# ProjecteQuiz

Aplicació web per a fer un quiz de marques de cotxes i administrar les preguntes amb un panell CRUD.

---

## Estructura

- index.html: El quiz per als usuaris.
- crud.html: Panell d’administració de preguntes.
- js/script.js: Lògica del quiz (usuari, preguntes i resultat).
- js/scriptCrud.js: Lògica del CRUD (afegir, editar, borrar preguntes).
- src/php/quiz.php: Endpoint per obtenir preguntes.
- src/php/crud.php: Endpoint per gestionar preguntes a la base de dades MySQL.
- css/style.css: Estils compartits.

---

## Funcions

### Quiz

- Sol·licita el nom del jugador (guardat amb localStorage).
- Presenta 10 preguntes aleatòries amb imatge i 4 opcions.
- Mostra el temps en pantalla.
- Informa del resultat final i permet tornar a jugar.

### CRUD

- Llista totes les preguntes amb les respostes i la imatge.
- Formulari per afegir, editar o eliminar preguntes.
- Actualització automàtica després de cada acció.

---

## Instal·lació

- Puja els arxius a un servidor amb PHP i MySQL.
- Configura la base de dades i les credencials.
- Obre index.html per jugar i crud.html per administrar preguntes.

---

