import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LessonAyah {
  arabic: string;
  transliteration: string;
  english: string;
  ref: string;
  link: string;
}

interface LessonHadith {
  arabic?: string;
  text: string;
  narrator?: string;
  source: string;
  link: string;
  grade?: string;
}

interface LessonSection {
  heading: string;
  body: string;
}

interface LessonContent {
  intro: string;
  sections: LessonSection[];
  ayahs: LessonAyah[];
  hadiths: LessonHadith[];
  keyTakeaways: string[];
  exercise?: string;
}

interface Lesson {
  id: number;
  title: string;
  duration: string;
  category: string;
  emoji: string;
  content: LessonContent;
}

const lessons: Lesson[] = [
  {
    id: 1,
    title: "Understanding Your Anger",
    duration: "5 min",
    category: "Foundation",
    emoji: "🧠",
    content: {
      intro: "Anger (غضب — ghadab) is a natural human emotion. Islam does not ask you to never feel anger — even the Prophet ﷺ became angry. The key is what you do with it. Understanding the nature of anger is the first step to mastering it.",
      sections: [
        {
          heading: "Why Do We Get Angry?",
          body: "Anger is triggered when we feel threatened, disrespected, or powerless. Shaytan fuels it, turning a spark into a wildfire. Imam al-Ghazali described anger as 'the fire of the heart' — it clouds judgment, destroys relationships, and pushes us away from Allah's pleasure.",
        },
        {
          heading: "The Islamic Perspective",
          body: "Islam distinguishes between righteous anger (for Allah's sake — like when the Prophet ﷺ became angry at injustice) and selfish anger (for the ego). Most of our daily anger is ego-driven. Recognizing this distinction is transformative.",
        },
        {
          heading: "The Physical Reality",
          body: "When angry, your body releases adrenaline and cortisol. Your heart races, blood pressure spikes, and rational thinking shuts down. The Sunnah remedies (wudu, sitting/lying down, silence) directly counter these physiological responses.",
        },
      ],
      ayahs: [
        {
          arabic: "وَالَّذِينَ يَجْتَنِبُونَ كَبَائِرَ الْإِثْمِ وَالْفَوَاحِشَ وَإِذَا مَا غَضِبُوا هُمْ يَغْفِرُونَ",
          transliteration: "Walladhīna yajtanibūna kabā'ira al-ithmi wal-fawāḥisha wa idhā mā ghaḍibū hum yaghfirūn",
          english: "And those who avoid the major sins and immoralities, and when they are angry, they forgive.",
          ref: "Qur'an 42:37",
          link: "https://quran.com/42/37",
        },
        {
          arabic: "وَلَمَن صَبَرَ وَغَفَرَ إِنَّ ذَٰلِكَ لَمِنْ عَزْمِ الْأُمُورِ",
          transliteration: "Wa laman ṣabara wa ghafara inna dhālika lamin 'azmi al-umūr",
          english: "And whoever is patient and forgives — indeed, that is of the matters [requiring] determination.",
          ref: "Qur'an 42:43",
          link: "https://quran.com/42/43",
        },
      ],
      hadiths: [
        {
          arabic: "لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ",
          text: "The strong person is not the one who can overpower others. The strong person is the one who controls himself when he is angry.",
          narrator: "Narrated by Abu Hurayrah (رضي الله عنه)",
          source: "Sahih al-Bukhari 6114",
          link: "https://sunnah.com/bukhari:6114",
          grade: "Sahih (Authentic)",
        },
      ],
      keyTakeaways: [
        "Anger itself is not sinful — acting on it wrongly is",
        "Most daily anger is ego-driven, not righteous",
        "The body's anger response can be physically countered with Sunnah practices",
        "Self-awareness is the foundation of anger management",
      ],
      exercise: "For the next 24 hours, whenever you feel a flash of irritation, pause and ask: 'Is this anger for Allah's sake, or for my ego?' Write down what you discover.",
    },
  },
  {
    id: 2,
    title: "The Prophet's ﷺ Anger Protocol",
    duration: "7 min",
    category: "Sunnah",
    emoji: "🕌",
    content: {
      intro: "The Prophet Muhammad ﷺ gave us a precise, step-by-step protocol for dealing with anger. These are not just spiritual suggestions — they are practical, physiologically sound techniques that work immediately.",
      sections: [
        {
          heading: "Step 1: Seek Refuge from Shaytan",
          body: "The very first thing to do when anger strikes is to say: A'ūdhu billāhi min ash-shayṭān ir-rajīm (I seek refuge in Allah from the accursed Satan). This is because Shaytan fans the flames of anger. The Prophet ﷺ once saw a man in a fit of rage and said: 'I know a word which, if he were to say it, what he feels would go away.'",
        },
        {
          heading: "Step 2: Change Your Physical Position",
          body: "If you are standing, sit down. If you are sitting, lie down. This is a Sunnah with a scientific basis — lowering your body reduces blood pressure and signals to your nervous system to calm down. It also physically removes you from a confrontational stance.",
        },
        {
          heading: "Step 3: Make Wudu",
          body: "The Prophet ﷺ said: 'Anger comes from Shaytan. Shaytan was created from fire, and fire is extinguished only with water. So when any of you becomes angry, let him make wudu.' The cool water on your skin activates the parasympathetic nervous system, directly countering the fight-or-flight response.",
        },
        {
          heading: "Step 4: Stay Silent",
          body: "When angry, your words become weapons. The Prophet ﷺ said: 'If any of you becomes angry, let him keep silent.' In that moment, anything you say will likely be regretted. Silence is not weakness — it is the ultimate display of strength.",
        },
      ],
      ayahs: [
        {
          arabic: "وَإِمَّا يَنزَغَنَّكَ مِنَ الشَّيْطَانِ نَزْغٌ فَاسْتَعِذْ بِاللَّهِ إِنَّهُ سَمِيعٌ عَلِيمٌ",
          transliteration: "Wa immā yanzaghannaka mina ash-shayṭāni nazghun fasta'idh billāhi innahu samī'un 'alīm",
          english: "And if an evil suggestion comes to you from Satan, then seek refuge in Allah. Indeed, He is Hearing and Knowing.",
          ref: "Qur'an 7:200",
          link: "https://quran.com/7/200",
        },
      ],
      hadiths: [
        {
          arabic: "إِذَا غَضِبَ أَحَدُكُمْ وَهُوَ قَائِمٌ فَلْيَجْلِسْ فَإِنْ ذَهَبَ عَنْهُ الْغَضَبُ وَإِلاَّ فَلْيَضْطَجِعْ",
          text: "If any of you becomes angry and he is standing, let him sit down so his anger will go away. If it does not go away, let him lie down.",
          narrator: "Narrated by Abu Dharr (رضي الله عنه)",
          source: "Sunan Abu Dawud 4782",
          link: "https://sunnah.com/abudawud:4782",
          grade: "Sahih (Authentic)",
        },
        {
          text: "Anger comes from Shaytan. Shaytan was created from fire, and fire is extinguished only with water. So when any of you becomes angry, let him perform wudu.",
          narrator: "Narrated by Atiyyah as-Sa'di (رضي الله عنه)",
          source: "Sunan Abu Dawud 4784",
          link: "https://sunnah.com/abudawud:4784",
          grade: "Hasan (Good)",
        },
        {
          text: "If any of you becomes angry, let him keep silent.",
          narrator: "Narrated by Ibn Abbas (رضي الله عنه)",
          source: "Musnad Ahmad 2136",
          link: "https://sunnah.com/ahmad:2136",
          grade: "Sahih (Authentic)",
        },
      ],
      keyTakeaways: [
        "The Sunnah protocol is: Seek refuge → Change position → Make wudu → Stay silent",
        "Each step has both spiritual and physiological benefits",
        "Acting on these steps interrupts the anger cycle before it escalates",
        "Practice these steps before anger strikes so they become automatic",
      ],
      exercise: "Memorize the four steps in order. Practice them today even when you are NOT angry, so your body remembers the sequence when you need it most.",
    },
  },
  {
    id: 3,
    title: "The Ego & Arrogance Connection",
    duration: "8 min",
    category: "Prevention",
    emoji: "🪞",
    content: {
      intro: "Most anger stems from the ego (nafs). We get angry because someone challenged our importance, our opinion, or our status. Understanding the deep connection between kibr (arrogance) and ghadab (anger) is key to uprooting anger at its source.",
      sections: [
        {
          heading: "The Root: 'I Am Right, You Are Wrong'",
          body: "Ask yourself honestly — how many times have you gotten angry not because of injustice, but because someone didn't respect YOU? Because YOUR plan was disrupted? Because YOUR ego was bruised? This is the nafs (lower self) at work, and Shaytan's first sin was exactly this: arrogance.",
        },
        {
          heading: "Kibr: The Disease of the Heart",
          body: "The Prophet ﷺ defined arrogance precisely: rejecting the truth and looking down on people. When we are angry, we often do both — we refuse to accept we might be wrong, and we belittle the other person. Anger and arrogance are twins.",
        },
        {
          heading: "The Antidote: Tawadu' (Humility)",
          body: "Humility is not thinking less of yourself — it is thinking of yourself less. When you truly internalize that all honor belongs to Allah, that you are His servant, the ego loosens its grip. A humble heart is rarely an angry heart.",
        },
      ],
      ayahs: [
        {
          arabic: "وَلَا تُصَعِّرْ خَدَّكَ لِلنَّاسِ وَلَا تَمْشِ فِي الْأَرْضِ مَرَحًا إِنَّ اللَّهَ لَا يُحِبُّ كُلَّ مُخْتَالٍ فَخُورٍ",
          transliteration: "Wa lā tuṣa''ir khaddaka lin-nāsi wa lā tamshi fil-arḍi maraḥā. Innallāha lā yuḥibbu kulla mukhtālin fakhūr",
          english: "And do not turn your cheek in contempt toward people, and do not walk through the earth arrogantly. Indeed, Allah does not like everyone self-deluded and boastful.",
          ref: "Qur'an 31:18",
          link: "https://quran.com/31/18",
        },
        {
          arabic: "تِلْكَ الدَّارُ الْآخِرَةُ نَجْعَلُهَا لِلَّذِينَ لَا يُرِيدُونَ عُلُوًّا فِي الْأَرْضِ وَلَا فَسَادًا",
          transliteration: "Tilka ad-dāru al-ākhiratu naj'aluhā lilladhīna lā yurīdūna 'uluwwan fil-arḍi wa lā fasādā",
          english: "That home of the Hereafter — We assign it to those who do not desire exaltedness upon the earth or corruption.",
          ref: "Qur'an 28:83",
          link: "https://quran.com/28/83",
        },
      ],
      hadiths: [
        {
          arabic: "لاَ يَدْخُلُ الْجَنَّةَ مَنْ كَانَ فِي قَلْبِهِ مِثْقَالُ ذَرَّةٍ مِنْ كِبْرٍ",
          text: "No one who has an atom's weight of arrogance in his heart will enter Paradise.",
          narrator: "Narrated by Abdullah ibn Mas'ud (رضي الله عنه)",
          source: "Sahih Muslim 91",
          link: "https://sunnah.com/muslim:91",
          grade: "Sahih (Authentic)",
        },
        {
          text: "The Prophet ﷺ was asked: 'What is arrogance?' He said: 'Rejecting the truth (batarul-haqq) and looking down on people (ghamtun-nas).'",
          narrator: "Narrated by Abdullah ibn Mas'ud (رضي الله عنه)",
          source: "Sahih Muslim 91",
          link: "https://sunnah.com/muslim:91",
          grade: "Sahih (Authentic)",
        },
      ],
      keyTakeaways: [
        "Most anger is ego-driven, not justice-driven",
        "Arrogance (kibr) and anger (ghadab) are deeply connected",
        "Humility (tawadu') is the most powerful prevention against anger",
        "Even an atom's weight of arrogance blocks Paradise",
      ],
      exercise: "Next time you feel anger rising, immediately ask: 'Am I angry because of injustice, or because my ego was hurt?' If it's the ego, say 'SubhanAllah' and let it go. Journal what you discover tonight.",
    },
  },
  {
    id: 4,
    title: "Patience (Sabr) as a Practice",
    duration: "6 min",
    category: "Patience",
    emoji: "⏳",
    content: {
      intro: "Sabr (patience) is mentioned over 90 times in the Quran. It is not passive endurance — it is an active, conscious choice to respond with grace under pressure. Sabr is the muscle that prevents anger from controlling you.",
      sections: [
        {
          heading: "The Three Types of Sabr",
          body: "Scholars describe three types: (1) Sabr upon obedience — patience in worshipping Allah even when it's hard; (2) Sabr from sin — patience in restraining yourself from haram; (3) Sabr upon trials — patience when calamities and difficulties hit. Anger management falls under types 2 and 3.",
        },
        {
          heading: "Sabr is Not Passivity",
          body: "Being patient doesn't mean being a doormat. The Prophet ﷺ stood up against injustice while remaining in control. Sabr means responding rather than reacting. It means choosing your words carefully rather than exploding. It means trusting Allah's plan rather than demanding instant resolution.",
        },
        {
          heading: "Building Your Sabr Muscle",
          body: "Like any muscle, sabr grows with exercise. Start small — be patient in traffic, be patient when food is late, be patient with your children's noise. Each small victory trains your nafs for the bigger tests. Allah says He is WITH the patient — what greater motivation is there?",
        },
      ],
      ayahs: [
        {
          arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
          transliteration: "Yā ayyuhalladhīna āmanū ista'īnū biṣ-ṣabri waṣ-ṣalāh. Innallāha ma'aṣ-ṣābirīn",
          english: "O you who believe, seek help through patience and prayer. Indeed, Allah is with the patient.",
          ref: "Qur'an 2:153",
          link: "https://quran.com/2/153",
        },
        {
          arabic: "إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ",
          transliteration: "Innamā yuwaffā aṣ-ṣābirūna ajrahum bighayri ḥisāb",
          english: "Indeed, the patient will be given their reward without account (i.e., without limit).",
          ref: "Qur'an 39:10",
          link: "https://quran.com/39/10",
        },
      ],
      hadiths: [
        {
          text: "No one is given a gift better and more encompassing than patience.",
          narrator: "Narrated by Abu Sa'id al-Khudri (رضي الله عنه)",
          source: "Sahih al-Bukhari 1469",
          link: "https://sunnah.com/bukhari:1469",
          grade: "Sahih (Authentic)",
        },
        {
          text: "How wonderful is the affair of the believer, for his affairs are all good. If something good happens to him, he is thankful for it, and that is good for him. If something bad happens to him, he bears it with patience, and that is good for him.",
          narrator: "Narrated by Suhayb (رضي الله عنه)",
          source: "Sahih Muslim 2999",
          link: "https://sunnah.com/muslim:2999",
          grade: "Sahih (Authentic)",
        },
      ],
      keyTakeaways: [
        "Sabr has three types — and anger management requires all three",
        "Patience is active strength, not passive weakness",
        "The reward for sabr is 'without limit' — unlimited reward from Allah",
        "Start building patience with small daily tests",
      ],
      exercise: "Today, intentionally practice sabr in three small situations: waiting in line, dealing with a slow driver, or listening to someone you disagree with. After each, say 'Alhamdulillah' and notice how it feels.",
    },
  },
  {
    id: 5,
    title: "Forgiveness: The Ultimate Power",
    duration: "7 min",
    category: "Forgiveness",
    emoji: "💚",
    content: {
      intro: "Forgiveness ('afw) in Islam is not a suggestion — it is a defining quality of the believers. The ability to forgive someone who wronged you is the highest form of strength. It frees you from the prison of anger and resentment.",
      sections: [
        {
          heading: "Forgiveness is for YOU",
          body: "Holding onto anger is like drinking poison and expecting the other person to die. When you forgive, you are not saying what they did was okay. You are freeing yourself from the burden of resentment. The Prophet ﷺ forgave the people of Makkah who tortured and exiled him for 13 years — on the day of conquest, he said: 'Go, you are free.'",
        },
        {
          heading: "Allah's Forgiveness and Yours",
          body: "Allah connects His forgiveness of YOUR sins to your forgiveness of others. When Abu Bakr (رضي الله عنه) swore to cut off support to a relative who slandered Aisha (رضي الله عنها), Allah revealed: 'Do you not wish that Allah should forgive you?' Abu Bakr immediately restored his support. Your forgiveness unlocks Allah's forgiveness.",
        },
        {
          heading: "When Forgiveness Feels Impossible",
          body: "Some wounds are deep. Forgiving doesn't mean forgetting or allowing abuse to continue. It means releasing the desire for revenge and leaving justice to Allah. Start with dua — ask Allah to soften your heart. Forgiveness is a process, not a switch.",
        },
      ],
      ayahs: [
        {
          arabic: "وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ",
          transliteration: "Wal-kāẓimīnal-ghayẓa wal-'āfīna 'anin-nāsi wallāhu yuḥibbul-muḥsinīn",
          english: "Those who restrain their anger and pardon people — and Allah loves the doers of good.",
          ref: "Qur'an 3:134",
          link: "https://quran.com/3/134",
        },
        {
          arabic: "أَلَا تُحِبُّونَ أَن يَغْفِرَ اللَّهُ لَكُمْ",
          transliteration: "Alā tuḥibbūna an yaghfirallāhu lakum",
          english: "Do you not wish that Allah should forgive you?",
          ref: "Qur'an 24:22",
          link: "https://quran.com/24/22",
        },
      ],
      hadiths: [
        {
          text: "Charity does not decrease wealth. No one forgives except that Allah increases his honor. And no one humbles himself for the sake of Allah except that Allah raises his status.",
          narrator: "Narrated by Abu Hurayrah (رضي الله عنه)",
          source: "Sahih Muslim 2588",
          link: "https://sunnah.com/muslim:2588",
          grade: "Sahih (Authentic)",
        },
        {
          text: "Be merciful to others and you will receive mercy. Forgive others and Allah will forgive you.",
          narrator: "Narrated by Abdullah ibn Amr (رضي الله عنه)",
          source: "Musnad Ahmad 7001",
          link: "https://sunnah.com/ahmad:7001",
          grade: "Sahih (Authentic)",
        },
      ],
      keyTakeaways: [
        "Forgiveness frees you — it is an act of self-liberation",
        "Allah ties His forgiveness of you to your forgiveness of others",
        "Forgiveness does not mean accepting abuse or injustice",
        "The Prophet ﷺ forgave his worst enemies — this is true strength",
      ],
      exercise: "Think of one person you are holding a grudge against. Make dua for them tonight: 'O Allah, forgive them and guide them.' Notice how your heart feels after. This is the beginning of freedom.",
    },
  },
  {
    id: 6,
    title: "Marriage & Anger Management",
    duration: "10 min",
    category: "Relationships",
    emoji: "💑",
    content: {
      intro: "Marriage is where anger management is tested the most. The person closest to you will inevitably frustrate you. The Prophet ﷺ said: 'The best of you are the best to their families.' How you handle anger with your spouse defines the quality of your marriage and your deen.",
      sections: [
        {
          heading: "Why Marriage Triggers Anger",
          body: "Your spouse sees you at your worst — tired, stressed, vulnerable. There's no filter. Unmet expectations, miscommunication, and accumulated resentment create a powder keg. But Allah designed marriage as a source of sakīnah (tranquility), not turmoil. When anger dominates, we have strayed from the Quranic vision of marriage.",
        },
        {
          heading: "The Prophet's ﷺ Example at Home",
          body: "Aisha (رضي الله عنها) reported that the Prophet ﷺ never struck a woman, never raised his voice at his wives, and was always the first to smile. When he was upset, he would simply turn away silently until his anger passed. He helped with housework, mended his own clothes, and treated his wives with playfulness and respect.",
        },
        {
          heading: "Practical Rules for Marital Arguments",
          body: "1) Never argue in the bedroom — keep that space sacred. 2) Don't bring up past mistakes — deal with the present issue only. 3) Never threaten divorce in anger. 4) Take a 20-minute cool-down before discussing. 5) Always end disagreements with a gesture of love, even if the issue isn't fully resolved.",
        },
      ],
      ayahs: [
        {
          arabic: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً",
          transliteration: "Wa min āyātihi an khalaqa lakum min anfusikum azwājan litaskunū ilayhā wa ja'ala baynakum mawaddatan wa raḥmah",
          english: "And among His signs is that He created for you from yourselves mates that you may find tranquility in them, and He placed between you affection and mercy.",
          ref: "Qur'an 30:21",
          link: "https://quran.com/30/21",
        },
        {
          arabic: "وَعَاشِرُوهُنَّ بِالْمَعْرُوفِ",
          transliteration: "Wa 'āshirūhunna bil-ma'rūf",
          english: "And live with them in kindness.",
          ref: "Qur'an 4:19",
          link: "https://quran.com/4/19",
        },
      ],
      hadiths: [
        {
          text: "The best of you are those who are best to their families, and I am the best of you to my family.",
          narrator: "Narrated by Aisha (رضي الله عنها)",
          source: "Sunan at-Tirmidhi 3895",
          link: "https://sunnah.com/tirmidhi:3895",
          grade: "Sahih (Authentic)",
        },
        {
          text: "The most perfect of believers in faith are those with the best character. And the best of you are those who are best to their women.",
          narrator: "Narrated by Abu Hurayrah (رضي الله عنه)",
          source: "Sunan at-Tirmidhi 1162",
          link: "https://sunnah.com/tirmidhi:1162",
          grade: "Hasan Sahih",
        },
      ],
      keyTakeaways: [
        "How you treat your spouse reflects your deen",
        "The Prophet ﷺ never raised his voice at home",
        "Never threaten divorce in anger — words cannot be taken back",
        "Marriage should be sakīnah (tranquility), not a battleground",
      ],
      exercise: "Tonight, regardless of how your day went, initiate a kind gesture toward your spouse — a compliment, a cup of tea, or simply listening. Do this for 7 days consecutively.",
    },
  },
  {
    id: 7,
    title: "Controlling Anger While Fasting",
    duration: "6 min",
    category: "Ramadan",
    emoji: "🌙",
    content: {
      intro: "Fasting is specifically designed by Allah to train your self-control. The hunger and thirst strip away your comfort zone, exposing the raw nafs. This is the ultimate training ground for anger management — if you can control yourself while fasting, you can do it anytime.",
      sections: [
        {
          heading: "Fasting: A Shield Against Anger",
          body: "The Prophet ﷺ called fasting a 'shield' (junnah). A shield protects you. When someone provokes you while fasting, your response should be: 'I am fasting.' This is not just information — it is a spiritual barrier. Saying these words reminds you and the other person that you are in a sacred state.",
        },
        {
          heading: "Why We're More Irritable While Fasting",
          body: "Low blood sugar, caffeine withdrawal, dehydration — these are real physiological stressors. Your threshold for anger drops. This is BY DESIGN. Allah is testing you with a lowered guard. It's easy to be patient when you're comfortable. The real test is patience when every nerve is on edge.",
        },
        {
          heading: "Making Fasting Count",
          body: "Many people fast from food but feast on backbiting, arguing, and anger. The Prophet ﷺ warned that many fasters get nothing from their fast except hunger and thirst. Guard your tongue more than you guard your stomach. A true fast is a fast of the entire being — eyes, ears, tongue, and temper.",
        },
      ],
      ayahs: [
        {
          arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ",
          transliteration: "Yā ayyuhalladhīna āmanū kutiba 'alaykumuṣ-ṣiyāmu kamā kutiba 'alalladhīna min qablikum la'allakum tattaqūn",
          english: "O you who believe, fasting is prescribed for you as it was prescribed for those before you, that you may become God-conscious (achieve taqwa).",
          ref: "Qur'an 2:183",
          link: "https://quran.com/2/183",
        },
      ],
      hadiths: [
        {
          text: "Fasting is a shield (from sins and Hellfire). If one of you is fasting, he should not use obscene language or raise his voice. If someone insults him or quarrels with him, let him say: 'I am fasting.'",
          narrator: "Narrated by Abu Hurayrah (رضي الله عنه)",
          source: "Sahih al-Bukhari 1904",
          link: "https://sunnah.com/bukhari:1904",
          grade: "Sahih (Authentic)",
        },
        {
          text: "Many people who fast get nothing from their fast except hunger and thirst. And many who pray at night get nothing from it except sleeplessness.",
          narrator: "Narrated by Abu Hurayrah (رضي الله عنه)",
          source: "Sunan Ibn Majah 1690",
          link: "https://sunnah.com/ibnmajah:1690",
          grade: "Sahih (Authentic)",
        },
      ],
      keyTakeaways: [
        "Fasting is a shield — use the phrase 'I am fasting' as a defense",
        "Low blood sugar lowers your anger threshold — be aware of this",
        "Guard your tongue more than your stomach during fasting",
        "The goal of fasting is taqwa (God-consciousness), not just hunger",
      ],
      exercise: "The next time you fast (whether Ramadan or voluntary), keep a tally of every time you successfully restrain your anger. Aim for 3+ restraints per fasting day. Say 'Innī ṣā'im' (I am fasting) each time.",
    },
  },
  {
    id: 8,
    title: "Imam Ghazali on Purifying the Heart",
    duration: "12 min",
    category: "Advanced",
    emoji: "📜",
    content: {
      intro: "Imam Abu Hamid al-Ghazali (d. 1111 CE), one of Islam's greatest scholars, dedicated an entire chapter of his masterwork 'Ihya Ulum al-Din' (Revival of the Religious Sciences) to anger. His insights remain profoundly relevant 900 years later.",
      sections: [
        {
          heading: "Anger as a Fire of the Heart",
          body: "Ghazali describes anger as a fire kindled in the heart. Just as physical fire destroys everything in its path, the fire of anger destroys relationships, faith, and inner peace. He says its fuel is arrogance (kibr), self-admiration ('ujb), and love of the world (ḥubb ad-dunyā). Remove the fuel, and the fire cannot burn.",
        },
        {
          heading: "The Three States of Anger",
          body: "Ghazali identifies three levels: (1) Deficiency — having no anger at all, even at injustice, which is blameworthy; (2) Excess — rage that controls you, which is destructive; (3) Balance — anger that rises for righteous causes and is controlled by reason and faith. The goal is balance, not elimination.",
        },
        {
          heading: "The Six Remedies of Ghazali",
          body: "Ghazali prescribes six remedies for anger: (1) Reflect on the Quranic verses praising those who restrain anger; (2) Fear Allah's punishment — He is more powerful than anyone you're angry at; (3) Beware of the consequences — anger destroys this life and the next; (4) Examine your own faults before judging others; (5) Consider that your anger might be unjust; (6) Know that Shaytan celebrates when you rage.",
        },
        {
          heading: "The Station of the Heart",
          body: "Ghazali teaches that anger management is not a behavioral trick — it is a station of the heart (maqām). Your outer behavior reflects your inner state. If you only suppress anger without purifying the heart, it will resurface. True transformation requires spiritual work: dhikr, reflection (murāqabah), self-accounting (muḥāsabah), and seeking closeness to Allah.",
        },
      ],
      ayahs: [
        {
          arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
          transliteration: "Alā bi dhikrillāhi taṭma'innul-qulūb",
          english: "Verily, in the remembrance of Allah do hearts find rest.",
          ref: "Qur'an 13:28",
          link: "https://quran.com/13/28",
        },
        {
          arabic: "قَدْ أَفْلَحَ مَن زَكَّاهَا وَقَدْ خَابَ مَن دَسَّاهَا",
          transliteration: "Qad aflaḥa man zakkāhā. Wa qad khāba man dassāhā",
          english: "Successful indeed is the one who purifies their soul. And failed is the one who corrupts it.",
          ref: "Qur'an 91:9-10",
          link: "https://quran.com/91/9-10",
        },
      ],
      hadiths: [
        {
          text: "In the body there is a piece of flesh; if it is sound, the whole body is sound, and if it is corrupt, the whole body is corrupt. Verily it is the heart.",
          narrator: "Narrated by al-Nu'man ibn Bashir (رضي الله عنه)",
          source: "Sahih al-Bukhari 52",
          link: "https://sunnah.com/bukhari:52",
          grade: "Sahih (Authentic)",
        },
        {
          text: "A man said to the Prophet ﷺ: 'Advise me.' He said: 'Do not get angry.' The man repeated his request several times, and the Prophet ﷺ kept saying: 'Do not get angry.'",
          narrator: "Narrated by Abu Hurayrah (رضي الله عنه)",
          source: "Sahih al-Bukhari 6116",
          link: "https://sunnah.com/bukhari:6116",
          grade: "Sahih (Authentic)",
        },
      ],
      keyTakeaways: [
        "Anger is a fire — remove its fuel (ego, arrogance, love of dunya)",
        "The goal is balanced anger, not zero anger",
        "Ghazali's six remedies combine Quranic reflection, fear of Allah, self-examination, and awareness of Shaytan",
        "True change happens at the level of the heart, not just behavior",
      ],
      exercise: "Spend 10 minutes tonight in murāqabah (self-reflection). Sit quietly, make dhikr, and ask yourself: 'What is the fuel of my anger? Is it ego? Status? Control?' Write down what you discover. Repeat weekly.",
    },
  },
];

