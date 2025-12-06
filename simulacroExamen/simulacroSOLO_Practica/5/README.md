# Simulacro práctico – Sistemas Web I (Práctica)

**Formato:** examen a papel (2 horas)
**Asignatura:** Sistemas Web I
**Tecnologías:** HTML, CSS, JS, Node.js, Express, EJS, sesiones, JSON, Socket.io (hasta sockets, sin más)


## 0. Contexto general

Estamos desarrollando una aplicación llamada **StudyBoard**, una web sencilla para gestionar **asignaturas** y **tareas** de los alumnos.

Estructura del proyecto:

```txt
studyboard/
 ├─ bin/
 │   └─ www
 ├─ app.js
 ├─ database.js
 ├─ package.json
 ├─ routes/
 │   ├─ index.js
 │   ├─ auth.js
 │   └─ tasks.js
 ├─ views/
 │   ├─ layout.ejs
 │   ├─ index.ejs
 │   ├─ login.ejs
 │   ├─ subjects.ejs
 │   ├─ tasks.ejs
 │   └─ admin_users.ejs
 └─ public/
     ├─ styles.css
     └─ js/
         └─ main.js
```

Fichero `database.js`:

```js
// database.js
const db = {
  users: {
    data: {
      "admin": {
        username: "admin",
        password: "admin",
        role: "admin",
        acceptedCookies: false
      },
      "alicia": {
        username: "alicia",
        password: "1234",
        role: "student",
        acceptedCookies: false
      },
      "diego": {
        username: "diego",
        password: "1234",
        role: "student",
        acceptedCookies: true
      }
    }
  },
  subjects: {
    data: [
      { id: 1, name: "Sistemas Web I" },
      { id: 2, name: "Algoritmia" },
      { id: 3, name: "Bases de Datos" }
    ]
  },
  tasks: {
    data: [
      { id: 1, subjectId: 1, title: "Práctica Express", done: false },
      { id: 2, subjectId: 2, title: "Listas enlazadas", done: true  }
    ]
  }
};

module.exports = db;
```

Fichero `app.js` (resumen con huecos):

```js
// app.js
var createError   = require('http-errors');
var express       = require('express');
var path          = require('path');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');

var indexRouter   = require('./routes/index');
var authRouter    = require('./routes/auth');
var tasksRouter   = require('./routes/tasks');
// TODO: cookiesRouter para el banner de cookies

var app = express();

// TODO (1): configurar vistas (views y motor EJS)

// TODO (2): middlewares básicos (json, urlencoded, cookieParser, estáticos)

app.use(session({
  secret: 'studyboard-secret',
  resave: false,
  saveUninitialized: false
}));

// TODO (3): middleware para poner req.session.user en res.locals.currentUser

// TODO (4): app.locals.appName y app.locals.tagline

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/tasks', tasksRouter);
// TODO: app.use('/cookies', cookiesRouter);

// 404
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
```


## 1. Configuración de Express y variables globales (2 puntos)

### 1.1. Vistas y middlewares básicos (1 punto)

Rellena los **TODO (1)** y **TODO (2)** de `app.js`:

1. Configurar las vistas:

   * carpeta de vistas: `views` dentro del directorio actual,
   * motor de plantillas: `ejs`.

2. Añadir los middlewares básicos:

   * `express.json()`
   * `express.urlencoded({ extended: false })`
   * `cookieParser()`
   * servir estáticos desde `public`.

Escribe el código completo que añadirías en esas zonas de `app.js` (no hace falta repetir todo el fichero).


### 1.2. Usuario actual en `res.locals` (0,5 puntos)

Completa el **TODO (3)**:

* Define un middleware que:

  * copie `req.session.user` a `res.locals.currentUser` (puede ser `undefined`),
  * llame a `next()`.

Escribe el `app.use` y la función middleware.


### 1.3. `app.locals.appName` y `tagline` (0,5 puntos)

Completa el **TODO (4)**:

* Crea estas variables globales:

  * `appName = "StudyBoard"`
  * `tagline = "Organiza tus asignaturas y tareas"`

* a- Escribe las líneas necesarias en `app.js`.
* b- Modifica este fragmento de `views/layout.ejs` para que use esas variables y no texto fijo:

