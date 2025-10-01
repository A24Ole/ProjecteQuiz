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
    <div class="init-hero fade-in">
      <h1 class="title">🎉 ¡Bienvenido a la Aventura! 🎉</h1>
      <h2>Quiz de Marcas de Coches</h2>
      <h3>¿Preparado para descubrir cuánto sabes del mundo automotriz?</h3>
      <form id="nameForm">
        <label for="nameInput"> ¿Cómo te llamas, piloto? </label>
        <br><br>
        <input id="nameInput" name="name" type="text" autocomplete="off" placeholder="Escribe tu nombre aquí..." required />
        <br>
        <button type="submit"> Guardar y Empezar 🏁 </button>
      </form> <br><br>
      <div class="init-footer">
        <span>Recuerda: ¡cada respuesta cuenta en la carrera final!</span>
      </div>
    </div>
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

// Pantalla inicial creativa con animación
function renderStart(name) {
  app.innerHTML = `
  <div class="start-screen container-card">
      <h1 class="title">🎉 Bienvenido, ${name}! 🎉</h1>
      <h2 class="subtitle">Prepárate para el DESAFÍO del Quiz</h2>
      <p class="description">Pon a prueba tus conocimientos y compite contra el tiempo ⏳</p>
      
      <div class="btn-group">
        <button id="buttonStart" class="start-btn">🚀 ¡Comenzar!</button>
        <button id="clearNameBtn" class="secondary-btn">🗑️ Borrar nombre</button>
      </div>
    </div>
  `;

  document.getElementById("buttonStart").addEventListener("click", () => {
    loadQuestions();
  });

  document.getElementById("clearNameBtn").addEventListener("click", () => {
    localStorage.removeItem("username");
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

// Renderiza una pregunta con estilo creativo
function renderQuestion() {
  if (currentQuestionIndex >= questions.length) {
    stopTimer();
    showResults();
    return;
  }

  const question = questions[currentQuestionIndex];
  const quizContent = document.getElementById("quizContent");

  const progressPercent = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  quizContent.innerHTML = `
    <div class="progress-bar">
      <div class="progress" style="width:${progressPercent}%;"></div>
    </div>
    <div class="question-card container-card">
      <h2 class="question-title">❓ Pregunta ${currentQuestionIndex + 1} de ${questions.length}</h2>
      <div class="question-image">
        <img src="${question.imageUrl}" alt="Pregunta" />
      </div>
      <div id="answers" class="answers btn-group"></div>
      <button id="nextBtn" class="next-btn">${currentQuestionIndex === questions.length - 1 ? "✅ Finalizar" : "➡️ Siguiente"}</button>
    </div>
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

// Mostrar resultados finales creativo
function showResults() {
  let correctCount = 0;
  questions.forEach((q, i) => {
    const userAnswer = userAnswers[i];
    const isCorrect = userAnswer === (q.correctIndex - 1);
    if (isCorrect) correctCount++;
  });

  const seconds = stopTimer();
  const percentage = Math.round((correctCount / questions.length) * 100);

  let message = "";

  if (percentage === 100) {
    message = "🎉 ¡Perfecto! Eres un GENIO del Quiz 🎉";
  } else if (percentage >= 70) {
    message = "👏 ¡Muy bien! Casi lo bordas 👏";
  } else if (percentage >= 40) {
    message = "😅 No está mal, pero puedes mejorar 😅";
  } else {
    message = "💡 ¡Sigue practicando! La próxima lo lograrás 💡";
  }

  app.innerHTML = `
    <div class="score-screen container-card">
      <h2 class="score-title">🏆 Resultados del Quiz 🏆</h2>
      <p class="score-message">${message}</p>
      <p class="score-result">Has acertado <span>${correctCount}</span> de ${questions.length} 
        preguntas en <strong>${seconds}</strong> segundos.</p>
      
      <div class="score-actions btn-group">
        <button id="restartBtn" class="score-btn replay">🔄 Reiniciar</button>
        <button id="homeBtn" class="score-btn home">🏠 Inicio</button>
      </div>
    </div>
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

const toggleBtn = document.getElementById("theme-toggle");
const body = document.body;
  
// Cargar preferencia previa del usuario o del sistema
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  body.setAttribute("data-theme", savedTheme);
  toggleBtn.textContent = savedTheme === "dark" ? "☀️" : "🌙";
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  body.setAttribute("data-theme", "dark");
  toggleBtn.textContent = "☀️";
}

// Alternar tema al hacer clic
toggleBtn.addEventListener("click", () => {
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  toggleBtn.textContent = newTheme === "dark" ? "☀️" : "🌙";
});

// Inicializa la aplicación
document.addEventListener('DOMContentLoaded', init);
