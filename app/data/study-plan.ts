export type StudyKind = "daily" | "retreat";

export type StudyEntry = {
  date: string;
  weekday: string;
  week?: number;
  weekTitle?: string;
  movement?: string;
  passage: string;
  focus: string;
  reflection?: string;
  kind: StudyKind;
  retreatQuestions?: string[];
  prayerPrompt?: string;
};

export type StudyMovement = {
  title: string;
  period: string;
  description: string;
};

export type StudyWeek = {
  number: number;
  title: string;
  movement: string;
};


export const studyPlan = {
  title: "Knowing God, Examining the Heart, and Learning to Walk With Him",
  subtitle: "A Daily Scripture Study System · July 27 – December 31, 2026",
  startDate: "2026-07-27",
  endDate: "2026-12-31",
  totalDays: 158,
  goldenRule: "Your normal study portion is 5–15 verses. Sometimes less. If a passage is rich, stay there for three or four days.",
  weeklyPattern: [
    ["Monday", "Text — Read and observe."],
    ["Tuesday", "Context — Understand the passage and its argument."],
    ["Wednesday", "Investigation — Words, structure, cross-references, theology."],
    ["Thursday", "Heart — What this reveals about God, humanity, sin, desire and obedience."],
    ["Friday", "Meditation — Read it again without trying to discover something new. Pray it. Sit with it."],
    ["Saturday", "Review — Look back at your notes and answer: what is God showing me?"],
    ["Sunday", "Worship / Rest — No academic study requirement. Church, prayer, worship, reflection."],
  ],
  timeModel: [

    ["5 min", "Be still, pray, prepare your heart"],
    ["10 min", "Read the passage slowly, 2–3 times"],
    ["10 min", "Observation"],
    ["15 min", "Context and structure"],
    ["15 min", "Word study / cross-references"],
    ["10 min", "Theology: God, humanity, sin, grace"],
    ["5 min", "Personal reflection"],
    ["5 min", "Prayer and one concrete response"],
  ],
} as const;


export const movements: StudyMovement[] = [

  { title: "The Heart Before God", period: "Weeks 1–4 · Jul 27 – Aug 23", description: "Not “how do I become a better Christian?” but: what is actually happening inside the human person before God? Genesis 1–4 and Jeremiah 17 lay the foundation for everything that follows." },

  { title: "Who God Is", period: "Weeks 5–6 · Aug 24 – Sep 6", description: "Before returning to the human heart, stop and look directly at God's own self-description in Exodus 33–34, and at what covenant love looks like as ordinary life in Deuteronomy." },

  { title: "Knowing the Truth, Yet the Heart Drifts", period: "Weeks 7–10 · Sep 7 – Oct 4", description: "The problem was never a lack of information. Judges, Gideon, Saul, and David all knew God — and still had to reckon with their own hearts. Psalm 51 is one of the deepest studies of the whole season." },

  { title: "Jesus: The Heart of the Matter", period: "Weeks 11–15 · Oct 5 – Nov 8", description: "Read Jesus after three months of examining the human heart and God's character. Watch what He does with both — in the Sermon on the Mount and in His personal conversations." },

  { title: "From Knowing to Walking", period: "Weeks 16–22 · Nov 9 – Dec 27", description: "Everything comes together: grace, flesh and Spirit, sovereignty and responsibility, and finally — “therefore” — what theology looks like when it becomes an actual life." },

];


export const weeks: StudyWeek[] = [

  { number: 1, title: "Creation, Identity, Command and Desire", movement: "The Heart Before God" },

  { number: 2, title: "The Fall and the Birth of Sin", movement: "The Heart Before God" },

  { number: 3, title: "Cain: Sin, Desire and Responsibility", movement: "The Heart Before God" },

  { number: 4, title: "The Heart", movement: "The Heart Before God" },

  { number: 5, title: "Who Is God?", movement: "Who God Is" },

  { number: 6, title: "Covenant Love and Remembering God", movement: "Who God Is" },

  { number: 7, title: "Forgetting God", movement: "Knowing the Truth, Yet the Heart Drifts" },

  { number: 8, title: "Gideon: Fear, Faith and Obedience", movement: "Knowing the Truth, Yet the Heart Drifts" },

  { number: 9, title: "Saul: Religious Activity and the Heart", movement: "Knowing the Truth, Yet the Heart Drifts" },

  { number: 10, title: "David and the Heart", movement: "Knowing the Truth, Yet the Heart Drifts" },

  { number: 11, title: "Jesus and the Inner Person", movement: "Jesus: The Heart of the Matter" },

  { number: 12, title: "Hidden Motives", movement: "Jesus: The Heart of the Matter" },

  { number: 13, title: "Hearing and Doing", movement: "Jesus: The Heart of the Matter" },

  { number: 14, title: "Jesus Knows the Person", movement: "Jesus: The Heart of the Matter" },

  { number: 15, title: "When Truth Becomes Difficult", movement: "Jesus: The Heart of the Matter" },

  { number: 16, title: "Grace and Freedom", movement: "From Knowing to Walking" },

  { number: 17, title: "Flesh, Spirit and Life", movement: "From Knowing to Walking" },

  { number: 18, title: "Sovereignty, Mercy and Responsibility", movement: "From Knowing to Walking" },

  { number: 19, title: "When Theology Becomes Life", movement: "From Knowing to Walking" },

  { number: 20, title: "Hearing Without Doing", movement: "From Knowing to Walking" },

  { number: 21, title: "The Life That Knows God", movement: "From Knowing to Walking" },

  { number: 22, title: "Bringing the Pieces Together", movement: "From Knowing to Walking" },

];


