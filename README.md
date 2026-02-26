# HabibiChill — Turn Anger Into Reward 🔥➡️🌟

The Muslim Anger & Emotional Mastery App. Manage anger using Qur'an, Sunnah, and Islamic psychology — in real time.

**Website:** [HabibiChill.com](https://habibichill.com)
**Built by:** [Ummah Build](https://ummah.build) · [X](https://x.com/ummahbuild) · [LinkedIn](https://linkedin.com/company/ummah-build)

---

## About

HabibiChill is a free, private, offline-first Progressive Web App designed to help Muslims manage anger using authentic Islamic teachings. It combines Quranic guidance, Prophetic ﷺ traditions, and modern emotional regulation techniques into an accessible, mobile-first experience.

No account required. No data leaves your device. 100% client-side.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Build tool with HMR |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Accessible UI components |
| Framer Motion | Animations & transitions |
| PWA (vite-plugin-pwa) | Offline support & installability |
| localStorage | Client-side data persistence |
| Recharts | Data visualization |

---

## File Structure

```
habibichill/
├── public/
│   ├── favicon.ico / favicon.svg / favicon-96x96.png
│   ├── apple-touch-icon.png
│   ├── web-app-manifest-192x192.png
│   ├── web-app-manifest-512x512.png
│   ├── habibichillmeta.png          # OG/Twitter social share image
│   ├── robots.txt
│   └── site.webmanifest
├── src/
│   ├── assets/
│   │   └── habibichill-logo.png
│   ├── components/
│   │   ├── EmergencyFlow.tsx         # 5-step Sunnah anger protocol with audio & hadith
│   │   ├── QuranPlayer.tsx           # Sticky audio player (Mishary Alafasy) with seekbar
│   │   ├── DhikrCounter.tsx          # 33-33-34 counter with progress ring & persistence
│   │   ├── WuduGuide.tsx             # 11-step wudu tutorial with sunnah references
│   │   ├── AngerJournal.tsx          # 4-step reflection journal with Sabr Points
│   │   ├── SituationGuide.tsx        # Situational guidance (6 scenarios)
│   │   ├── NavLink.tsx
│   │   ├── tabs/
│   │   │   ├── HomeTab.tsx           # Dashboard: quick tools, daily wisdom, Quran
│   │   │   ├── LearnTab.tsx          # 8 lessons with Quran, Hadith & exercises
│   │   │   ├── TrackTab.tsx          # Stats, achievements, anger log
│   │   │   └── ProfileTab.tsx        # Settings & accessibility options
│   │   └── ui/                       # shadcn/ui component library
│   ├── context/
│   │   └── AppContext.tsx            # Global state with localStorage persistence
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Index.tsx                 # State router (landing → onboarding → app)
│   │   ├── LandingPage.tsx           # SEO landing page with research stats
│   │   ├── OnboardingFlow.tsx        # 6-step personalization flow
│   │   ├── Dashboard.tsx             # Main app shell with bottom nav
│   │   ├── LegalPage.tsx             # Privacy, Terms, Legal pages
│   │   └── NotFound.tsx
│   ├── index.css                     # Design system tokens & theme
│   ├── main.tsx                      # App entry point
│   └── App.tsx                       # Router & providers
├── index.html                        # SEO meta, OG tags, structured data
├── vercel.json                       # SPA routing for Vercel deployment
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

---

## Features

### 🔥 Emergency Anger Protocol
- "I'm Angry" button with 5-step Sunnah-based calming flow
- Seek Refuge (A'ūdhu billāh) with audio recitation (Alafasy)
- Change position, make wudu, stay silent, make dua
- Every step includes expandable Hadith cards with narrator, source book, grade, and sunnah.com links

### 📖 Quran Player
- Sticky audio player with 11 surahs (Al-Fatiha through An-Nas)
- Mishary Rashid Alafasy recitation via Islamic Network CDN
- Play/pause, prev/next, seekable progress bar, surah picker
- Time display and loading states

### 📿 Dhikr Counter
- SubhanAllah (33), Alhamdulillah (33), Allahu Akbar (34)
- Animated progress ring with tap-to-count
- Auto-advance between dhikr phases
- Expandable hadith rewards for each dhikr
- Progress persisted to localStorage
- Completion screen with celebratory hadith (Sahih Muslim 597)

### 💧 Wudu Guide
- 11-step interactive tutorial with progress bar
- Arabic text and transliteration for duas
- Sunnah references with sunnah.com links for each step
- Practical tips (e.g., "interlock fingers", "don't forget heels")
- Completion screen with dua after wudu (Tirmidhi 55)

### 📓 Anger Journal
- 4-step reflection: Trigger → Situation/Intensity → Control → Reflection
- 8 trigger categories (Work, Family, Online, Traffic, etc.)
- 5-level intensity emoji scale
- +10 Sabr Points for controlled anger
- Success screen with relevant Quranic verse
- Entries saved and viewable in Track tab

### 🧭 Situation-Based Guidance
- 6 real-life scenarios: Marriage, Online, Family, Workplace, Parenting, Traffic
- Each includes 5 tailored action steps
- Quranic ayah with Arabic, translation, and link
- Hadith with source and sunnah.com link

### 📚 Learn Tab — 8 Full Lessons
1. Understanding Your Anger (Foundation)
2. The Prophet's ﷺ Anger Protocol (Sunnah)
3. The Ego & Arrogance Connection (Prevention)
4. Patience (Sabr) as a Practice (Patience)
5. Forgiveness: The Ultimate Power (Forgiveness)
6. Marriage & Anger Management (Relationships)
7. Controlling Anger While Fasting (Ramadan)
8. Imam Ghazali on Purifying the Heart (Advanced)

Each lesson includes:
- Introduction and expandable topic sections
- Quranic ayahs (Arabic + transliteration + English + Quran.com link)
- Authenticated Hadiths (narrator, source, grade badge, sunnah.com link)
- Key takeaways
- Practical daily exercise
- Completion tracking with localStorage persistence

### 📊 Track Tab
- Sabr Score & streak tracking
- Controlled vs. uncontrolled anger log
- Achievement badges (First Control, Streak Master, etc.)
- Anger entry history with details

### ⚙️ Profile & Settings
- Dark mode toggle
- Font size (small/medium/large)
- Reduced motion
- High contrast mode
- Reset all data
- Ummah Build social links

### 🌐 Landing Page
- SEO-optimized with full meta tags (OG, Twitter)
- "Why This Matters" research stats section (7 data points)
- Quranic verse feature section
- Mobile-responsive design
- Social sharing image

### 🔧 Technical
- PWA with service worker and offline support
- Mobile-first responsive design
- Safe area support for notched devices
- Keyboard accessible
- Screen reader friendly semantic HTML
- localStorage persistence for all user data
- No external accounts or logins required

---

## Future Roadmap

### 🔜 Coming Soon
- [ ] Haptic feedback on emergency flow steps
- [ ] Multiple Quran reciter options (Sudais, Shuraim, Abdul Basit)
- [ ] Silence timer with countdown and motivational hadith
- [ ] Weekly anger pattern analytics charts (recharts)
- [ ] Export anger journal as PDF

### 🗓️ Planned
- [ ] Ramadan Mode — fasting-specific anger guidance, iftar calm reminders
- [ ] Marriage Mode — couples tools, shared reflection
- [ ] AI Islamic coaching companion (non-fatwa emotional guidance)
- [ ] Community challenges (Ramadan No-Anger, Forgiveness Friday)
- [ ] Scholar content library with video/audio lectures
- [ ] Smart notifications (streak reminders, pattern-based calm alerts)
- [ ] Pre-emptive calm reminders based on anger patterns

### 🌍 Long-Term Vision
- [ ] Multi-language support (Arabic, Urdu, Malay, Turkish, French)
- [ ] Apple Watch / wearable quick actions
- [ ] Lock screen widget support
- [ ] Integration with Muslim Pro and other Islamic apps
- [ ] Mosque-based anger management program toolkit
- [ ] Research partnerships with Islamic psychology institutions
- [ ] Family mode with parenting-specific tools
- [ ] Therapist/counselor referral directory

---

## Development

```sh
npm install
npm run dev
```

Build for production:

```sh
npm run build
```

---

## Deployment

Configured for Vercel with `vercel.json` SPA routing. All routes redirect to `index.html` for client-side routing.

```sh
vercel --prod
```

---

## Contributing

HabibiChill is built by [Ummah Build](https://ummah.build) — a studio building tech for the Muslim community. We welcome contributions, feedback, and duas.

- 🐛 Report bugs via GitHub Issues
- 💡 Suggest features via GitHub Discussions
- 🤝 PRs welcome for translations and accessibility improvements

---

## License

© 2025 [HabibiChill.com](https://habibichill.com) — Made with ❤️ by [Ummah Build](https://ummah.build)
