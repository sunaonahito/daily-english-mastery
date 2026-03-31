import { useState, useEffect, useCallback, useRef, useMemo } from "react";

// ─── DATA: 14-day curriculum ───────────────────────────────────────────
const CURRICULUM = [
  {
    day: 1, title: "Greetings & First Impressions", titleJa: "あいさつ＆第一印象", icon: "👋",
    words: [
      { en: "greeting", ja: "あいさつ", ex: "A warm greeting goes a long way." },
      { en: "introduce", ja: "紹介する", ex: "Let me introduce myself." },
      { en: "pleasure", ja: "喜び", ex: "It's a pleasure to meet you." },
      { en: "acquaintance", ja: "知人", ex: "She's an old acquaintance of mine." },
      { en: "casual", ja: "カジュアルな", ex: "It was a casual conversation." },
    ],
    phrases: [
      { en: "Hi, how's it going?", ja: "やあ、調子はどう？" },
      { en: "Nice to meet you.", ja: "はじめまして。" },
      { en: "Long time no see!", ja: "久しぶり！" },
      { en: "What do you do for a living?", ja: "お仕事は何をされてますか？" },
      { en: "I'm originally from…", ja: "出身は〜です。" },
    ],
    chunks: [
      { en: "How have you been?", ja: "最近どうしてた？", note: "久しぶりの相手に" },
      { en: "It's been a while.", ja: "しばらくぶりだね。", note: "再会時に" },
      { en: "I've heard a lot about you.", ja: "お噂はかねがね。", note: "紹介された時に" },
    ],
  },
  {
    day: 2, title: "Daily Routines & Small Talk", titleJa: "日常ルーティン＆雑談", icon: "☀️",
    words: [
      { en: "routine", ja: "日課", ex: "My morning routine starts at 6." },
      { en: "commute", ja: "通勤する", ex: "I commute by train." },
      { en: "groceries", ja: "食料品", ex: "I need to pick up some groceries." },
      { en: "errands", ja: "用事", ex: "I have some errands to run." },
      { en: "schedule", ja: "予定", ex: "My schedule is packed today." },
    ],
    phrases: [
      { en: "What's your plan for today?", ja: "今日の予定は？" },
      { en: "I usually wake up around 7.", ja: "だいたい7時に起きます。" },
      { en: "I'm running late.", ja: "遅れそう。" },
      { en: "I'm off today.", ja: "今日は休みです。" },
      { en: "Let me check my schedule.", ja: "予定を確認させて。" },
    ],
    chunks: [
      { en: "I'm kind of busy.", ja: "ちょっと忙しいんだ。", note: "柔らかく断る時" },
      { en: "What are you up to?", ja: "何してるの？", note: "カジュアルに聞く" },
      { en: "Same as usual.", ja: "いつもと同じだよ。", note: "日常の返答" },
    ],
  },
  {
    day: 3, title: "Feelings & Emotions", titleJa: "気持ち＆感情表現", icon: "😊",
    words: [
      { en: "excited", ja: "ワクワクする", ex: "I'm so excited about the trip!" },
      { en: "frustrated", ja: "イライラする", ex: "I'm frustrated with the traffic." },
      { en: "relieved", ja: "安心した", ex: "I'm relieved it worked out." },
      { en: "exhausted", ja: "疲れ果てた", ex: "I'm exhausted after the hike." },
      { en: "grateful", ja: "感謝している", ex: "I'm grateful for your help." },
    ],
    phrases: [
      { en: "I'm so happy to hear that!", ja: "それを聞いて嬉しい！" },
      { en: "That makes me nervous.", ja: "それ緊張するなぁ。" },
      { en: "I couldn't be happier.", ja: "最高に幸せ。" },
      { en: "I'm a bit under the weather.", ja: "ちょっと体調が悪い。" },
      { en: "No worries at all.", ja: "全然心配ないよ。" },
    ],
    chunks: [
      { en: "I can't complain.", ja: "悪くないよ。", note: "まあまあの時" },
      { en: "I'm fed up with…", ja: "〜にうんざりだ。", note: "不満を表す" },
      { en: "That's a relief.", ja: "ほっとした。", note: "安心した時" },
    ],
  },
  {
    day: 4, title: "Opinions & Agreement", titleJa: "意見＆同意・反対", icon: "💬",
    words: [
      { en: "opinion", ja: "意見", ex: "What's your opinion on this?" },
      { en: "perspective", ja: "視点", ex: "I see it from a different perspective." },
      { en: "agree", ja: "同意する", ex: "I totally agree with you." },
      { en: "disagree", ja: "反対する", ex: "I respectfully disagree." },
      { en: "consider", ja: "考慮する", ex: "Let me consider it." },
    ],
    phrases: [
      { en: "I think so too.", ja: "私もそう思う。" },
      { en: "That's a good point.", ja: "いいポイントだね。" },
      { en: "I see what you mean.", ja: "言いたいことはわかるよ。" },
      { en: "I'm not so sure about that.", ja: "それはどうかな。" },
      { en: "It depends on the situation.", ja: "状況によるね。" },
    ],
    chunks: [
      { en: "I couldn't agree more.", ja: "大賛成だよ。", note: "強い同意" },
      { en: "That's not necessarily true.", ja: "必ずしもそうとは限らないよ。", note: "やんわり反対" },
      { en: "You have a point.", ja: "一理あるね。", note: "部分的に同意" },
    ],
  },
  {
    day: 5, title: "Requests & Offers", titleJa: "お願い＆提案", icon: "🤝",
    words: [
      { en: "favor", ja: "お願い", ex: "Can I ask you a favor?" },
      { en: "appreciate", ja: "感謝する", ex: "I really appreciate it." },
      { en: "bother", ja: "迷惑をかける", ex: "Sorry to bother you." },
      { en: "willing", ja: "喜んで〜する", ex: "I'm willing to help." },
      { en: "hesitate", ja: "ためらう", ex: "Don't hesitate to ask." },
    ],
    phrases: [
      { en: "Could you do me a favor?", ja: "お願いがあるんだけど。" },
      { en: "Would you mind helping me?", ja: "手伝ってもらえませんか？" },
      { en: "Let me give you a hand.", ja: "手伝うよ。" },
      { en: "I'd be happy to help.", ja: "喜んでお手伝いします。" },
      { en: "That would be great.", ja: "それは助かります。" },
    ],
    chunks: [
      { en: "Do you want me to…?", ja: "〜しましょうか？", note: "申し出る時" },
      { en: "I owe you one.", ja: "恩に着るよ。", note: "感謝を伝える" },
      { en: "No problem at all.", ja: "全然問題ないよ。", note: "快く引き受ける" },
    ],
  },
  {
    day: 6, title: "Food & Dining", titleJa: "食事＆レストラン", icon: "🍽️",
    words: [
      { en: "appetizer", ja: "前菜", ex: "We shared an appetizer." },
      { en: "ingredient", ja: "材料", ex: "What are the main ingredients?" },
      { en: "reservation", ja: "予約", ex: "I'd like to make a reservation." },
      { en: "portion", ja: "量", ex: "The portions are huge!" },
      { en: "starving", ja: "お腹ペコペコ", ex: "I'm starving. Let's eat!" },
    ],
    phrases: [
      { en: "Are you ready to order?", ja: "ご注文はお決まりですか？" },
      { en: "I'll have the same.", ja: "同じものをください。" },
      { en: "Could I get the check?", ja: "お会計をお願いします。" },
      { en: "This is on me.", ja: "ここは私がおごるよ。" },
      { en: "Let's split the bill.", ja: "割り勘にしよう。" },
    ],
    chunks: [
      { en: "I'm in the mood for…", ja: "〜が食べたい気分。", note: "食べたいものを言う" },
      { en: "It looks delicious!", ja: "おいしそう！", note: "料理を見た時" },
      { en: "I'm a picky eater.", ja: "好き嫌いが多いんです。", note: "食の好みを伝える" },
    ],
  },
  {
    day: 7, title: "Week 1 Review & Shopping", titleJa: "第1週復習＆買い物", icon: "🛍️",
    words: [
      { en: "bargain", ja: "お買い得", ex: "This coat was a real bargain." },
      { en: "receipt", ja: "レシート", ex: "Could I have the receipt?" },
      { en: "refund", ja: "返金", ex: "I'd like to request a refund." },
      { en: "browse", ja: "見て回る", ex: "I'm just browsing, thanks." },
      { en: "afford", ja: "余裕がある", ex: "I can't afford it right now." },
    ],
    phrases: [
      { en: "I'm just looking, thanks.", ja: "見ているだけです。" },
      { en: "Do you have this in a smaller size?", ja: "もっと小さいサイズはありますか？" },
      { en: "Can I try this on?", ja: "試着してもいいですか？" },
      { en: "Is there a discount?", ja: "割引はありますか？" },
      { en: "I'll take it.", ja: "これをください。" },
    ],
    chunks: [
      { en: "It's a rip-off.", ja: "ぼったくりだ。", note: "高すぎる時" },
      { en: "It's worth every penny.", ja: "お値段以上だよ。", note: "価値がある時" },
      { en: "I'm window shopping.", ja: "ウィンドウショッピング中。", note: "買う気はない時" },
    ],
  },
  {
    day: 8, title: "Directions & Getting Around", titleJa: "道案内＆移動", icon: "🗺️",
    words: [
      { en: "intersection", ja: "交差点", ex: "Turn left at the intersection." },
      { en: "landmark", ja: "目印", ex: "The tower is a famous landmark." },
      { en: "shortcut", ja: "近道", ex: "I know a shortcut." },
      { en: "destination", ja: "目的地", ex: "We arrived at our destination." },
      { en: "pedestrian", ja: "歩行者", ex: "Watch out for pedestrians." },
    ],
    phrases: [
      { en: "Excuse me, how do I get to…?", ja: "すみません、〜への行き方は？" },
      { en: "It's about a 10-minute walk.", ja: "歩いて約10分です。" },
      { en: "You can't miss it.", ja: "すぐわかりますよ。" },
      { en: "Is it within walking distance?", ja: "歩いて行ける距離ですか？" },
      { en: "Take the second right.", ja: "2つ目を右に曲がってください。" },
    ],
    chunks: [
      { en: "I'm lost.", ja: "道に迷いました。", note: "迷った時" },
      { en: "It's just around the corner.", ja: "すぐそこの角だよ。", note: "近い場所を示す" },
      { en: "Could you show me on the map?", ja: "地図で教えてくれますか？", note: "地図を見せてもらう" },
    ],
  },
  {
    day: 9, title: "Plans & Invitations", titleJa: "予定＆誘い方", icon: "📅",
    words: [
      { en: "available", ja: "空いている", ex: "Are you available this weekend?" },
      { en: "cancel", ja: "キャンセルする", ex: "I have to cancel our plans." },
      { en: "postpone", ja: "延期する", ex: "Let's postpone it to next week." },
      { en: "occasion", ja: "機会", ex: "It's a special occasion." },
      { en: "gathering", ja: "集まり", ex: "We're having a small gathering." },
    ],
    phrases: [
      { en: "Are you free this Saturday?", ja: "今週の土曜空いてる？" },
      { en: "Do you feel like going out?", ja: "お出かけする気分？" },
      { en: "I'm down for that!", ja: "それいいね！乗った！" },
      { en: "Maybe next time.", ja: "また今度ね。" },
      { en: "Something came up.", ja: "用事ができちゃった。" },
    ],
    chunks: [
      { en: "Let's play it by ear.", ja: "臨機応変にいこう。", note: "決めずに様子見" },
      { en: "I'll take a rain check.", ja: "またの機会に。", note: "丁寧に断る" },
      { en: "Count me in!", ja: "仲間に入れて！", note: "参加したい時" },
    ],
  },
  {
    day: 10, title: "Health & Wellness", titleJa: "健康＆体調", icon: "🏥",
    words: [
      { en: "symptom", ja: "症状", ex: "What are your symptoms?" },
      { en: "prescription", ja: "処方箋", ex: "Here's your prescription." },
      { en: "allergy", ja: "アレルギー", ex: "I have a nut allergy." },
      { en: "recover", ja: "回復する", ex: "She's recovering well." },
      { en: "appointment", ja: "予約", ex: "I have a doctor's appointment." },
    ],
    phrases: [
      { en: "I don't feel well.", ja: "気分が悪いです。" },
      { en: "I think I'm coming down with something.", ja: "何かにかかりそう。" },
      { en: "Get well soon.", ja: "お大事に。" },
      { en: "You should see a doctor.", ja: "医者に行った方がいいよ。" },
      { en: "Take care of yourself.", ja: "お体に気をつけて。" },
    ],
    chunks: [
      { en: "I've been feeling under the weather.", ja: "ちょっと体調崩してて。", note: "体調不良の婉曲表現" },
      { en: "I have a runny nose.", ja: "鼻水が出る。", note: "風邪の症状" },
      { en: "I'm on the mend.", ja: "快方に向かってます。", note: "回復中を伝える" },
    ],
  },
  {
    day: 11, title: "Work & Career", titleJa: "仕事＆キャリア", icon: "💼",
    words: [
      { en: "deadline", ja: "締め切り", ex: "The deadline is next Friday." },
      { en: "colleague", ja: "同僚", ex: "My colleague helped me out." },
      { en: "promote", ja: "昇進させる", ex: "She was promoted to manager." },
      { en: "resign", ja: "辞職する", ex: "He decided to resign." },
      { en: "overtime", ja: "残業", ex: "I've been doing a lot of overtime." },
    ],
    phrases: [
      { en: "I'm swamped with work.", ja: "仕事で手一杯です。" },
      { en: "Let's call it a day.", ja: "今日はここまでにしよう。" },
      { en: "I'll get back to you on that.", ja: "それについて後で連絡します。" },
      { en: "Keep up the good work.", ja: "その調子で頑張って。" },
      { en: "I'm looking for a new job.", ja: "転職を探しています。" },
    ],
    chunks: [
      { en: "I'm tied up right now.", ja: "今手が離せないんだ。", note: "忙しい時" },
      { en: "It's not my cup of tea.", ja: "私の得意分野じゃないな。", note: "向いてない時" },
      { en: "I'll keep you posted.", ja: "進捗をお知らせします。", note: "報告を約束する" },
    ],
  },
  {
    day: 12, title: "Hobbies & Interests", titleJa: "趣味＆興味", icon: "🎨",
    words: [
      { en: "passionate", ja: "情熱的な", ex: "She's passionate about art." },
      { en: "leisure", ja: "余暇", ex: "What do you do in your leisure time?" },
      { en: "addicted", ja: "ハマっている", ex: "I'm addicted to this game." },
      { en: "binge-watch", ja: "一気見する", ex: "I binge-watched the whole series." },
      { en: "enthusiast", ja: "愛好家", ex: "He's a coffee enthusiast." },
    ],
    phrases: [
      { en: "What do you do for fun?", ja: "趣味は何？" },
      { en: "I'm really into photography.", ja: "写真にハマっています。" },
      { en: "I picked it up last year.", ja: "去年始めたんです。" },
      { en: "I can't put it down!", ja: "やめられない！" },
      { en: "We should do that together sometime.", ja: "今度一緒にやろうよ。" },
    ],
    chunks: [
      { en: "I'm hooked on…", ja: "〜にハマっている。", note: "夢中なものを言う" },
      { en: "It's right up my alley.", ja: "まさに私好み。", note: "興味がピッタリ" },
      { en: "I've always wanted to try…", ja: "ずっと〜してみたかった。", note: "願望を伝える" },
    ],
  },
  {
    day: 13, title: "Travel & Experiences", titleJa: "旅行＆経験", icon: "✈️",
    words: [
      { en: "itinerary", ja: "旅程", ex: "Here's our travel itinerary." },
      { en: "souvenir", ja: "お土産", ex: "I bought some souvenirs." },
      { en: "breathtaking", ja: "息をのむ", ex: "The view was breathtaking." },
      { en: "accommodation", ja: "宿泊施設", ex: "We booked the accommodation online." },
      { en: "jet lag", ja: "時差ボケ", ex: "I'm still dealing with jet lag." },
    ],
    phrases: [
      { en: "Have you ever been to…?", ja: "〜に行ったことある？" },
      { en: "It was an amazing experience.", ja: "素晴らしい経験だった。" },
      { en: "I'd love to go there someday.", ja: "いつか行ってみたい。" },
      { en: "It's a must-see!", ja: "絶対見るべき！" },
      { en: "I highly recommend it.", ja: "超おすすめだよ。" },
    ],
    chunks: [
      { en: "I'm dying to go to…", ja: "〜に行きたくてたまらない。", note: "強い願望" },
      { en: "It blew my mind.", ja: "衝撃的だった。", note: "すごい経験の時" },
      { en: "It was a once-in-a-lifetime experience.", ja: "一生に一度の経験だった。", note: "特別な体験" },
    ],
  },
  {
    day: 14, title: "Final Review & Advanced Phrases", titleJa: "総復習＆上級フレーズ", icon: "🏆",
    words: [
      { en: "fluent", ja: "流暢な", ex: "She's fluent in three languages." },
      { en: "confidence", ja: "自信", ex: "Speak with confidence." },
      { en: "accomplish", ja: "達成する", ex: "I accomplished my goal!" },
      { en: "progress", ja: "進歩", ex: "You've made great progress." },
      { en: "persevere", ja: "やり抜く", ex: "If you persevere, you'll succeed." },
    ],
    phrases: [
      { en: "I've come a long way.", ja: "ずいぶん成長した。" },
      { en: "Practice makes perfect.", ja: "練習は裏切らない。" },
      { en: "Don't be afraid to make mistakes.", ja: "間違いを恐れないで。" },
      { en: "Every little bit helps.", ja: "少しずつでも役に立つ。" },
      { en: "Keep it up!", ja: "その調子！" },
    ],
    chunks: [
      { en: "I'm getting the hang of it.", ja: "コツをつかんできた。", note: "上達を感じた時" },
      { en: "It's on the tip of my tongue.", ja: "のどまで出かかってるんだけど。", note: "思い出せない時" },
      { en: "Let's wrap it up.", ja: "そろそろまとめよう。", note: "終了する時" },
    ],
  },
];

