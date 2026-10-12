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

// Row Groupings for Filters
const gojuonRows = [
  { name: "A-Row (あ行)", indices: [0, 1, 2, 3, 4] },
  { name: "Ka-Row (か行)", indices: [5, 6, 7, 8, 9] },
  { name: "Sa-Row (さ行)", indices: [10, 11, 12, 13, 14] },
  { name: "Ta-Row (た行)", indices: [15, 16, 17, 18, 19] },
  { name: "Na-Row (な行)", indices: [20, 21, 22, 23, 24] },
  { name: "Ha-Row (は行)", indices: [25, 26, 27, 28, 29] },
  { name: "Ma-Row (ま行)", indices: [30, 31, 32, 33, 34] },
  { name: "Ya-Row (や行)", indices: [35, 37, 39] },
  { name: "Ra-Row (ら行)", indices: [40, 41, 42, 43, 44] },
  { name: "Wa-Row (わ行/ん)", indices: [45, 49, 50] }
];

// App State
let isKatakana = false;
let currentQuizItem = null;
let currentQuizKana = "";

// DOM Elements
const gridEl = document.getElementById('gojuon-grid');
const toggleKanaBtn = document.getElementById('toggle-kana');
const modeStudyBtn = document.getElementById('mode-study');
const modeQuizBtn = document.getElementById('mode-quiz');
const modeLyricsBtn = document.getElementById('mode-lyrics');

const chartView = document.getElementById('chart-view');
const quizView = document.getElementById('quiz-view');
const lyricsView = document.getElementById('lyrics-view');
const scriptSelectorContainer = document.getElementById('script-selector-container');
const scriptModeSelect = document.getElementById('script-mode-select');

// Quiz Row Filters
const rowCheckboxesEl = document.getElementById('row-checkboxes');
const presetAllBtn = document.getElementById('preset-all');
const presetVowelsBtn = document.getElementById('preset-vowels');
const presetClearBtn = document.getElementById('preset-clear');

const quizQuestion = document.getElementById('quiz-question');
const quizInput = document.getElementById('quiz-input');
const quizSubmit = document.getElementById('quiz-submit');
const quizFeedback = document.getElementById('quiz-feedback');

// Lyrics Mode Elements
const lyricsJapanese = document.getElementById('lyrics-japanese');
const lyricsRomaji = document.getElementById('lyrics-romaji');
const copySubmissionBtn = document.getElementById('copy-submission');
const lyricsStatus = document.getElementById('lyrics-status');

