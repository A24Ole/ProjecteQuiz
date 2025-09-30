const application = document.getElementById("partida"); 
const app = application; 

let questions = [];
let userAnswers = {};
let currentQuestionIndex = 0;

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
  application.innerHTML = `
    <h2>Hola, ${name}!</h2>
    <h2>Bienvenido al Quiz</h2>
    <p>Para comenzar el quiz, pulsa el botón "Comenzar".</p>
    <button id="buttonStart">Comenzar</button>
    <button id="clearNameBtn">Esborrar nom</button>
  `;

  document.getElementById("buttonStart").addEventListener("click", () => {
    console.log("Comenzar pulsado");
    loadQuestions();
  });

  document.getElementById('clearNameBtn').addEventListener('click', () => {
    localStorage.removeItem('username');
    showForm();
  });
}


// Carga las preguntas desde backend
async function loadQuestions() {
  console.log("Iniciando carga de preguntas...");
  try {
    const resp = await fetch('http://a24oleproyat.daw.inspedralbes.cat/projecteProdProva/src/php/quiz.php?action=load');
    const data = await resp.json();
    console.log("Datos recibidos del backend:", data);

    if (!data.questions || !Array.isArray(data.questions)) {
      throw new Error("Formato de preguntas incorrecto");
    }

    questions = data.questions;
    userAnswers = {};
    currentQuestionIndex = 0;

    renderQuestion();
  } catch (error) {
    console.error("Error cargando preguntas:", error);
    application.innerHTML = `<p>Error cargando preguntas: ${error.message}</p>`;
  }
}

// Renderiza una pregunta según currentQuestionIndex
function renderQuestion() {
  if (currentQuestionIndex >= questions.length) {
    console.log("Todas las preguntas respondidas, mostrando resultados...");
    showResults();
    return;
  }

  const question = questions[currentQuestionIndex];

  application.innerHTML = `
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
      console.warn("Intento de avanzar sin seleccionar respuesta");
      alert("Debes seleccionar una respuesta antes de continuar.");
      return;
    }

    const userAnswer = userAnswers[currentQuestionIndex];
    const correctAnswerIndex = questions[currentQuestionIndex].correctIndex - 1;
    const isCorrect = userAnswer === correctAnswerIndex;

    if (isCorrect) {
      console.log(`✅ Respuesta a la pregunta ${currentQuestionIndex + 1} es CORRECTA`);
    } else {
      console.log(`❌ Respuesta a la pregunta ${currentQuestionIndex + 1} es INCORRECTA`);
    }

    console.log(`Avanzando de pregunta ${currentQuestionIndex + 1}`);
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

  application.innerHTML = `
    <h2>Resultados</h2>
    <p>Has acertado ${correctCount} de ${questions.length} preguntas.</p>
    <button id="restartBtn">Reiniciar</button>
    <button id="homeBtn">Inicio</button>
  `;

  document.getElementById("restartBtn").addEventListener("click", () => {
    console.log("Reiniciando quiz...");
    loadQuestions();
  });

  document.getElementById("homeBtn").addEventListener("click", () => {
    console.log("Volviendo al inicio...");
    init();
  });
}

// Inicializa la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  init();
});