export const studies: StudyEntry[] = [

  { date: "2026-07-27", weekday: "Monday", week: 1, weekTitle: "Creation, Identity, Command and Desire", movement: "The Heart Before God", passage: "Genesis 1:1–5", focus: "God as Creator; darkness and light; God's first acts.", reflection: "What does this opening reveal about who God is before anything else exists?", kind: "daily" },

  { date: "2026-07-28", weekday: "Tuesday", week: 1, weekTitle: "Creation, Identity, Command and Desire", movement: "The Heart Before God", passage: "Genesis 1:6–13", focus: "God's ordering of creation; command and response.", reflection: "What does creation's response to God's command teach me about God's authority?", kind: "daily" },

  { date: "2026-07-29", weekday: "Wednesday", week: 1, weekTitle: "Creation, Identity, Command and Desire", movement: "The Heart Before God", passage: "Genesis 1:14–25", focus: "Order, purpose and distinction.", reflection: "What does this teach me about God's intentionality?", kind: "daily" },

  { date: "2026-07-30", weekday: "Thursday", week: 1, weekTitle: "Creation, Identity, Command and Desire", movement: "The Heart Before God", passage: "Genesis 1:26–31", focus: "Image of God; humanity's purpose and dominion.", reflection: "What does being God's image-bearer mean for how I understand myself?", kind: "daily" },

  { date: "2026-07-31", weekday: "Friday", week: 1, weekTitle: "Creation, Identity, Command and Desire", movement: "The Heart Before God", passage: "Genesis 2:1–17", focus: "Eden, command, freedom, responsibility.", reflection: "Why is God's command important to understanding human freedom?", kind: "daily" },

  { date: "2026-08-01", weekday: "Saturday", week: 1, weekTitle: "Creation, Identity, Command and Desire", movement: "The Heart Before God", passage: "Genesis 2:18–25", focus: "Humanity, relationship, nakedness and innocence.", reflection: "What does this reveal about human life before corruption?", kind: "daily" },

  { date: "2026-08-02", weekday: "Sunday", week: 1, weekTitle: "Creation, Identity, Command and Desire", movement: "The Heart Before God", passage: "Genesis 1–2 (review)", focus: "No new research — review your notes.", reflection: "What have I learned about God and humanity this week?", kind: "daily" },

  { date: "2026-08-03", weekday: "Monday", week: 2, weekTitle: "The Fall and the Birth of Sin", movement: "The Heart Before God", passage: "Genesis 3:1–7", focus: "Serpent, command, deception, desire.", reflection: "Where does the movement toward disobedience begin?", kind: "daily" },

  { date: "2026-08-04", weekday: "Tuesday", week: 2, weekTitle: "The Fall and the Birth of Sin", movement: "The Heart Before God", passage: "Genesis 3:8–13", focus: "Shame, hiding, blame and responsibility.", reflection: "What does sin do to a person's relationship with God?", kind: "daily" },

  { date: "2026-08-05", weekday: "Wednesday", week: 2, weekTitle: "The Fall and the Birth of Sin", movement: "The Heart Before God", passage: "Genesis 3:14–19", focus: "Judgment, consequence and God's words concerning humanity.", reflection: "How do God's justice and mercy appear in the aftermath?", kind: "daily" },

  { date: "2026-08-06", weekday: "Thursday", week: 2, weekTitle: "The Fall and the Birth of Sin", movement: "The Heart Before God", passage: "Genesis 3:20–24", focus: "Exile from Eden and God's continued action toward humanity.", reflection: "What does God's response teach me about holiness?", kind: "daily" },

  { date: "2026-08-07", weekday: "Friday", week: 2, weekTitle: "The Fall and the Birth of Sin", movement: "The Heart Before God", passage: "Genesis 3:1–24", focus: "Reconstruct the entire argument.", reflection: "What is the difference between temptation, desire, choice and consequence?", kind: "daily" },

  { date: "2026-08-08", weekday: "Saturday", week: 2, weekTitle: "The Fall and the Birth of Sin", movement: "The Heart Before God", passage: "Genesis 3 (again)", focus: "Write a one-page study titled “Where Corruption Begins.”", reflection: "What have I learned about the human heart?", kind: "daily" },

  { date: "2026-08-09", weekday: "Sunday", week: 2, weekTitle: "The Fall and the Birth of Sin", movement: "The Heart Before God", passage: "— (no new passage)", focus: "Pray through Genesis 3.", reflection: "What part of Genesis 3 speaks most directly to me?", kind: "daily" },

  { date: "2026-08-10", weekday: "Monday", week: 3, weekTitle: "Cain: Sin, Desire and Responsibility", movement: "The Heart Before God", passage: "Genesis 4:1–7", focus: "Cain, Abel, offering, anger and God's warning.", reflection: "What does God say to Cain before Cain acts?", kind: "daily" },

  { date: "2026-08-11", weekday: "Tuesday", week: 3, weekTitle: "Cain: Sin, Desire and Responsibility", movement: "The Heart Before God", passage: "Genesis 4:8–16", focus: "Murder, accountability and judgment.", reflection: "How does God hold Cain responsible while still showing restraint?", kind: "daily" },

  { date: "2026-08-12", weekday: "Wednesday", week: 3, weekTitle: "Cain: Sin, Desire and Responsibility", movement: "The Heart Before God", passage: "Genesis 4:17–26", focus: "Human civilization after Cain; Lamech; worship.", reflection: "What happens when human development occurs alongside moral corruption?", kind: "daily" },

  { date: "2026-08-13", weekday: "Thursday", week: 3, weekTitle: "Cain: Sin, Desire and Responsibility", movement: "The Heart Before God", passage: "Genesis 4:6–7", focus: "Hebrew terms surrounding sin, crouching, desire and ruling.", reflection: "What does this passage teach about the relationship between desire and responsibility?", kind: "daily" },

  { date: "2026-08-14", weekday: "Friday", week: 3, weekTitle: "Cain: Sin, Desire and Responsibility", movement: "The Heart Before God", passage: "Genesis 4:1–16", focus: "Compare Cain and Abel.", reflection: "What did Cain know? What did Cain want? What did Cain choose?", kind: "daily" },

  { date: "2026-08-15", weekday: "Saturday", week: 3, weekTitle: "Cain: Sin, Desire and Responsibility", movement: "The Heart Before God", passage: "Genesis 4:6–7 (slowly, several times)", focus: "Write your own explanation without commentary, then compare.", reflection: "Did the additional research clarify or challenge my interpretation?", kind: "daily" },

  { date: "2026-08-16", weekday: "Sunday", week: 3, weekTitle: "Cain: Sin, Desire and Responsibility", movement: "The Heart Before God", passage: "Genesis 4:1–16 (review)", focus: "Review.", reflection: "What have Cain's choices taught me about my own desires?", kind: "daily" },

  { date: "2026-08-17", weekday: "Monday", week: 4, weekTitle: "The Heart", movement: "The Heart Before God", passage: "Jeremiah 17:1–4", focus: "Sin engraved on the heart.", reflection: "What does Scripture mean by sin being deeply established within people?", kind: "daily" },

  { date: "2026-08-18", weekday: "Tuesday", week: 4, weekTitle: "The Heart", movement: "The Heart Before God", passage: "Jeremiah 17:5–8", focus: "Trusting man versus trusting God.", reflection: "What does my life reveal about where I actually place my trust?", kind: "daily" },

  { date: "2026-08-19", weekday: "Wednesday", week: 4, weekTitle: "The Heart", movement: "The Heart Before God", passage: "Jeremiah 17:9–10", focus: "Hebrew study of lev/levav — deceitfulness, searching and testing.", reflection: "What does it mean for God to know the heart better than I know myself?", kind: "daily" },

  { date: "2026-08-20", weekday: "Thursday", week: 4, weekTitle: "The Heart", movement: "The Heart Before God", passage: "Jeremiah 17:11–18", focus: "Desire, wealth, justice, healing and refuge.", reflection: "What does Jeremiah connect with a person's relationship with God?", kind: "daily" },

  { date: "2026-08-21", weekday: "Friday", week: 4, weekTitle: "The Heart", movement: "The Heart Before God", passage: "Proverbs 4:20–27", focus: "Heart, mouth, eyes, feet and the direction of life.", reflection: "How does the inner person eventually become visible in conduct?", kind: "daily" },

  { date: "2026-08-22", weekday: "Saturday", week: 4, weekTitle: "The Heart", movement: "The Heart Before God", passage: "Proverbs 15:1–4, 31–33", focus: "Speech, correction, humility and the heart.", reflection: "How do I respond when Scripture or another person corrects me?", kind: "daily" },

  { date: "2026-08-23", weekday: "Sunday", week: 4, weekTitle: "The Heart", movement: "The Heart Before God", passage: "Jeremiah 17:5–10 (review)", focus: "Review your notes.", reflection: "What has Scripture exposed about my heart this month?", kind: "daily" },

  { date: "2026-08-24", weekday: "Monday", week: 5, weekTitle: "Who Is God?", movement: "Who God Is", passage: "Exodus 33:12–17", focus: "Moses' desire for God's presence.", reflection: "Do I want God's presence, or mainly what God's presence can give me?", kind: "daily" },

  { date: "2026-08-25", weekday: "Tuesday", week: 5, weekTitle: "Who Is God?", movement: "Who God Is", passage: "Exodus 33:18–23", focus: "God's glory and self-revelation.", reflection: "What does Moses actually ask to know about God?", kind: "daily" },

  { date: "2026-08-26", weekday: "Wednesday", week: 5, weekTitle: "Who Is God?", movement: "Who God Is", passage: "Exodus 34:1–7", focus: "God's self-description.", reflection: "Which attributes does God choose to announce about Himself?", kind: "daily" },

  { date: "2026-08-27", weekday: "Thursday", week: 5, weekTitle: "Who Is God?", movement: "Who God Is", passage: "Exodus 34:8–9", focus: "Worship, confession and covenant.", reflection: "What does knowing God's character produce in Moses?", kind: "daily" },

  { date: "2026-08-28", weekday: "Friday", week: 5, weekTitle: "Who Is God?", movement: "Who God Is", passage: "Exodus 34:1–9", focus: "Mercy, grace, patience, steadfast love, faithfulness, forgiveness, justice.", reflection: "How do God's mercy and justice exist together?", kind: "daily" },

  { date: "2026-08-29", weekday: "Saturday", week: 5, weekTitle: "Who Is God?", movement: "Who God Is", passage: "Psalm 103:1–22", focus: "Mark every statement about God's character.", reflection: "What kind of God does David teach his own soul to remember?", kind: "daily" },

  { date: "2026-08-30", weekday: "Sunday", week: 5, weekTitle: "Who Is God?", movement: "Who God Is", passage: "Exodus 34:6–7; Psalm 103", focus: "No new research — pray through God's character.", reflection: "Which attribute of God do I most need to understand and trust right now?", kind: "daily" },

  { date: "2026-08-31", weekday: "Monday", week: 6, weekTitle: "Covenant Love and Remembering God", movement: "Who God Is", passage: "Deuteronomy 6:1–9", focus: "Hear, love, remember, teach.", reflection: "What does loving God involve beyond emotion?", kind: "daily" },

  { date: "2026-09-01", weekday: "Tuesday", week: 6, weekTitle: "Covenant Love and Remembering God", movement: "Who God Is", passage: "Deuteronomy 6:10–19", focus: "Prosperity, forgetting and testing God.", reflection: "Why can blessing become spiritually dangerous?", kind: "daily" },

  { date: "2026-09-02", weekday: "Wednesday", week: 6, weekTitle: "Covenant Love and Remembering God", movement: "Who God Is", passage: "Deuteronomy 6:20–25", focus: "Teaching the next generation; remembering redemption.", reflection: "Why does Israel's obedience need to be connected to what God has done?", kind: "daily" },

  { date: "2026-09-03", weekday: "Thursday", week: 6, weekTitle: "Covenant Love and Remembering God", movement: "Who God Is", passage: "Deuteronomy 8:1–10", focus: "Wilderness, testing, hunger and dependence.", reflection: "What did God use Israel's lack to teach them?", kind: "daily" },

  { date: "2026-09-04", weekday: "Friday", week: 6, weekTitle: "Covenant Love and Remembering God", movement: "Who God Is", passage: "Deuteronomy 8:11–20", focus: "Prosperity, pride and forgetting God.", reflection: "What happens when a person interprets God's blessing as personal achievement?", kind: "daily" },

  { date: "2026-09-05", weekday: "Saturday", week: 6, weekTitle: "Covenant Love and Remembering God", movement: "Who God Is", passage: "Deuteronomy 6 and 8", focus: "Compare remembering and forgetting.", reflection: "What practices help me remember God rather than merely know about Him?", kind: "daily" },

  { date: "2026-09-06", weekday: "Sunday", week: 6, weekTitle: "Covenant Love and Remembering God", movement: "Who God Is", passage: "Deuteronomy 8:1–18 (review)", focus: "Prayer and review.", reflection: "Where do I need greater dependence on God?", kind: "daily" },

  { date: "2026-09-07", weekday: "Monday", week: 7, weekTitle: "Forgetting God", movement: "Knowing the Truth, Yet the Heart Drifts", passage: "Judges 2:6–10", focus: "Generational memory and forgetting.", reflection: "How can people who once knew God's works become disconnected from them?", kind: "daily" },

  { date: "2026-09-08", weekday: "Tuesday", week: 7, weekTitle: "Forgetting God", movement: "Knowing the Truth, Yet the Heart Drifts", passage: "Judges 2:11–15", focus: "Idolatry and covenant violation.", reflection: "What happens when desire replaces devotion?", kind: "daily" },

  { date: "2026-09-09", weekday: "Wednesday", week: 7, weekTitle: "Forgetting God", movement: "Knowing the Truth, Yet the Heart Drifts", passage: "Judges 2:16–23", focus: "God's response to Israel's rebellion.", reflection: "How do judgment and mercy operate together?", kind: "daily" },

  { date: "2026-09-10", weekday: "Thursday", week: 7, weekTitle: "Forgetting God", movement: "Knowing the Truth, Yet the Heart Drifts", passage: "Judges 2:6–23", focus: "Identify the repeated cycle.", reflection: "Where do I see a similar pattern in human spiritual life?", kind: "daily" },

  { date: "2026-09-11", weekday: "Friday", week: 7, weekTitle: "Forgetting God", movement: "Knowing the Truth, Yet the Heart Drifts", passage: "Judges 2:10–19", focus: "Knowing, forgetting, desire and behavior.", reflection: "Is knowledge enough to keep a heart faithful?", kind: "daily" },

  { date: "2026-09-12", weekday: "Saturday", week: 7, weekTitle: "Forgetting God", movement: "Knowing the Truth, Yet the Heart Drifts", passage: "Judges 2 (review)", focus: "Write the cycle in your own words.", reflection: "Which part of the cycle should I be most watchful about?", kind: "daily" },

  { date: "2026-09-13", weekday: "Sunday", week: 7, weekTitle: "Forgetting God", movement: "Knowing the Truth, Yet the Heart Drifts", passage: "Judges 2:10–19 (review)", focus: "Review.", reflection: "What does it mean for me personally not to forget God?", kind: "daily" },

  { date: "2026-09-14", weekday: "Monday", week: 8, weekTitle: "Gideon: Fear, Faith and Obedience", movement: "Knowing the Truth, Yet the Heart Drifts", passage: "Judges 6:1–10", focus: "Israel's oppression and God's diagnosis.", reflection: "What does God say is actually wrong with Israel?", kind: "daily" },

  { date: "2026-09-15", weekday: "Tuesday", week: 8, weekTitle: "Gideon: Fear, Faith and Obedience", movement: "Knowing the Truth, Yet the Heart Drifts", passage: "Judges 6:11–24", focus: "Gideon's fear and God's call.", reflection: "How does God respond to Gideon's questions?", kind: "daily" },

  { date: "2026-09-16", weekday: "Wednesday", week: 8, weekTitle: "Gideon: Fear, Faith and Obedience", movement: "Knowing the Truth, Yet the Heart Drifts", passage: "Judges 6:25–32", focus: "Gideon's first assignment.", reflection: "Why does obedience sometimes begin privately before it becomes public?", kind: "daily" },

  { date: "2026-09-17", weekday: "Thursday", week: 8, weekTitle: "Gideon: Fear, Faith and Obedience", movement: "Knowing the Truth, Yet the Heart Drifts", passage: "Judges 6:33–40", focus: "Gideon's testing and uncertainty.", reflection: "What is the difference between honest weakness and refusing to trust God?", kind: "daily" },

  { date: "2026-09-18", weekday: "Friday", week: 8, weekTitle: "Gideon: Fear, Faith and Obedience", movement: "Knowing the Truth, Yet the Heart Drifts", passage: "Judges 6:11–40", focus: "Character study of Gideon.", reflection: "What does Gideon's story teach me about God's patience with imperfect people?", kind: "daily" },

  { date: "2026-09-19", weekday: "Saturday", week: 8, weekTitle: "Gideon: Fear, Faith and Obedience", movement: "Knowing the Truth, Yet the Heart Drifts", passage: "Judges 6:25–27", focus: "Focus on “because he was too afraid…”", reflection: "Where might obedience require courage from me?", kind: "daily" },

  { date: "2026-09-20", weekday: "Sunday", week: 8, weekTitle: "Gideon: Fear, Faith and Obedience", movement: "Knowing the Truth, Yet the Heart Drifts", passage: "Judges 6 (review)", focus: "Review.", reflection: "What is God asking me to obey even when I feel afraid?", kind: "daily" },

  { date: "2026-09-21", weekday: "Monday", week: 9, weekTitle: "Saul: Religious Activity and the Heart", movement: "Knowing the Truth, Yet the Heart Drifts", passage: "1 Samuel 8:1–9", focus: "Israel's demand for a king.", reflection: "What did Israel want, and why?", kind: "daily" },

  { date: "2026-09-22", weekday: "Tuesday", week: 9, weekTitle: "Saul: Religious Activity and the Heart", movement: "Knowing the Truth, Yet the Heart Drifts", passage: "1 Samuel 8:10–22", focus: "God's warning and Israel's insistence.", reflection: "What does God sometimes allow people to pursue despite warning them?", kind: "daily" },

  { date: "2026-09-23", weekday: "Wednesday", week: 9, weekTitle: "Saul: Religious Activity and the Heart", movement: "Knowing the Truth, Yet the Heart Drifts", passage: "1 Samuel 13:8–15", focus: "Saul's impatience and Samuel's rebuke.", reflection: "What does fear of circumstances do to obedience?", kind: "daily" },

  { date: "2026-09-24", weekday: "Thursday", week: 9, weekTitle: "Saul: Religious Activity and the Heart", movement: "Knowing the Truth, Yet the Heart Drifts", passage: "1 Samuel 15:1–23", focus: "Partial obedience and rejection of God's command.", reflection: "Why isn't partial obedience equivalent to obedience?", kind: "daily" },

  { date: "2026-09-25", weekday: "Friday", week: 9, weekTitle: "Saul: Religious Activity and the Heart", movement: "Knowing the Truth, Yet the Heart Drifts", passage: "1 Samuel 15:24–35", focus: "Saul's confession, fear of people, consequences.", reflection: "Is Saul more concerned with God's approval or people's approval?", kind: "daily" },

  { date: "2026-09-26", weekday: "Saturday", week: 9, weekTitle: "Saul: Religious Activity and the Heart", movement: "Knowing the Truth, Yet the Heart Drifts", passage: "1 Samuel 15:22–23", focus: "Examine “to obey is better than sacrifice.”", reflection: "Where might religious activity hide disobedience in my own life?", kind: "daily" },

  { date: "2026-09-27", weekday: "Sunday", week: 9, weekTitle: "Saul: Religious Activity and the Heart", movement: "Knowing the Truth, Yet the Heart Drifts", passage: "1 Samuel 15 (review)", focus: "Review.", reflection: "What is the difference between appearing spiritually active and actually obeying God?", kind: "daily" },

  { date: "2026-09-28", weekday: "Monday", week: 10, weekTitle: "David and the Heart", movement: "Knowing the Truth, Yet the Heart Drifts", passage: "1 Samuel 16:1–13", focus: "God's choice and “the heart.”", reflection: "What can God see that human beings cannot?", kind: "daily" },

  { date: "2026-09-29", weekday: "Tuesday", week: 10, weekTitle: "David and the Heart", movement: "Knowing the Truth, Yet the Heart Drifts", passage: "Psalm 51:1–6", focus: "Sin, confession and truth.", reflection: "What does David acknowledge about his own condition?", kind: "daily" },

  { date: "2026-09-30", weekday: "Wednesday", week: 10, weekTitle: "David and the Heart", movement: "Knowing the Truth, Yet the Heart Drifts", passage: "Psalm 51:7–12", focus: "Cleansing, heart, spirit and restoration.", reflection: "What exactly is David asking God to change?", kind: "daily" },

  { date: "2026-10-01", weekday: "Thursday", week: 10, weekTitle: "David and the Heart", movement: "Knowing the Truth, Yet the Heart Drifts", passage: "Psalm 51:13–19", focus: "Restoration leading to service and worship.", reflection: "What should genuine repentance produce?", kind: "daily" },

  { date: "2026-10-02", weekday: "Friday", week: 10, weekTitle: "David and the Heart", movement: "Knowing the Truth, Yet the Heart Drifts", passage: "Psalm 51:1–19", focus: "Trace David's movement from guilt to restoration.", reflection: "How is biblical repentance different from merely feeling bad?", kind: "daily" },

  { date: "2026-10-03", weekday: "Saturday", week: 10, weekTitle: "David and the Heart", movement: "Knowing the Truth, Yet the Heart Drifts", passage: "1 Samuel 16:1–13; Psalm 51", focus: "Compare God's view of the heart with David's confession.", reflection: "What does God want to do in the inner person?", kind: "daily" },

  { date: "2026-10-04", weekday: "Sunday", week: 10, weekTitle: "David and the Heart", movement: "Knowing the Truth, Yet the Heart Drifts", passage: "Psalm 51 (pray it)", focus: "Pray it personally.", reflection: "What do I need God to create, renew or restore in me?", kind: "daily" },

  { date: "2026-10-05", weekday: "Monday", week: 11, weekTitle: "Jesus and the Inner Person", movement: "Jesus: The Heart of the Matter", passage: "Matthew 5:1–12", focus: "Beatitudes and the character of the Kingdom person.", reflection: "Which description challenges my present character most?", kind: "daily" },

  { date: "2026-10-06", weekday: "Tuesday", week: 11, weekTitle: "Jesus and the Inner Person", movement: "Jesus: The Heart of the Matter", passage: "Matthew 5:13–20", focus: "Salt, light, righteousness and the Law.", reflection: "What kind of righteousness does Jesus expect?", kind: "daily" },

  { date: "2026-10-07", weekday: "Wednesday", week: 11, weekTitle: "Jesus and the Inner Person", movement: "Jesus: The Heart of the Matter", passage: "Matthew 5:21–26", focus: "Anger, murder and reconciliation.", reflection: "What does Jesus reveal about the relationship between inner attitude and outward action?", kind: "daily" },

  { date: "2026-10-08", weekday: "Thursday", week: 11, weekTitle: "Jesus and the Inner Person", movement: "Jesus: The Heart of the Matter", passage: "Matthew 5:27–32", focus: "Lust, desire and adultery.", reflection: "What does Jesus teach about the origin of sinful action?", kind: "daily" },

  { date: "2026-10-09", weekday: "Friday", week: 11, weekTitle: "Jesus and the Inner Person", movement: "Jesus: The Heart of the Matter", passage: "Matthew 5:33–48", focus: "Truthfulness, retaliation, enemies and love.", reflection: "What kind of heart can actually love an enemy?", kind: "daily" },

  { date: "2026-10-10", weekday: "Saturday", week: 11, weekTitle: "Jesus and the Inner Person", movement: "Jesus: The Heart of the Matter", passage: "Matthew 5:17–48", focus: "Summarize Jesus' treatment of external religion vs. inner righteousness.", reflection: "What is Jesus trying to transform?", kind: "daily" },

  { date: "2026-10-11", weekday: "Sunday", week: 11, weekTitle: "Jesus and the Inner Person", movement: "Jesus: The Heart of the Matter", passage: "Matthew 5 (review)", focus: "Prayer and review.", reflection: "What did Jesus expose in me this week?", kind: "daily" },

  { date: "2026-10-12", weekday: "Monday", week: 12, weekTitle: "Hidden Motives", movement: "Jesus: The Heart of the Matter", passage: "Matthew 6:1–4", focus: "Giving and motives.", reflection: "Why do I sometimes want people to notice what I do for God?", kind: "daily" },

  { date: "2026-10-13", weekday: "Tuesday", week: 12, weekTitle: "Hidden Motives", movement: "Jesus: The Heart of the Matter", passage: "Matthew 6:5–18", focus: "Prayer, fasting and secrecy.", reflection: "What does Jesus teach about being seen by God rather than people?", kind: "daily" },

  { date: "2026-10-14", weekday: "Wednesday", week: 12, weekTitle: "Hidden Motives", movement: "Jesus: The Heart of the Matter", passage: "Matthew 6:19–24", focus: "Treasure, heart and masters.", reflection: "What does my treasure reveal about my heart?", kind: "daily" },

  { date: "2026-10-15", weekday: "Thursday", week: 12, weekTitle: "Hidden Motives", movement: "Jesus: The Heart of the Matter", passage: "Matthew 6:25–34", focus: "Anxiety, provision and trust.", reflection: "What does worry reveal about what I believe about God?", kind: "daily" },

  { date: "2026-10-16", weekday: "Friday", week: 12, weekTitle: "Hidden Motives", movement: "Jesus: The Heart of the Matter", passage: "Matthew 6:1–34", focus: "Identify Jesus' repeated concern with the hidden life.", reflection: "Who am I when nobody is watching?", kind: "daily" },

  { date: "2026-10-17", weekday: "Saturday", week: 12, weekTitle: "Hidden Motives", movement: "Jesus: The Heart of the Matter", passage: "Matthew 6:19–34", focus: "Write “What my heart seeks.”", reflection: "What am I most tempted to make my security?", kind: "daily" },

  { date: "2026-10-18", weekday: "Sunday", week: 12, weekTitle: "Hidden Motives", movement: "Jesus: The Heart of the Matter", passage: "Matthew 6 (pray through)", focus: "Pray through the chapter.", reflection: "What hidden motive does God want me to surrender?", kind: "daily" },

  { date: "2026-10-19", weekday: "Monday", week: 13, weekTitle: "Hearing and Doing", movement: "Jesus: The Heart of the Matter", passage: "Matthew 7:1–6", focus: "Judgment, discernment and hypocrisy.", reflection: "Why is self-examination necessary before correcting others?", kind: "daily" },

  { date: "2026-10-20", weekday: "Tuesday", week: 13, weekTitle: "Hearing and Doing", movement: "Jesus: The Heart of the Matter", passage: "Matthew 7:7–12", focus: "Prayer, God's goodness and treating others.", reflection: "How does knowing God's goodness affect how I treat people?", kind: "daily" },

  { date: "2026-10-21", weekday: "Wednesday", week: 13, weekTitle: "Hearing and Doing", movement: "Jesus: The Heart of the Matter", passage: "Matthew 7:13–14", focus: "Two ways and narrowness.", reflection: "Why does Jesus describe following Him as a particular way rather than merely an idea?", kind: "daily" },

  { date: "2026-10-22", weekday: "Thursday", week: 13, weekTitle: "Hearing and Doing", movement: "Jesus: The Heart of the Matter", passage: "Matthew 7:15–23", focus: "False prophets, fruit and “I never knew you.”", reflection: "What is the difference between religious activity and genuine relationship with Christ?", kind: "daily" },

  { date: "2026-10-23", weekday: "Friday", week: 13, weekTitle: "Hearing and Doing", movement: "Jesus: The Heart of the Matter", passage: "Matthew 7:24–29", focus: "Hearing versus doing.", reflection: "What does Jesus say actually makes a person wise?", kind: "daily" },

  { date: "2026-10-24", weekday: "Saturday", week: 13, weekTitle: "Hearing and Doing", movement: "Jesus: The Heart of the Matter", passage: "Matthew 7:13–29", focus: "Compare the two builders and two kinds of disciples.", reflection: "What evidence would show I am actually building on Christ's words?", kind: "daily" },

  { date: "2026-10-25", weekday: "Sunday", week: 13, weekTitle: "Hearing and Doing", movement: "Jesus: The Heart of the Matter", passage: "Matthew 7 (review)", focus: "Review.", reflection: "Where am I hearing without doing?", kind: "daily" },

  { date: "2026-10-26", weekday: "Monday", week: 14, weekTitle: "Jesus Knows the Person", movement: "Jesus: The Heart of the Matter", passage: "John 3:1–8", focus: "Nicodemus and new birth.", reflection: "Why isn't religious knowledge sufficient for transformation?", kind: "daily" },

  { date: "2026-10-27", weekday: "Tuesday", week: 14, weekTitle: "Jesus Knows the Person", movement: "Jesus: The Heart of the Matter", passage: "John 3:9–21", focus: "Spirit, belief, condemnation, light and darkness.", reflection: "What does Jesus say about people's response to light?", kind: "daily" },

  { date: "2026-10-28", weekday: "Wednesday", week: 14, weekTitle: "Jesus Knows the Person", movement: "Jesus: The Heart of the Matter", passage: "John 4:1–15", focus: "Living water and spiritual thirst.", reflection: "What kind of thirst does Jesus identify?", kind: "daily" },

  { date: "2026-10-29", weekday: "Thursday", week: 14, weekTitle: "Jesus Knows the Person", movement: "Jesus: The Heart of the Matter", passage: "John 4:16–26", focus: "Jesus exposes the Samaritan woman's life while offering life.", reflection: "Why does Jesus bring truth about her life into the conversation?", kind: "daily" },

  { date: "2026-10-30", weekday: "Friday", week: 14, weekTitle: "Jesus Knows the Person", movement: "Jesus: The Heart of the Matter", passage: "John 4:27–42", focus: "Witness, worship and belief.", reflection: "What happens when someone encounters Jesus personally?", kind: "daily" },

  { date: "2026-10-31", weekday: "Saturday", week: 14, weekTitle: "Jesus Knows the Person", movement: "Jesus: The Heart of the Matter", passage: "John 3:1–21; 4:1–42", focus: "Compare Nicodemus and the Samaritan woman.", reflection: "How does Jesus deal with different kinds of people?", kind: "daily" },

  { date: "2026-11-01", weekday: "Sunday", week: 14, weekTitle: "Jesus Knows the Person", movement: "Jesus: The Heart of the Matter", passage: "John 3–4 (review)", focus: "Review.", reflection: "What does Jesus know about me that I need to stop hiding from Him?", kind: "daily" },

  { date: "2026-11-02", weekday: "Monday", week: 15, weekTitle: "When Truth Becomes Difficult", movement: "Jesus: The Heart of the Matter", passage: "John 6:22–29", focus: "What the crowd seeks from Jesus.", reflection: "What does Jesus say they really need?", kind: "daily" },

  { date: "2026-11-03", weekday: "Tuesday", week: 15, weekTitle: "When Truth Becomes Difficult", movement: "Jesus: The Heart of the Matter", passage: "John 6:30–40", focus: "Bread of life and belief.", reflection: "What does Jesus mean by coming to Him?", kind: "daily" },

  { date: "2026-11-04", weekday: "Wednesday", week: 15, weekTitle: "When Truth Becomes Difficult", movement: "Jesus: The Heart of the Matter", passage: "John 6:41–51", focus: "Offense, murmuring and Jesus' identity.", reflection: "Why do people resist truth when it challenges their assumptions?", kind: "daily" },

  { date: "2026-11-05", weekday: "Thursday", week: 15, weekTitle: "When Truth Becomes Difficult", movement: "Jesus: The Heart of the Matter", passage: "John 6:52–59", focus: "Jesus' difficult teaching.", reflection: "What happens when God's truth doesn't fit what people expected?", kind: "daily" },

  { date: "2026-11-06", weekday: "Friday", week: 15, weekTitle: "When Truth Becomes Difficult", movement: "Jesus: The Heart of the Matter", passage: "John 6:60–71", focus: "Disciples leaving; Peter's confession.", reflection: "Why does Peter remain even when he doesn't understand everything?", kind: "daily" },

  { date: "2026-11-07", weekday: "Saturday", week: 15, weekTitle: "When Truth Becomes Difficult", movement: "Jesus: The Heart of the Matter", passage: "John 6:60–69", focus: "Understanding, offense, faith and perseverance.", reflection: "Can I remain with Christ when I don't yet understand everything?", kind: "daily" },

  { date: "2026-11-08", weekday: "Sunday", week: 15, weekTitle: "When Truth Becomes Difficult", movement: "Jesus: The Heart of the Matter", passage: "John 6:22–71 (review)", focus: "Review.", reflection: "What do I do when Scripture confronts what I already believe?", kind: "daily" },

  { date: "2026-11-09", weekday: "Monday", week: 16, weekTitle: "Grace and Freedom", movement: "From Knowing to Walking", passage: "Romans 6:1–7", focus: "Grace, sin, baptism and union with Christ.", reflection: "Why does Paul reject the idea that grace gives permission to continue in sin?", kind: "daily" },

  { date: "2026-11-10", weekday: "Tuesday", week: 16, weekTitle: "Grace and Freedom", movement: "From Knowing to Walking", passage: "Romans 6:8–14", focus: "Death, life, sin's rule and presenting yourself to God.", reflection: "What does Paul tell believers to do with their bodies?", kind: "daily" },

  { date: "2026-11-11", weekday: "Wednesday", week: 16, weekTitle: "Grace and Freedom", movement: "From Knowing to Walking", passage: "Romans 6:15–19", focus: "Slavery, obedience and righteousness.", reflection: "What does Paul mean by becoming obedient from the heart?", kind: "daily" },

  { date: "2026-11-12", weekday: "Thursday", week: 16, weekTitle: "Grace and Freedom", movement: "From Knowing to Walking", passage: "Romans 6:20–23", focus: "Two masters, two outcomes.", reflection: "What does Paul say sin produces compared with obedience?", kind: "daily" },

  { date: "2026-11-13", weekday: "Friday", week: 16, weekTitle: "Grace and Freedom", movement: "From Knowing to Walking", passage: "Romans 6:1–23", focus: "Trace grace → identity → choice → obedience → outcome.", reflection: "How does grace change the way I understand obedience?", kind: "daily" },

  { date: "2026-11-14", weekday: "Saturday", week: 16, weekTitle: "Grace and Freedom", movement: "From Knowing to Walking", passage: "Romans 6:11–14", focus: "Turn the passage into prayer.", reflection: "What part of my life needs to be presented to God?", kind: "daily" },

  { date: "2026-11-15", weekday: "Sunday", week: 16, weekTitle: "Grace and Freedom", movement: "From Knowing to Walking", passage: "Romans 6 (review)", focus: "Review.", reflection: "What does freedom from sin actually look like in practice?", kind: "daily" },

  { date: "2026-11-16", weekday: "Monday", week: 17, weekTitle: "Flesh, Spirit and Life", movement: "From Knowing to Walking", passage: "Romans 7:1–6", focus: "Law, death and belonging to Christ.", reflection: "What changed about the believer's relationship to the Law?", kind: "daily" },

  { date: "2026-11-17", weekday: "Tuesday", week: 17, weekTitle: "Flesh, Spirit and Life", movement: "From Knowing to Walking", passage: "Romans 7:7–13", focus: "Law, sin and desire.", reflection: "Does God's command create sin, or expose it?", kind: "daily" },

  { date: "2026-11-18", weekday: "Wednesday", week: 17, weekTitle: "Flesh, Spirit and Life", movement: "From Knowing to Walking", passage: "Romans 7:14–25", focus: "Flesh, desire, conflict and inability.", reflection: "What exactly is Paul describing here?", kind: "daily" },

  { date: "2026-11-19", weekday: "Thursday", week: 17, weekTitle: "Flesh, Spirit and Life", movement: "From Knowing to Walking", passage: "Romans 8:1–11", focus: "Flesh versus Spirit; condemnation versus life.", reflection: "What does the Spirit actually change?", kind: "daily" },

  { date: "2026-11-20", weekday: "Friday", week: 17, weekTitle: "Flesh, Spirit and Life", movement: "From Knowing to Walking", passage: "Romans 8:12–17", focus: "Mortifying sin, adoption and sonship.", reflection: "How does knowing I belong to God affect how I deal with sin?", kind: "daily" },

  { date: "2026-11-21", weekday: "Saturday", week: 17, weekTitle: "Flesh, Spirit and Life", movement: "From Knowing to Walking", passage: "Romans 8:18–30", focus: "Suffering, hope, weakness and God's purpose.", reflection: "What does hope look like when life is still difficult?", kind: "daily" },

  { date: "2026-11-22", weekday: "Sunday", week: 17, weekTitle: "Flesh, Spirit and Life", movement: "From Knowing to Walking", passage: "Romans 8:31–39", focus: "Pray the chapter's final assurance.", reflection: "What does God's love mean for my perseverance?", kind: "daily" },

  { date: "2026-11-23", weekday: "Monday", week: 18, weekTitle: "Sovereignty, Mercy and Responsibility", movement: "From Knowing to Walking", passage: "Romans 9:1–5", focus: "Paul's grief for Israel.", reflection: "Why does theology begin here with Paul's grief rather than detached argument?", kind: "daily" },

  { date: "2026-11-24", weekday: "Tuesday", week: 18, weekTitle: "Sovereignty, Mercy and Responsibility", movement: "From Knowing to Walking", passage: "Romans 9:6–18", focus: "Promise, election, mercy and hardening.", reflection: "What exactly is Paul arguing?", kind: "daily" },

  { date: "2026-11-25", weekday: "Wednesday", week: 18, weekTitle: "Sovereignty, Mercy and Responsibility", movement: "From Knowing to Walking", passage: "Romans 9:19–29", focus: "Human objection and God's authority.", reflection: "What objection does Paul anticipate?", kind: "daily" },

  { date: "2026-11-26", weekday: "Thursday", week: 18, weekTitle: "Sovereignty, Mercy and Responsibility", movement: "From Knowing to Walking", passage: "Romans 9:30–33; 10:1–13", focus: "Israel's pursuit of righteousness, faith and human response.", reflection: "How does Paul's argument hold divine action and human response together?", kind: "daily" },

  { date: "2026-11-27", weekday: "Friday", week: 18, weekTitle: "Sovereignty, Mercy and Responsibility", movement: "From Knowing to Walking", passage: "Romans 10:14–21", focus: "Hearing, preaching, belief and rejection.", reflection: "What does human response contribute to Paul's argument?", kind: "daily" },

  { date: "2026-11-28", weekday: "Saturday", week: 18, weekTitle: "Sovereignty, Mercy and Responsibility", movement: "From Knowing to Walking", passage: "Romans 11:1–36", focus: "Mercy, Israel, Gentiles, warning, humility and God's wisdom.", reflection: "Why does Paul end this discussion in worship?", kind: "daily" },

  { date: "2026-11-29", weekday: "Sunday", week: 18, weekTitle: "Sovereignty, Mercy and Responsibility", movement: "From Knowing to Walking", passage: "Romans 9–11 (review)", focus: "No new interpretation — review the whole argument.", reflection: "What have I learned about God's sovereignty without ignoring human responsibility?", kind: "daily" },

  { date: "2026-11-30", weekday: "Monday", week: 19, weekTitle: "When Theology Becomes Life", movement: "From Knowing to Walking", passage: "Romans 12:1–2", focus: "Mercy, body, worship, mind and transformation.", reflection: "What does Paul mean by presenting my body as worship?", kind: "daily" },

  { date: "2026-12-01", weekday: "Tuesday", week: 19, weekTitle: "When Theology Becomes Life", movement: "From Knowing to Walking", passage: "Romans 12:3–8", focus: "Humility, gifts and the body.", reflection: "What does genuine humility look like?", kind: "daily" },

  { date: "2026-12-02", weekday: "Wednesday", week: 19, weekTitle: "When Theology Becomes Life", movement: "From Knowing to Walking", passage: "Romans 12:9–13", focus: "Love, devotion, service, patience and prayer.", reflection: "What would sincere love look like in my ordinary life?", kind: "daily" },

  { date: "2026-12-03", weekday: "Thursday", week: 19, weekTitle: "When Theology Becomes Life", movement: "From Knowing to Walking", passage: "Romans 12:14–18", focus: "Blessing enemies and pursuing peace.", reflection: "What does my response to difficult people reveal about my heart?", kind: "daily" },

  { date: "2026-12-04", weekday: "Friday", week: 19, weekTitle: "When Theology Becomes Life", movement: "From Knowing to Walking", passage: "Romans 12:19–21", focus: "Revenge, God's justice and overcoming evil with good.", reflection: "What does it mean to overcome evil rather than merely avoid doing evil?", kind: "daily" },

  { date: "2026-12-05", weekday: "Saturday", week: 19, weekTitle: "When Theology Becomes Life", movement: "From Knowing to Walking", passage: "Romans 12:1–21", focus: "Draw a line from Romans 1–11 into Romans 12.", reflection: "How does theology become conduct?", kind: "daily" },

  { date: "2026-12-06", weekday: "Sunday", week: 19, weekTitle: "When Theology Becomes Life", movement: "From Knowing to Walking", passage: "Romans 12 (review)", focus: "Review.", reflection: "What truth that I know needs to become a practice?", kind: "daily" },

  { date: "2026-12-07", weekday: "Monday", week: 20, weekTitle: "Hearing Without Doing", movement: "From Knowing to Walking", passage: "James 1:19–21", focus: "Hearing, anger, humility and receiving the Word.", reflection: "How do I respond when God's Word confronts me?", kind: "daily" },

  { date: "2026-12-08", weekday: "Tuesday", week: 20, weekTitle: "Hearing Without Doing", movement: "From Knowing to Walking", passage: "James 1:22–27", focus: "Hearing versus doing.", reflection: "What does James say happens when knowledge doesn't become obedience?", kind: "daily" },

  { date: "2026-12-09", weekday: "Wednesday", week: 20, weekTitle: "Hearing Without Doing", movement: "From Knowing to Walking", passage: "James 2:1–9", focus: "Partiality and love.", reflection: "What does the way I treat people reveal about my faith?", kind: "daily" },

  { date: "2026-12-10", weekday: "Thursday", week: 20, weekTitle: "Hearing Without Doing", movement: "From Knowing to Walking", passage: "James 2:10–13", focus: "Law, mercy and judgment.", reflection: "Why does James connect obedience with mercy?", kind: "daily" },

  { date: "2026-12-11", weekday: "Friday", week: 20, weekTitle: "Hearing Without Doing", movement: "From Knowing to Walking", passage: "James 2:14–20", focus: "Faith and works.", reflection: "What kind of “faith” does James reject?", kind: "daily" },

  { date: "2026-12-12", weekday: "Saturday", week: 20, weekTitle: "Hearing Without Doing", movement: "From Knowing to Walking", passage: "James 2:21–26", focus: "Abraham and Rahab as examples.", reflection: "How does genuine faith become visible?", kind: "daily" },

  { date: "2026-12-13", weekday: "Sunday", week: 20, weekTitle: "Hearing Without Doing", movement: "From Knowing to Walking", passage: "James 1:19–27; 2:14–26 (review)", focus: "Review.", reflection: "What would my faith look like if someone could only observe my actions?", kind: "daily" },

  { date: "2026-12-14", weekday: "Monday", week: 21, weekTitle: "The Life That Knows God", movement: "From Knowing to Walking", passage: "1 John 1:5–10", focus: "Light, darkness, sin and confession.", reflection: "What does walking in the light actually mean?", kind: "daily" },

  { date: "2026-12-15", weekday: "Tuesday", week: 21, weekTitle: "The Life That Knows God", movement: "From Knowing to Walking", passage: "1 John 2:1–6", focus: "Sin, advocacy, obedience and knowing Christ.", reflection: "What does John connect with truly knowing Christ?", kind: "daily" },

  { date: "2026-12-16", weekday: "Wednesday", week: 21, weekTitle: "The Life That Knows God", movement: "From Knowing to Walking", passage: "1 John 2:15–17", focus: "Love of the world and desire.", reflection: "What desires compete with love for God?", kind: "daily" },

  { date: "2026-12-17", weekday: "Thursday", week: 21, weekTitle: "The Life That Knows God", movement: "From Knowing to Walking", passage: "1 John 3:1–10", focus: "Identity, sin and the life of righteousness.", reflection: "How does John's teaching challenge casual attitudes toward sin?", kind: "daily" },

  { date: "2026-12-18", weekday: "Friday", week: 21, weekTitle: "The Life That Knows God", movement: "From Knowing to Walking", passage: "1 John 3:16–24", focus: "Love, action, conscience and confidence.", reflection: "What does love look like when it becomes action?", kind: "daily" },

  { date: "2026-12-19", weekday: "Saturday", week: 21, weekTitle: "The Life That Knows God", movement: "From Knowing to Walking", passage: "1 John 4:7–21", focus: "God's love and our love.", reflection: "What does receiving God's love require me to become toward others?", kind: "daily" },

  { date: "2026-12-20", weekday: "Sunday", week: 21, weekTitle: "The Life That Knows God", movement: "From Knowing to Walking", passage: "1 John 5:1–5", focus: "Review the letter's repeated themes.", reflection: "What does John describe as evidence that a person knows God?", kind: "daily" },

  { date: "2026-12-21", weekday: "Monday", week: 22, weekTitle: "Bringing the Pieces Together", movement: "From Knowing to Walking", passage: "Psalm 139:1–12", focus: "God's knowledge and presence.", reflection: "What does it mean to be completely known by God?", kind: "daily" },

  { date: "2026-12-22", weekday: "Tuesday", week: 22, weekTitle: "Bringing the Pieces Together", movement: "From Knowing to Walking", passage: "Psalm 139:13–18", focus: "God's knowledge of our formation.", reflection: "How should God's knowledge of me affect my relationship with Him?", kind: "daily" },

  { date: "2026-12-23", weekday: "Wednesday", week: 22, weekTitle: "Bringing the Pieces Together", movement: "From Knowing to Walking", passage: "Psalm 139:19–24", focus: "David's invitation for God to search him.", reflection: "Am I actually willing for God to expose what I don't see in myself?", kind: "daily" },

  { date: "2026-12-24", weekday: "Thursday", week: 22, weekTitle: "Bringing the Pieces Together", movement: "From Knowing to Walking", passage: "Luke 15:11–24", focus: "The younger son, repentance and the Father's response.", reflection: "What does returning to the Father actually look like?", kind: "daily" },

  { date: "2026-12-25", weekday: "Friday", week: 22, weekTitle: "Bringing the Pieces Together", movement: "From Knowing to Walking", passage: "Luke 15:25–32", focus: "The older brother and self-righteousness.", reflection: "Can someone be physically close to God's house while emotionally far from God's heart?", kind: "daily" },

  { date: "2026-12-26", weekday: "Saturday", week: 22, weekTitle: "Bringing the Pieces Together", movement: "From Knowing to Walking", passage: "Luke 15:11–32", focus: "Compare both sons.", reflection: "Which kind of lostness is easier for me to recognize, and which is harder?", kind: "daily" },

  { date: "2026-12-27", weekday: "Sunday", week: 22, weekTitle: "Bringing the Pieces Together", movement: "From Knowing to Walking", passage: "Psalm 139; Luke 15 (review)", focus: "Review the entire five-month study.", reflection: "What has God repeatedly brought to my attention?", kind: "daily" },

  {
    date: "2026-12-28", weekday: "Monday", week: 22, weekTitle: "Bringing the Pieces Together", movement: "From Knowing to Walking",
    passage: "Exodus 34:6–7; Psalm 103:1–14; Romans 11:33–36; 1 John 4:7–21",
    focus: "What Have I Learned About God?", kind: "retreat",
    retreatQuestions: [
      "How has my understanding of God's character changed?",
      "What have I learned about God's holiness?",
      "What have I learned about His mercy?",
      "What have I learned about His faithfulness?",
      "What have I learned about His justice?",
      "What have I learned about His patience?",
      "What do I still misunderstand about God?"
    ],
    prayerPrompt: "Father, let what I know about You become what I trust about You."
  },

  {
    date: "2026-12-29", weekday: "Tuesday", week: 22, weekTitle: "Bringing the Pieces Together", movement: "From Knowing to Walking",
    passage: "Genesis 3:1–13; Genesis 4:1–7; Jeremiah 17:5–10; Psalm 51:1–12; Romans 7:14–25",
    focus: "What Have I Learned About Myself?", kind: "retreat",
    retreatQuestions: [
      "What have I learned about my heart?",
      "What patterns of desire have I noticed?",
      "Where do I tend to rationalize, and where do I resist correction?",
      "What do I know but fail to practice?",
      "What kind of person am I becoming?",
      "What needs to change?"
    ],
    prayerPrompt: "Search me, O God, and know my heart…"
  },

  {
    date: "2026-12-30", weekday: "Wednesday", week: 22, weekTitle: "Bringing the Pieces Together", movement: "From Knowing to Walking",
    passage: "Matthew 7:24–27; Romans 12:1–21; James 1:22–27; 1 John 2:1–6",
    focus: "What Does God Want Me to Do With What I Know?", kind: "retreat",
    retreatQuestions: [
      "What truths have become especially clear?",
      "Which truths have I actually practiced, and which remain mostly intellectual?",
      "What habits or relationships need attention?",
      "What desires need to be brought under God's rule?",
      "What one practice should I carry into 2027?"
    ],
    prayerPrompt: "Because I believe ________, I will ________. (Give yourself three concrete commitments, not twenty.)"
  },

  {
    date: "2026-12-31", weekday: "Thursday", week: 22, weekTitle: "Bringing the Pieces Together", movement: "From Knowing to Walking",
    passage: "Psalm 119:9–16; Psalm 119:33–40; Psalm 119:97–112; Psalm 119:129–136",
    focus: "The Covenant of the Heart", kind: "retreat",
    retreatQuestions: [
      "What did I learn about God? About myself?",
      "What did Scripture repeatedly confront in me — and repeatedly encourage in me?",
      "What changed? What didn't change?",
      "What am I still struggling to understand — and still struggling to obey?",
      "What am I grateful for?",
      "What do I want the next season of my walk with God to look like?"
    ],
    prayerPrompt: "Lord, I do not want to merely know Your Word. I want…"
  },

];


