// ===========================
// ResumeIQ — Core Analyzer
// ===========================

// ===========================
// Theme Toggle
// ===========================
(function initTheme() {
  const saved = localStorage.getItem('resumeiq-theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();

const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('resumeiq-theme', next);
  // Re-render radar chart with updated colors if it exists
  if (radarChart) {
    const resume = resumeInput.value.trim();
    const jd = jdInput.value.trim();
    if (resume && jd) {
      const data = analyzeGap(resume, jd);
      renderRadarChart(data.categories);
    }
  }
});

function getChartColors() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  return {
    gridColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)',
    labelColor: isLight ? '#5a5a72' : '#8888a0',
    pointBorder: isLight ? '#ffffff' : '#ffffff'
  };
}

// Skill taxonomy for intelligent matching
const SKILL_TAXONOMY = {
  'Programming Languages': [
    'python','javascript','typescript','java','c++','c#','go','golang','rust','ruby',
    'php','swift','kotlin','scala','r','matlab','perl','dart','lua','shell','bash',
    'powershell','sql','html','css','sass','less','objective-c','assembly','haskell',
    'elixir','clojure','julia','groovy','vba','cobol','fortran'
  ],
  'Frontend': [
    'react','reactjs','react.js','angular','angularjs','vue','vuejs','vue.js','svelte',
    'next.js','nextjs','nuxt','nuxtjs','gatsby','remix','tailwind','tailwindcss',
    'bootstrap','material-ui','mui','chakra','styled-components','webpack','vite',
    'parcel','redux','zustand','mobx','recoil','jquery','three.js','d3','d3.js',
    'webgl','canvas','svg','pwa','responsive design','accessibility','a11y','figma',
    'storybook','framer motion'
  ],
  'Backend': [
    'node.js','nodejs','express','expressjs','fastapi','django','flask','spring',
    'spring boot','asp.net','.net','rails','ruby on rails','laravel','nestjs',
    'koa','hapi','gin','fiber','actix','graphql','rest','restful','grpc','websocket',
    'microservices','monolith','api','oauth','jwt','authentication','authorization'
  ],
  'Database': [
    'postgresql','postgres','mysql','mongodb','redis','elasticsearch','sqlite',
    'oracle','sql server','dynamodb','cassandra','couchdb','firebase','firestore',
    'supabase','prisma','sequelize','mongoose','typeorm','knex','neo4j','influxdb',
    'memcached','mariadb'
  ],
  'Cloud & DevOps': [
    'aws','amazon web services','gcp','google cloud','azure','docker','kubernetes',
    'k8s','terraform','ansible','jenkins','github actions','gitlab ci','ci/cd',
    'circleci','travis','heroku','vercel','netlify','digitalocean','nginx','apache',
    'linux','ubuntu','centos','cloudflare','lambda','serverless','ecs','eks','ec2',
    's3','cloudformation','helm','prometheus','grafana','datadog','new relic'
  ],
  'Data & AI/ML': [
    'machine learning','deep learning','nlp','natural language processing',
    'computer vision','tensorflow','pytorch','keras','scikit-learn','sklearn',
    'pandas','numpy','scipy','matplotlib','seaborn','jupyter','data science',
    'data analysis','data engineering','etl','spark','hadoop','airflow','kafka',
    'data pipeline','bigquery','redshift','snowflake','tableau','power bi',
    'statistics','regression','classification','clustering','neural network',
    'transformer','bert','gpt','llm','langchain','openai','hugging face',
    'opencv','mediapipe','rag','fine-tuning','prompt engineering'
  ],
  'Testing & QA': [
    'jest','mocha','chai','pytest','unittest','selenium','cypress','playwright',
    'testing library','enzyme','vitest','supertest','tdd','bdd','unit testing',
    'integration testing','e2e','end-to-end','qa','quality assurance','postman',
    'swagger','load testing','performance testing','jmeter'
  ],
  'Soft Skills & Methods': [
    'agile','scrum','kanban','jira','confluence','leadership','communication',
    'teamwork','problem solving','critical thinking','project management',
    'stakeholder','cross-functional','mentoring','presentation','documentation',
    'code review','pair programming','design patterns','solid','oop',
    'functional programming','system design','architecture'
  ]
};

