// Gojuon Data Set
const gojuonData = [
  { h: "あ", k: "ア", r: "a" },  { h: "い", k: "イ", r: "i" },  { h: "う", k: "ウ", r: "u" },  { h: "え", k: "エ", r: "e" },  { h: "お", k: "オ", r: "o" },
  { h: "か", k: "カ", r: "ka" }, { h: "き", k: "キ", r: "ki" }, { h: "く", k: "ク", r: "ku" }, { h: "け", k: "ケ", r: "ke" }, { h: "こ", k: "コ", r: "ko" },
  { h: "さ", k: "サ", r: "sa" }, { h: "し", k: "シ", r: "shi" },{ h: "す", k: "ス", r: "su" }, { h: "せ", k: "セ", r: "se" }, { h: "そ", k: "ソ", r: "so" },
  { h: "た", k: "タ", r: "ta" }, { h: "ち", k: "チ", r: "chi" },{ h: "つ", k: "ツ", r: "tsu" },{ h: "て", k: "テ", r: "te" }, { h: "と", k: "ト", r: "to" },
  { h: "な", k: "ナ", r: "na" }, { h: "に", k: "ニ", r: "ni" }, { h: "ぬ", k: "ヌ", r: "nu" }, { h: "ね", k: "ネ", r: "ne" }, { h: "の", k: "ノ", r: "no" },
  { h: "は", k: "ハ", r: "ha" }, { h: "ひ", k: "ヒ", r: "hi" }, { h: "ふ", k: "フ", r: "fu" }, { h: "へ", k: "ヘ", r: "he" }, { h: "ほ", k: "ホ", r: "ho" },
  { h: "ま", k: "マ", r: "ma" }, { h: "み", k: "ミ", r: "mi" }, { h: "む", k: "ム", r: "mu" }, { h: "め", k: "メ", r: "me" }, { h: "も", k: "モ", r: "mo" },
  { h: "や", k: "ヤ", r: "ya" }, { h: "", k: "", r: "" },      { h: "ゆ", k: "ユ", r: "yu" }, { h: "", k: "", r: "" },      { h: "よ", k: "ヨ", r: "yo" },
  { h: "ら", k: "ラ", r: "ra" }, { h: "り", k: "リ", r: "ri" }, { h: "る", k: "ル", r: "ru" }, { h: "れ", k: "レ", r: "re" }, { h: "ろ", k: "ロ", r: "ro" },
  { h: "わ", k: "ワ", r: "wa" }, { h: "", k: "", r: "" },      { h: "", k: "", r: "" },      { h: "", k: "", r: "" },      { h: "を", k: "ヲ", r: "wo" },
  { h: "ん", k: "ン", r: "n" }
];

// App State
let isKatakana = false;
let currentQuizItem = null;

// DOM Elements
const gridEl = document.getElementById('gojuon-grid');
const toggleKanaBtn = document.getElementById('toggle-kana');
const modeStudyBtn = document.getElementById('mode-study');
const modeQuizBtn = document.getElementById('mode-quiz');
const chartView = document.getElementById('chart-view');
const quizView = document.getElementById('quiz-view');

const quizQuestion = document.getElementById('quiz-question');
const quizInput = document.getElementById('quiz-input');
const quizSubmit = document.getElementById('quiz-submit');
const quizFeedback = document.getElementById('quiz-feedback');

// Speech Synthesis for Audio
function speakKana(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    window.speechSynthesis.speak(utterance);
  }
}

// Render Study Chart
function renderChart() {
  gridEl.innerHTML = '';
  gojuonData.forEach(item => {
    const card = document.createElement('div');
    if (!item.r) {
      card.className = 'kana-card empty';
    } else {
      card.className = 'kana-card';
      const char = isKatakana ? item.k : item.h;
      card.innerHTML = `
        <div class="kana-char">${char}</div>
        <div class="romaji-label">${item.r}</div>
      `;
      card.addEventListener('click', () => speakKana(char));
    }
    gridEl.appendChild(card);
  });
}

// Setup Quiz
function nextQuizQuestion() {
  const validItems = gojuonData.filter(i => i.r !== "");
  currentQuizItem = validItems[Math.floor(Math.random() * validItems.length)];
  quizQuestion.textContent = isKatakana ? currentQuizItem.k : currentQuizItem.h;
  quizInput.value = '';
  quizFeedback.textContent = '';
  quizFeedback.className = 'feedback';
  quizInput.focus();
}

function checkQuizAnswer() {
  if (!currentQuizItem) return;
  const userAnswer = quizInput.value.trim().toLowerCase();
  if (userAnswer === currentQuizItem.r) {
    quizFeedback.textContent = 'Correct! (正解)';
    quizFeedback.className = 'feedback correct';
    speakKana(isKatakana ? currentQuizItem.k : currentQuizItem.h);
    setTimeout(nextQuizQuestion, 1200);
  } else {
    quizFeedback.textContent = `Incorrect! Correct answer is: ${currentQuizItem.r}`;
    quizFeedback.className = 'feedback incorrect';
  }
}

// Event Listeners
toggleKanaBtn.addEventListener('click', () => {
  isKatakana = !isKatakana;
  toggleKanaBtn.textContent = isKatakana ? 'Switch to Hiragana' : 'Switch to Katakana';
  renderChart();
  if (!quizView.classList.contains('hidden')) nextQuizQuestion();
});

modeStudyBtn.addEventListener('click', () => {
  modeStudyBtn.classList.add('active');
  modeQuizBtn.classList.remove('active');
  chartView.classList.remove('hidden');
  quizView.classList.add('hidden');
});

modeQuizBtn.addEventListener('click', () => {
  modeQuizBtn.classList.add('active');
  modeStudyBtn.classList.remove('active');
  quizView.classList.remove('hidden');
  chartView.classList.add('hidden');
  nextQuizQuestion();
});

quizSubmit.addEventListener('click', checkQuizAnswer);
quizInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') checkQuizAnswer();
});

// Initialize App
renderChart();