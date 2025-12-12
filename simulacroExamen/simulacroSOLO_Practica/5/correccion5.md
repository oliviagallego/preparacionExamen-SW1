
## 1. Configuración de Express y variables globales (2 puntos)

### 1.1. Vistas y middlewares básicos (1 punto)

#### TODO (1) – configuración de vistas

```js
// TODO (1): configurar vistas (views y motor EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
```

#### TODO (2) – middlewares básicos

```js
// TODO (2): middlewares básicos (json, urlencoded, cookieParser, estáticos)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
```

---

### 1.2. Usuario actual en `res.locals` (0,5 puntos)

#### TODO (3)

```js
// TODO (3): middleware para poner req.session.user en res.locals.currentUser
app.use(function (req, res, next) {
  res.locals.currentUser = req.session.user; // puede ser undefined
  next();
});
```

---

### 1.3. `app.locals.appName` y tagline (0,5 puntos)

#### a) En `app.js` (TODO (4))

```js
// TODO (4): app.locals.appName y app.locals.tagline
app.locals.appName  = 'StudyBoard';
app.locals.tagline  = 'Organiza tus asignaturas y tareas';
```

#### b) `views/layout.ejs` usando esas variables

```ejs
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <title><%= appName %> - <%= tagline %></title>
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body>
    <header>
      <h1><%= appName %> - <%= tagline %></h1>
    </header>
    <main>
      <%- body %>
    </main>
  </body>
</html>
```

---

## 2. Login, logout y middlewares de autenticación y roles (3 puntos)

### 2.1. Ruta POST `/auth/login` (1,5 puntos)

En `routes/auth.js`:

```js
// POST /auth/login
router.post('/login', function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const user = db.users.data[username];

  if (!user || user.password !== password) {
    return res.render('login', {
      title: 'Iniciar sesión',
      error: 'Usuario o contraseña incorrectos'
    });
  }

  // credenciales correctas
  req.session.user = user;
  res.redirect('/subjects');
});
```

---

### 2.2. Ruta POST `/auth/logout` (0,5 puntos)

Versión sencilla (eliminar usuario de sesión):

```js
// POST /auth/logout
router.post('/logout', function (req, res) {
  req.session.user = null;    // o delete req.session.user;
  res.redirect('/');
});
```

(Alternativa válida: `req.session.destroy(...)`, pero no es obligatorio.)

---

### 2.3. `requireAuth` y `requireAdmin` (1 punto)

#### a) Middleware `requireAuth`

```js
function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
}
```

#### b) Middleware `requireAdmin`

```js
function requireAdmin(req, res, next) {
  const user = req.session.user; // asumimos que existe

  if (!user || user.role !== 'admin') {
    return res.status(403).send('Prohibido');
    // o: return res.redirect('/');
  }

  next();
}
```

#### c) Aplicarlos en `tasks.js` e `index.js`

**routes/tasks.js**

```js
var express = require('express');
var router = express.Router();
var db = require('../database');

// requireAuth definido aquí o importado de otro módulo
function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
}

// aplicar a TODAS las rutas de /tasks
router.use(requireAuth);

router.get('/', function (req, res) {
  const tasks = db.tasks.data;
  res.render('tasks', { title: 'Mis tareas', tasks: tasks });
});

module.exports = router;
```

**routes/index.js**

```js
var express = require('express');
var router = express.Router();
var db = require('../database');

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
}

function requireAdmin(req, res, next) {
  const user = req.session.user;
  if (!user || user.role !== 'admin') {
    return res.status(403).send('Prohibido');
  }
  next();
}

router.get('/', function (req, res) {
  res.render('index', { title: 'Bienvenido a StudyBoard' });
});

// sólo en /admin/users
router.get('/admin/users', requireAuth, requireAdmin, function (req, res) {
  const users = db.users.data;
  res.render('admin_users', {
    title: 'Administrar usuarios',
    users: users
  });
});

module.exports = router;
```

---

## 3. EJS: arrays vs objetos, condicionales (2,5 puntos)

