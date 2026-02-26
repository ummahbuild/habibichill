import { useLocation, Link } from "react-router-dom";

const content: Record<string, { title: string; lastUpdated: string; sections: { heading: string; body: string }[] }> = {
  privacy: {
    title: "Privacy Policy",
    lastUpdated: "February 26, 2026",
    sections: [
      {
        heading: "Overview",
        body: "HabibiChill is built by Ummah Build. Your privacy is fundamental to our mission. This app is designed to be 100% private — no accounts, no servers, no tracking.",
      },
      {
        heading: "Data Collection",
        body: "HabibiChill does NOT collect, store, or transmit any personal data to external servers. All data (anger journal entries, settings, dhikr counts, lesson progress) is stored exclusively in your browser's localStorage on your device. We have no ability to access, read, or recover your data.",
      },
      {
        heading: "Analytics & Tracking",
        body: "We do not use cookies, analytics trackers, or any third-party tracking scripts. No Google Analytics, no Facebook Pixel, no fingerprinting. Your usage of HabibiChill is completely private.",
      },
      {
        heading: "Third-Party Services",
        body: "The only external requests made by the app are: (1) Quran audio files loaded from cdn.islamic.network for the Quran player feature. (2) Google Fonts for typography (Amiri, Inter, Poppins). These services may have their own privacy policies.",
      },
      {
        heading: "Data Deletion",
        body: "Since all data is stored locally in your browser, you can delete all HabibiChill data at any time by: (1) Using the 'Reset All Data' button in the Profile/Settings tab, or (2) Clearing your browser's site data for this domain.",
      },
      {
        heading: "Children's Privacy",
        body: "HabibiChill does not knowingly collect data from children under 13. Since no data is collected from any user, this concern does not apply.",
      },
      {
        heading: "Changes to This Policy",
        body: "We may update this privacy policy from time to time. Any changes will be reflected on this page with an updated date.",
      },
      {
        heading: "Contact",
        body: "For questions about this privacy policy, contact Ummah Build at https://ummah.build or on X @ummahbuild.",
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    lastUpdated: "February 26, 2026",
    sections: [
      {
        heading: "Acceptance of Terms",
        body: "By accessing and using HabibiChill, you agree to these Terms of Service. If you do not agree, please do not use the app.",
      },
      {
        heading: "Description of Service",
        body: "HabibiChill is a free Progressive Web App that provides Islamic anger management tools, Quranic references, Hadith guidance, and emotional regulation exercises. The app is provided 'as is' without warranties of any kind.",
      },
      {
        heading: "Not a Substitute for Professional Help",
        body: "HabibiChill is an educational and spiritual tool. It is NOT a substitute for professional mental health counseling, therapy, or medical advice. If you are experiencing severe emotional distress, domestic violence, or mental health crises, please seek professional help immediately.",
      },
      {
        heading: "Religious Content Disclaimer",
        body: "The Quranic verses, Hadith references, and Islamic guidance provided are sourced from authentic collections and reputable Islamic sources (Quran.com, Sunnah.com). However, for specific religious rulings (fatwas), please consult qualified Islamic scholars in your community.",
      },
      {
        heading: "User Data",
        body: "All user data is stored locally on your device. We do not have access to your data and cannot recover it if lost. You are responsible for your own data.",
      },
      {
        heading: "Intellectual Property",
        body: "HabibiChill is owned and operated by Ummah Build. The app design, branding, and original content are the property of Ummah Build. Quranic text and Hadith content are part of the Islamic public domain.",
      },
      {
        heading: "Limitation of Liability",
        body: "Ummah Build and HabibiChill shall not be liable for any damages arising from the use or inability to use the app, including but not limited to emotional, psychological, or relational outcomes.",
      },
      {
        heading: "Modifications",
        body: "We reserve the right to modify these terms at any time. Continued use of the app after changes constitutes acceptance of the updated terms.",
      },
      {
        heading: "Contact",
        body: "For questions about these terms, contact Ummah Build at https://ummah.build.",
      },
    ],
  },
  legal: {
    title: "Legal Notice",
    lastUpdated: "February 26, 2026",
    sections: [
      {
        heading: "Publisher",
        body: "HabibiChill is published by Ummah Build. Website: https://ummah.build. Social: @ummahbuild on X and LinkedIn.",
      },
      {
        heading: "Hosting",
        body: "The application is hosted on Vercel (vercel.com). Quran audio content is served via the Islamic Network CDN (cdn.islamic.network).",
      },
      {
        heading: "Content Sources",
        body: "Quranic text and translations are referenced from Quran.com. Hadith texts and authentication grades are referenced from Sunnah.com. All references include direct links to their sources for verification. Audio recitations are by Sheikh Mishary Rashid Alafasy.",
      },
      {
        heading: "Accuracy",
        body: "While we strive for accuracy in all Islamic content, HabibiChill is an educational tool and should not be used as a sole source for Islamic rulings. Always verify with qualified scholars.",
      },
      {
        heading: "Open Source",
        body: "HabibiChill's codebase is the property of Ummah Build. Portions of the UI use open-source libraries including React, Tailwind CSS, shadcn/ui, and Framer Motion, each under their respective licenses.",
      },
      {
        heading: "Contact",
        body: "For legal inquiries, please reach out via https://ummah.build.",
      },
    ],
  },
};

const LegalPage = () => {
  const location = useLocation();
  const type = location.pathname.replace("/", "") || "legal";
  const page = content[type] || content.legal;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/95 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link to="/" className="font-heading text-lg font-bold text-foreground hover:text-primary transition-colors">
            ← HabibiChill
          </Link>
          <div className="flex gap-4 text-sm">
            <Link to="/privacy" className={`transition-colors ${type === "privacy" ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}>Privacy</Link>
            <Link to="/terms" className={`transition-colors ${type === "terms" ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}>Terms</Link>
            <Link to="/legal" className={`transition-colors ${type === "legal" ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}>Legal</Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto max-w-2xl px-4 py-12">
        <h1 className="mb-2 font-heading text-3xl font-bold text-foreground">{page.title}</h1>
        <p className="mb-8 text-sm text-muted-foreground">Last updated: {page.lastUpdated}</p>

        <div className="flex flex-col gap-6">
          {page.sections.map((section, i) => (
            <section key={i}>
              <h2 className="mb-2 font-heading text-lg font-semibold text-foreground">{section.heading}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} HabibiChill.com — Made with ❤️ by{" "}
            <a href="https://ummah.build" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              Ummah Build
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default LegalPage;
