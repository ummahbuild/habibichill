import { useState, useEffect, useCallback } from "react";
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

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface LessonContent {
  intro: string;
  sections: LessonSection[];
  ayahs: LessonAyah[];
  hadiths: LessonHadith[];
  keyTakeaways: string[];
  exercise?: string;
  quiz?: QuizQuestion[];
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
      quiz: [
        { question: "What did the Prophet ﷺ say about the truly strong person?", options: ["The one who can fight well", "The one who controls himself when angry", "The one who never feels anger", "The one who wins arguments"], correctIndex: 1, explanation: "The Prophet ﷺ said: 'The strong person is not the one who can overpower others. The strong person is the one who controls himself when he is angry.' (Bukhari 6114)" },
        { question: "What are the two types of anger in Islam?", options: ["Hot and cold anger", "Righteous anger and ego-driven anger", "Physical and emotional anger", "Internal and external anger"], correctIndex: 1, explanation: "Islam distinguishes between righteous anger (for Allah's sake) and selfish anger (for the ego). Most daily anger is ego-driven." },
      ],
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
      quiz: [
        { question: "What is the FIRST step in the Sunnah anger protocol?", options: ["Make wudu", "Stay silent", "Seek refuge from Shaytan", "Lie down"], correctIndex: 2, explanation: "The first step is to say A'udhu billahi min ash-Shaytan ir-Rajeem — seeking refuge from Shaytan who fuels anger." },
        { question: "Why does the Prophet ﷺ prescribe changing position?", options: ["To show respect", "To reduce blood pressure and signal the nervous system to calm", "To stretch muscles", "To look away from the person"], correctIndex: 1, explanation: "Lowering your body reduces blood pressure and signals to your nervous system to calm down, removing you from a confrontational stance." },
      ],
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
      quiz: [
        { question: "How much arrogance blocks entry to Paradise?", options: ["A mountain's weight", "A handful", "An atom's weight", "None — arrogance is forgiven"], correctIndex: 2, explanation: "The Prophet ﷺ said: 'No one who has an atom's weight of arrogance in his heart will enter Paradise.' (Muslim 91)" },
        { question: "What is the antidote to ego-driven anger?", options: ["More anger", "Tawadu (humility)", "Ignoring it", "Physical exercise"], correctIndex: 1, explanation: "Humility (tawadu') is thinking of yourself less. A humble heart is rarely an angry heart." },
      ],
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
      quiz: [
        { question: "How many times is Sabr mentioned in the Quran?", options: ["About 20", "About 50", "Over 90", "About 10"], correctIndex: 2, explanation: "Sabr (patience) is mentioned over 90 times in the Quran — showing its central importance to Islam." },
        { question: "What is the reward for those who practice Sabr?", options: ["Double their deeds", "Reward without limit", "Forgiveness only", "Extra years of life"], correctIndex: 1, explanation: "'Indeed, the patient will be given their reward without account (without limit).' (Qur'an 39:10)" },
      ],
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
      quiz: [
        { question: "What did the Prophet ﷺ say to the people of Makkah on the day of conquest?", options: ["'You will be punished'", "'Go, you are free'", "'Convert or face consequences'", "'Pay a fine'"], correctIndex: 1, explanation: "Despite 13 years of persecution, torture, and exile, the Prophet ﷺ said 'Go, you are free' — the greatest act of forgiveness in history." },
        { question: "What does Allah connect His forgiveness to?", options: ["Amount of prayer", "Your forgiveness of others", "Financial charity", "Pilgrimage"], correctIndex: 1, explanation: "Allah revealed 'Do you not wish that Allah should forgive you?' (24:22) — directly linking His forgiveness to our forgiveness of others." },
      ],
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
      quiz: [
        { question: "What is the Quranic purpose of marriage?", options: ["Financial security", "Social status", "Sakīnah (tranquility)", "Having children only"], correctIndex: 2, explanation: "Allah says He placed 'mawaddah wa rahmah' (affection and mercy) between spouses for sakīnah (tranquility). (Qur'an 30:21)" },
        { question: "How did the Prophet ﷺ handle anger at home?", options: ["He would raise his voice", "He would leave for days", "He would turn away silently until it passed", "He would punish"], correctIndex: 2, explanation: "Aisha (RA) reported he never struck anyone, never raised his voice at his wives, and would simply turn away silently when upset." },
      ],
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
      quiz: [
        { question: "What does the Prophet ﷺ call fasting?", options: ["A burden", "A shield (junnah)", "A punishment", "A reward"], correctIndex: 1, explanation: "The Prophet ﷺ called fasting a 'shield' (junnah) — it protects you from sins and hellfire. (Bukhari 1904)" },
        { question: "What should you say when provoked while fasting?", options: ["'Leave me alone'", "'I am fasting'", "'I will deal with you later'", "'Be quiet'"], correctIndex: 1, explanation: "The Prophet ﷺ said: 'If someone insults him or quarrels with him, let him say: I am fasting.' This serves as a spiritual barrier." },
      ],
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
      quiz: [
        { question: "According to Ghazali, what are the three states of anger?", options: ["Hot, warm, cold", "Deficiency, excess, balance", "Physical, emotional, spiritual", "Internal, external, hidden"], correctIndex: 1, explanation: "Ghazali identifies deficiency (no anger even at injustice), excess (uncontrolled rage), and balance (righteous anger controlled by faith)." },
        { question: "What does Ghazali say is the 'fuel' of anger?", options: ["Other people's actions", "Arrogance, self-admiration, and love of dunya", "Physical pain", "Lack of sleep"], correctIndex: 1, explanation: "Ghazali says anger's fuel is kibr (arrogance), 'ujb (self-admiration), and ḥubb ad-dunyā (love of worldly things). Remove the fuel, the fire cannot burn." },
      ],
    },
  },
  {
    id: 9,
    title: "The Tongue: Your Greatest Weapon",
    duration: "7 min",
    category: "Prevention",
    emoji: "🗣️",
    content: {
      intro: "The Prophet ﷺ said: 'Whoever guarantees me what is between his jaws and what is between his legs, I guarantee him Paradise.' (Bukhari 6474). When anger strikes, the tongue becomes the most dangerous weapon — words spoken in rage destroy marriages, friendships, and family bonds in seconds.",
      sections: [
        {
          heading: "Why Angry Words Are So Destructive",
          body: "Unlike physical wounds that heal, verbal wounds scar the heart permanently. A spouse remembers 'I wish I never married you' for decades. A child internalizes 'You're useless' as truth. The Prophet ﷺ warned that a person may utter a word displeasing to Allah without thinking, and it causes them to slip into the Hellfire (Bukhari 6478).",
        },
        {
          heading: "The Sunnah of Silence",
          body: "The Prophet ﷺ said: 'If any of you becomes angry, let him be silent.' (Ahmad 329). This isn't passive — it's the most powerful anger management technique. Neuroscience confirms: speaking during the first 6-20 seconds of anger bypasses your rational brain entirely. Silence buys time for wisdom.",
        },
        {
          heading: "Replacing Angry Speech with Dhikr",
          body: "Instead of lashing out, redirect the tongue to remembrance of Allah. Say A'udhu billahi min ash-Shaytan ir-Rajeem, then SubhanAllah 10 times. By the time you finish, the urge to speak harshly will have passed. You've turned a potential sin into worship.",
        },
      ],
      ayahs: [
        {
          arabic: "وَقُل لِّعِبَادِي يَقُولُوا الَّتِي هِيَ أَحْسَنُ إِنَّ الشَّيْطَانَ يَنزَغُ بَيْنَهُمْ",
          transliteration: "Wa qul li'ibādī yaqūlul-latī hiya aḥsan. Innash-shayṭāna yanzaghu baynahum",
          english: "And tell My servants to say that which is best. Indeed, Satan induces dissension among them.",
          ref: "Qur'an 17:53",
          link: "https://quran.com/17/53",
        },
        {
          arabic: "وَاخْفِضْ صَوْتَكَ إِنَّ أَنكَرَ الْأَصْوَاتِ لَصَوْتُ الْحَمِيرِ",
          transliteration: "Wakhfiḍ ṣawtaka inna ankaral-aṣwāti laṣawtul-ḥamīr",
          english: "And lower your voice. Indeed, the most disagreeable of sounds is the voice of donkeys.",
          ref: "Qur'an 31:19",
          link: "https://quran.com/31/19",
        },
      ],
      hadiths: [
        {
          arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
          text: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.",
          narrator: "Narrated by Abu Hurayrah (رضي الله عنه)",
          source: "Sahih al-Bukhari 6018",
          link: "https://sunnah.com/bukhari:6018",
          grade: "Sahih (Authentic)",
        },
        {
          text: "Whoever guarantees me what is between his jaws (tongue) and what is between his legs, I guarantee him Paradise.",
          narrator: "Narrated by Sahl ibn Sa'd (رضي الله عنه)",
          source: "Sahih al-Bukhari 6474",
          link: "https://sunnah.com/bukhari:6474",
          grade: "Sahih (Authentic)",
        },
      ],
      keyTakeaways: [
        "Words spoken in anger cause permanent damage to relationships",
        "Silence during anger is strength, not weakness",
        "Replace angry speech with dhikr — turn sin into worship",
        "The tongue is the key to Paradise or Hellfire",
      ],
      exercise: "For 24 hours, before speaking to anyone, pause for 2 seconds and ask: 'Is what I'm about to say good?' If not, stay silent. Track how many times you chose silence over harmful speech.",
      quiz: [
        { question: "What does the Prophet ﷺ guarantee for those who guard their tongue?", options: ["Wealth", "Paradise", "Fame", "Long life"], correctIndex: 1, explanation: "'Whoever guarantees me what is between his jaws and what is between his legs, I guarantee him Paradise.' (Bukhari 6474)" },
        { question: "How long does the initial anger 'bypass' of rational thinking last?", options: ["1-2 seconds", "6-20 seconds", "1-5 minutes", "30 minutes"], correctIndex: 1, explanation: "Neuroscience confirms speaking during the first 6-20 seconds of anger bypasses your rational brain entirely. Silence buys time for wisdom." },
      ],
    },
  },
  {
    id: 10,
    title: "Gratitude: The Anger Antidote",
    duration: "6 min",
    category: "Prevention",
    emoji: "🌟",
    content: {
      intro: "Gratitude (shukr) and anger cannot coexist in the same heart. When you're truly grateful, anger has no foothold. Allah promises: 'If you are grateful, I will surely increase you.' (Qur'an 14:7). This lesson explores how deliberate gratitude practice can dissolve anger at its root.",
      sections: [
        {
          heading: "The Neuroscience of Gratitude",
          body: "Research from UC Davis shows that people who practice daily gratitude have 23% lower cortisol (the stress hormone that fuels anger). Gratitude activates the same brain regions as receiving a reward — it literally replaces anger's neural pathways with peace.",
        },
        {
          heading: "The Prophetic Gratitude Practice",
          body: "The Prophet ﷺ prayed at night until his feet were swollen. When Aisha (RA) asked why, given that his past and future sins were forgiven, he replied: 'Should I not be a grateful servant?' (Bukhari 4837). His entire life was an expression of gratitude — and he was the most patient, least angry person who ever lived.",
        },
        {
          heading: "Gratitude Reframes Everything",
          body: "Angry about your job? Be grateful you have one. Frustrated with your spouse? Be grateful for companionship. Mad about traffic? Be grateful for a vehicle. This isn't toxic positivity — it's the Quranic command: 'And if you should count the favors of Allah, you could not enumerate them.' (Qur'an 16:18). Perspective kills anger.",
        },
      ],
      ayahs: [
        {
          arabic: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ وَلَئِن كَفَرْتُمْ إِنَّ عَذَابِي لَشَدِيدٌ",
          transliteration: "La'in shakartum la'azīdannakum wa la'in kafartum inna 'adhābī lashadīd",
          english: "If you are grateful, I will surely increase you [in favor]; but if you deny, indeed, My punishment is severe.",
          ref: "Qur'an 14:7",
          link: "https://quran.com/14/7",
        },
      ],
      hadiths: [
        {
          text: "Look at those who are below you (in wealth/status) and do not look at those who are above you. This is more likely to prevent you from belittling the blessings of Allah.",
          narrator: "Narrated by Abu Hurayrah (رضي الله عنه)",
          source: "Sahih Muslim 2963",
          link: "https://sunnah.com/muslim:2963",
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
        "Gratitude and anger cannot coexist — practice one to eliminate the other",
        "Daily gratitude lowers cortisol by 23%, reducing anger threshold",
        "Look at those below you in blessings, not above — this prevents resentment",
        "Allah promises to increase blessings for the grateful",
      ],
      exercise: "Tonight before bed, write down 5 specific blessings from today. Do this every night for 7 days. On day 7, compare your anger levels to day 1.",
    },
  },
  {
    id: 11,
    title: "Tawakkul: Trusting Allah's Plan",
    duration: "8 min",
    category: "Advanced",
    emoji: "🕊️",
    content: {
      intro: "Most anger comes from wanting to control what you cannot control. Tawakkul — true reliance on Allah — dissolves this root cause by shifting your focus from controlling outcomes to trusting the Controller of all outcomes. This is advanced-level anger management.",
      sections: [
        {
          heading: "The Root Cause of Most Anger",
          body: "Someone cut you off in traffic — you couldn't control their driving. Your boss was unfair — you couldn't control their decision. Your child disobeyed — you couldn't control their choices. Anger is almost always a response to unmet expectations about things beyond your control. Tawakkul eliminates these expectations.",
        },
        {
          heading: "What Tawakkul Really Means",
          body: "Tawakkul is NOT passivity. The Prophet ﷺ said: 'If you put your trust in Allah as you should, He would provide for you as He provides for the birds: they go out in the morning empty and return full.' (Tirmidhi 2344). The birds GO OUT — they take action. But they don't WORRY about the outcome. Maximum effort + zero anxiety = Tawakkul.",
        },
        {
          heading: "How Tawakkul Prevents Anger",
          body: "When you truly believe Allah controls all outcomes: others' actions stop triggering you (it's Allah's decree). Fear-based anger dissolves (Allah is sufficient). You accept difficult situations without rage (you trust His wisdom). People lose power to make you angry (your success is in Allah's hands, not theirs).",
        },
      ],
      ayahs: [
        {
          arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
          transliteration: "Wa man yatawakkal 'alallāhi fahuwa ḥasbuh",
          english: "And whoever relies upon Allah — then He is sufficient for him.",
          ref: "Qur'an 65:3",
          link: "https://quran.com/65/3",
        },
        {
          arabic: "عَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ",
          transliteration: "'Asā an takrahū shay'an wa huwa khayrun lakum",
          english: "Perhaps you hate a thing and it is good for you; and perhaps you love a thing and it is bad for you. And Allah knows, while you know not.",
          ref: "Qur'an 2:216",
          link: "https://quran.com/2/216",
        },
      ],
      hadiths: [
        {
          text: "If you put your trust in Allah as you should, He would provide for you as He provides for the birds: they go out in the morning hungry and return full.",
          narrator: "Narrated by Umar ibn al-Khattab (رضي الله عنه)",
          source: "Sunan at-Tirmidhi 2344",
          link: "https://sunnah.com/tirmidhi:2344",
          grade: "Sahih (Authentic)",
        },
        {
          arabic: "قَدَرُ اللَّهِ وَمَا شَاءَ فَعَلَ",
          text: "It is the decree of Allah and He does what He wills.",
          narrator: "Narrated by Abu Hurayrah (رضي الله عنه)",
          source: "Sahih Muslim 2664",
          link: "https://sunnah.com/muslim:2664",
          grade: "Sahih (Authentic)",
        },
      ],
      keyTakeaways: [
        "Most anger stems from wanting to control what you cannot — Tawakkul eliminates this",
        "Tawakkul is maximum effort + zero anxiety about results",
        "When you trust Allah's plan, people lose power to make you angry",
        "Every uncontrollable situation is an invitation to deepen Tawakkul",
      ],
      exercise: "Identify one situation that's been making you angry that you cannot control. Write it down. Then write: 'I trust that Allah has a plan for this that I cannot see.' Say 'Hasbiyallahu wa ni'mal wakeel' 7 times and feel the anger release.",
    },
  },
  {
    id: 12,
    title: "Daily Habits That Prevent Anger",
    duration: "6 min",
    category: "Prevention",
    emoji: "🌅",
    content: {
      intro: "The best anger management happens BEFORE anger arrives. By building a daily routine rooted in Sunnah practices, you create such strong emotional resilience that anger struggles to take hold. Prevention is always better than cure.",
      sections: [
        {
          heading: "The Morning Shield",
          body: "Wake before Fajr for even 2 rak'ahs. Recite morning adhkar — especially 'Allahumma inni a'udhu bika minal hammi wal hazan' (O Allah, I seek refuge from worry and grief). Read Qur'an for 5 minutes — Surah Ash-Sharh (94) addresses emotional distress directly. These practices build a spiritual shield that lasts all day.",
        },
        {
          heading: "Physical and Nutritional Foundations",
          body: "Exercise burns cortisol (stress hormone). Even a brisk walk to the masjid counts. Eat dates for blood sugar stability — low blood sugar is the #1 hidden trigger for irritability. Sleep well — the Prophet ﷺ slept after Isha. Sleep deprivation reduces anger threshold by up to 60%.",
        },
        {
          heading: "The Evening Reset",
          body: "Before bed, do muhasabah (self-accounting): 'Did I lose my temper today? What triggered it? How can I do better tomorrow?' Recite evening adhkar and Surah Al-Mulk. Forgive anyone who wronged you today — go to sleep with a clean heart. The Prophet ﷺ said: 'Do not go to sleep angry with your brother.'",
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
      ],
      hadiths: [
        {
          text: "Take advantage of five before five: your youth before your old age, your health before your illness, your wealth before your poverty, your free time before your busyness, and your life before your death.",
          narrator: "Narrated by Ibn Abbas (رضي الله عنه)",
          source: "Mustadrak al-Hakim 7846",
          link: "https://sunnah.com/urn/2053310",
          grade: "Sahih (Authentic)",
        },
        {
          text: "The most beloved deeds to Allah are the most consistent ones, even if small.",
          narrator: "Narrated by Aisha (رضي الله عنها)",
          source: "Sahih al-Bukhari 6464",
          link: "https://sunnah.com/bukhari:6464",
          grade: "Sahih (Authentic)",
        },
      ],
      keyTakeaways: [
        "Prevention through daily habits is more powerful than reaction during anger",
        "Morning adhkar, exercise, and Qur'an create a daily spiritual shield",
        "Low blood sugar, poor sleep, and skipped prayers lower your anger threshold",
        "Evening self-accounting (muhasabah) builds continuous improvement",
      ],
      exercise: "For the next 3 days, try this routine: (1) Morning adhkar after Fajr, (2) 10-minute walk, (3) 3 dates for breakfast, (4) Evening muhasabah before sleep. Note your anger levels each day.",
    },
  },
];

const categories = ["All", ...Array.from(new Set(lessons.map((l) => l.category)))];

const dailyVerses = [
  { arabic: "وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ", english: "Those who restrain their anger and pardon people.", ref: "3:134" },
  { arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", english: "Indeed, Allah is with the patient.", ref: "2:153" },
  { arabic: "ادْفَعْ بِالَّتِي هِيَ أَحْسَنُ", english: "Repel evil by that which is better.", ref: "41:34" },
  { arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", english: "In the remembrance of Allah do hearts find rest.", ref: "13:28" },
  { arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", english: "Indeed, with hardship comes ease.", ref: "94:5" },
  { arabic: "وَلَمَن صَبَرَ وَغَفَرَ إِنَّ ذَٰلِكَ لَمِنْ عَزْمِ الْأُمُورِ", english: "Whoever is patient and forgives — that is of the matters requiring determination.", ref: "42:43" },
  { arabic: "خُذِ الْعَفْوَ وَأْمُرْ بِالْعُرْفِ وَأَعْرِضْ عَنِ الْجَاهِلِينَ", english: "Take what is given freely, enjoin what is good, and turn away from the ignorant.", ref: "7:199" },
];

const getDailyVerse = () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return dailyVerses[dayOfYear % dailyVerses.length];
};

const LearnTab = () => {
  const [openLessonId, setOpenLessonId] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>(() => {
    const saved = localStorage.getItem("hc-completed-lessons");
    return saved ? JSON.parse(saved) : [1, 2];
  });
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem("hc-learn-streak");
    if (!saved) return { count: 0, lastDate: "" };
    return JSON.parse(saved);
  });

  useEffect(() => {
    localStorage.setItem("hc-completed-lessons", JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem("hc-learn-streak", JSON.stringify(streak));
  }, [streak]);

  const updateStreak = () => {
    const today = new Date().toDateString();
    if (streak.lastDate === today) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const newCount = streak.lastDate === yesterday ? streak.count + 1 : 1;
    setStreak({ count: newCount, lastDate: today });
  };

  const openLesson = lessons.find((l) => l.id === openLessonId);
  const nextLessonIndex = completedLessons.length;
  const nextLesson = lessons[nextLessonIndex] || lessons[0];
  const filteredLessons = activeCategory === "All" ? lessons : lessons.filter((l) => l.category === activeCategory);
  const progress = Math.round((completedLessons.length / lessons.length) * 100);
  const dailyVerse = getDailyVerse();

  const markComplete = (id: number) => {
    if (!completedLessons.includes(id)) {
      setCompletedLessons((prev) => [...prev, id]);
      updateStreak();
    }
  };

  if (openLesson) {
    const currentIndex = lessons.findIndex(l => l.id === openLesson.id);
    const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
    const nextNav = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
    return (
      <LessonView
        lesson={openLesson}
        completed={completedLessons.includes(openLesson.id)}
        expandedSection={expandedSection}
        onToggleSection={(s) => setExpandedSection(expandedSection === s ? null : s)}
        onComplete={() => markComplete(openLesson.id)}
        onBack={() => { setOpenLessonId(null); setExpandedSection(null); }}
        totalLessons={lessons.length}
        completedCount={completedLessons.length}
        onNavigate={(id) => { setOpenLessonId(id); setExpandedSection(null); }}
        prevLesson={prevLesson}
        nextLesson={nextNav}
      />
    );
  }

  return (
    <div className="container mx-auto max-w-lg px-4 pt-6 pb-8">
      {/* Header with progress & streak */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h1 className="mb-1 font-heading text-xl font-bold text-foreground">Daily Training</h1>
          <p className="text-sm text-muted-foreground">
            {lessons.length} lessons · Quran, Hadith & practical wisdom
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Streak */}
          {streak.count > 0 && (
            <div className="flex flex-col items-center">
              <span className="text-lg">🔥</span>
              <span className="text-[10px] font-bold text-foreground">{streak.count}d</span>
            </div>
          )}
          {/* Progress ring */}
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
            <svg className="h-14 w-14 -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="24" fill="none" strokeWidth="4" className="stroke-muted" />
              <circle cx="28" cy="28" r="24" fill="none" strokeWidth="4" className="stroke-primary"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 24}`}
                strokeDashoffset={`${2 * Math.PI * 24 * (1 - progress / 100)}`}
                style={{ transition: "stroke-dashoffset 0.5s ease" }}
              />
            </svg>
            <span className="absolute text-xs font-bold text-foreground">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Daily Verse Card */}
      <motion.div
        className="mb-5 rounded-2xl bg-gradient-calm border border-primary/10 p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-2 flex items-center gap-2">
          <span className="text-sm">📖</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">Today's Verse</span>
        </div>
        <p className="mb-2 font-arabic text-lg leading-loose text-foreground text-center" dir="rtl">{dailyVerse.arabic}</p>
        <p className="mb-1 text-sm text-muted-foreground italic text-center">"{dailyVerse.english}"</p>
        <p className="text-[10px] text-primary text-center">— Qur'an {dailyVerse.ref}</p>
      </motion.div>

      {/* Continue Learning Card */}
      <motion.div
        className="mb-5 overflow-hidden rounded-2xl border border-primary/20 bg-card"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="p-5">
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
              {completedLessons.includes(nextLesson.id) ? "Review" : "Up Next"}
            </span>
            <span className="text-[10px] text-muted-foreground">{nextLesson.duration}</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{nextLesson.emoji}</span>
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground leading-tight">{nextLesson.title}</h2>
              <p className="text-xs text-muted-foreground">{nextLesson.category}</p>
            </div>
          </div>
          <p className="mb-4 text-xs text-muted-foreground line-clamp-2">{nextLesson.content.intro}</p>
          <button
            onClick={() => setOpenLessonId(nextLesson.id)}
            className="w-full rounded-xl bg-primary px-4 py-3 font-heading text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.02] active:scale-95"
          >
            {completedLessons.includes(nextLesson.id) ? "Review Lesson →" : "Start Lesson →"}
          </button>
        </div>
        {/* Mini progress bar */}
        <div className="h-1 bg-muted">
          <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </motion.div>

      {/* Category Filters */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground shadow-calm"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Learning Path */}
      <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {activeCategory === "All" ? "All Lessons" : activeCategory}
        <span className="ml-1.5 text-xs font-normal">({filteredLessons.length})</span>
      </h2>
      <div className="flex flex-col gap-2.5">
        {filteredLessons.map((lesson, idx) => {
          const isCompleted = completedLessons.includes(lesson.id);
          const isNext = lesson.id === nextLesson.id;
          return (
            <motion.button
              key={lesson.id}
              onClick={() => setOpenLessonId(lesson.id)}
              className={`group flex items-center gap-3.5 rounded-xl border p-4 text-left transition-all ${
                isCompleted
                  ? "border-success/20 bg-success/5 hover:border-success/40"
                  : isNext
                    ? "border-primary/30 bg-primary/5 hover:border-primary/50"
                    : "border-border bg-card hover:border-muted-foreground/30"
              }`}
              whileTap={{ scale: 0.98 }}
            >
              {/* Number/icon circle */}
              <div className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-bold transition-all ${
                isCompleted
                  ? "bg-success text-success-foreground"
                  : isNext
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
              }`}>
                {isCompleted ? (
                  <span className="text-sm">✓</span>
                ) : (
                  <span>{lesson.emoji}</span>
                )}
                {isNext && !isCompleted && (
                  <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-background bg-secondary animate-pulse" />
                )}
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground leading-tight">{lesson.title}</p>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">{lesson.duration}</span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                  <span className={`text-[10px] font-medium ${isCompleted ? "text-success" : "text-muted-foreground"}`}>
                    {isCompleted ? "Completed" : lesson.category}
                  </span>
                </div>
              </div>
              {/* Arrow */}
              <span className="text-sm text-muted-foreground transition-transform group-hover:translate-x-0.5">→</span>
            </motion.button>
          );
        })}
      </div>

      {/* Completion message */}
      {completedLessons.length === lessons.length && (
        <motion.div
          className="mt-6 rounded-2xl border border-success/30 bg-success/5 p-5 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="mb-2 block text-3xl">🏆</span>
          <h3 className="font-heading text-base font-bold text-foreground">All Lessons Complete!</h3>
          <p className="mt-1 text-xs text-muted-foreground">MāshāAllah! Review any lesson to deepen your understanding.</p>
        </motion.div>
      )}
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
  totalLessons: number;
  completedCount: number;
  onNavigate: (id: number) => void;
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
}

