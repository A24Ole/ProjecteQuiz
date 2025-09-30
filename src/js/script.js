const app = document.getElementById("partida");

let questions = [];
let userAnswers = {};
let currentQuestionIndex = 0;
let startTime, timerInterval;

// Inicializar la app
function init() {
  const savedName = localStorage.getItem('username');
  if (savedName) {
    renderStart(savedName);
  } else {
    showForm();
  }
}

// Mostrar formulario para introducir nombre si no está guardado
function showForm() {
  app.innerHTML = `
    <form id="nameForm">
      <label for="nameInput">Introduce tu nombre:</label>
      <input id="nameInput" name="name" type="text" required />
      <button type="submit">Guardar</button>
    </form>
  `;

  const form = document.getElementById('nameForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value.trim();
    if (name) {
      localStorage.setItem('username', name);
      renderStart(name);
    }
  });
}

// Pantalla inicial con saludo, botón para empezar y borrar nombre
function renderStart(name) {
  app.innerHTML = `
    <h2>Hola, ${name}!</h2>
    <h2>Bienvenido al Quiz</h2>
    <p>Para comenzar el quiz, pulsa el botón "Comenzar".</p>
    <button id="buttonStart">Comenzar</button>
    <button id="clearNameBtn">Borrar nombre</button>
  `;

  document.getElementById("buttonStart").addEventListener("click", () => {
    loadQuestions();
  });

  document.getElementById('clearNameBtn').addEventListener('click', () => {
    localStorage.removeItem('username');
    showForm();
  });
}

// Carga las preguntas desde backend
async function loadQuestions() {
  try {
    const resp = await fetch('http://a24oleproyat.daw.inspedralbes.cat/src/php/quiz.php?action=load');
    const data = await resp.json();

    if (!data.questions || !Array.isArray(data.questions)) {
      throw new Error("Formato de preguntas incorrecto");
    }

    questions = data.questions;
    userAnswers = {};
    currentQuestionIndex = 0;

    app.innerHTML = `<div id="timer"></div><div id="quizContent"></div>`;

    startTimer();
    renderQuestion();
  } catch (error) {
    console.error("Error cargando preguntas:", error);
    app.innerHTML = `<p>Error cargando preguntas: ${error.message}</p>`;
  }
}

// Renderiza una pregunta según currentQuestionIndex
function renderQuestion() {
  if (currentQuestionIndex >= questions.length) {
    stopTimer();
    showResults();
    return;
  }

  const question = questions[currentQuestionIndex];
  const quizContent = document.getElementById("quizContent");

  quizContent.innerHTML = `
    <h2>Pregunta ${currentQuestionIndex + 1} de ${questions.length}</h2>
    <p>${question.question}</p>
    <div id="answers"></div>
    <button id="nextBtn">${currentQuestionIndex === questions.length - 1 ? "Finalizar" : "Siguiente"}</button>
  `;

  const answersDiv = document.getElementById("answers");

  question.answers.forEach((answerText, idx) => {
    const btn = document.createElement("button");
    btn.textContent = answerText;
    btn.className = "answer-btn";

    if (userAnswers[currentQuestionIndex] === idx) {
      btn.classList.add("selected");
    }

    btn.addEventListener("click", () => {
      userAnswers[currentQuestionIndex] = idx;
      [...answersDiv.children].forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });

    answersDiv.appendChild(btn);
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    if (userAnswers[currentQuestionIndex] === undefined) {
      alert("Debes seleccionar una respuesta antes de continuar.");
      return;
    }
    currentQuestionIndex++;
    renderQuestion();
  });
}

// Mostrar resultados finales
function showResults() {
  let correctCount = 0;
  questions.forEach((q, i) => {
    const userAnswer = userAnswers[i];
    const isCorrect = userAnswer === (q.correctIndex - 1);
    if (isCorrect) correctCount++;
  });

  const seconds = stopTimer();

  app.innerHTML = `
    <h2>Resultados</h2>
    <p>Has acertado ${correctCount} de ${questions.length} preguntas en ${seconds} segundos.</p>
    <button id="restartBtn">Reiniciar</button>
    <button id="homeBtn">Inicio</button>
  `;

  document.getElementById("restartBtn").addEventListener("click", loadQuestions);
  document.getElementById("homeBtn").addEventListener("click", init);
}

// TIMER
function startTimer() {
  startTime = new Date();

  const timerDiv = document.getElementById('timer');
  timerDiv.textContent = "Tiempo: 00:00";

  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  const endTime = new Date();
  const timeDiff = endTime - startTime;
  return Math.round(timeDiff / 1000);
}

function updateTimer() {
  const now = new Date();
  const timeDiff = now - startTime;
  const seconds = Math.floor(timeDiff / 1000) % 60;
  const minutes = Math.floor(timeDiff / (1000 * 60)) % 60;
  const timerDiv = document.getElementById('timer');
  if (timerDiv) {
    timerDiv.textContent = `Tiempo: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}

// Inicializa la aplicación
document.addEventListener('DOMContentLoaded', init);