export const journalFields = [

  { key: "observation", label: "What does the text say?", help: "Pure observation." },

  { key: "meaning", label: "What does the text mean?", help: "Context, structure, language, interpretation." },

  { key: "god", label: "What does this reveal about God?" },

  { key: "humanity", label: "What does this reveal about humanity?" },

  { key: "sinAndDesire", label: "What does this reveal about sin and desire?" },

  { key: "grace", label: "What does this reveal about grace, mercy or God's faithfulness?" },

  { key: "obedience", label: "What does this reveal about obedience?" },

  { key: "me", label: "What does this reveal about me?" },

  { key: "resistance", label: "What am I tempted to resist?" },

  { key: "believe", label: "What must I believe?" },

  { key: "do", label: "What must I do?" },

  { key: "prayer", label: "Prayer." },

  { key: "remember", label: "One sentence to remember.", help: "Reduce the day's lesson to one sentence you can carry through the day." },

] as const;


export const studyChecklist = [

  { section: "beforeReading", items: [

    "I put away distractions.",

    "I prayed before studying.",

    "I am approaching Scripture to listen, not merely to collect information.",

    "I read the passage without immediately consulting outside material.",

  ]},

  { section: "observation", items: [

    "I read the passage at least twice.",

    "I identified the main subject.",

    "I identified the people involved.",

    "I noticed repeated words or ideas.",

    "I noticed commands, promises, warnings, contrasts, and cause-and-effect statements.",

    "I identified anything I don't understand.",

  ]},

  { section: "context", items: [

    "What comes before this passage? What comes after?",

    "Who is speaking, and who is being addressed?",

    "What problem or situation is being addressed, and why does this passage occur here?",

    "What is the author's main point?",

  ]},

  { section: "study", items: [

    "I identified the key words and checked important Hebrew/Greek terms where necessary.",

    "I examined the grammar where it affects meaning.",

    "I looked at relevant cross-references and compared translations where useful.",

    "I distinguished what the text actually says from what I assume it says.",

    "I wrote down questions instead of pretending I understand everything.",

  ]},

  { section: "theology", items: [

    "What does this reveal about God? About humanity? About sin?",

    "What does this reveal about God's grace, mercy or justice?",

    "What does this reveal about faith and obedience?",

  ]},

  { section: "personalReflection", items: [

    "What does this expose in me? What attitude or desire does it challenge?",

    "What am I tempted to resist here?",

    "What do I already know but fail to practice?",

    "What would obedience look like in my actual life?",

  ]},

  { section: "end", items: [

    "I wrote one sentence beginning: “Today I believe God is showing me…”",

    "I wrote one concrete response, and prayed about it.",

    "I recorded unresolved questions for later study.",

  ]},

] as const;