// Speech Synthesis
function speakKana(text) {
  if ('speechSynthesis' in window && text) {
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

// Render Row Checkboxes for Quiz
function renderRowCheckboxes() {
  rowCheckboxesEl.innerHTML = '';
  gojuonRows.forEach((row, rowIndex) => {
    const sampleChars = row.indices.map(i => isKatakana ? gojuonData[i].k : gojuonData[i].h).join(' ');

    const label = document.createElement('label');
    label.className = 'row-item';
    label.innerHTML = `
      <input type="checkbox" value="${rowIndex}" checked />
      <span><strong>${row.name}</strong> <small style="color:#7f8c8d">(${sampleChars})</small></span>
    `;
    rowCheckboxesEl.appendChild(label);
  });
}

// Quiz Mechanics
function nextQuizQuestion() {
  const checkedRowBoxes = rowCheckboxesEl.querySelectorAll('input[type="checkbox"]:checked');
  
  if (checkedRowBoxes.length === 0) {
    quizQuestion.textContent = "⚠️";
    quizFeedback.textContent = 'Please select at least one row above!';
    quizFeedback.className = 'feedback incorrect';
    currentQuizItem = null;
    return;
  }

  let activeIndices = [];
  checkedRowBoxes.forEach(cb => {
    const rowIndex = parseInt(cb.value);
    activeIndices = activeIndices.concat(gojuonRows[rowIndex].indices);
  });

  const randomIndex = activeIndices[Math.floor(Math.random() * activeIndices.length)];
  currentQuizItem = gojuonData[randomIndex];

  const selectedScript = scriptModeSelect.value;
  if (selectedScript === "hiragana") {
    currentQuizKana = currentQuizItem.h;
  } else if (selectedScript === "katakana") {
    currentQuizKana = currentQuizItem.k;
  } else if (selectedScript === "mixed") {
    currentQuizKana = Math.random() < 0.5 ? currentQuizItem.h : currentQuizItem.k;
  }

  quizQuestion.textContent = currentQuizKana;
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
    speakKana(currentQuizKana);
    setTimeout(nextQuizQuestion, 1200);
  } else {
    quizFeedback.textContent = `Incorrect! Correct answer: ${currentQuizItem.r}`;
    quizFeedback.className = 'feedback incorrect';
  }
}

// Preset Filter Actions
presetAllBtn.addEventListener('click', () => {
  rowCheckboxesEl.querySelectorAll('input').forEach(cb => cb.checked = true);
  if (!quizView.classList.contains('hidden')) nextQuizQuestion();
});

presetClearBtn.addEventListener('click', () => {
  rowCheckboxesEl.querySelectorAll('input').forEach(cb => cb.checked = false);
  if (!quizView.classList.contains('hidden')) nextQuizQuestion();
});

presetVowelsBtn.addEventListener('click', () => {
  rowCheckboxesEl.querySelectorAll('input').forEach((cb, index) => {
    cb.checked = (index === 0);
  });
  if (!quizView.classList.contains('hidden')) nextQuizQuestion();
});

// Navigation Mode Switchers
modeStudyBtn.addEventListener('click', () => {
  modeStudyBtn.classList.add('active');
  modeQuizBtn.classList.remove('active');
  modeLyricsBtn.classList.remove('active');

  chartView.classList.remove('hidden');
  quizView.classList.add('hidden');
  lyricsView.classList.add('hidden');
  scriptSelectorContainer.classList.add('hidden');
});

modeQuizBtn.addEventListener('click', () => {
  modeQuizBtn.classList.add('active');
  modeStudyBtn.classList.remove('active');
  modeLyricsBtn.classList.remove('active');

  quizView.classList.remove('hidden');
  chartView.classList.add('hidden');
  lyricsView.classList.add('hidden');
  scriptSelectorContainer.classList.remove('hidden');
  nextQuizQuestion();
});

modeLyricsBtn.addEventListener('click', () => {
  modeLyricsBtn.classList.add('active');
  modeStudyBtn.classList.remove('active');
  modeQuizBtn.classList.remove('active');

  lyricsView.classList.remove('hidden');
  chartView.classList.add('hidden');
  quizView.classList.add('hidden');
  scriptSelectorContainer.classList.add('hidden');
});

// Toggle Kana Button
toggleKanaBtn.addEventListener('click', () => {
  isKatakana = !isKatakana;
  toggleKanaBtn.textContent = isKatakana ? 'Switch to Hiragana' : 'Switch to Katakana';
  renderChart();
  renderRowCheckboxes();
  if (!quizView.classList.contains('hidden')) nextQuizQuestion();
});

// Script Mode Select Handler
scriptModeSelect.addEventListener('change', () => {
  if (!quizView.classList.contains('hidden')) nextQuizQuestion();
});

// Quiz Answer Listeners
quizSubmit.addEventListener('click', checkQuizAnswer);
quizInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') checkQuizAnswer();
});

// Lyrics Copy Submission Listener
copySubmissionBtn.addEventListener('click', () => {
  const japaneseText = lyricsJapanese.value.trim();
  const romajiText = lyricsRomaji.value.trim();

  if (!japaneseText || !romajiText) {
    lyricsStatus.style.color = '#e74c3c';
    lyricsStatus.textContent = 'Please fill in both Japanese and Romaji fields before copying.';
    return;
  }

  const formattedOutput = `--- Student Lyrics Submission ---\n\n[Japanese Lyrics]\n${japaneseText}\n\n[Romaji Answer]\n${romajiText}`;

  navigator.clipboard.writeText(formattedOutput).then(() => {
    lyricsStatus.style.color = '#27ae60';
    lyricsStatus.textContent = 'Copied to clipboard! Ready to send to teacher.';
    setTimeout(() => { lyricsStatus.textContent = ''; }, 3000);
  }).catch(() => {
    lyricsStatus.style.color = '#e74c3c';
    lyricsStatus.textContent = 'Failed to copy automatically. Please copy manually.';
  });
});

// App Initialization
renderChart();
renderRowCheckboxes();