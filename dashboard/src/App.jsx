import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import {
  BookOpen,
  HelpCircle,
  Search,
  Check,
  Layers,
  Copy,
  X,
  CheckCircle2,
  Award,
  AlertCircle,
  ExternalLink,
  Code,
  Flame,
  ArrowRight,
  Bookmark,
  Activity,
  Trash2
} from 'lucide-react';
import './App.css';

// Import all 19 raw markdown files using Vite's ?raw feature
import f00 from '../../00_INDEX.md?raw';
import f01 from '../../01_Arrays_TwoPointers.md?raw';
import f02 from '../../02_SlidingWindow.md?raw';
import f03 from '../../03_BinarySearch.md?raw';
import f04 from '../../04_LinkedList.md?raw';
import f05 from '../../05_Stack_Queue_Monotonic.md?raw';
import f06 from '../../06_Trees_BST.md?raw';
import f07 from '../../07_Graphs_BFS_DFS.md?raw';
import f08 from '../../08_Heaps_PriorityQueue.md?raw';
import f09 from '../../09_Recursion_Backtracking.md?raw';
import f10 from '../../10_DynamicProgramming.md?raw';
import f11 from '../../11_Greedy.md?raw';
import f12 from '../../12_Tries.md?raw';
import f13 from '../../13_UnionFind_DSU.md?raw';
import f14 from '../../14_SegmentTree_BIT.md?raw';
import f15 from '../../15_BitManipulation.md?raw';
import f16 from '../../16_MathAndNumberTheory.md?raw';
import f17 from '../../17_StringPatterns.md?raw';
import f18 from '../../18_InterviewMasterSheet.md?raw';

const filesData = [
  { id: '00', name: '00_INDEX.md', title: '🧠 DSA Master Index', content: f00, triggerWords: 'index, study plan, schedule, structure' },
  { id: '01', name: '01_Arrays_TwoPointers.md', title: '🔁 Arrays & Two Pointers', content: f01, triggerWords: 'sorted array, pair sum, palindrome, container, trapping water, Dutch flag' },
  { id: '02', name: '02_SlidingWindow.md', title: '🪟 Sliding Window', content: f02, triggerWords: 'subarray, substring, window, k elements, contiguous, longest without repeating' },
  { id: '03', name: '03_BinarySearch.md', title: '🔍 Binary Search', content: f03, triggerWords: 'sorted, find target, minimize/maximize, Koko eating, rotated search' },
  { id: '04', name: '04_LinkedList.md', title: '🔗 Linked List', content: f04, triggerWords: 'cycle, middle, reverse, merge, Kth node, slow fast, K-group' },
  { id: '05', name: '05_Stack_Queue_Monotonic.md', title: '🥞 Stack & Monotonic', content: f05, triggerWords: 'next greater, parentheses, min in window, daily temperatures, histogram' },
  { id: '06', name: '06_Trees_BST.md', title: '🌲 Trees & BST', content: f06, triggerWords: 'tree traversal, LCA, BST valid, diameter, path sum, serialize' },
  { id: '07', name: '07_Graphs_BFS_DFS.md', title: '🕸️ Graphs', content: f07, triggerWords: 'connected components, shortest path, cycle, course schedule, island counting, Dijkstra' },
  { id: '08', name: '08_Heaps_PriorityQueue.md', title: '👑 Heaps & Priority Queue', content: f08, triggerWords: 'top K, kth largest/smallest, median stream, merging sorted lists' },
  { id: '09', name: '09_Recursion_Backtracking.md', title: '🪵 Backtracking', content: f09, triggerWords: 'all combinations, permutations, subsets, N-queens, phone letters' },
  { id: '10', name: '10_DynamicProgramming.md', title: '📈 Dynamic Programming', content: f10, triggerWords: 'count ways, min/max cost, optimal substructure, knapsack, LCS, LIS' },
  { id: '11', name: '11_Greedy.md', title: '🍕 Greedy Algorithms', content: f11, triggerWords: 'locally optimal, intervals, scheduling, non-overlapping, jump game' },
  { id: '12', name: '12_Tries.md', title: '🌳 Tries', content: f12, triggerWords: 'prefix search, autocomplete, word dictionary, search II' },
  { id: '13', name: '13_UnionFind_DSU.md', title: '🤝 Union Find / DSU', content: f13, triggerWords: 'connected, redundant edge, number of islands, kruskal' },
  { id: '14', name: '14_SegmentTree_BIT.md', title: '📊 Segment Tree & BIT', content: f14, triggerWords: 'range query, range update, point update, fenwick' },
  { id: '15', name: '15_BitManipulation.md', title: '🔌 Bit Manipulation', content: f15, triggerWords: 'XOR tricks, counting bits, single number, hamming weight' },
  { id: '16', name: '16_MathAndNumberTheory.md', title: '🔢 Math & Theory', content: f16, triggerWords: 'GCD, prime, modular arithmetic, combinatorics, sieve' },
  { id: '17', name: '17_StringPatterns.md', title: '🧵 String Algorithms', content: f17, triggerWords: 'pattern match, anagram, palindrome, hashing, KMP, Rabin-Karp' },
  { id: '18', name: '18_InterviewMasterSheet.md', title: '🎯 MASTER SHEET', content: f18, triggerWords: 'cheat-sheet, flow-chart, checklist, templates, survival tips' }
];