```ejs
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <title>StudyBoard - Organiza tus asignaturas y tareas</title>
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body>
    <header>
      <h1>StudyBoard - Organiza tus asignaturas y tareas</h1>
    </header>
    <main>
      <%- body %>
    </main>
  </body>
</html>
```


## 2. Login, logout y middlewares de autenticación y roles (3 puntos)

Fichero `routes/auth.js` (parcial):

```js
var express = require('express');
var router = express.Router();
var db = require('../database');

// GET /auth/login
router.get('/login', function(req, res) {
  res.render('login', {
    title: 'Iniciar sesión',
    error: null
  });
});

// TODO: POST /auth/login

// TODO: POST /auth/logout

module.exports = router;
```

### 2.1. Ruta `POST /auth/login` (1,5 puntos)

Implementa el login:

* Recibe `username` y `password` desde `req.body`.
* Comprueba si existe `db.users.data[username]`.
* Verifica que la contraseña es correcta.
* Si las credenciales son correctas:

  * guarda el usuario en `req.session.user`,
  * redirige a `/subjects` (suponemos que esa ruta lista asignaturas).
* Si son incorrectas:

  * vuelve a pintar `login.ejs` con:

    * `title: 'Iniciar sesión'`
    * `error: 'Usuario o contraseña incorrectos'`.

Escribe la función completa para `router.post('/login', ...)`.


### 2.2. Ruta `POST /auth/logout` (0,5 puntos)

Implementa logout:

* Destruye la sesión (o al menos elimina `req.session.user`),
* Redirige a `/`.


### 2.3. `requireAuth` y `requireAdmin` (1 punto)

En `routes/tasks.js`:

```js
var express = require('express');
var router = express.Router();
var db = require('../database');

// TODO: requireAuth

router.get('/', function(req, res) {
  const tasks = db.tasks.data;
  res.render('tasks', { title: 'Mis tareas', tasks: tasks });
});

module.exports = router;
```

Y en `routes/index.js` queremos un panel de administración de usuarios:

```js
var express = require('express');
var router = express.Router();
var db = require('../database');

// TODO: requireAuth
// TODO: requireAdmin

router.get('/', function(req, res) {
  res.render('index', { title: 'Bienvenido a StudyBoard' });
});

router.get('/admin/users', function(req, res) {
  const users = db.users.data;
  res.render('admin_users', { title: 'Administrar usuarios', users: users });
});

module.exports = router;
```

a- Escribe un middleware `requireAuth(req, res, next)` que:

* si **no** existe `req.session.user`, redirija a `/auth/login`,
* si existe, llame a `next()`.

b-  Escribe un middleware `requireAdmin(req, res, next)` que:

* asuma que `req.session.user` existe,
* compruebe que `req.session.user.role === 'admin'`,
* si **no** es admin, responda con `res.status(403).send('Prohibido')` o redirija a `/`,
* si es admin, llame a `next()`.

c- Muestra cómo aplicar:

* `requireAuth` a **todas** las rutas de `/tasks`,
* `requireAuth` y `requireAdmin` a la ruta `/admin/users`.

(No hace falta escribir todo el fichero, solo las partes relevantes.)


## 3. EJS: arrays vs objetos, condicionales (2,5 puntos)

### 3.1. Lista de asignaturas (`subjects.ejs`) (1 punto)

En `routes/index.js` tenemos:

```js
router.get('/subjects', function(req, res) {
  const subjects = db.subjects.data; // array
  res.render('subjects', { title: 'Mis asignaturas', subjects: subjects });
});
```

`subjects` es un array de objetos como:

```js
[
  { id: 1, name: "Sistemas Web I" },
  { id: 2, name: "Algoritmia" },
  { id: 3, name: "Bases de Datos" }
]
```

En la vista `subjects.ejs`:

1. Muestra `<h2><%= title %></h2>`.
2. Si `subjects` está vacío, muestra:
   `No tienes asignaturas aún.`
3. Si **no** está vacío, muestra una lista `<ul>` con un `<li>` por asignatura con su nombre.

Escribe el fragmento EJS que iría dentro del `<main>`.

### 3.2. Lista de tareas (`tasks.ejs`) (1,5 puntos)

En `routes/tasks.js`:

```js
router.get('/', function(req, res) {
  const tasks = db.tasks.data; // array
  res.render('tasks', { title: 'Mis tareas', tasks: tasks });
});
```

Cada tarea tiene:

```js
{ id, subjectId, title, done }
```