### 3.1. Lista de asignaturas (`subjects.ejs`) (1 punto)

Dentro de `<main>`:

```ejs
<h2><%= title %></h2>

<% if (!subjects || subjects.length === 0) { %>
  <p>No tienes asignaturas aún.</p>
<% } else { %>
  <ul>
    <% subjects.forEach(function (subject) { %>
      <li><%= subject.name %></li>
    <% }); %>
  </ul>
<% } %>
```

---

### 3.2. Lista de tareas (`tasks.ejs`) (1,5 puntos)

#### a) Tabla + if de vacío

```ejs
<h2><%= title %></h2>

<% if (!tasks || tasks.length === 0) { %>
  <p>No tienes tareas pendientes.</p>
<% } else { %>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Asignatura</th>
        <th>Título</th>
        <th>Estado</th>
      </tr>
    </thead>
    <tbody>
      <% tasks.forEach(function (task) { %>
        <tr>
          <td><%= task.id %></td>
          <td><%= task.subjectId %></td>
          <td><%= task.title %></td>
          <td><%= task.done ? 'Hecha' : 'Pendiente' %></td>
        </tr>
      <% }); %>
    </tbody>
  </table>
<% } %>
```

#### b) Si `tasks` fuera un objeto con ids como claves

Si `tasks` fuera algo así como:

```js
tasks = {
  "1": { id: 1, ... },
  "2": { id: 2, ... }
};
```

ya **no** podríamos hacer `tasks.forEach(...)` porque `forEach` es de arrays.

Opciones:

* Convertir a array en el controlador antes de renderizar, o
* En la vista, usar `Object.keys(tasks).forEach(...)`:

```ejs
<% Object.keys(tasks).forEach(function (id) { 
     const task = tasks[id]; %>
  <tr>
    <td><%= task.id %></td>
    ...
  </tr>
<% }); %>
```

La idea: como es un objeto, hay que iterar sobre sus claves; `forEach` directo no valdría.

---

## 4. Banner de cookies y sesión/BD (2 puntos)

### 4.1. Condición en la vista (0,75 puntos)

#### a) Pseudocódigo condición “mostrar banner”

> Mostrar el banner si:
>
> * en sesión **no** está `cookiesAccepted = true`, **y además**
> * si hay usuario logueado, en BD `acceptedCookies` es `false`.

Pseudocódigo:

```txt
if (req.session.cookiesAccepted !== true
    AND (
      req.session.user does NOT exist
      OR req.session.user.acceptedCookies === false
    )) {
  mostrar banner
}
```

Es decir:

```js
if (
  req.session.cookiesAccepted !== true &&
  (!req.session.user || req.session.user.acceptedCookies === false)
) {
  // mostrar banner
}
```

#### b) Condición EJS aproximada

Suponiendo que en `res.locals` tenemos:

* `cookiesAccepted` ← `req.session.cookiesAccepted`
* `currentUser` ← `req.session.user`

```ejs
<% if (!cookiesAccepted && (!currentUser || !currentUser.acceptedCookies)) { %>
  <div class="cookie-banner">
    Usamos cookies para mejorar tu experiencia.
    <!-- botones aquí -->
  </div>
<% } %>
```

---

### 4.2. Ruta POST `/cookies/accept` (0,75 puntos)

**routes/cookies.js**

```js
// routes/cookies.js
var express = require('express');
var router  = express.Router();
var db      = require('../database');

router.post('/accept', function (req, res) {
  // marcar en sesión
  req.session.cookiesAccepted = true;

  // si hay usuario logueado, actualizar también en "BD"
  if (req.session.user) {
    const username = req.session.user.username;
    db.users.data[username].acceptedCookies = true;
    // opcional: actualizar copia en sesión
    req.session.user.acceptedCookies = true;
  }

  res.redirect('/');
});

module.exports = router;
```

**Línea a añadir en `app.js`**

Arriba:

```js
var cookiesRouter = require('./routes/cookies');
```

Y en la configuración de rutas:

```js
app.use('/cookies', cookiesRouter);
```

---

### 4.3. Botón “Rechazar” (0,5 puntos)

#### a) HTML del botón/enlace

Por ejemplo, en el banner:

```html
<a href="https://www.google.com" class="btn btn-secondary">
  Rechazar
</a>
```

(o un `<button>` con `onclick="window.location.href='https://www.google.com'"`, etc.)

#### b) Por qué no hace falta tocar sesión o BD al rechazar

En este ejercicio, **solo** tenemos la lógica de “aceptar” cookies.
Si el usuario pulsa “Rechazar” y lo mandamos fuera (a Google), al volver no hemos marcado nada en la sesión ni en la BD:

* `req.session.cookiesAccepted` seguirá siendo `undefined` o `false`.
* `acceptedCookies` en BD seguirá siendo `false`.

Por tanto, la condición del banner seguirá siendo verdadera y se seguirá mostrando; no necesitamos guardar un “rechazo permanente”, sólo registramos el caso de aceptación.

---

## 5. JSON y package.json (1,5 puntos)

### 5.1. Corregir JSON (1 punto)

JSON dado:

```json
{
  "id": 4,
  "title": "Repasar JSON",
  "done": false,
  "tags": ["json", "node", ],
  estimatedMinutes: 30
}
```

#### a) ¿Es un JSON válido?

No, **no es válido**.

#### b) JSON corregido

```json
{
  "id": 4,
  "title": "Repasar JSON",
  "done": false,
  "tags": ["json", "node"],
  "estimatedMinutes": 30
}
```

#### c) Errores concretos corregidos (al menos 3)

1. Había una **coma sobrante** después de `"node"` dentro del array `"tags"` → en JSON no se permiten comas finales en arrays.
2. La clave `estimatedMinutes` no estaba entre comillas → en JSON todas las claves deben ir entre **comillas dobles**.
3. Ahora todas las claves del objeto cumplen el requisito de estar entre comillas dobles (antes había al menos una que no lo cumplía).

(Otros comentarios posibles: antes, tal y como estaba, ningún parser JSON estándar lo aceptaría por la coma extra y la clave sin comillas.)

---

### 5.2. Script `start` en `package.json` (0,5 puntos)

Dado:

```json
{
  "name": "studyboard",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

El servidor se arranca desde `./bin/www`.
Queremos poder hacer `npm start`.

```json
"scripts": {
  "start": "node ./bin/www"
}
```

Resultado completo:

```json
{
  "name": "studyboard",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "start": "node ./bin/www"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

---

## 6. Socket.io – Notificar nuevas tareas (BONUS 0,5 puntos)

### 6.1. Servidor (0,25 puntos)

Dentro del `socket.on('new-task', ...)`:

```js
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.join('tasks-room');

  socket.on('new-task', (taskData) => {
    // TODO: emitir un mensaje a todos los clientes de la room "tasks-room"
    // con el evento 'task-created' y los datos taskData
    io.to('tasks-room').emit('task-created', taskData);
  });
});
```

---

### 6.2. Cliente (0,25 puntos) – flujo

Código cliente:

```js
const socket = io();

socket.on('task-created', (task) => {
  console.log('Nueva tarea creada:', task.title);
});
```

Cuando un usuario ejecuta:

```js
socket.emit('new-task', { title: 'Hacer simulacro', subjectId: 1, done: false });
```

ocurre lo siguiente:

1. Ese cliente envía al servidor el evento `new-task` con los datos de la tarea.
2. En el servidor, dentro de `socket.on('new-task', ...)`, se recibe `taskData` y se ejecuta `io.to('tasks-room').emit('task-created', taskData);`.
3. Socket.io envía el evento `task-created` con esos datos a **todos los sockets** que estén en la sala `"tasks-room"` (incluido normalmente el emisor).
4. En cada cliente que tenga el listener `socket.on('task-created', ...)`, se ejecuta el callback y se muestra por consola:
   `Nueva tarea creada: Hacer simulacro`.
