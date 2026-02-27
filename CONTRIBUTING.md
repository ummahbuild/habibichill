# Contributing to HabibiChill 🤝

Jazāk Allāhu Khayran for your interest in contributing to HabibiChill! This project is built by [Ummah Build](https://ummah.build) and is open to the Muslim tech community.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Submitting Changes](#submitting-changes)
- [Issue Guidelines](#issue-guidelines)
- [Style Guide](#style-guide)
- [License](#license)

---

## 📜 Code of Conduct

This project follows Islamic adab (etiquette). We expect all contributors to:

- Be respectful and kind in all interactions
- Provide constructive feedback with good intentions
- Ensure all Islamic content is sourced from authentic references
- Avoid adding content that contradicts the Qur'an and Sunnah
- Remember that this project serves the Ummah — prioritize benefit over ego

---

## 🛠️ How to Contribute

### 🐛 Report a Bug
1. Check [existing issues](https://github.com/ummah-build/habibichill/issues) first
2. Use the **Bug Report** issue template
3. Include steps to reproduce, expected vs. actual behavior, and device/browser info

### 💡 Suggest a Feature
1. Check [existing feature requests](https://github.com/ummah-build/habibichill/issues?q=label%3Aenhancement)
2. Use the **Feature Request** issue template
3. Explain the problem it solves and how it benefits users

### 🌍 Add a Translation
1. We welcome translations into Arabic, Urdu, Malay, Turkish, French, and more
2. Use the **Translation** issue template
3. Ensure Islamic terms are translated accurately

### 📖 Improve Islamic Content
1. All Quranic references must link to [Quran.com](https://quran.com)
2. All Hadith references must link to [Sunnah.com](https://sunnah.com) and include narrator, source book, and number
3. Use the **Content Improvement** issue template

### ♿ Accessibility Improvements
- We prioritize screen reader support, keyboard navigation, and reduced motion
- Test with at least one screen reader before submitting accessibility PRs

---

## 💻 Development Setup

### Prerequisites
- Node.js 18+ or Bun
- Git

### Getting Started

```bash
# Clone the repository
git clone https://github.com/ummah-build/habibichill.git
cd habibichill

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Tech Stack
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Build tool with HMR |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Accessible UI components |
| Framer Motion | Animations & transitions |
| PWA (vite-plugin-pwa) | Offline support |
| localStorage | Client-side persistence |
| Recharts | Data visualization |

---

## 📁 Project Structure

```
src/
├── assets/          # Images & static assets
├── components/      # Reusable components
│   ├── tabs/        # Main tab views (Home, Quran, Learn, Me)
│   └── ui/          # shadcn/ui component library
├── context/         # React context (AppContext.tsx)
├── data/            # Static data (blog posts)
├── hooks/           # Custom React hooks
├── lib/             # Utilities
└── pages/           # Route pages
```

---

## 📝 Submitting Changes

1. **Fork** the repository
2. **Create a branch**: `git checkout -b feature/your-feature-name`
3. **Make changes** following the [Style Guide](#style-guide)
4. **Test** your changes locally on both mobile and desktop
5. **Commit** with clear messages: `feat: add silence timer to emergency flow`
6. **Push** to your fork: `git push origin feature/your-feature-name`
7. **Open a Pull Request** with a clear description of changes

### Commit Convention
We use [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation
- `style:` — Formatting (no code change)
- `refactor:` — Code restructuring
- `test:` — Adding/updating tests
- `chore:` — Maintenance

---

## 🎯 Issue Guidelines

### Before Opening an Issue
- Search existing issues to avoid duplicates
- Check if the feature is already on our [roadmap](README.md#future-roadmap)

### Issue Labels
| Label | Description |
|---|---|
| `bug` | Something isn't working |
| `enhancement` | New feature or improvement |
| `translation` | Language/translation work |
| `islamic-content` | Quran/Hadith/Dua content |
| `accessibility` | Accessibility improvements |
| `good first issue` | Good for newcomers |
| `help wanted` | Extra attention needed |

---

## 🎨 Style Guide

### Code
- Use TypeScript strict mode
- Follow existing patterns in the codebase
- Use Tailwind CSS semantic tokens (`text-foreground`, `bg-card`) — never hardcode colors
- Components should be small and focused (< 200 lines ideally)
- Use `framer-motion` for animations

### Islamic Content
- **Quranic verses**: Include Arabic text, transliteration, English translation, and Quran.com link
- **Hadith**: Include narrator (رضي الله عنه), source book, hadith number, and Sunnah.com link
- **Duas**: Include Arabic, transliteration, English meaning, and when to recite
- Never include unverified or fabricated hadith
- Use ﷺ after Prophet Muhammad's name

### Design
- Mobile-first responsive design
- Support dark mode via CSS variables
- Ensure proper contrast ratios (WCAG AA minimum)
- Use the app's design tokens from `index.css`

---

## ⚖️ License

HabibiChill is released under the **MIT License**. By contributing, you agree that your contributions will be licensed under the same license.

```
MIT License

Copyright (c) 2025 Ummah Build

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🤲 Dua

May Allah accept our efforts in serving the Ummah through technology. May this project be a means of sadaqah jariyah for all contributors.

**Built with ❤️ by [Ummah Build](https://ummah.build)**