// Flatten for quick lookup
const ALL_SKILLS = {};
Object.entries(SKILL_TAXONOMY).forEach(([cat, skills]) => {
  skills.forEach(s => ALL_SKILLS[s] = cat);
});

// ===========================
// DOM Elements
// ===========================
const resumeInput = document.getElementById('resume-input');
const jdInput = document.getElementById('jd-input');
const resumeCount = document.getElementById('resume-count');
const jdCount = document.getElementById('jd-count');
const btnAnalyze = document.getElementById('btn-analyze');
const btnSample = document.getElementById('btn-sample');
const btnClearResume = document.getElementById('btn-clear-resume');
const btnClearJd = document.getElementById('btn-clear-jd');
const inputSection = document.getElementById('input-section');
const resultsSection = document.getElementById('results-section');

// ===========================
// Character Counters
// ===========================
resumeInput.addEventListener('input', () => {
  resumeCount.textContent = `${resumeInput.value.length} characters`;
});
jdInput.addEventListener('input', () => {
  jdCount.textContent = `${jdInput.value.length} characters`;
});

// Clear buttons
btnClearResume.addEventListener('click', () => { resumeInput.value = ''; resumeCount.textContent = '0 characters'; });
btnClearJd.addEventListener('click', () => { jdInput.value = ''; jdCount.textContent = '0 characters'; });

// ===========================
// Sample Data
// ===========================
const SAMPLE_RESUME = `Rajdeepsinh Jadeja
Software Developer | AI/ML Enthusiast

EXPERIENCE
Software Developer Intern — TechCorp Solutions (Jan 2025 - Present)
• Built REST APIs using Python and Flask for internal tools
• Developed responsive UIs with HTML, CSS, and JavaScript
• Worked with MySQL database for data storage and retrieval
• Collaborated with a team of 5 using Agile methodology and Jira

Academic Projects:
• Driver Drowsiness Detection System using OpenCV, Dlib, and Python
• Hand Gesture Recognition System using MediaPipe and TensorFlow
• Built a personal portfolio website using HTML, CSS, and JavaScript

SKILLS
Programming: Python, JavaScript, C++, SQL, HTML, CSS
Frameworks: Flask, OpenCV, TensorFlow, MediaPipe
Tools: Git, GitHub, VS Code, Jupyter Notebook
Databases: MySQL, SQLite
Other: Machine Learning, Computer Vision, Data Structures, Algorithms, OOP, Problem Solving

EDUCATION
B.Tech in Computer Science — XYZ University (2022-2026)
CGPA: 8.5/10`;

const SAMPLE_JD = `Full Stack Developer — InnovateTech Inc.

We are looking for a passionate Full Stack Developer to join our growing engineering team.

Requirements:
• 1-3 years of experience in full-stack web development
• Strong proficiency in React.js or Vue.js for frontend development
• Backend experience with Node.js, Express.js, or Django
• Database experience with PostgreSQL and MongoDB
• Familiarity with Docker and cloud platforms (AWS or GCP)
• Experience with Git version control and CI/CD pipelines
• Understanding of RESTful APIs and GraphQL
• Knowledge of TypeScript is a plus
• Experience with Redis for caching
• Familiarity with testing frameworks (Jest, Pytest)
• Strong communication and teamwork skills
• Agile/Scrum methodology experience

Nice to have:
• Experience with Kubernetes and microservices architecture
• Knowledge of Tailwind CSS or Material-UI
• Familiarity with Next.js or Nuxt.js
• Understanding of system design principles
• Experience with data structures and algorithms`;

btnSample.addEventListener('click', () => {
  resumeInput.value = SAMPLE_RESUME;
  jdInput.value = SAMPLE_JD;
  resumeCount.textContent = `${SAMPLE_RESUME.length} characters`;
  jdCount.textContent = `${SAMPLE_JD.length} characters`;
});