const quizQuestions = [
  { prompt: "Input is SORTED ARRAY + find a pair/triplet?", answer: "Two Pointers" },
  { prompt: "Find a contiguous subarray or substring matching a size/sum constraint?", answer: "Sliding Window" },
  { prompt: "Searching position in sorted / minimize-maximize target?", answer: "Binary Search" },
  { prompt: "Linked list operations to detect cycles or find the middle node?", answer: "Slow-Fast Pointer" },
  { prompt: "Need to process in Last-In-First-Out, match brackets, or find next greater/smaller?", answer: "Monotonic Stack" },
  { prompt: "Level-by-level traversal or shortest path in an unweighted graph?", answer: "BFS" },
  { prompt: "Shortest path in a graph with non-negative edge weights?", answer: "Dijkstra" },
  { prompt: "Extract top K elements, or maintain the running median dynamically?", answer: "Heap / Priority Queue" },
  { prompt: "Exhaustive search to find ALL valid combinations/permutations/subsets?", answer: "Backtracking" },
  { prompt: "Find the count of ways or optimal (min/max) values with choices and overlapping states?", answer: "Dynamic Programming" },
  { prompt: "Interval scheduling or making a sequence of locally optimal choices?", answer: "Greedy" },
  { prompt: "Dynamic dictionary lookup or character-by-character prefix matching?", answer: "Trie" },
  { prompt: "Checking connectivity or count of independent sets dynamically?", answer: "Union-Find (DSU)" },
  { prompt: "Performing range sum/min/max queries with dynamic updates?", answer: "Segment Tree or BIT" },
  { prompt: "Find single occurrences, parity checks, or bit counters in O(1) space?", answer: "Bit Manipulation" }
];

