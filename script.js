// ===== Audio Elements =====
let bgAudio = null;
let correctAudio = null;
let wrongAudio = null;
let isMuted = false;

function initAudio() {
  bgAudio = document.getElementById('bgMusic');
  correctAudio = document.getElementById('correctSound');
  wrongAudio = document.getElementById('wrongSound');

  if (bgAudio) {
    bgAudio.volume = 0.25; // Keep background quiet

    // Start background on first user interaction (required by browsers)
    const startAudio = () => {
      if (bgAudio.paused && !isMuted) {
        bgAudio.play().catch(e => console.log("BG play blocked:", e));
      }
      document.body.removeEventListener('click', startAudio);
      document.body.removeEventListener('touchstart', startAudio);
    };
    document.body.addEventListener('click', startAudio);
    document.body.addEventListener('touchstart', startAudio);
  }
}

function playCorrectSound() {
  if (correctAudio) {
    correctAudio.currentTime = 0;
    correctAudio.play().catch(e => console.log("Correct sound failed:", e));
  }
}

function playWrongSound() {
  if (wrongAudio) {
    wrongAudio.currentTime = 0;
    wrongAudio.play().catch(e => console.log("Wrong sound failed:", e));
  }
}

function toggleMute() {
  if (!bgAudio) return;

  isMuted = !isMuted;
  const btn = document.getElementById('mute-btn');
  
  if (isMuted) {
    bgAudio.pause();
    btn.textContent = '🔇 Unmute Music';
  } else {
    bgAudio.play().catch(e => console.log("Play failed:", e));
    btn.textContent = '🔊 Mute Music';
  }
}

// ===== Quiz Data (10 questions) =====
const quizData = [
  {
    question: "1. Why does a perfect square have an odd number of total positive factors?",
    options: [
      "Because it is always divisible by 2.",
      "Because its prime factorization has only even exponents.",
      "Because one factor (the square root) is repeated and counted once.",
      "Because it has more composite factors than prime factors."
    ],
    correct: 2
  },
  {
    question: "2. The set of positive factors of 49 is {1, 7, 49}. What is √49?",
    options: [
      "1",
      "7",
      "49",
      "Not a perfect square"
    ],
    correct: 1
  },
  {
    question: "3. Which number is NOT a perfect square based on its factor count?",
    options: [
      "64 (factors: 1,2,4,8,16,32,64)",
      "81 (factors: 1,3,9,27,81)",
      "50 (factors: 1,2,5,10,25,50)",
      "100 (factors: 1,2,4,5,10,20,25,50,100)"
    ],
    correct: 2
  },
  {
    question: "4. If a number has exactly 9 positive factors, what can you conclude?",
    options: [
      "It is not a perfect square.",
      "It is a perfect square.",
      "It is a prime number.",
      "It must be less than 100."
    ],
    correct: 1
  },
  {
    question: "5. Using the set of factors {1, 2, 3, 4, 6, 9, 12, 18, 36}, what is √36?",
    options: [
      "4",
      "6",
      "9",
      "12"
    ],
    correct: 1
  },
  {
    question: "6. Which statement is TRUE?",
    options: [
      "All numbers with odd factors are perfect squares.",
      "Only perfect squares have an odd number of total positive factors.",
      "Prime numbers have an odd number of factors.",
      "Even numbers cannot be perfect squares."
    ],
    correct: 1
  },
  {
    question: "7. How many positive factors does 16 have? Is it a perfect square?",
    options: [
      "4 factors – not a perfect square",
      "5 factors – yes, it is a perfect square",
      "6 factors – not a perfect square",
      "8 factors – yes, it is a perfect square"
    ],
    correct: 1
  },
  {
    question: "8. The middle number in the ordered set of factors of a perfect square is:",
    options: [
      "Always 1",
      "The number itself",
      "Its square root",
      "Half the number"
    ],
    correct: 2
  },
  {
    question: "9. Which number has a factor set with an even number of elements?",
    options: [
      "25 → {1,5,25}",
      "36 → {1,2,3,4,6,9,12,18,36}",
      "49 → {1,7,49}",
      "20 → {1,2,4,5,10,20}"
    ],
    correct: 3
  },
  {
    question: "10. If n = p² (where p is prime), how many positive factors does n have?",
    options: [
      "1",
      "2",
      "3",
      "4"
    ],
    correct: 2
  }
];

// ===== Quiz Logic =====
let currentQuestion = 0;
let score = 0;
let answered = false;

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options');
const feedbackEl = document.getElementById('feedback');
const scoreDisplay = document.getElementById('score-display');
const questionScreen = document.getElementById('question-screen');
const finalScreen = document.getElementById('final-screen');
const finalScoreEl = document.getElementById('final-score');
const messageEl = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');
const muteBtn = document.getElementById('mute-btn');

if (restartBtn) restartBtn.addEventListener('click', restartQuiz);
if (muteBtn) muteBtn.addEventListener('click', toggleMute);

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
    feedbackEl.innerHTML = `<span class="incorrect">❌ Incorrect! Correct answer: ${q.options[q.correct]}</span>`;
    playWrongSound();
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
    message = '🌟 Perfect! You’ve mastered perfect squares!';
  } else if (percent >= 80) {
    message = '🎉 Excellent understanding!';
  } else if (percent >= 60) {
    message = '👍 Good job! Keep reviewing.';
  } else if (percent >= 40) {
    message = '📚 Solid effort—practice more!';
  } else {
    message = '💡 Review factor sets and try again!';
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

// Initialize
window.onload = () => {
  initAudio();
  loadQuestion();
};