// ===========================
// Skill Extraction
// ===========================
function extractSkills(text) {
  const lower = text.toLowerCase();
  const found = new Map();
  // Sort skills by length descending to match longer phrases first
  const sorted = Object.keys(ALL_SKILLS).sort((a,b) => b.length - a.length);
  sorted.forEach(skill => {
    // Word boundary matching
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|[\\s,;|/()\\[\\]•\\-])${escaped}(?:$|[\\s,;|/()\\[\\]•\\-.:])`, 'i');
    if (regex.test(lower) || lower.includes(skill)) {
      found.set(skill, ALL_SKILLS[skill]);
    }
  });
  return found;
}

// ===========================
// Analysis Engine
// ===========================
function analyzeGap(resumeText, jdText) {
  const resumeSkills = extractSkills(resumeText);
  const jdSkills = extractSkills(jdText);

  const matched = new Map();
  const missing = new Map();

  jdSkills.forEach((cat, skill) => {
    if (resumeSkills.has(skill)) {
      matched.set(skill, cat);
    } else {
      missing.set(skill, cat);
    }
  });

  // Extra skills in resume not in JD
  const extra = new Map();
  resumeSkills.forEach((cat, skill) => {
    if (!jdSkills.has(skill)) extra.set(skill, cat);
  });

  // Category breakdown
  const categories = {};
  Object.keys(SKILL_TAXONOMY).forEach(cat => {
    const jdInCat = [...jdSkills].filter(([_,c]) => c === cat);
    const matchedInCat = [...matched].filter(([_,c]) => c === cat);
    categories[cat] = {
      total: jdInCat.length,
      matched: matchedInCat.length,
      pct: jdInCat.length > 0 ? Math.round((matchedInCat.length / jdInCat.length) * 100) : -1
    };
  });

  const totalJd = jdSkills.size;
  const totalMatched = matched.size;
  const overallPct = totalJd > 0 ? Math.round((totalMatched / totalJd) * 100) : 0;

  // Strength rating
  let strength = 'Weak';
  if (overallPct >= 85) strength = 'Excellent';
  else if (overallPct >= 70) strength = 'Strong';
  else if (overallPct >= 50) strength = 'Moderate';

  // Generate suggestions
  const suggestions = generateSuggestions(missing, categories, overallPct);

  return { matched, missing, extra, categories, overallPct, strength, suggestions, totalJd };
}

function generateSuggestions(missing, categories, overallPct) {
  const suggestions = [];
  // Find weakest categories
  const weakCats = Object.entries(categories)
    .filter(([_,v]) => v.total > 0 && v.pct < 50)
    .sort((a,b) => a[1].pct - b[1].pct);

  weakCats.forEach(([cat, data]) => {
    const missingInCat = [...missing].filter(([_,c]) => c === cat).map(([s]) => s);
    if (missingInCat.length > 0) {
      suggestions.push({
        priority: 'high',
        title: `Strengthen ${cat} Skills`,
        text: `You're missing key skills in this category: ${missingInCat.slice(0,4).join(', ')}. Consider adding projects or certifications that demonstrate these technologies.`
      });
    }
  });

  // General suggestions based on score
  if (overallPct < 50) {
    suggestions.push({
      priority: 'high',
      title: 'Significant Skill Gap Detected',
      text: 'Your resume covers less than half the required skills. Focus on the top 3-4 missing skills and add concrete examples of using them in projects or work.'
    });
  }

  if (missing.size > 0) {
    const topMissing = [...missing.keys()].slice(0, 3);
    suggestions.push({
      priority: 'med',
      title: 'Add Missing Keywords',
      text: `Ensure your resume explicitly mentions: ${topMissing.join(', ')}. Many companies use ATS systems that scan for exact keyword matches.`
    });
  }

  suggestions.push({
    priority: 'low',
    title: 'Quantify Your Achievements',
    text: 'Where possible, add numbers to your bullet points (e.g., "Improved API response time by 40%" or "Managed a team of 5 developers"). This makes your experience more impactful.'
  });

  if (overallPct >= 70) {
    suggestions.push({
      priority: 'low',
      title: 'Strong Foundation — Fine-Tune Details',
      text: 'Your resume has good coverage. Focus on tailoring the language to mirror the job description\'s exact terminology for maximum ATS compatibility.'
    });
  }

  return suggestions;
}

