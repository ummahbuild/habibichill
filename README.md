# HabibiChill — Turn Anger Into Reward

The Muslim Anger & Emotional Mastery App. Manage anger using Qur'an, Sunnah, and Islamic psychology — in real time.

**Website:** [HabibiChill.com](https://habibichill.com)  
**Made by:** [Ummah Build](https://ummah.build) · [X](https://x.com/ummahbuild) · [LinkedIn](https://linkedin.com/company/ummah-build)

---

## Tech Stack

- React 18 + TypeScript
- Vite + PWA (offline-first)
- Tailwind CSS + shadcn/ui
- Framer Motion animations
- 100% client-side, no backend

## File Structure

```
src/
├── assets/
│   └── habibichill-logo.png
├── components/
│   ├── EmergencyFlow.tsx        # 5-step Sunnah anger protocol
│   ├── QuranPlayer.tsx          # Sticky audio player with surah picker
│   ├── DhikrCounter.tsx         # SubhanAllah/Alhamdulillah/Allahu Akbar counter
│   ├── WuduGuide.tsx            # Step-by-step wudu guide
│   ├── AngerJournal.tsx         # Anger journal with reflection prompts
│   ├── SituationGuide.tsx       # Situation-based guidance (marriage, work, etc.)
│   ├── NavLink.tsx              # Navigation link component
│   ├── tabs/
│   │   ├── HomeTab.tsx          # Dashboard with tools & wisdom
│   │   ├── LearnTab.tsx         # Prevention training lessons
│   │   ├── TrackTab.tsx         # Progress tracking & achievements
│   │   └── ProfileTab.tsx       # Settings & accessibility
│   └── ui/                     # shadcn/ui components
├── context/
│   └── AppContext.tsx           # Global state (localStorage persistence)
├── pages/
│   ├── Index.tsx                # Router/state switcher
│   ├── LandingPage.tsx          # SEO-optimized landing page
│   ├── OnboardingFlow.tsx       # 6-step personalization
│   ├── Dashboard.tsx            # Main app shell + navbar
│   └── NotFound.tsx
├── index.css                    # Design tokens & theme
└── main.tsx                     # App entry
```

## Features

### ✅ Done

- [x] Landing page with SEO meta tags, JSON-LD, and AI engine optimization
- [x] Social sharing meta image (habibichillmeta.png for OG/Twitter)
- [x] PWA support with offline capability and installability
- [x] "I'm Angry" emergency button with 5-step Sunnah protocol
- [x] Center circle emergency button in bottom navigation bar
- [x] Breathing exercise with animated circle
- [x] Quran & hadith references with source links (quran.com, sunnah.com)
- [x] Sticky Quran audio player with play/pause/next/prev and surah picker
- [x] Sabr points & streak gamification system
- [x] Anger log tracking with controlled/uncontrolled outcomes
- [x] 6-step onboarding flow with personalization
- [x] Dark mode, font size, reduced motion, high contrast settings
- [x] Mobile-responsive design throughout
- [x] Daily wisdom with rotating Quranic verses
- [x] Prevention training (Learn tab) with lesson roadmap
- [x] Achievement badges on Track tab
- [x] Profile with social links and reset
- [x] Dhikr counter (SubhanAllah, Alhamdulillah, Allahu Akbar with progress ring)
- [x] Wudu step-by-step guide with 11 steps and dua
- [x] Anger journal with 4-step reflection (trigger, situation, control, reflection)
- [x] Situation-based guidance (Marriage, Online, Family, Workplace, Parenting, Traffic)
- [x] Quick tools wired up on Home tab (Dhikr, Quran, Wudu, Journal)

### 📋 TODO

- [ ] Haptic feedback on emergency flow steps
- [ ] Multiple Quran reciter options
- [ ] Ramadan Mode with fasting-specific guidance
- [ ] Marriage Mode with couples tools
- [ ] Weekly anger pattern analytics charts
- [ ] Export journal as PDF
- [ ] Apple Watch / wearable quick actions
- [ ] Lock screen widget support
- [ ] AI Islamic coaching companion (non-fatwa)
- [ ] Community challenges (Ramadan No-Anger, Forgiveness Friday)
- [ ] Scholar content library with video/audio lectures
- [ ] Multi-language support (Arabic, Urdu, Malay, Turkish)
- [ ] Smart notifications (streak reminders, stress detection)
- [ ] Silence timer tool
- [ ] Pre-emptive calm reminders based on anger patterns

## Development

```sh
npm install
npm run dev
```

## License

© 2025 HabibiChill.com — Made with ❤️ by [Ummah Build](https://ummah.build)