export const reflectionQuestions = [

  { section: "God", questions: [

    "What does this teach me about God?",

    "What aspect of God's character is visible here?",

    "What does God love? What does God hate?",

    "What does God require?",

    "What does God patiently endure?",

    "What does God refuse to compromise?",

  ]},

  { section: "The Human Heart", questions: [

    "What does this reveal about human desire, and about the heart?",

    "What does the person in this passage want, and what are they afraid of?",

    "What are they willing to do to get what they want?",

    "What happens when desire conflicts with God's command?",

  ]},

  { section: "Me", questions: [

    "Where do I see myself in this passage? What makes me uncomfortable?",

    "What truth do I already know but don't consistently live?",

    "Is there something I need to confess, or surrender?",

    "Is there someone I need to forgive, or an attitude I need to change?",

  ]},

  { section: "Response", questions: [

    "What should I believe?",

    "What should I reject?",

    "What should I begin?",

    "What should I stop?",

    "What should I practice this week?",

  ]},

] as const;


export const notebookSections = [
  { key: "text", title: "Text", description: "Your actual Bible study." },
  { key: "god", title: "God", description: "Everything you're learning about God's character." },
  { key: "heart", title: "Heart", description: "Everything Scripture exposes about human desire, sin, obedience and transformation." },
  { key: "me", title: "Me", description: "Your prayers, convictions, decisions, struggles and responses." },
] as const;

