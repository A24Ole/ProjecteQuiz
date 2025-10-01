const API_URL = 'http://a24oleproyat.daw.inspedralbes.cat/src/php/crud.php';
const container = document.getElementById('applicationCrud');
let editingId = null;


async function loadQuestions() {
  const res = await fetch(API_URL);
  const questions = await res.json();

  container.innerHTML = `
    <h1>Listado de Preguntas</h1>
    <table border="1" style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th>ID</th><th>Imagen</th><th>Respuestas</th><th>Correcta</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${questions.map(q => `
          <tr>
            <td>${q.id}</td>
            <td>
              ${q.imagen ? `<img src="${escapeHtml(q.imagen)}" alt="Imagen" style="max-width:100px;max-height:100px;">` : ''}
            </td>
            <td>
              1) ${escapeHtml(q.answer1)}<br>
              2) ${escapeHtml(q.answer2)}<br>
              3) ${escapeHtml(q.answer3)}<br>
              4) ${escapeHtml(q.answer4)}
            </td>
            <td>${q.correct_answer}</td>
            <td>
              <button onclick="editQuestion(${q.id})">Editar</button>
              <button onclick="deleteQuestion(${q.id})">Borrar</button>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>

    <h2>${editingId ? 'Editar Pregunta' : 'Añadir Nueva Pregunta'}</h2>
    <form id="formQuestion">
      <input type="text" name="imagen" placeholder="URL de la imagen"><br>
      <input type="text" name="answer1" placeholder="Respuesta 1" required><br>
      <input type="text" name="answer2" placeholder="Respuesta 2" required><br>
      <input type="text" name="answer3" placeholder="Respuesta 3" required><br>
      <input type="text" name="answer4" placeholder="Respuesta 4" required><br>
      <input type="number" name="correct_answer" placeholder="Correcta (1-4)" min="1" max="4" required><br>
      <button type="submit">${editingId ? 'Guardar Cambios' : 'Agregar Pregunta'}</button>
      ${editingId ? '<button type="button" id="cancelEdit">Cancelar</button>' : ''}
    </form>
  `;

  const form = document.getElementById('formQuestion');
  if (!form) {
    console.error('El formulario "formQuestion" no fue encontrado');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const dataObj = Object.fromEntries(formData.entries());

    if (editingId) {
      dataObj.id = editingId;
      dataObj._method = 'PUT';
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataObj)
      });
      const result = await response.json();
      if (!response.ok) {
        console.error('Error del servidor:', result.error);
        alert('Error: ' + result.error);
      } else {
        editingId = null;
        loadQuestions();
      }
    } catch (error) {
      console.error('Error en la red:', error);
      alert('Error en la red: ' + error.message);
    }
  });

  if (editingId) {
    document.getElementById('cancelEdit').addEventListener('click', () => {
      editingId = null;
      loadQuestions();
    });
    fillForm(editingId, questions);
  }
}

async function deleteQuestion(id) {
  if (confirm("¿Seguro que quieres borrar esta pregunta?")) {
    const dataObj = { id: id, _method: 'DELETE' };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataObj)
      });
      const result = await response.json();
      if (!response.ok) {
        console.error('Error al borrar:', result.error);
        alert('Error al borrar: ' + result.error);
      } else {
        loadQuestions();
      }
    } catch (error) {
      console.error('Error en la red:', error);
      alert('Error en la red: ' + error.message);
    }
  }
}

window.deleteQuestion = deleteQuestion;
window.editQuestion = editQuestion;

function fillForm(id, questions) {
  const question = questions.find(q => q.id === id);
  if (!question) return;
  const form = document.getElementById('formQuestion');
  form.imagen.value = question.imagen || '';
  form.answer1.value = question.answer1 || '';
  form.answer2.value = question.answer2 || '';
  form.answer3.value = question.answer3 || '';
  form.answer4.value = question.answer4 || '';
  form.correct_answer.value = question.correct_answer || '';
}

function editQuestion(id) {
  editingId = id;
  loadQuestions();
}

function escapeHtml(text) {
  if (typeof text !== 'string') {
    text = text === undefined || text === null ? '' : String(text);
  }
  return text.replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);
}

loadQuestions();

// Variables globales