// Helper to escape HTML characters
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Custom simple C++ Syntax Highlighter
function highlightCpp(code) {
  const keywords = new Set([
    'break', 'case', 'catch', 'class', 'const', 'continue', 'default', 'delete',
    'do', 'else', 'enum', 'explicit', 'export', 'extern', 'false', 'for', 'friend',
    'goto', 'if', 'inline', 'namespace', 'new', 'nullptr', 'operator', 'private',
    'protected', 'public', 'return', 'sizeof', 'static', 'struct', 'switch',
    'template', 'this', 'throw', 'true', 'try', 'typedef', 'typename', 'union',
    'using', 'virtual', 'void', 'while'
  ]);

  const types = new Set([
    'int', 'long', 'float', 'double', 'bool', 'char', 'short', 'unsigned', 'signed',
    'vector', 'string', 'stack', 'queue', 'deque', 'priority_queue',
    'unordered_map', 'unordered_set', 'set', 'map', 'pair', 'greater', 'auto', 'long long'
  ]);

  const tokenRegex = /(\/\/.*|\/\*[\s\S]*?\*\/)|("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')|(\b\d+\b)|(\b[a-zA-Z_][a-zA-Z0-9_]*\b)|([<>&]+)/g;

  return code.replace(tokenRegex, (match, comment, string, number, word, special) => {
    if (comment) {
      return `<span class="cpp-comment">${escapeHtml(match)}</span>`;
    }
    if (string) {
      return `<span class="cpp-string">${escapeHtml(match)}</span>`;
    }
    if (number) {
      return `<span class="cpp-number">${match}</span>`;
    }
    if (word) {
      if (keywords.has(word)) {
        return `<span class="cpp-keyword">${word}</span>`;
      }
      if (types.has(word)) {
        return `<span class="cpp-type">${word}</span>`;
      }
      return word;
    }
    if (special) {
      return escapeHtml(match);
    }
    return match;
  });
}

// Setup custom marked renderer
const renderer = new marked.Renderer();
renderer.code = ({ text, lang }) => {
  const code = text || '';
  const language = lang || '';
  let highlighted = code;
  if (language === 'cpp' || language === 'c++') {
    highlighted = highlightCpp(code);
  } else {
    highlighted = escapeHtml(code);
  }

  // Split and wrap each line for interactive trace highlights
  const linesList = highlighted.split('\n');
  if (linesList.length > 1 && linesList[linesList.length - 1] === '') {
    linesList.pop();
  }
  const formattedCode = linesList.map((line, idx) => {
    return `<div class="code-line" data-line="${idx + 1}">${line || '&nbsp;'}</div>`;
  }).join('');

  // Safe JS string injection for onclick copy
  const safeCode = code.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');

  return `
    <div class="code-container">
      <div class="code-header">
        <span>${language ? language.toUpperCase() : 'CODE'}</span>
        <button class="copy-btn" onclick="window.copyCodeToClipboard(\`${safeCode}\`)">
          Copy Code
        </button>
      </div>
      <pre><code class="language-${language || 'text'}">${formattedCode}</code></pre>
    </div>
  `;
};
marked.use({ renderer });

// Convert GitHub style alerts to HTML alerts
function preprocessMarkdown(content) {
  const lines = content.split('\n');
  const result = [];
  let inAlert = false;
  let alertType = '';
  let alertContent = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const alertMatch = line.match(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);

    if (alertMatch) {
      if (inAlert) {
        result.push(`<div class="alert alert-${alertType}">${marked.parse(alertContent.join('\n'))}</div>`);
      }
      inAlert = true;
      alertType = alertMatch[1].toLowerCase();
      if (alertType === 'important') alertType = 'warning';
      alertContent = [];
    } else if (inAlert && line.startsWith('>')) {
      alertContent.push(line.replace(/^>\s?/, ''));
    } else {
      if (inAlert) {
        result.push(`<div class="alert alert-${alertType}">${marked.parse(alertContent.join('\n'))}</div>`);
        inAlert = false;
      }
      result.push(line);
    }
  }
  if (inAlert) {
    result.push(`<div class="alert alert-${alertType}">${marked.parse(alertContent.join('\n'))}</div>`);
  }
  return result.join('\n');
}