export const knowThisButPrompt = {
  title: "I Know This, But…",
  instruction: "I know this intellectually, but what would it mean for me to actually live it?",
  examples: [
    ["God is faithful.", "What does that change about how I respond when I'm afraid?"],
    ["Forgiveness is commanded.", "Who am I still mentally prosecuting?"],
    ["God looks at the heart.", "What does He see in mine?"],
    ["The flesh wars against the Spirit.", "What desire am I feeding?"],
    ["I am saved by grace.", "Does grace make me more grateful and obedient, or more casual about sin?"],
  ],
} as const;

export const studyNotebookInstruction =
  "Divide the notebook into four sections. Eventually you should be able to look backward and see what you believed in July, what Scripture confronted in August, what began to change in September, and where you are in December.";

export const studySystemSummary =
  "Text → Understanding → Truth → Heart → Prayer → Obedience.";

export function getStudyByDate(date: string) {
  return studies.find((study) => study.date === date);
}

export function getStudiesByWeek(week: number) {
  return studies.filter((study) => study.week === week);
}

export function getPreviousStudy(date: string) {
  const index = studies.findIndex((study) => study.date === date);
  return index > 0 ? studies[index - 1] : undefined;
}

export function getNextStudy(date: string) {
  const index = studies.findIndex((study) => study.date === date);
  return index >= 0 && index < studies.length - 1 ? studies[index + 1] : undefined;
}
