  const container = document.getElementById('applicationCrud');
  let editingId = null;

  async function loadQuestions() {
    const res = await fetch('http://a24oleproyat.daw.inspedralbes.cat/src/php/crud.php');
    const questions = await res.json();

    container.innerHTML = `
      <h1>Listado de Preguntas</h1>
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>ID</th><th>Pregunta</th><th>Respuestas</th><th>Correcta</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${questions.map(q => `
            <tr>
              <td>${q.id}</td>
              <td>${escapeHtml(q.question)}</td>
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
        <input type="text" name="question" placeholder="Pregunta" required><br>
        <input type="text" name="answer1" placeholder="Respuesta 1" required><br>
        <input type="text" name="answer2" placeholder="Respuesta 2" required><br>
        <input type="text" name="answer3" placeholder="Respuesta 3" required><br>
        <input type="text" name="answer4" placeholder="Respuesta 4" required><br>
        <input type="number" name="correct_answer" placeholder="Correcta (1-4)" min="1" max="4" required><br>
        <button type="submit">${editingId ? 'Guardar Cambios' : 'Agregar Pregunta'}</button>
        ${editingId ? '<button type="button" id="cancelEdit">Cancelar</button>' : ''}
      </form>
    `;

    document.getElementById('formQuestion').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      if (editingId) {
        data.id = editingId;
        data._method = "PUT";
        await fetch('http://a24oleproyat.daw.inspedralbes.cat/projecteProdProva/src/php/crud.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        editingId = null;
      } else {
        await fetch('php/crud.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      }
      loadQuestions();
    });

    if (editingId) {
      document.getElementById('cancelEdit').addEventListener('click', () => {
        editingId = null;
        loadQuestions();
      });
      fillForm(editingId, questions);
    }
  }

  function fillForm(id, questions) {
    const question = questions.find(q => q.id === id);
    if (!question) return;
    const form = document.getElementById('formQuestion');
    form.question.value = question.question;
    form.answer1.value = question.answer1;
    form.answer2.value = question.answer2;
    form.answer3.value = question.answer3;
    form.answer4.value = question.answer4;
    form.correct_answer.value = question.correct_answer;
  }

  async function deleteQuestion(id) {
    if (confirm("¿Seguro que quieres borrar esta pregunta?")) {
      await fetch('http://a24oleproyat.daw.inspedralbes.cat/projecteProdProva/src/php/crud.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, _method: "DELETE" })
      });
      loadQuestions();
    }
  }
  window.deleteQuestion = deleteQuestion;

  function editQuestion(id) {
    editingId = id;
    loadQuestions();
  }
  window.editQuestion = editQuestion;

  // Escapar HTML para evitar XSS
  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, function(m) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m];
    });
  }

  loadQuestions();    