// ─── Utilities ──────────────────────────────────────────────────────────
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// ─── Speech synthesis ───────────────────────────────────────────────────
const speak = (text, lang = "en-US", rate = 0.85) => {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = rate;
  u.pitch = 1;
  const voices = window.speechSynthesis.getVoices();
  const match = voices.find(v => v.lang.startsWith(lang.slice(0, 2)) && (v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Daniel") || v.name.includes("Karen")));
  if (match) u.voice = match;
  window.speechSynthesis.speak(u);
};
const speakEn = (text, rate) => speak(text, "en-US", rate || 0.85);
const speakJa = (text) => speak(text, "ja-JP", 1);

// ─── Design tokens ──────────────────────────────────────────────────────
const fonts = `'DM Sans', 'Noto Sans JP', sans-serif`;
const mono = `'JetBrains Mono', monospace`;
const fontLink = "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700;0,9..40,800;1,9..40,400&family=Noto+Sans+JP:wght@300;400;600;800&family=JetBrains+Mono:wght@400;700&display=swap";

const C = {
  bg: "#060a12", bg2: "#0b1121", surface: "#0e1628", surfaceHover: "#131f3a",
  border: "rgba(100,160,255,0.07)", borderActive: "rgba(100,160,255,0.22)",
  text: "#b8c8e2", textDim: "#4e6082", textBright: "#e4edf8",
  accent: "#5b8def", accentSoft: "rgba(91,141,239,0.1)", accentGlow: "rgba(91,141,239,0.2)",
  green: "#3dcc7a", greenSoft: "rgba(61,204,122,0.1)",
  red: "#e85858", redSoft: "rgba(232,88,88,0.1)",
  amber: "#e8a838", amberSoft: "rgba(232,168,56,0.1)",
  cyan: "#32bcd8", cyanSoft: "rgba(50,188,216,0.08)",
};
const base = { fontFamily: fonts, color: C.text, WebkitFontSmoothing: "antialiased", lineHeight: 1.55 };

// ─── Speaker Button ─────────────────────────────────────────────────────
function SpeakerBtn({ text, lang = "en", size = 18, style: sx = {} }) {
  const [on, setOn] = useState(false);
  return (
    <button onClick={e => { e.stopPropagation(); setOn(true); lang === "en" ? speakEn(text) : speakJa(text); setTimeout(() => setOn(false), 1100); }}
      style={{ background: on ? C.accentSoft : "transparent", border: "none", borderRadius: 8, width: size + 12, height: size + 12, display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s", flexShrink: 0, ...sx }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={on ? C.accent : C.textDim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill={on ? C.accent : "none"} />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" opacity={0.35} />
      </svg>
    </button>
  );
}

// ─── Main App ───────────────────────────────────────────────────────────
const initProgress = { completed: {}, scores: {}, totalReviews: 0, mistakes: {} };

export default function App() {
  const [view, setView] = useState("home");
  const [selectedDay, setSelectedDay] = useState(0);
  const [learnTab, setLearnTab] = useState("words");
  const [learnMode, setLearnMode] = useState("cards");
  const [quizItems, setQuizItems] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizMode, setQuizMode] = useState("visual");
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [streak, setStreak] = useState(0);
  const [progress, setProgress] = useState(initProgress);
  const [showFlip, setShowFlip] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [autoPlayIdx, setAutoPlayIdx] = useState(-1);
  const [autoPlaying, setAutoPlaying] = useState(false);
  const timerRef = useRef(null);
  const autoRef = useRef(null);

  useEffect(() => {
    (async () => { try { const r = await window.storage.get("eng14_prog"); if (r?.value) setProgress(JSON.parse(r.value)); } catch {} })();
  }, []);
  useEffect(() => { (async () => { try { await window.storage.set("eng14_prog", JSON.stringify(progress)); } catch {} })(); }, [progress]);
  useEffect(() => { if (window.speechSynthesis) { window.speechSynthesis.getVoices(); window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices(); } }, []);

  const dayData = CURRICULUM[selectedDay];
  const getItems = (tab) => tab === "words" ? dayData.words : tab === "phrases" ? dayData.phrases : dayData.chunks;

  // Quiz
  const startQuiz = (mode = "visual") => {
    const d = CURRICULUM[selectedDay];
    const all = [
      ...d.words.map(w => ({ type: "word", q: w.ja, a: w.en, ex: w.ex })),
      ...d.phrases.map(p => ({ type: "phrase", q: p.ja, a: p.en })),
      ...d.chunks.map(c => ({ type: "chunk", q: c.ja, a: c.en, note: c.note })),
    ];
    const enAll = all.map(i => i.a);
    const withOpts = all.map(item => {
      const wrong = shuffle(enAll.filter(e => e !== item.a)).slice(0, 3);
      return { ...item, options: shuffle([item.a, ...wrong]) };
    });
    setQuizItems(shuffle(withOpts)); setQuizIndex(0); setScore(0); setAnswered(null); setStreak(0); setQuizMode(mode); setView("quiz");
  };

  const handleAnswer = (opt) => {
    if (answered !== null) return;
    const correct = opt === quizItems[quizIndex].a;
    setAnswered(opt);
    if (correct) { setScore(s => s + 1); setStreak(s => s + 1); speakEn(opt, 0.9); }
    else {
      setStreak(0);
      setProgress(prev => { const k = `${selectedDay}_${quizItems[quizIndex].a}`; return { ...prev, mistakes: { ...prev.mistakes, [k]: (prev.mistakes[k] || 0) + 1 } }; });
    }
    timerRef.current = setTimeout(() => {
      if (quizIndex < quizItems.length - 1) {
        setQuizIndex(i => i + 1); setAnswered(null);
        if (quizMode === "listening") setTimeout(() => speakEn(quizItems[quizIndex + 1]?.a, 0.8), 300);
      } else {
        const fs = correct ? score + 1 : score;
        const pct = Math.round((fs / quizItems.length) * 100);
        setProgress(prev => ({
          ...prev, completed: { ...prev.completed, [selectedDay]: true },
          scores: { ...prev.scores, [selectedDay]: Math.max(prev.scores[selectedDay] || 0, pct) },
          totalReviews: prev.totalReviews + 1,
        }));
        setView("result");
      }
    }, 1000);
  };

  useEffect(() => () => { clearTimeout(timerRef.current); clearTimeout(autoRef.current); }, []);

  // Auto-play
  const stopAutoPlay = () => { setAutoPlaying(false); setAutoPlayIdx(-1); clearTimeout(autoRef.current); window.speechSynthesis?.cancel(); };
  const startAutoPlay = () => { const items = getItems(learnTab); setAutoPlaying(true); setAutoPlayIdx(0); playSeq(items, 0); };
  const playSeq = (items, idx) => {
    if (idx >= items.length) { stopAutoPlay(); return; }
    setAutoPlayIdx(idx); speakEn(items[idx].en, 0.8);
    autoRef.current = setTimeout(() => { speakJa(items[idx].ja); autoRef.current = setTimeout(() => playSeq(items, idx + 1), 2200); }, 2000);
  };

  const completedCount = Object.keys(progress.completed).length;
  const overallPct = Math.round((completedCount / 14) * 100);

  // ────────────────────────────────────────────────────────────────────
  // RENDER: HOME
  // ────────────────────────────────────────────────────────────────────
  const renderHome = () => (
    <div style={{ ...base, minHeight: "100vh", background: C.bg }}>
      <link href={fontLink} rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}
        @keyframes fu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .dc{transition:all .2s ease}.dc:hover{transform:translateY(-2px);border-color:${C.borderActive}!important;box-shadow:0 6px 24px ${C.accentGlow}}
      `}</style>
      <div style={{ position: "fixed", top: -100, right: -100, width: 360, height: 360, background: `radial-gradient(circle,${C.accentGlow} 0%,transparent 60%)`, pointerEvents: "none", opacity: 0.4 }} />

      {/* Header */}
      <div style={{ padding: "32px 20px 20px", textAlign: "center", animation: "fu .45s ease" }}>
        <div style={{ fontSize: 10, letterSpacing: 5, color: C.accent, fontWeight: 700, fontFamily: mono, marginBottom: 8, opacity: 0.7 }}>14-DAY ENGLISH MASTERY</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: C.textBright, marginBottom: 4 }}>日常英会話マスター</h1>
        <p style={{ fontSize: 12, color: C.textDim, fontWeight: 300 }}>聞いて・覚えて・使える英語を2週間で</p>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 20px 20px", animation: "fu .45s ease .08s both" }}>
        <div style={{ position: "relative", width: 58, height: 58, flexShrink: 0 }}>
          <svg width="58" height="58" viewBox="0 0 58 58">
            <circle cx="29" cy="29" r="24" fill="none" stroke={C.surface} strokeWidth="3.5" />
            <circle cx="29" cy="29" r="24" fill="none" stroke={C.accent} strokeWidth="3.5" strokeLinecap="round"
              strokeDasharray={`${overallPct * 1.508} 151`} transform="rotate(-90 29 29)"
              style={{ transition: "stroke-dasharray .6s", filter: `drop-shadow(0 0 3px ${C.accentGlow})` }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 800, fontFamily: mono, color: C.textBright }}>{overallPct}%</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, flex: 1 }}>
          {[[completedCount, "/14日"], [progress.totalReviews, "回テスト"], [14 * 13, "項目収録"]].map(([n, l], i) => (
            <div key={i} style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 800, fontFamily: mono, color: C.textBright }}>{n}</div>
              <div style={{ fontSize: 9, color: C.textDim }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Day grid */}
      <div style={{ padding: "0 14px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
          {CURRICULUM.map((day, i) => {
            const done = progress.completed[i]; const sc = progress.scores[i];
            return (
              <button className="dc" key={i} onClick={() => { setSelectedDay(i); setView("day"); setLearnTab("words"); setCardIndex(0); setShowFlip(false); setLearnMode("cards"); }}
                style={{ background: done ? C.accentSoft : C.surface, border: `1px solid ${done ? C.borderActive : C.border}`, borderRadius: 12, padding: "12px 10px", textAlign: "left", cursor: "pointer", position: "relative", animation: `fu .35s ease ${.04 * i}s both` }}>
                {done && <div style={{ position: "absolute", top: 7, right: 7, width: 18, height: 18, background: C.accent, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>}
                <div style={{ fontSize: 22, marginBottom: 2 }}>{day.icon}</div>
                <div style={{ fontSize: 9, color: C.accent, fontWeight: 700, fontFamily: mono, letterSpacing: 1 }}>DAY {day.day}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.textBright, lineHeight: 1.35, marginBottom: 1 }}>{day.titleJa}</div>
                <div style={{ fontSize: 9, color: C.textDim }}>{day.title}</div>
                {sc != null && (
                  <div style={{ marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ flex: 1, height: 2.5, background: C.border, borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${sc}%`, height: "100%", background: sc >= 80 ? C.green : sc >= 60 ? C.amber : C.red, borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 9, fontFamily: mono, color: sc >= 80 ? C.green : sc >= 60 ? C.amber : C.red, fontWeight: 700 }}>{sc}%</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ textAlign: "center", padding: "0 0 20px", fontSize: 9, color: C.textDim }}>Web Speech API で音声学習対応</div>
    </div>
  );

  // ────────────────────────────────────────────────────────────────────
  // RENDER: DAY (Learn)
  // ────────────────────────────────────────────────────────────────────
  const renderDay = () => {
    const items = getItems(learnTab);
    return (
      <div style={{ ...base, minHeight: "100vh", background: C.bg }}>
        <link href={fontLink} rel="stylesheet" />
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0}
          @keyframes fu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
          @keyframes glow{0%,100%{box-shadow:0 0 8px ${C.accentGlow}}50%{box-shadow:0 0 20px ${C.accentGlow}}}
        `}</style>

        {/* Top */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 14px 0" }}>
          <button onClick={() => { stopAutoPlay(); setView("home"); }}
            style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.textDim }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, color: C.accent, fontWeight: 700, fontFamily: mono, letterSpacing: 2 }}>DAY {dayData.day}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.textBright }}>{dayData.icon} {dayData.titleJa}</div>
          </div>
        </div>

        {/* Content tabs */}
        <div style={{ display: "flex", gap: 5, padding: "12px 14px 0" }}>
          {[["words", "単語", dayData.words.length], ["phrases", "フレーズ", dayData.phrases.length], ["chunks", "チャンク", dayData.chunks.length]].map(([k, l, n]) => (
            <button key={k} onClick={() => { setLearnTab(k); setCardIndex(0); setShowFlip(false); stopAutoPlay(); }}
              style={{ padding: "6px 13px", borderRadius: 100, border: learnTab === k ? `1.5px solid ${C.accent}` : `1px solid ${C.border}`, background: learnTab === k ? C.accentSoft : "transparent", color: learnTab === k ? C.accent : C.textDim, fontFamily: fonts, fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all .15s" }}>
              {l} <span style={{ opacity: 0.5, marginLeft: 2 }}>{n}</span>
            </button>
          ))}
        </div>

        {/* Mode tabs */}
        <div style={{ display: "flex", gap: 5, padding: "8px 14px 0" }}>
          {[["cards", "カード"], ["list", "一覧"], ["listen", "🎧 リスニング"]].map(([k, l]) => (
            <button key={k} onClick={() => { setLearnMode(k); if (k !== "listen") stopAutoPlay(); }}
              style={{ padding: "5px 11px", borderRadius: 100, border: learnMode === k ? `1px solid ${C.cyan}55` : `1px solid ${C.border}`, background: learnMode === k ? C.cyanSoft : "transparent", color: learnMode === k ? C.cyan : C.textDim, fontFamily: fonts, fontSize: 10, fontWeight: 600, cursor: "pointer", transition: "all .15s" }}>
              {l}
            </button>
          ))}
        </div>

        {/* Cards */}
        {learnMode === "cards" && (
          <div style={{ padding: 14, animation: "fu .3s ease" }}>
            {(() => {
              const item = items[cardIndex]; const isW = learnTab === "words"; const isCh = learnTab === "chunks";
              return (
                <div onClick={() => setShowFlip(!showFlip)}
                  style={{ background: showFlip ? C.surfaceHover : C.surface, border: `1px solid ${showFlip ? C.borderActive : C.border}`, borderRadius: 14, padding: "24px 20px", textAlign: "center", cursor: "pointer", minHeight: 160, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", transition: "all .2s", position: "relative" }}>
                  <div style={{ position: "absolute", top: 10, right: 10 }}><SpeakerBtn text={item.en} lang="en" /></div>
                  {!showFlip ? (
                    <>
                      <div style={{ fontSize: isW ? 28 : 18, fontWeight: 700, color: C.textBright, lineHeight: 1.4, marginBottom: 6 }}>{item.en}</div>
                      <div style={{ fontSize: 11, color: C.textDim }}>タップで日本語を表示</div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: isW ? 22 : 17, fontWeight: 700, color: C.accent, marginBottom: 6, lineHeight: 1.4 }}>{item.ja}</div>
                      {isW && item.ex && <div style={{ fontSize: 12, color: C.textDim, fontStyle: "italic" }}>"{item.ex}"</div>}
                      {isCh && item.note && <div style={{ fontSize: 10, color: C.cyan, background: C.cyanSoft, padding: "3px 10px", borderRadius: 6, marginTop: 5 }}>{item.note}</div>}
                    </>
                  )}
                </div>
              );
            })()}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 14 }}>
              <button disabled={cardIndex === 0} onClick={() => { setCardIndex(i => i - 1); setShowFlip(false); }}
                style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${C.border}`, background: C.surface, color: cardIndex === 0 ? C.textDim + "33" : C.textBright, cursor: cardIndex === 0 ? "default" : "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
              <div style={{ display: "flex", gap: 4 }}>
                {items.map((_, i) => (
                  <button key={i} onClick={() => { setCardIndex(i); setShowFlip(false); }}
                    style={{ width: i === cardIndex ? 16 : 6, height: 6, borderRadius: 3, background: i === cardIndex ? C.accent : C.border, border: "none", cursor: "pointer", transition: "all .2s" }} />
                ))}
              </div>
              <button disabled={cardIndex === items.length - 1} onClick={() => { setCardIndex(i => i + 1); setShowFlip(false); }}
                style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${C.border}`, background: C.surface, color: cardIndex === items.length - 1 ? C.textDim + "33" : C.textBright, cursor: cardIndex === items.length - 1 ? "default" : "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
            </div>
          </div>
        )}

        {/* List */}
        {learnMode === "list" && (
          <div style={{ padding: "14px 14px 6px", animation: "fu .3s ease" }}>
            {items.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: C.surface, borderRadius: 10, marginBottom: 6, border: `1px solid ${C.border}` }}>
                <SpeakerBtn text={item.en} lang="en" size={15} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: C.textBright }}>{item.en}</div>
                  <div style={{ fontSize: 11, color: C.textDim }}>{item.ja}</div>
                  {item.note && <div style={{ fontSize: 9, color: C.cyan, marginTop: 1 }}>{item.note}</div>}
                </div>
                {item.ex && <div style={{ fontSize: 9, color: C.textDim, maxWidth: 110, textAlign: "right", fontStyle: "italic" }}>{item.ex}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Listening */}
        {learnMode === "listen" && (
          <div style={{ padding: 14, animation: "fu .3s ease" }}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, textAlign: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: C.textDim, marginBottom: 10 }}>🎧 英語→日本語の順に自動再生</div>
              {!autoPlaying
                ? <button onClick={startAutoPlay} style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 100, padding: "12px 28px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: fonts, boxShadow: `0 3px 12px ${C.accentGlow}` }}>▶ 再生開始</button>
                : <button onClick={stopAutoPlay} style={{ background: C.redSoft, color: C.red, border: `1px solid ${C.red}30`, borderRadius: 100, padding: "12px 28px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: fonts }}>■ 停止</button>}
            </div>
            {items.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: autoPlayIdx === i ? C.accentSoft : C.surface, borderRadius: 10, marginBottom: 5, border: `1px solid ${autoPlayIdx === i ? C.borderActive : C.border}`, transition: "all .25s" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: autoPlayIdx === i ? C.accent : C.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: autoPlayIdx === i ? "#fff" : C.textDim, fontFamily: mono, flexShrink: 0, animation: autoPlayIdx === i ? "glow 1.5s ease infinite" : "none" }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: autoPlayIdx === i ? C.textBright : C.text }}>{item.en}</div>
                  <div style={{ fontSize: 11, color: C.textDim }}>{item.ja}</div>
                </div>
                <SpeakerBtn text={item.en} lang="en" size={14} />
              </div>
            ))}
          </div>
        )}

        {/* Quiz CTA */}
        <div style={{ padding: "6px 14px 14px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.textDim, marginBottom: 6, textAlign: "center" }}>テストモード</div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => startQuiz("visual")} style={{ flex: 1, background: C.accent, color: "#fff", border: "none", borderRadius: 10, padding: "13px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: fonts, boxShadow: `0 3px 12px ${C.accentGlow}` }}>📝 4択クイズ</button>
            <button onClick={() => { startQuiz("listening"); setTimeout(() => { const d = CURRICULUM[selectedDay]; const first = d.words[0] || d.phrases[0]; if (first) speakEn(first.en, 0.8); }, 600); }}
              style={{ flex: 1, background: C.cyanSoft, color: C.cyan, border: `1px solid ${C.cyan}28`, borderRadius: 10, padding: "13px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: fonts }}>🎧 リスニング</button>
          </div>
        </div>
        <div style={{ height: 16 }} />
      </div>
    );
  };

  // ────────────────────────────────────────────────────────────────────
  // RENDER: QUIZ
  // ────────────────────────────────────────────────────────────────────
  const renderQuiz = () => {
    if (!quizItems.length) return null;
    const item = quizItems[quizIndex];
    const pct = Math.round((quizIndex / quizItems.length) * 100);
    const isL = quizMode === "listening";
    return (
      <div style={{ ...base, minHeight: "100vh", background: C.bg, padding: 14 }}>
        <link href={fontLink} rel="stylesheet" />
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0}
          @keyframes fu{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
          @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}
          .ob:hover{background:${C.surfaceHover}!important}
        `}</style>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <button onClick={() => { setView("day"); clearTimeout(timerRef.current); }} style={{ background: "none", border: "none", color: C.textDim, fontSize: 16, cursor: "pointer", padding: 4 }}>✕</button>
          <div style={{ flex: 1, height: 3, background: C.surface, borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg,${C.accent},${C.cyan})`, borderRadius: 2, transition: "width .4s" }} />
          </div>
          <span style={{ fontSize: 11, color: C.textDim, fontFamily: mono, minWidth: 38, textAlign: "right" }}>{quizIndex + 1}/{quizItems.length}</span>
        </div>

        {streak >= 2 && <div style={{ textAlign: "center", marginBottom: 10, animation: "fu .2s ease" }}>
          <span style={{ background: C.amberSoft, color: C.amber, padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700, border: `1px solid ${C.amber}25` }}>🔥 {streak}連続正解！</span>
        </div>}

        <div style={{ textAlign: "center", marginBottom: 24, animation: "fu .3s ease" }}>
          <div style={{ fontSize: 9, color: C.textDim, textTransform: "uppercase", letterSpacing: 2, fontFamily: mono, marginBottom: 5 }}>{isL ? "LISTENING" : item.type === "word" ? "VOCABULARY" : item.type === "phrase" ? "PHRASE" : "CHUNK"}</div>
          {isL ? (
            <div style={{ padding: "24px 16px", background: C.surface, borderRadius: 14, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 13, color: C.textDim, marginBottom: 10 }}>聞こえた英語を選んでください</div>
              <button onClick={() => speakEn(item.a, 0.75)}
                style={{ width: 56, height: 56, borderRadius: "50%", border: `2px solid ${C.accent}`, background: C.accentSoft, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill={C.accent} stroke="none"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke={C.accent} strokeWidth="2" fill="none" strokeLinecap="round" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke={C.accent} strokeWidth="2" fill="none" strokeLinecap="round" opacity=".4" /></svg>
              </button>
              <div style={{ fontSize: 10, color: C.textDim, marginTop: 6 }}>タップで再生</div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 12, color: C.textDim, marginBottom: 5 }}>この日本語に合う英語は？</div>
              <div style={{ fontSize: 20, fontWeight: 700, padding: "20px 16px", background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, lineHeight: 1.5, color: C.textBright }}>
                {item.q}
                <div style={{ marginTop: 6 }}><SpeakerBtn text={item.q} lang="ja" size={16} /></div>
              </div>
            </>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {item.options.map((opt, i) => {
            const isC = opt === item.a; const isS = answered === opt;
            let bg = C.surface, bdr = `1px solid ${C.border}`, iBg = C.border, iC = C.textDim;
            if (answered !== null) {
              if (isC) { bg = C.greenSoft; bdr = `1px solid ${C.green}35`; iBg = C.green; iC = "#fff"; }
              else if (isS) { bg = C.redSoft; bdr = `1px solid ${C.red}35`; iBg = C.red; iC = "#fff"; }
            }
            return (
              <button className="ob" key={i} onClick={() => handleAnswer(opt)}
                style={{ padding: "12px 14px", borderRadius: 10, border: bdr, background: bg, color: C.text, fontSize: 13, fontWeight: 500, textAlign: "left", cursor: answered ? "default" : "pointer", transition: "all .15s", display: "flex", alignItems: "center", gap: 9, fontFamily: fonts, animation: answered && isS && !isC ? "shake .3s ease" : "none" }}>
                <span style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: iBg, color: iC, fontSize: 11, fontWeight: 700, flexShrink: 0, transition: "all .15s" }}>
                  {answered !== null ? (isC ? "✓" : isS ? "✕" : String.fromCharCode(65 + i)) : String.fromCharCode(65 + i)}
                </span>
                <span style={{ flex: 1, lineHeight: 1.4 }}>{opt}</span>
                {answered !== null && isC && <SpeakerBtn text={opt} lang="en" size={13} />}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // ────────────────────────────────────────────────────────────────────
  // RENDER: RESULT
  // ────────────────────────────────────────────────────────────────────
  const renderResult = () => {
    const total = quizItems.length;
    const pct = Math.round((score / total) * 100);
    const emoji = pct >= 90 ? "🎉" : pct >= 70 ? "👏" : pct >= 50 ? "💪" : "📚";
    const msg = pct >= 90 ? "素晴らしい！完璧に近い！" : pct >= 70 ? "よくできました！" : pct >= 50 ? "もう少し復習しよう！" : "繰り返し練習しよう！";
    const rc = pct >= 70 ? C.green : pct >= 50 ? C.amber : C.red;
    return (
      <div style={{ ...base, minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <link href={fontLink} rel="stylesheet" />
        <style>{`*{box-sizing:border-box;margin:0;padding:0}@keyframes fu{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}@keyframes si{from{transform:scale(.8);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
        <div style={{ animation: "si .4s ease", fontSize: 50, marginBottom: 10 }}>{emoji}</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.textBright, animation: "fu .4s ease .1s both" }}>DAY {dayData.day} 結果</h2>
        <p style={{ fontSize: 13, color: C.textDim, margin: "4px 0 20px", animation: "fu .4s ease .15s both" }}>{msg}</p>
        <div style={{ position: "relative", width: 110, height: 110, marginBottom: 18, animation: "si .5s ease .2s both" }}>
          <svg width="110" height="110" viewBox="0 0 110 110">
            <circle cx="55" cy="55" r="46" fill="none" stroke={C.surface} strokeWidth="5" />
            <circle cx="55" cy="55" r="46" fill="none" stroke={rc} strokeWidth="5" strokeLinecap="round" strokeDasharray={`${pct * 2.89} 289`} transform="rotate(-90 55 55)" style={{ filter: `drop-shadow(0 0 5px ${rc}35)` }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 28, fontWeight: 800, fontFamily: mono, color: C.textBright }}>{pct}%</span>
          </div>
        </div>
        <div style={{ fontSize: 14, color: C.text, marginBottom: 24, animation: "fu .4s ease .25s both" }}>
          <span style={{ fontFamily: mono, fontWeight: 700, color: C.textBright }}>{score}</span> / {total} 正解
        </div>
        <div style={{ display: "flex", gap: 8, width: "100%", maxWidth: 320, animation: "fu .4s ease .3s both" }}>
          <button onClick={startQuiz} style={{ flex: 1, background: C.accentSoft, color: C.accent, border: `1px solid ${C.accent}25`, borderRadius: 10, padding: "13px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: fonts }}>もう一度</button>
          <button onClick={() => setView("home")} style={{ flex: 1, background: C.accent, color: "#fff", border: "none", borderRadius: 10, padding: "13px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: fonts, boxShadow: `0 3px 12px ${C.accentGlow}` }}>ホームへ</button>
        </div>
      </div>
    );
  };

  if (view === "home") return renderHome();
  if (view === "day") return renderDay();
  if (view === "quiz") return renderQuiz();
  if (view === "result") return renderResult();
  return null;
}