const LearnTab = () => {
  const [openLessonId, setOpenLessonId] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>(() => {
    const saved = localStorage.getItem("hc-completed-lessons");
    return saved ? JSON.parse(saved) : [1, 2];
  });
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("hc-completed-lessons", JSON.stringify(completedLessons));
  }, [completedLessons]);

  const openLesson = lessons.find((l) => l.id === openLessonId);
  const nextLessonIndex = completedLessons.length;
  const nextLesson = lessons[nextLessonIndex] || lessons[0];

  const markComplete = (id: number) => {
    if (!completedLessons.includes(id)) {
      setCompletedLessons((prev) => [...prev, id]);
    }
  };

  if (openLesson) {
    return (
      <LessonView
        lesson={openLesson}
        completed={completedLessons.includes(openLesson.id)}
        expandedSection={expandedSection}
        onToggleSection={(s) => setExpandedSection(expandedSection === s ? null : s)}
        onComplete={() => markComplete(openLesson.id)}
        onBack={() => { setOpenLessonId(null); setExpandedSection(null); }}
      />
    );
  }

  return (
    <div className="container mx-auto max-w-lg px-4 pt-6 pb-8">
      <h1 className="mb-2 font-heading text-xl font-bold text-foreground">Daily Training</h1>
      <p className="mb-6 text-sm text-muted-foreground">Prevention through education — Quran, Hadith & practical wisdom</p>

      {/* Today's lesson */}
      <div className="mb-6 rounded-2xl bg-gradient-calm border border-border p-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Today's Lesson</p>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{nextLesson.emoji}</span>
          <h2 className="font-heading text-lg font-bold text-foreground">{nextLesson.title}</h2>
        </div>
        <p className="mb-3 text-sm text-muted-foreground">{nextLesson.duration} · {nextLesson.category}</p>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(completedLessons.length / lessons.length) * 100}%` }} />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{completedLessons.length} / {lessons.length} lessons completed</p>
        <button
          onClick={() => setOpenLessonId(nextLesson.id)}
          className="mt-3 w-full rounded-xl bg-primary px-4 py-3 font-heading font-semibold text-primary-foreground transition-all hover:scale-105 active:scale-95"
        >
          {completedLessons.includes(nextLesson.id) ? "Review Lesson" : "Start Lesson"}
        </button>
      </div>

      {/* Learning Path */}
      <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">Learning Path</h2>
      <div className="flex flex-col gap-3">
        {lessons.map((lesson) => {
          const isCompleted = completedLessons.includes(lesson.id);
          const isNext = lesson.id === nextLesson.id;
          return (
            <button
              key={lesson.id}
              onClick={() => setOpenLessonId(lesson.id)}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                isCompleted
                  ? "border-success/30 bg-success/5"
                  : isNext
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card opacity-60"
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-full text-lg ${
                isCompleted ? "bg-success text-success-foreground" : isNext ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {isCompleted ? "✓" : lesson.emoji}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{lesson.title}</p>
                <p className="text-xs text-muted-foreground">{lesson.duration} · {lesson.category}</p>
              </div>
              <span className="text-xs text-muted-foreground">→</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ─── Lesson View ───────────────────────────── */
interface LessonViewProps {
  lesson: Lesson;
  completed: boolean;
  expandedSection: string | null;
  onToggleSection: (s: string) => void;
  onComplete: () => void;
  onBack: () => void;
}

const LessonView = ({ lesson, completed, expandedSection, onToggleSection, onComplete, onBack }: LessonViewProps) => {
  const { content } = lesson;

  return (
    <motion.div
      className="container mx-auto max-w-lg px-4 pt-6 pb-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <button onClick={onBack} className="mb-4 text-sm text-primary hover:underline">← Back to lessons</button>

      {/* Header */}
      <div className="mb-6 text-center">
        <span className="mb-2 block text-4xl">{lesson.emoji}</span>
        <h1 className="mb-1 font-heading text-2xl font-bold text-foreground">{lesson.title}</h1>
        <p className="text-sm text-muted-foreground">{lesson.duration} · {lesson.category}</p>
      </div>

      {/* Intro */}
      <p className="mb-6 text-sm leading-relaxed text-foreground">{content.intro}</p>

      {/* Sections (expandable) */}
      <div className="mb-6 flex flex-col gap-2">
        {content.sections.map((section) => (
          <div key={section.heading} className="rounded-xl border border-border bg-card overflow-hidden">
            <button
              onClick={() => onToggleSection(section.heading)}
              className="flex w-full items-center justify-between p-4 text-left"
            >
              <h3 className="text-sm font-semibold text-foreground">{section.heading}</h3>
              <span className="text-xs text-muted-foreground">{expandedSection === section.heading ? "▲" : "▼"}</span>
            </button>
            <AnimatePresence>
              {expandedSection === section.heading && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Quranic References */}
      <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">📖 Quranic Insight</h3>
      <div className="mb-6 flex flex-col gap-3">
        {content.ayahs.map((ayah, i) => (
          <div key={i} className="rounded-2xl bg-gradient-calm border border-border p-4">
            <p className="mb-2 font-arabic text-lg leading-loose text-foreground" dir="rtl">{ayah.arabic}</p>
            <p className="mb-1 text-xs font-medium text-primary italic">{ayah.transliteration}</p>
            <p className="mb-2 text-sm text-muted-foreground italic">"{ayah.english}"</p>
            <a href={ayah.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">{ayah.ref} →</a>
          </div>
        ))}
      </div>

      {/* Hadith References */}
      <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">📚 Hadith Evidence</h3>
      <div className="mb-6 flex flex-col gap-3">
        {content.hadiths.map((hadith, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-4">
            {hadith.arabic && (
              <p className="mb-2 font-arabic text-base leading-relaxed text-foreground" dir="rtl">{hadith.arabic}</p>
            )}
            <p className="mb-2 text-sm text-foreground italic">"{hadith.text}"</p>
            {hadith.narrator && (
              <p className="mb-1 text-xs text-muted-foreground">{hadith.narrator}</p>
            )}
            <div className="flex items-center gap-2">
              <a href={hadith.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">{hadith.source} →</a>
              {hadith.grade && (
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  hadith.grade.includes("Sahih") ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                }`}>
                  {hadith.grade}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Key Takeaways */}
      <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">🔑 Key Takeaways</h3>
      <div className="mb-6 flex flex-col gap-2">
        {content.keyTakeaways.map((t, i) => (
          <div key={i} className="flex gap-3 rounded-xl border border-border bg-card p-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i + 1}</span>
            <p className="text-sm text-foreground">{t}</p>
          </div>
        ))}
      </div>

      {/* Exercise */}
      {content.exercise && (
        <>
          <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">🏋️ Today's Exercise</h3>
          <div className="mb-6 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-4">
            <p className="text-sm leading-relaxed text-foreground">{content.exercise}</p>
          </div>
        </>
      )}

      {/* Complete button */}
      <button
        onClick={() => {
          onComplete();
          onBack();
        }}
        className={`w-full rounded-xl py-3 font-heading font-semibold transition-all hover:scale-105 active:scale-95 ${
          completed
            ? "bg-success text-success-foreground"
            : "bg-primary text-primary-foreground"
        }`}
      >
        {completed ? "✓ Completed — Review Again" : "Mark as Complete ✨"}
      </button>
    </motion.div>
  );
};

export default LearnTab;