export default function App() {
  const [activeFileId, setActiveFileId] = useState('00');
  const [activeTab, setActiveTab] = useState('reader'); // 'reader', 'quiz'
  const [searchQuery, setSearchQuery] = useState('');
  const [showRefPanel, setShowRefPanel] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Quiz states
  const [quizIdx, setQuizIdx] = useState(0);
  const [showQuizAnswer, setShowQuizAnswer] = useState(false);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [shuffledQuiz, setShuffledQuiz] = useState([]);

  // Get or create unique user ID
  const [userId] = useState(() => {
    let id = localStorage.getItem('dsa_user_id');
    if (!id) {
      id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      localStorage.setItem('dsa_user_id', id);
    }
    return id;
  });

  // Progress states saved in localStorage
  const [completedChapters, setCompletedChapters] = useState(() => {
    const saved = localStorage.getItem('dsa_completed_chapters');
    return saved ? JSON.parse(saved) : [];
  });
  const [completedProblems, setCompletedProblems] = useState(() => {
    const saved = localStorage.getItem('dsa_completed_problems');
    return saved ? JSON.parse(saved) : [];
  });

  // Reference for content link clicks
  const documentPaneRef = useRef(null);

  // Sync completion states with local storage
  useEffect(() => {
    localStorage.setItem('dsa_completed_chapters', JSON.stringify(completedChapters));
  }, [completedChapters]);

  useEffect(() => {
    localStorage.setItem('dsa_completed_problems', JSON.stringify(completedProblems));
  }, [completedProblems]);

  // Fetch/sync progress on mount
  useEffect(() => {
    const fetchAndSyncProgress = async () => {
      try {
        const localChapters = JSON.parse(localStorage.getItem('dsa_completed_chapters') || '[]');
        const localProblems = JSON.parse(localStorage.getItem('dsa_completed_problems') || '[]');

        // If we have local progress, call the sync endpoint to upload and merge it in the DB
        if (localChapters.length > 0 || localProblems.length > 0) {
          const res = await fetch('/api/progress/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              completedChapters: localChapters,
              completedProblems: localProblems
            })
          });
          if (res.ok) {
            const data = await res.json();
            setCompletedChapters(data.completedChapters);
            setCompletedProblems(data.completedProblems);
            localStorage.setItem('dsa_completed_chapters', JSON.stringify(data.completedChapters));
            localStorage.setItem('dsa_completed_problems', JSON.stringify(data.completedProblems));
            return;
          }
        }

        // If no local progress to sync, just load from database
        const res = await fetch(`/api/progress/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setCompletedChapters(data.completedChapters);
          setCompletedProblems(data.completedProblems);
          localStorage.setItem('dsa_completed_chapters', JSON.stringify(data.completedChapters));
          localStorage.setItem('dsa_completed_problems', JSON.stringify(data.completedProblems));
        }
      } catch (err) {
        console.error('Failed to sync/fetch progress with backend:', err);
      }
    };

    fetchAndSyncProgress();
  }, [userId]);

  // Initial Shuffle for the Quiz
  useEffect(() => {
    shuffleQuizList();
  }, []);

  const shuffleQuizList = () => {
    const arr = [...quizQuestions];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffledQuiz(arr);
    setQuizIdx(0);
    setShowQuizAnswer(false);
  };

  // Expose clipboard function globally so pre-rendered raw HTML copy button can run it
  useEffect(() => {
    window.copyCodeToClipboard = (code) => {
      navigator.clipboard.writeText(code)
        .then(() => triggerToast('Copied code to clipboard!'))
        .catch(() => triggerToast('Failed to copy.'));
    };
    return () => {
      delete window.copyCodeToClipboard;
    };
  }, []);

  // Enhance tables and set up interactive debugger trace on hover
  useEffect(() => {
    const container = documentPaneRef.current;
    if (!container || activeTab !== 'reader') return;

    // 1. Identify and style dry-run tables, wrap side-by-side
    const tables = container.querySelectorAll('table');
    tables.forEach((table) => {
      const ths = table.querySelectorAll('th');
      if (
        ths.length >= 2 &&
        ths[0].innerText.trim().toLowerCase() === 'line' &&
        (ths[1].innerText.trim().toLowerCase().includes('trace') || ths[1].innerText.trim().toLowerCase().includes('explain'))
      ) {
        table.classList.add('dry-run-table');

        // Find preceding code container
        let prevSibling = table.previousElementSibling;
        let headerElement = null;
        while (prevSibling && !prevSibling.classList?.contains('code-container')) {
          if (prevSibling.tagName === 'H3' || prevSibling.tagName === 'H4' || prevSibling.tagName === 'H5') {
            headerElement = prevSibling;
          }
          prevSibling = prevSibling.previousElementSibling;
        }

        if (prevSibling && !prevSibling.parentElement.classList.contains('template-side-by-side')) {
          const wrapper = document.createElement('div');
          wrapper.className = 'template-side-by-side';
          prevSibling.parentNode.insertBefore(wrapper, prevSibling);
          
          if (headerElement) {
            wrapper.parentNode.insertBefore(headerElement, wrapper);
          }
          
          wrapper.appendChild(prevSibling);
          wrapper.appendChild(table);
        }
      }
    });

    // 2. Set up event listeners for hover interaction
    const handleMouseOver = (e) => {
      const row = e.target.closest('.dry-run-table tbody tr');
      if (!row) return;

      const lineTd = row.cells[0];
      if (!lineTd) return;

      const lineNum = lineTd.innerText.trim();
      if (!lineNum || isNaN(lineNum)) return;

      const table = row.closest('table');
      const sideBySide = table.closest('.template-side-by-side');
      if (sideBySide) {
        const codeLine = sideBySide.querySelector(`.code-line[data-line="${lineNum}"]`);
        if (codeLine) {
          codeLine.classList.add('highlighted-line');
        }
      }
    };

    const handleMouseOut = (e) => {
      const row = e.target.closest('.dry-run-table tbody tr');
      if (!row) return;

      const table = row.closest('table');
      const sideBySide = table.closest('.template-side-by-side');
      if (sideBySide) {
        const highlightedLines = sideBySide.querySelectorAll('.code-line.highlighted-line');
        highlightedLines.forEach((line) => {
          line.classList.remove('highlighted-line');
        });
      }
    };

    container.addEventListener('mouseover', handleMouseOver);
    container.addEventListener('mouseout', handleMouseOut);

    return () => {
      container.removeEventListener('mouseover', handleMouseOver);
      container.removeEventListener('mouseout', handleMouseOut);
    };
  }, [activeFileId, activeTab]);

  // Dynamic LaTeX Math rendering via KaTeX
  useEffect(() => {
    if (activeTab !== 'reader') return;
    
    const renderMath = () => {
      const container = document.getElementById('document-pane');
      if (container && window.renderMathInElement) {
        window.renderMathInElement(container, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true }
          ],
          throwOnError: false
        });
      }
    };

    // Run after React updates the DOM
    const timer = setTimeout(renderMath, 100);
    return () => clearTimeout(timer);
  }, [activeFileId, activeTab]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Parse problems list for current active file
  const activeFile = filesData.find(f => f.id === activeFileId) || filesData[0];

  // Extract problems dynamically
  const parseProblems = (content, fileId) => {
    const lines = content.split('\n');
    const problems = [];
    let currentDifficulty = 'medium';

    for (let line of lines) {
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes('easy') || lowerLine.includes('🟢')) {
        currentDifficulty = 'easy';
      } else if (lowerLine.includes('medium') || lowerLine.includes('🟡')) {
        currentDifficulty = 'medium';
      } else if (lowerLine.includes('hard') || lowerLine.includes('🔴')) {
        currentDifficulty = 'hard';
      }

      const regex = /(?:LC|LeetCode)\s*(\d+)(?:\s*(?:—|-|:)\s*([A-Za-z0-9\s_.\-&/]+))?/gi;
      let match;
      while ((match = regex.exec(line)) !== null) {
        const problemNum = match[1];
        let title = match[2] ? match[2].trim() : `Problem ${problemNum}`;
        title = title.split('(')[0].split('|')[0].trim();

        const key = `${fileId}-${problemNum}`;
        if (!problems.some(p => p.key === key)) {
          problems.push({
            key,
            num: problemNum,
            title: `LC ${problemNum} — ${title}`,
            difficulty: currentDifficulty
          });
        }
      }
    }
    return problems;
  };

  const currentProblems = parseProblems(activeFile.content, activeFile.id);

  // Toggle problem completion
  const handleToggleProblem = async (key) => {
    const isCompleted = completedProblems.includes(key);
    // Optimistic UI update
    setCompletedProblems(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );

    try {
      await fetch('/api/progress/problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          problemKey: key,
          completed: !isCompleted
        })
      });
    } catch (err) {
      console.error('Failed to sync problem toggle to server:', err);
    }
  };

  // Toggle chapter completion
  const handleToggleChapter = async (id) => {
    const isCompleted = completedChapters.includes(id);
    // Optimistic UI update
    setCompletedChapters(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );

    try {
      await fetch('/api/progress/chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          chapterId: id,
          completed: !isCompleted
        })
      });
    } catch (err) {
      console.error('Failed to sync chapter toggle to server:', err);
    }
  };

  const handleResetProgress = async () => {
    if (window.confirm("Are you sure you want to reset all progress? This will clear both your local storage cache and the database.")) {
      try {
        await fetch(`/api/progress/${userId}`, {
          method: 'DELETE'
        });
      } catch (err) {
        console.error('Failed to reset progress on server:', err);
      }

      localStorage.removeItem('dsa_completed_chapters');
      localStorage.removeItem('dsa_completed_problems');
      setCompletedChapters([]);
      setCompletedProblems([]);
      triggerToast('Progress successfully reset!');
    }
  };

  // Progress Calculations
  const allProblemsCount = filesData.reduce((acc, f) => acc + parseProblems(f.content, f.id).length, 0);
  const completedProblemsCount = completedProblems.length;
  const totalPercentage = allProblemsCount > 0 ? Math.round((completedProblemsCount / allProblemsCount) * 100) : 0;

  // Search filter
  const filteredFiles = filesData.filter(file => {
    const q = searchQuery.toLowerCase();
    return file.name.toLowerCase().includes(q) ||
      file.title.toLowerCase().includes(q) ||
      file.triggerWords.toLowerCase().includes(q) ||
      file.content.toLowerCase().includes(q);
  });

  // Client-side markdown navigation interception
  const handleContentClick = (e) => {
    const link = e.target.closest('a');
    if (link) {
      const href = link.getAttribute('href');
      if (href && (href.startsWith('./') || href.endsWith('.md'))) {
        e.preventDefault();
        const cleanName = href.replace('./', '').split('/').pop();
        const matchedFile = filesData.find(f => f.name === cleanName);
        if (matchedFile) {
          setActiveFileId(matchedFile.id);
          documentPaneRef.current?.scrollTo(0, 0);
        }
      }
    }
  };

  // Render markdown text to HTML
  const renderMarkdownHtml = (markdownContent) => {
    const processed = preprocessMarkdown(markdownContent);
    return { __html: marked.parse(processed) };
  };

  // Quiz evaluation
  const handleQuizAnswer = (isCorrect) => {
    setQuizScore(prev => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1
    }));

    if (quizIdx + 1 < shuffledQuiz.length) {
      setQuizIdx(prev => prev + 1);
      setShowQuizAnswer(false);
    } else {
      triggerToast("Quiz complete! Resetting...");
      shuffleQuizList();
    }
  };

  // Calculate specific chapter's problem completion
  const getChapterProblemStats = (fileId, content) => {
    const problems = parseProblems(content, fileId);
    if (problems.length === 0) return null;
    const completed = problems.filter(p => completedProblems.includes(p.key)).length;
    return { completed, total: problems.length };
  };

  return (
    <div className="app-container">
      {/* Sidebar (Left) */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Flame size={24} style={{ color: '#8b5cf6' }} />
            <span>Final DSA Cheatsheet</span>
          </div>
        </div>

        {/* Global Progress Dashboard */}
        <div className="progress-summary">
          <div className="progress-ring-container">
            <svg width="52" height="52">
              <circle cx="26" cy="26" r="22" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="transparent" />
              <circle
                cx="26" cy="26" r="22"
                stroke="#6366f1" strokeWidth="4" fill="transparent"
                strokeDasharray="138"
                strokeDashoffset={138 - (138 * totalPercentage) / 100}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <div className="progress-ring-text">{totalPercentage}%</div>
          </div>
          <div className="progress-info">
            <span className="progress-title">LeetCode Mastery</span>
            <span className="progress-detail">{completedProblemsCount} / {allProblemsCount} Solved</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search patterns or contents..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* File Chapters List */}
        <nav className="file-list">
          {filteredFiles.map((file) => {
            const isCompleted = completedChapters.includes(file.id);
            const stats = getChapterProblemStats(file.id, file.content);
            const isActive = activeFileId === file.id;

            return (
              <div
                key={file.id}
                className={`file-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveFileId(file.id);
                  setActiveTab('reader');
                  documentPaneRef.current?.scrollTo(0, 0);
                }}
              >
                <div className="file-item-left">
                  <span className="file-num">{file.id}</span>
                  <span className="file-name">{file.title.replace(/^[^\s]+\s+/, '')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {stats && (
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {stats.completed}/{stats.total}
                    </span>
                  )}
                  <div
                    className={`completion-indicator ${isCompleted ? 'completed' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleChapter(file.id);
                    }}
                  >
                    {isCompleted && <Check />}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main Panel (Right) */}
      <main className="main-content">
        <header className="top-header">
          <div className="tab-group">
            <button
              className={`tab-btn ${activeTab === 'reader' ? 'active' : ''}`}
              onClick={() => setActiveTab('reader')}
            >
              <BookOpen size={16} />
              Study Reader
            </button>
            <button
              className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
              onClick={() => setActiveTab('quiz')}
            >
              <HelpCircle size={16} />
              Pattern Quiz
            </button>
          </div>
          <div className="header-actions">
            <button
              className="action-btn"
              onClick={() => setShowRefPanel(true)}
            >
              <Code size={16} />
              C++ STL Cheat Sheet
            </button>
          </div>
        </header>

        {/* Tab view logic */}
        <div className="content-body">
          {activeTab === 'reader' ? (
            <>
              {/* Document Pane */}
              <div
                className="document-pane"
                ref={documentPaneRef}
                onClick={handleContentClick}
                id="document-pane"
              >
                <div className="document-container">
                  <div className="markdown-body" dangerouslySetInnerHTML={renderMarkdownHtml(activeFile.content)} />
                </div>
              </div>

              {/* Sidebar Checklist Panel */}
              <div className="checklist-pane">
                <div className="checklist-header">
                  <span className="checklist-title">LeetCode Checklists</span>
                  <span className="checklist-count">{currentProblems.filter(p => completedProblems.includes(p.key)).length} / {currentProblems.length}</span>
                </div>
                {currentProblems.length > 0 ? (
                  <div className="checklist-list">
                    {currentProblems.map((prob) => {
                      const isChecked = completedProblems.includes(prob.key);
                      return (
                        <div
                          key={prob.key}
                          className={`checklist-item ${isChecked ? 'checked' : ''}`}
                          onClick={() => handleToggleProblem(prob.key)}
                        >
                          <div className="checklist-cb">
                            {isChecked && <Check />}
                          </div>
                          <div className="checklist-info">
                            <span className={`lc-badge ${prob.difficulty}`}>
                              {prob.difficulty}
                            </span>
                            <span className="checklist-text">{prob.title}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty-checklist">
                    <CheckCircle2 />
                    <p style={{ fontSize: '14px', fontWeight: '500' }}>No specific LeetCode problems list found in this file.</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Use the "Mark Chapter Completed" checkbox in the left sidebar to record overall progress.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Pattern Quiz View */
            <div style={{ flexGrow: 1, overflowY: 'auto' }}>
              <div className="quiz-container">
                <h2 style={{ textAlign: 'center', margin: '20px 0' }}>🧠 Pattern Recognition Trainer</h2>
                {shuffledQuiz.length > 0 && (
                  <div className="quiz-card">
                    <div className="quiz-stats">
                      <span>Question {quizIdx + 1} of {shuffledQuiz.length}</span>
                      <span>Score: {quizScore.correct} / {quizScore.total}</span>
                    </div>

                    <div className="quiz-card-header">Scenario / Trigger Words</div>
                    <div className="quiz-prompt">
                      "{shuffledQuiz[quizIdx].prompt}"
                    </div>

                    <div className="quiz-card-header">Recognized Pattern</div>
                    <div
                      className="quiz-answer-zone"
                      onClick={() => setShowQuizAnswer(true)}
                    >
                      {showQuizAnswer ? (
                        <span className="quiz-answer">{shuffledQuiz[quizIdx].answer}</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Click to reveal solution...</span>
                      )}
                    </div>

                    {showQuizAnswer ? (
                      <div className="quiz-buttons">
                        <button
                          className="quiz-btn success"
                          onClick={() => handleQuizAnswer(true)}
                        >
                          I got it right! ✅
                        </button>
                        <button
                          className="quiz-btn danger"
                          onClick={() => handleQuizAnswer(false)}
                        >
                          I got it wrong... ❌
                        </button>
                      </div>
                    ) : (
                      <button
                        className="quiz-btn primary"
                        onClick={() => setShowQuizAnswer(true)}
                      >
                        Reveal Solution
                      </button>
                    )}
                  </div>
                )}

                <button
                  className="quiz-btn secondary"
                  style={{ alignSelf: 'center', marginTop: '20px' }}
                  onClick={shuffleQuizList}
                >
                  Restart & Reshuffle Quiz
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Floating Slide-out C++ STL Cheat Sheet Panel */}
        <div className={`reference-panel ${showRefPanel ? 'open' : ''}`}>
          <div className="reference-header">
            <span className="reference-title">
              <Code size={20} style={{ color: 'var(--accent-indigo)' }} />
              C++ STL Quick Reference
            </span>
            <button className="reference-close" onClick={() => setShowRefPanel(false)}>
              <X size={18} />
            </button>
          </div>
          <div className="reference-content">
            <div className="markdown-body">
              <h3>📦 Common Containers</h3>
              <pre><code className="language-cpp">// std::vector
                vector&lt;int&gt; v;
                v.push_back(x); v.pop_back();
                v.size(); v.clear();

                // std::stack (LIFO)
                stack&lt;int&gt; st;
                st.push(x); st.top(); st.pop(); st.empty();

                // std::queue (FIFO)
                queue&lt;int&gt; q;
                q.push(x); q.front(); q.pop(); q.empty();

                // std::unordered_map (Hash Table)
                unordered_map&lt;int, int&gt; mp;
                mp[key] = val;
                mp.count(key); // 1 if exists, 0 if not
                mp.erase(key);

                // std::unordered_set (Unique values)
                unordered_set&lt;int&gt; st;
                st.insert(x); st.count(x); st.erase(x);</code></pre>

              <h3>👑 Heaps / Priority Queues</h3>
              <pre><code className="language-cpp">// Max Heap (Default)
                priority_queue&lt;int&gt; max_pq;
                max_pq.push(x); max_pq.top(); max_pq.pop();

                // Min Heap
                priority_queue&lt;int, vector&lt;int&gt;, greater&lt;int&gt;&gt; min_pq;
                min_pq.push(x); min_pq.top(); min_pq.pop();</code></pre>

              <h3>⚡ Core STL Algorithms</h3>
              <pre><code className="language-cpp">// Sorting: O(n log n)
                sort(v.begin(), v.end());
                sort(v.begin(), v.end(), greater&lt;int&gt;()); // Reverse

                // Binary Search: O(log n) (Assumes sorted)
                bool exists = binary_search(v.begin(), v.end(), val);

                // Lower / Upper Bounds (Assumes sorted)
                // First element &gt;= val
                auto it = lower_bound(v.begin(), v.end(), val);
                // First element &gt; val
                auto it2 = upper_bound(v.begin(), v.end(), val);

                // Numeric Operations
                int sum = accumulate(v.begin(), v.end(), 0);

                // Bitwise Operations
                int set_bits = __builtin_popcount(num); // Counts 1s</code></pre>

              <h3>🧠 Key Mental Models</h3>
              <ul>
                <li><strong>Two Pointers:</strong> "I need O(n) on sorted data. Eliminate impossible states."</li>
                <li><strong>Sliding Window:</strong> "I need optimal contiguous subarray. Maintain valid window."</li>
                <li><strong>Binary Search:</strong> "The answer space is monotonic. Bisect on feasibility."</li>
                <li><strong>Dynamic Programming:</strong> "Cache overlapping subproblems. Recurse + memoize."</li>
                <li><strong>Monotonic Stack:</strong> "Each element pushed/popped once. Next greater/smaller in O(n)."</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Toast popup */}
      {toastMessage && (
        <div className="toast">
          <Check size={16} />
          {toastMessage}
        </div>
      )}
    </div>
  );
}
