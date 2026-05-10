# 🎯 ResumeIQ — AI-Powered Resume Gap Analyzer

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="Chart.js"/>
</p>

**ResumeIQ** is a smart, client-side resume analysis tool that compares your resume against a target job description to identify skill gaps, highlight matches, and provide actionable improvement suggestions — all without requiring any API keys or backend.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📊 **Skill Gap Analysis** | Compares resume vs job description across 250+ skills in 8 categories |
| 🕸️ **Radar Chart** | Visual skill coverage breakdown using Chart.js |
| ✅ **Matched Skills** | Green-tagged skills that align with the job requirements |
| ⚠️ **Missing Skills** | Red-tagged gaps you need to fill |
| 💡 **Smart Suggestions** | Priority-ranked improvement tips (High / Medium / Low) |
| 📈 **Category Breakdown** | Animated progress bars per skill category |
| 🌓 **Dark / Light Theme** | Toggle between themes with localStorage persistence |
| 📥 **Export Report** | Download your analysis as a Markdown (.md) file |
| ⚡ **100% Client-Side** | No backend, no API keys — runs entirely in the browser |

## 🖼️ Screenshots

### Dark Mode
![Dark Mode](screenshots/dark-mode.png)

### Light Mode
![Light Mode](screenshots/light-mode.png)

## 🚀 Getting Started

### Option 1: Open Directly
Simply open `index.html` in any modern browser — no installation required!

### Option 2: Local Server
```bash
# Using Node.js serve
npx serve .

# Or Python
python -m http.server 3000
```

Then visit `http://localhost:3000`

## 🛠️ Tech Stack

- **HTML5** — Semantic markup & structure
- **CSS3** — Custom properties, glassmorphism, animations, responsive design
- **JavaScript (Vanilla)** — Core analysis engine with intelligent skill extraction
- **Chart.js** — Radar chart visualization
- **Google Fonts (Inter)** — Modern typography

## 📂 Project Structure

```
ResumeIQ/
├── index.html      # Main application page
├── style.css       # Design system & themes (dark/light)
├── analyzer.js     # Core analysis engine & UI logic
└── README.md       # Project documentation
```

## 🧠 How It Works

1. **Paste** your resume text and the target job description
2. **Click** "Analyze Resume Gap"
3. **Review** matched skills, missing skills, radar chart, and suggestions
4. **Export** the report as a Markdown file

The analyzer uses a curated taxonomy of **250+ technical and soft skills** across 8 categories:
- Programming Languages
- Frontend Development
- Backend Development
- Databases
- Cloud & DevOps
- Data & AI/ML
- Testing & QA
- Soft Skills & Methods

## 👤 Author

**Rajdeepsinh Jadeja**
- GitHub: [@rajdeepsinh](https://github.com/rajdeepsinh)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
