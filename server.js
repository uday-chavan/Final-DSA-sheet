require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Check database connection and initialize tables
async function initDb() {
  const client = await pool.connect();
  try {
    console.log('Verifying/initializing Neon PostgreSQL tables...');
    
    // Create completed_chapters table
    await client.query(`
      CREATE TABLE IF NOT EXISTS completed_chapters (
        user_id UUID NOT NULL,
        chapter_id VARCHAR(50) NOT NULL,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, chapter_id)
      );
    `);

    // Create completed_problems table
    await client.query(`
      CREATE TABLE IF NOT EXISTS completed_problems (
        user_id UUID NOT NULL,
        problem_key VARCHAR(100) NOT NULL,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, problem_key)
      );
    `);

    console.log('Database verification/initialization successful.');
  } catch (err) {
    console.error('Database connection/initialization failed:', err);
    process.exit(1);
  } finally {
    client.release();
  }
}

// Fetch all progress for a user
app.get('/api/progress/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const chaptersRes = await pool.query(
      'SELECT chapter_id FROM completed_chapters WHERE user_id = $1',
      [userId]
    );
    const problemsRes = await pool.query(
      'SELECT problem_key FROM completed_problems WHERE user_id = $1',
      [userId]
    );

    res.json({
      completedChapters: chaptersRes.rows.map(r => r.chapter_id),
      completedProblems: problemsRes.rows.map(r => r.problem_key),
    });
  } catch (err) {
    console.error('Error fetching progress:', err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Sync local storage progress to the database
app.post('/api/progress/sync', async (req, res) => {
  const { userId, completedChapters, completedProblems } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    if (Array.isArray(completedChapters)) {
      for (const ch of completedChapters) {
        await client.query(
          'INSERT INTO completed_chapters (user_id, chapter_id) VALUES ($1, $2) ON CONFLICT (user_id, chapter_id) DO NOTHING',
          [userId, ch]
        );
      }
    }

    if (Array.isArray(completedProblems)) {
      for (const prob of completedProblems) {
        await client.query(
          'INSERT INTO completed_problems (user_id, problem_key) VALUES ($1, $2) ON CONFLICT (user_id, problem_key) DO NOTHING',
          [userId, prob]
        );
      }
    }

    await client.query('COMMIT');

    // Retrieve full merged list
    const finalChapters = await client.query(
      'SELECT chapter_id FROM completed_chapters WHERE user_id = $1',
      [userId]
    );
    const finalProblems = await client.query(
      'SELECT problem_key FROM completed_problems WHERE user_id = $1',
      [userId]
    );

    res.json({
      completedChapters: finalChapters.rows.map(r => r.chapter_id),
      completedProblems: finalProblems.rows.map(r => r.problem_key),
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error syncing progress:', err);
    res.status(500).json({ error: 'Failed to sync progress' });
  } finally {
    client.release();
  }
});

// Toggle a single chapter's completion
app.post('/api/progress/chapter', async (req, res) => {
  const { userId, chapterId, completed } = req.body;
  if (!userId || !chapterId) {
    return res.status(400).json({ error: 'userId and chapterId are required' });
  }

  try {
    if (completed) {
      await pool.query(
        'INSERT INTO completed_chapters (user_id, chapter_id) VALUES ($1, $2) ON CONFLICT (user_id, chapter_id) DO NOTHING',
        [userId, chapterId]
      );
    } else {
      await pool.query(
        'DELETE FROM completed_chapters WHERE user_id = $1 AND chapter_id = $2',
        [userId, chapterId]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Error toggling chapter:', err);
    res.status(500).json({ error: 'Failed to toggle chapter' });
  }
});

// Toggle a single problem's completion
app.post('/api/progress/problem', async (req, res) => {
  const { userId, problemKey, completed } = req.body;
  if (!userId || !problemKey) {
    return res.status(400).json({ error: 'userId and problemKey are required' });
  }

  try {
    if (completed) {
      await pool.query(
        'INSERT INTO completed_problems (user_id, problem_key) VALUES ($1, $2) ON CONFLICT (user_id, problem_key) DO NOTHING',
        [userId, problemKey]
      );
    } else {
      await pool.query(
        'DELETE FROM completed_problems WHERE user_id = $1 AND problem_key = $2',
        [userId, problemKey]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Error toggling problem:', err);
    res.status(500).json({ error: 'Failed to toggle problem' });
  }
});

// Reset progress for a user
app.delete('/api/progress/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    await pool.query('DELETE FROM completed_chapters WHERE user_id = $1', [userId]);
    await pool.query('DELETE FROM completed_problems WHERE user_id = $1', [userId]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error resetting progress:', err);
    res.status(500).json({ error: 'Failed to reset progress' });
  }
});

// Serve static files from the React app build directory
const path = require('path');
app.use(express.static(path.join(__dirname, 'dashboard/dist')));

// The "catchall" handler: for any request that doesn't match API endpoints, send back React's index.html file.
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard/dist/index.html'));
});

const PORT = process.env.PORT || 5000;
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Express server running on http://localhost:${PORT}`);
  });
});