// ===========================
// Render Results
// ===========================
let radarChart = null;

function renderResults(data) {
  resultsSection.classList.remove('hidden');
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Score cards
  animateCounter('score-match', data.overallPct, '%');
  document.getElementById('score-match-sub').textContent =
    data.overallPct >= 70 ? 'Good alignment!' : data.overallPct >= 50 ? 'Room to improve' : 'Needs work';

  animateCounter('score-matched-count', data.matched.size);
  document.getElementById('score-matched-sub').textContent = `out of ${data.totalJd} required`;

  animateCounter('score-gap-count', data.missing.size);
  document.getElementById('score-gap-sub').textContent = data.missing.size === 0 ? 'Perfect!' : 'skills to add';

  document.getElementById('score-strength').textContent = data.strength;
  document.getElementById('score-strength-sub').textContent =
    data.strength === 'Excellent' ? '🔥 You\'re a great fit!' :
    data.strength === 'Strong' ? '💪 Almost there!' :
    data.strength === 'Moderate' ? '📈 Keep building!' : '🎯 Focus on gaps';

  // Ring animation
  const ringFill = document.getElementById('ring-fill-match');
  const circumference = 2 * Math.PI * 52;
  ringFill.style.strokeDasharray = circumference;
  setTimeout(() => {
    ringFill.style.strokeDashoffset = circumference - (circumference * data.overallPct / 100);
  }, 300);

  // Add SVG gradient for ring
  const svg = ringFill.closest('svg');
  if (!svg.querySelector('#ringGradient')) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `<linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#6366f1"/><stop offset="100%" style="stop-color:#a855f7"/>
    </linearGradient>`;
    svg.prepend(defs);
  }

  // Matched skills
  const matchedList = document.getElementById('matched-skills-list');
  matchedList.innerHTML = '';
  document.getElementById('matched-badge').textContent = data.matched.size;
  data.matched.forEach((cat, skill) => {
    matchedList.innerHTML += `<span class="skill-tag matched">✓ ${skill}</span>`;
  });
  if (data.matched.size === 0) matchedList.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;">No direct matches found</p>';

  // Missing skills
  const gapsList = document.getElementById('gaps-skills-list');
  gapsList.innerHTML = '';
  document.getElementById('gaps-badge').textContent = data.missing.size;
  data.missing.forEach((cat, skill) => {
    gapsList.innerHTML += `<span class="skill-tag missing">✕ ${skill}</span>`;
  });
  if (data.missing.size === 0) gapsList.innerHTML = '<p style="color:var(--green);font-size:0.85rem;">🎉 No gaps — perfect match!</p>';

  // Suggestions
  const sugList = document.getElementById('suggestions-list');
  sugList.innerHTML = '';
  data.suggestions.forEach(s => {
    const icon = s.priority === 'high' ? '🔴' : s.priority === 'med' ? '🟡' : '🟢';
    sugList.innerHTML += `
      <div class="suggestion-item">
        <div class="suggestion-icon priority-${s.priority}">${icon}</div>
        <div class="suggestion-content"><h4>${s.title}</h4><p>${s.text}</p></div>
      </div>`;
  });

  // Category bars
  const catBars = document.getElementById('category-bars');
  catBars.innerHTML = '';
  Object.entries(data.categories).forEach(([cat, val]) => {
    if (val.total === 0) return;
    catBars.innerHTML += `
      <div class="category-bar-row">
        <span class="category-name">${cat}</span>
        <div class="category-bar-track"><div class="category-bar-fill" style="width:0%" data-width="${val.pct}"></div></div>
        <span class="category-percent">${val.pct}%</span>
      </div>`;
  });
  // Animate bars
  setTimeout(() => {
    document.querySelectorAll('.category-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.width + '%';
    });
  }, 400);

  // Radar chart
  renderRadarChart(data.categories);
}