En `tasks.ejs` queremos:

* Mostrar `<h2><%= title %></h2>`.
* Si no hay tareas, mostrar `No tienes tareas pendientes.`
* Si hay tareas, mostrar una tabla con columnas:

  * ID
  * Asignatura (subjectId)
  * Título
  * Estado (texto “Hecha” si `done` es `true`, “Pendiente” si `false`).

* a- Escribe el EJS necesario para hacer esto (tabla + if de vacío).
* b- Explica brevemente cómo lo cambiarías si `tasks` fuese un **objeto** con ids como claves (por qué `forEach` ya no valdría directamente).


## 4. Banner de cookies y sesión/BD (2 puntos)

Queremos un **banner de cookies** en la parte de abajo de todas las páginas:

* Texto: `"Usamos cookies para mejorar tu experiencia."`
* Botón “Aceptar”
* Botón “Rechazar”

Lógica:

* Mostrar el banner si:

  * en sesión **no** está `cookiesAccepted = true`, **y además**
  * si hay usuario logueado y en BD `acceptedCookies` es `false`.

### 4.1. Condición en la vista (0,75 puntos)

* a- Escribe la condición lógica en pseudocódigo para “mostrar banner”. Usa:

* `req.session.cookiesAccepted`
* `req.session.user`
* `req.session.user.acceptedCookies`

* b- Escribe una condición EJS aproximada para `layout.ejs`:

```ejs
<% if ( /* condición */ ) { %>
  <div class="cookie-banner">
    Usamos cookies para mejorar tu experiencia.
    <!-- botones aquí -->
  </div>
<% } %>
```


### 4.2. Ruta `POST /cookies/accept` (0,75 puntos)

Crea un router `routes/cookies.js` con:

* Import de `express` y `../database`.
* Definición de `router`.
* Ruta `POST /accept` que:

  * haga `req.session.cookiesAccepted = true;`

  * si hay usuario en sesión, haga:

    ```js
    const username = req.session.user.username;
    db.users.data[username].acceptedCookies = true;
    ```

  * redirija a `/`.

Escribe el contenido de `routes/cookies.js` y la línea que habría que añadir en `app.js` para usarlo.


### 4.3. Botón “Rechazar” (0,5 puntos)

Queremos que el botón **Rechazar** lleve a `https://www.google.com`.

* a- Escribe un posible HTML del botón/enlace que haga eso sin tocar el backend.
* b- Explica por qué en este ejercicio **no hace falta** modificar sesión o BD cuando se pulsa Rechazar (justifica en 2–3 líneas).


## 5. JSON y `package.json` (1,5 puntos)

### 5.1. Corregir JSON (1 punto)

Analiza este JSON que representa una tarea:

```json
{
  "id": 4,
  "title": "Repasar JSON",
  "done": false,
  "tags": ["json", "node", ],
  estimatedMinutes: 30
}
```

* a- ¿Es un JSON válido?
* b- Corrígelo para que sea JSON completamente válido.
* c- Indica al menos **tres errores concretos** que has corregido.


### 5.2. Script `start` en `package.json` (0,5 puntos)

`package.json`:

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

El servidor Express se arranca desde `./bin/www` como en los ejemplos de clase.
Queremos poder arrancar la aplicación con:

```bash
npm start
```

Escribe el contenido completo del objeto `"scripts"` adecuado para esto.


## 6. Socket.io – Notificar nuevas tareas (BONUS 0,5 puntos)

Queremos usar Socket.io para notificar en tiempo real que se ha creado una nueva tarea.

### 6.1. Servidor (0,25 puntos)

En el servidor:

```js
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.join('tasks-room');

  socket.on('new-task', (taskData) => {
    // TODO: emitir un mensaje a todos los clientes de la room "tasks-room"
    // con el evento 'task-created' y los datos taskData
  });
});
```

Escribe la línea que falta en el `TODO`.


### 6.2. Cliente (0,25 puntos)

En el cliente tenemos:

```js
const socket = io();

socket.on('task-created', (task) => {
  console.log('Nueva tarea creada:', task.title);
});
```

Explica en 3–4 líneas qué ocurre (flujo completo) cuando un usuario ejecuta en el cliente:

```js
socket.emit('new-task', { title: 'Hacer simulacro', subjectId: 1, done: false });
```

hasta que el resto de clientes ven el mensaje en consola.
