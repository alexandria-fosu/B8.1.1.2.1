// ===== AUDIO CONTROL =====
let bgAudio = null;
let correctAudio = null;
let wrongAudio = null;
let isBgStarted = false;

function initAudio() {
  bgAudio = document.getElementById('bgMusic');
  correctAudio = document.getElementById('correctSound');
  wrongAudio = document.getElementById('wrongSound');

  if (bgAudio) {
    bgAudio.volume = 0.25;
    const startBg = () => {
      if (!isBgStarted && bgAudio.paused) {
        bgAudio.play().catch(e => console.log("BG play blocked"));
        isBgStarted = true;
      }
      document.body.removeEventListener('click', startBg);
      document.body.removeEventListener('touchstart', startBg);
    };
    document.body.addEventListener('click', startBg);
    document.body.addEventListener('touchstart', startBg);
  }
}

function playCorrectSound() {
  if (correctAudio) {
    correctAudio.currentTime = 0;
    correctAudio.play().catch(e => console.log("Correct sound failed"));
  }
}

function playWrongSound() {
  if (wrongAudio) {
    wrongAudio.currentTime = 0;
    wrongAudio.play().catch(e => console.log("Wrong sound failed"));
  }
}

// ===== QUIZ DATA: 8 questions covering decimals, whole numbers, and benchmark fractions =====
const quizData = [
  {
    question: "What is 3.45 × 100?",
    options: ["34.5", "345", "0.345", "3450"],
    correct: 1
  },
  {
    question: "What is 72 ÷ 10?",
    options: ["7.2", "0.72", "720", "72"],
    correct: 0
  },
  {
    question: "What is 0.006 × 1,000?",
    options: ["0.06", "0.6", "6", "60"],
    correct: 2
  },
  {
    question: "What is 1/2 × 10? (Remember: 1/2 = 0.5)",
    options: ["0.5", "5", "50", "1/20"],
    correct: 1
  },
  {
    question: "What is 4.8 ÷ 100?",
    options: ["0.48", "0.048", "48", "0.0048"],
    correct: 1
  },
  {
    question: "What is 3/4 × 100? (3/4 = 0.75)",
    options: ["7.5", "75", "0.75", "300"],
    correct: 1
  },
  {
    question: "What is 15.2 ÷ 10?",
    options: ["1.52", "0.152", "152", "1520"],
    correct: 0
  },
  {
    question: "What is 1/10 × 1,000?",
    options: ["1", "10", "100", "1000"],
    correct: 2
  }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

// DOM Elements
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options');
const feedbackEl = document.getElementById('feedback');
const scoreDisplay = document.getElementById('score-display');
const questionScreen = document.getElementById('question-screen');
const finalScreen = document.getElementById('final-screen');
const finalScoreEl = document.getElementById('final-score');
const messageEl = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');

restartBtn.addEventListener('click', restartQuiz);

function loadQuestion() {
  if (currentQuestion >= quizData.length) {
    showFinalScreen();
    return;
  }

  const q = quizData[currentQuestion];
  questionText.textContent = q.question;
  optionsContainer.innerHTML = '';

  q.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'option-btn';
    button.textContent = option;
    button.onclick = () => selectAnswer(index);
    optionsContainer.appendChild(button);
  });

  feedbackEl.textContent = '';
  answered = false;
}

function selectAnswer(selectedIndex) {
  if (answered) return;
  answered = true;

  const q = quizData[currentQuestion];
  const isCorrect = selectedIndex === q.correct;

  if (isCorrect) {
    score++;
    scoreDisplay.textContent = `Score: ${score} / ${quizData.length}`;
    feedbackEl.innerHTML = '<span class="correct">✅ Correct!</span>';
    playCorrectSound();
  } else {
    feedbackEl.innerHTML = `<span class="incorrect">❌ Incorrect! The correct answer is: ${q.options[q.correct]}</span>`;
  }

  document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);

  setTimeout(() => {
    currentQuestion++;
    loadQuestion();
  }, 1800);
}

function showFinalScreen() {
  questionScreen.style.display = 'none';
  finalScreen.style.display = 'block';

  finalScoreEl.textContent = `Final Score: ${score} / ${quizData.length}`;
  
  let message = '';
  const percent = (score / quizData.length) * 100;
  if (percent === 100) {
    message = '🌟 Perfect! You’ve mastered powers of 10!';
  } else if (percent >= 75) {
    message = '🎉 Excellent! You understand decimal and fraction shifts!';
  } else if (percent >= 50) {
    message = '👍 Good effort! Review how digits move when multiplying/dividing by 10, 100, 1000.';
  } else {
    message = '📚 Keep practicing! Remember: ×10 moves decimal right, ÷10 moves it left.';
  }
  messageEl.textContent = message;
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  scoreDisplay.textContent = `Score: ${score} / ${quizData.length}`;
  finalScreen.style.display = 'none';
  questionScreen.style.display = 'block';
  loadQuestion();
}

// Start
window.onload = () => {
  initAudio();
  loadQuestion();
};