const LessonView = ({ lesson, completed, expandedSection, onToggleSection, onComplete, onBack, totalLessons, completedCount, onNavigate, prevLesson, nextLesson }: LessonViewProps) => {
  const { content } = lesson;
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem("hc-bookmarks");
    return saved ? JSON.parse(saved) : [];
  });
  const [notes, setNotes] = useState<Record<number, string>>(() => {
    const saved = localStorage.getItem("hc-lesson-notes");
    return saved ? JSON.parse(saved) : {};
  });
  const [showNotes, setShowNotes] = useState(false);
  const [quizState, setQuizState] = useState<{ started: boolean; currentQ: number; answers: (number | null)[]; showResult: boolean }>({
    started: false, currentQ: 0, answers: [], showResult: false,
  });

  useEffect(() => {
    localStorage.setItem("hc-bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem("hc-lesson-notes", JSON.stringify(notes));
  }, [notes]);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  }, []);

  const quiz = content.quiz;
  const hasQuiz = quiz && quiz.length > 0;

  const startQuiz = () => {
    setQuizState({ started: true, currentQ: 0, answers: new Array(quiz!.length).fill(null), showResult: false });
  };

  const answerQuiz = (optionIndex: number) => {
    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentQ] = optionIndex;
    const isLast = quizState.currentQ >= quiz!.length - 1;
    setQuizState(prev => ({ ...prev, answers: newAnswers, showResult: true }));
  };

  const nextQuestion = () => {
    const isLast = quizState.currentQ >= quiz!.length - 1;
    if (isLast) {
      setQuizState(prev => ({ ...prev, started: false }));
    } else {
      setQuizState(prev => ({ ...prev, currentQ: prev.currentQ + 1, showResult: false }));
    }
  };

  const quizScore = quizState.answers.filter((a, i) => a === quiz?.[i]?.correctIndex).length;

  return (
    <motion.div
      className="container mx-auto max-w-lg px-4 pt-6 pb-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="mb-4 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-primary hover:underline">
          <span>←</span> Back to lessons
        </button>
        <span className="text-[10px] text-muted-foreground font-medium">
          {completedCount}/{totalLessons} completed
        </span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">{lesson.category}</span>
          <span className="text-xs text-muted-foreground">{lesson.duration}</span>
          {completed && <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">✓ Done</span>}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{lesson.emoji}</span>
          <h1 className="font-heading text-2xl font-bold text-foreground leading-tight">{lesson.title}</h1>
        </div>
      </div>

      {/* Intro */}
      <div className="mb-6 rounded-2xl border border-border bg-card p-4">
        <p className="text-sm leading-relaxed text-foreground">{content.intro}</p>
      </div>

      {/* Sections (expandable) */}
      <div className="mb-6 flex flex-col gap-2">
        {content.sections.map((section, idx) => (
          <div key={section.heading} className={`rounded-xl border overflow-hidden transition-colors ${
            expandedSection === section.heading ? "border-primary/30 bg-primary/5" : "border-border bg-card"
          }`}>
            <button
              onClick={() => onToggleSection(section.heading)}
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">{idx + 1}</span>
              <h3 className="flex-1 text-sm font-semibold text-foreground">{section.heading}</h3>
              <motion.span
                className="text-xs text-muted-foreground"
                animate={{ rotate: expandedSection === section.heading ? 180 : 0 }}
              >
                ▼
              </motion.span>
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
      <h3 className="mb-3 flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs">📖</span>
        Quranic Insight
      </h3>
      <div className="mb-6 flex flex-col gap-3">
        {content.ayahs.map((ayah, i) => {
          const bmId = `ayah-${ayah.ref}`;
          const isBookmarked = bookmarks.includes(bmId);
          return (
            <div key={i} className="rounded-2xl bg-gradient-calm border border-primary/10 p-4 relative">
              <button
                onClick={() => toggleBookmark(bmId)}
                className={`absolute top-3 right-3 text-sm transition-colors ${isBookmarked ? "text-primary" : "text-muted-foreground/40 hover:text-primary/60"}`}
                title={isBookmarked ? "Remove bookmark" : "Bookmark this ayah"}
              >
                {isBookmarked ? "★" : "☆"}
              </button>
              <p className="mb-2 font-arabic text-lg leading-loose text-foreground pr-6" dir="rtl">{ayah.arabic}</p>
              <p className="mb-1 text-xs font-medium text-primary italic">{ayah.transliteration}</p>
              <p className="mb-2 text-sm text-muted-foreground italic">"{ayah.english}"</p>
              <a href={ayah.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline hover:text-primary/80">{ayah.ref} →</a>
            </div>
          );
        })}
      </div>

      {/* Hadith References */}
      <h3 className="mb-3 flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/10 text-xs">📚</span>
        Hadith Evidence
      </h3>
      <div className="mb-6 flex flex-col gap-3">
        {content.hadiths.map((hadith, i) => {
          const bmId = `hadith-${hadith.source}`;
          const isBookmarked = bookmarks.includes(bmId);
          return (
            <div key={i} className="rounded-2xl border border-border bg-card p-4 relative">
              <button
                onClick={() => toggleBookmark(bmId)}
                className={`absolute top-3 right-3 text-sm transition-colors ${isBookmarked ? "text-primary" : "text-muted-foreground/40 hover:text-primary/60"}`}
                title={isBookmarked ? "Remove bookmark" : "Bookmark this hadith"}
              >
                {isBookmarked ? "★" : "☆"}
              </button>
              {hadith.arabic && (
                <p className="mb-2 font-arabic text-base leading-relaxed text-foreground pr-6" dir="rtl">{hadith.arabic}</p>
              )}
              <p className="mb-2 text-sm text-foreground italic pr-6">"{hadith.text}"</p>
              {hadith.narrator && (
                <p className="mb-1 text-xs text-muted-foreground">{hadith.narrator}</p>
              )}
              <div className="flex items-center gap-2">
                <a href={hadith.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline hover:text-primary/80">{hadith.source} →</a>
                {hadith.grade && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    hadith.grade.includes("Sahih") ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  }`}>
                    {hadith.grade}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Key Takeaways */}
      <h3 className="mb-3 flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-xs">🔑</span>
        Key Takeaways
      </h3>
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
          <h3 className="mb-3 flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/10 text-xs">🏋️</span>
            Today's Exercise
          </h3>
          <div className="mb-6 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-4">
            <p className="text-sm leading-relaxed text-foreground">{content.exercise}</p>
          </div>
        </>
      )}

      {/* Quiz Section */}
      {hasQuiz && (
        <>
          <h3 className="mb-3 flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/10 text-xs">🧠</span>
            Test Your Knowledge
          </h3>
          {!quizState.started ? (
            <div className="mb-6 rounded-2xl border border-border bg-card p-5 text-center">
              {quizState.answers.some(a => a !== null) ? (
                <>
                  <span className="mb-2 block text-2xl">{quizScore === quiz!.length ? "🏆" : "📝"}</span>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    Score: {quizScore}/{quiz!.length} {quizScore === quiz!.length && "— Perfect!"}
                  </p>
                  <button onClick={startQuiz} className="mt-2 rounded-xl bg-primary/10 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors">
                    Retake Quiz
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-3">{quiz!.length} questions to test your understanding</p>
                  <button onClick={startQuiz} className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:scale-[1.02] transition-all">
                    Start Quiz →
                  </button>
                </>
              )}
            </div>
          ) : (
            <motion.div
              className="mb-6 rounded-2xl border border-primary/20 bg-card p-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground font-medium">
                  Question {quizState.currentQ + 1} of {quiz!.length}
                </span>
                <div className="flex gap-1">
                  {quiz!.map((_, i) => (
                    <span key={i} className={`h-1.5 w-4 rounded-full ${
                      i === quizState.currentQ ? "bg-primary" : i < quizState.currentQ ? "bg-success" : "bg-muted"
                    }`} />
                  ))}
                </div>
              </div>
              <p className="mb-4 text-sm font-semibold text-foreground">{quiz![quizState.currentQ].question}</p>
              <div className="flex flex-col gap-2">
                {quiz![quizState.currentQ].options.map((opt, oi) => {
                  const selected = quizState.answers[quizState.currentQ] === oi;
                  const isCorrect = oi === quiz![quizState.currentQ].correctIndex;
                  const showFeedback = quizState.showResult;
                  return (
                    <button
                      key={oi}
                      onClick={() => !quizState.showResult && answerQuiz(oi)}
                      disabled={quizState.showResult}
                      className={`rounded-xl border p-3 text-left text-sm transition-all ${
                        showFeedback && isCorrect
                          ? "border-success bg-success/10 text-foreground"
                          : showFeedback && selected && !isCorrect
                            ? "border-destructive bg-destructive/10 text-foreground"
                            : selected
                              ? "border-primary bg-primary/10 text-foreground"
                              : "border-border bg-card text-muted-foreground hover:border-muted-foreground/40"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                          showFeedback && isCorrect ? "bg-success text-success-foreground" : showFeedback && selected ? "bg-destructive text-destructive-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                          {showFeedback && isCorrect ? "✓" : showFeedback && selected && !isCorrect ? "✗" : String.fromCharCode(65 + oi)}
                        </span>
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
              {quizState.showResult && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{quiz![quizState.currentQ].explanation}</p>
                  <button onClick={nextQuestion} className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground">
                    {quizState.currentQ >= quiz!.length - 1 ? "See Results" : "Next Question →"}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </>
      )}

      {/* Personal Notes */}
      <div className="mb-6">
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>📝</span> My Notes {notes[lesson.id] ? "(saved)" : ""}
          <span className="text-[10px]">{showNotes ? "▲" : "▼"}</span>
        </button>
        <AnimatePresence>
          {showNotes && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <textarea
                value={notes[lesson.id] || ""}
                onChange={(e) => setNotes(prev => ({ ...prev, [lesson.id]: e.target.value }))}
                placeholder="Write your reflections, personal insights, or action items..."
                className="w-full rounded-xl border border-border bg-card p-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                rows={3}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Complete button */}
      <motion.button
        onClick={() => {
          onComplete();
          onBack();
        }}
        className={`w-full rounded-xl py-3.5 font-heading font-semibold transition-all ${
          completed
            ? "bg-success text-success-foreground"
            : "bg-primary text-primary-foreground"
        }`}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
      >
        {completed ? "✓ Completed — Review Again" : "Mark as Complete ✨"}
      </motion.button>

      {/* Next/Prev Navigation */}
      <div className="mt-4 flex gap-2">
        {prevLesson && (
          <button
            onClick={() => onNavigate(prevLesson.id)}
            className="flex-1 rounded-xl border border-border bg-card p-3 text-left hover:border-primary/30 transition-colors"
          >
            <span className="text-[10px] text-muted-foreground">← Previous</span>
            <p className="text-xs font-semibold text-foreground truncate">{prevLesson.title}</p>
          </button>
        )}
        {nextLesson && (
          <button
            onClick={() => onNavigate(nextLesson.id)}
            className="flex-1 rounded-xl border border-border bg-card p-3 text-right hover:border-primary/30 transition-colors"
          >
            <span className="text-[10px] text-muted-foreground">Next →</span>
            <p className="text-xs font-semibold text-foreground truncate">{nextLesson.title}</p>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default LearnTab;