function animateCounter(id, target, suffix = '') {
  const el = document.getElementById(id);
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = current + suffix;
  }, 30);
}

function renderRadarChart(categories) {
  const labels = [];
  const values = [];
  Object.entries(categories).forEach(([cat, val]) => {
    if (val.total > 0) {
      labels.push(cat);
      values.push(val.pct);
    }
  });

  if (radarChart) radarChart.destroy();

  const colors = getChartColors();
  const ctx = document.getElementById('radar-chart').getContext('2d');
  radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels,
      datasets: [{
        label: 'Your Coverage',
        data: values,
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        borderColor: '#6366f1',
        borderWidth: 2,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: colors.pointBorder,
        pointBorderWidth: 1,
        pointRadius: 4
      }, {
        label: 'Required (100%)',
        data: labels.map(() => 100),
        backgroundColor: 'rgba(168, 85, 247, 0.05)',
        borderColor: 'rgba(168, 85, 247, 0.3)',
        borderWidth: 1,
        borderDash: [4, 4],
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: { display: false, stepSize: 25 },
          grid: { color: colors.gridColor },
          angleLines: { color: colors.gridColor },
          pointLabels: {
            color: colors.labelColor,
            font: { size: 10, family: 'Inter' }
          }
        }
      },
      plugins: {
        legend: {
          labels: { color: colors.labelColor, font: { size: 11, family: 'Inter' }, usePointStyle: true, pointStyle: 'circle' }
        }
      },
      animation: { duration: 1200, easing: 'easeOutQuart' }
    }
  });
}

// ===========================
// Event Handlers
// ===========================
btnAnalyze.addEventListener('click', runAnalysis);
document.getElementById('btn-reanalyze')?.addEventListener('click', () => {
  resultsSection.classList.add('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('btn-export')?.addEventListener('click', exportReport);

function runAnalysis() {
  const resume = resumeInput.value.trim();
  const jd = jdInput.value.trim();

  if (!resume || !jd) {
    shakeButton(btnAnalyze);
    return;
  }

  btnAnalyze.classList.add('loading');

  // Simulate brief processing
  setTimeout(() => {
    const data = analyzeGap(resume, jd);
    btnAnalyze.classList.remove('loading');
    renderResults(data);
  }, 1200);
}

function shakeButton(btn) {
  btn.style.animation = 'shake 0.4s ease';
  setTimeout(() => btn.style.animation = '', 400);
}

// Shake keyframes
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}`;
document.head.appendChild(shakeStyle);

// ===========================
// Export Report
// ===========================
function exportReport() {
  const resume = resumeInput.value.trim();
  const jd = jdInput.value.trim();
  if (!resume || !jd) return;

  const data = analyzeGap(resume, jd);
  let md = `# ResumeIQ — Gap Analysis Report\n`;
  md += `**Generated:** ${new Date().toLocaleDateString()}\n\n`;
  md += `## Overall Match: ${data.overallPct}% | Strength: ${data.strength}\n\n`;
  md += `## ✅ Matched Skills (${data.matched.size})\n`;
  data.matched.forEach((c, s) => md += `- ${s} *(${c})*\n`);
  md += `\n## ⚠️ Missing Skills (${data.missing.size})\n`;
  data.missing.forEach((c, s) => md += `- ${s} *(${c})*\n`);
  md += `\n## 📊 Category Breakdown\n`;
  Object.entries(data.categories).forEach(([cat, v]) => {
    if (v.total > 0) md += `- **${cat}**: ${v.pct}% (${v.matched}/${v.total})\n`;
  });
  md += `\n## 💡 Suggestions\n`;
  data.suggestions.forEach(s => md += `### ${s.title}\n${s.text}\n\n`);

  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ResumeIQ_Report.md';
  a.click();
  URL.revokeObjectURL(url);
}
