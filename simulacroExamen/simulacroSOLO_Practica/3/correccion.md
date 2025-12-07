
## Apartado 1 – Configuración de Express, vistas y `app.locals` (2 pt)

### 1.1. Configuración de vistas + middlewares (TODO 1 y 2)

```js
// app.js
var createError   = require('http-errors');
var express       = require('express');
var path          = require('path');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');

var indexRouter   = require('./routes/index');
var authRouter    = require('./routes/auth');
var adminRouter   = require('./routes/admin');

var app = express();

// TODO 1: configurar vistas (views + motor ejs)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// TODO 2: middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'eventhub-secret',
  resave: false,
  saveUninitialized: false
}));

// TODO 3, TODO 4 irían aquí...

// Rutas...
```


### 1.2. `res.locals.currentUser` (TODO 3)

```js
// TODO 3: res.locals.currentUser
app.use(function (req, res, next) {
  res.locals.currentUser = req.session.user || null;
  next();
});
```


### 1.3. `app.locals.siteName` y `siteDescription` (TODO 4)

**a- En `app.js`:**

```js
// TODO 4: app.locals.siteName y siteDescription
app.locals.siteName = 'EventHub';
app.locals.siteDescription = 'Gestión sencilla de eventos';
```

**b- `views/layout.ejs` modificado:**

```ejs
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <title><%= siteName %> - <%= siteDescription %></title>
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body>
    <header>
      <h1><%= siteName %> - <%= siteDescription %></h1>
    </header>
    <main>
      <%- body %>
    </main>
  </body>
</html>
```


## Apartado 2 – Login, logout, `requireAuth` y roles (3 pt)

### 2.1. POST `/auth/login`

```js
// routes/auth.js
var express = require('express');
var router = express.Router();
var db = require('../database');

// GET /auth/login
router.get('/login', function(req, res) {
  res.render('login', {
    title: 'Login',
    error: null
  });
});

// POST /auth/login
router.post('/login', function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const user = db.users.data[username];

  if (user && user.password === password) {
    // credenciales correctas
    req.session.user = user;
    return res.redirect('/events');
  } else {
    // credenciales incorrectas
    return res.render('login', {
      title: 'Login',
      error: 'Credenciales incorrectas'
    });
  }
});

// TODO: POST /auth/logout

module.exports = router;
```


### 2.2. POST `/auth/logout`

```js
// POST /auth/logout
router.post('/logout', function (req, res) {
  req.session.destroy(function (err) {
    // ignoramos err en este examen
    res.redirect('/');
  });
});
```


### 2.3. `requireAuth` en `routes/index.js`

```js
// routes/index.js
var express = require('express');
var router = express.Router();
var db = require('../database');

// TODO: requireAuth
function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
}

router.get('/', function(req, res) {
  res.render('index', { title: 'Bienvenido a EventHub' });
});

// Solo /events requiere login
router.get('/events', requireAuth, function(req, res) {
  const events = db.events.data;
  res.render('events', { title: 'Eventos disponibles', events: events });
});

module.exports = router;
```


### 2.4. `requireAdmin` en `routes/admin.js`

```js
// routes/admin.js
var express = require('express');
var router = express.Router();
var db = require('../database');

// Middleware requireAuth (reutilizado aquí)
function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
}

// Middleware requireAdmin
function requireAdmin(req, res, next) {
  const user = req.session.user;
  if (!user || user.role !== 'admin') {
    // podría ser res.status(403).send('Prohibido');
    return res.redirect('/');
  }
  next();
}

// Todas las rutas de /admin pasan por ambos
router.use(requireAuth);
router.use(requireAdmin);

router.get('/events', function(req, res) {
  const events = db.events.data;
  res.render('admin_events', { title: 'Admin eventos', events: events });
});

router.get('/users', function(req, res) {
  const users = db.users.data;
  res.render('admin_users', { title: 'Admin usuarios', users: users });
});

module.exports = router;
```


## Apartado 3 – EJS, arrays, objetos y condicionales (2,5 pt)

### 3.1. `<main>` de `events.ejs` (array)

```ejs
<main>
  <h2><%= title %></h2>

  <% if (!events || events.length === 0) { %>
    <p>No hay eventos disponibles</p>
  <% } else { %>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Ciudad</th>
          <th>Plazas</th>
        </tr>
      </thead>
      <tbody>
        <% events.forEach(function(evento) { %>
          <tr>
            <td><%= evento.id %></td>
            <td><%= evento.name %></td>
            <td><%= evento.city %></td>
            <td><%= evento.seats %></td>
          </tr>
        <% }); %>
      </tbody>
    </table>
  <% } %>
</main>
```


### 3.2. `admin_users.ejs` (objeto)

**a- Recorrer objeto `users`:**

```ejs
<h2><%= title %></h2>

<table>
  <thead>
    <tr>
      <th>Username</th>
      <th>Rol</th>
      <th>Cookies</th>
    </tr>
  </thead>
  <tbody>
    <% Object.keys(users).forEach(function (key) {
         var user = users[key];
    %>
      <tr>
        <td><%= user.username %></td>
        <td><%= user.role %></td>
        <td><%= user.acceptedCookies ? 'Sí' : 'No' %></td>
      </tr>
    <% }); %>
  </tbody>
</table>
```

(también valdría `Object.values(users).forEach(function(user) { ... })`).

**b-  Por qué no funcionaría `users.forEach(...)`**

Porque `users` es un **objeto normal**:

```js
{
  "admin": {...},
  "marta": {...},
  "pablo": {...}
}
```

y **no** un array.
Los objetos en JS no tienen método `.forEach()`, así que hacer `users.forEach(...)` daría error de tipo (`users.forEach is not a function`).
Primero hay que convertirlo a array de claves (`Object.keys`) o de valores (`Object.values`).


## Apartado 4 – Banner de cookies (2 pt)

### 4.1. Lógica de cuándo mostrarlo

**a-  Condición lógica (en palabras y “código”):**

Mostrar el banner cuando:

* el usuario **no** ha aceptado cookies en la sesión actual
  `req.session.cookiesAccepted !== true`
* **y además**, si está logueado, su `acceptedCookies` en BD es `false`:

```js
!req.session.cookiesAccepted &&
(
  !req.session.user ||
  req.session.user.acceptedCookies === false
)
```

**b - Condición EJS aproximada:**

Suponiendo que en las vistas tienes:

* `cookiesAccepted` (copiado de la sesión),
* `currentUser` (el usuario logueado):

```ejs
<% if (!cookiesAccepted && (!currentUser || !currentUser.acceptedCookies)) { %>
  <!-- aquí va el banner de cookies -->
  <div class="cookie-banner">
    ...
  </div>
<% } %>
```

### 4.2. `routes/cookies.js` + `app.use`

**`routes/cookies.js`:**

```js
// routes/cookies.js
var express = require('express');
var router = express.Router();
var db = require('../database');

router.post('/accept', function (req, res) {
  // marcar en sesión
  req.session.cookiesAccepted = true;

  // si hay usuario logueado, actualizar BD
  if (req.session.user) {
    const username = req.session.user.username;
    if (db.users.data[username]) {
      db.users.data[username].acceptedCookies = true;
    }
  }

  // volver a la página principal
  res.redirect('/');
});

module.exports = router;
```

**En `app.js`:**

```js
var cookiesRouter = require('./routes/cookies');
app.use('/cookies', cookiesRouter);
```


### 4.3. Botón Rechazar

**a) Solo HTML (sin backend):**

Por ejemplo:

```html
<a href="https://www.wikipedia.org">
  <button type="button">Rechazar</button>
</a>
```

o directamente:

```html
<button type="button" onclick="window.location.href='https://www.wikipedia.org'">
  Rechazar
</button>
```

**b) Por qué no guardar nada en sesión/BD al rechazar**

Porque “rechazar” aquí significa **no dar consentimiento a las cookies**, así que lo más coherente en este ejercicio es **no guardar nada extra** (no crear más cookies ni tocar la BD).
Además, el enunciado solo pide redirigir fuera (Wikipedia), no seguir usando la aplicación ni recordar su decisión.


## 🧩 Apartado 5 – JSON y `package.json` (1,5 pt)

### 5.1. Corrección JSON

JSON dado:

```json
{
  "id": 3,
  "name": "Hackathon Web",
  "city": "Gijon",
  "tags": ["web", "javascript", ],
  seats: 80,
  "online": true,
}
```

**a)** No es JSON válido.

**b) JSON corregido:**

```json
{
  "id": 3,
  "name": "Hackathon Web",
  "city": "Gijon",
  "tags": ["web", "javascript"],
  "seats": 80,
  "online": true
}
```

**c) Errores corregidos (al menos 3):**

1. Coma sobrante dentro del array: `"javascript", ]` → en JSON no se permiten comas finales en arrays.
2. Clave `seats` sin comillas → en JSON todas las claves deben ir entre comillas: `"seats"`.
3. Coma sobrante después del último campo `"online": true,` → tampoco se permiten comas finales en objetos.


### 5.2. `scripts` en `package.json`

```json
"scripts": {
  "start": "node ./bin/www"
}
```

Con eso, `npm start` ejecuta `node ./bin/www`.



## Apartado 6 – Socket.io BONUS (0,5 pt)

### 6.1. Línea que falta en el servidor

```js
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.join('eventhub');

  socket.on('new-event', (data) => {
    // notificar a todos los clientes de la room "eventhub"
    io.to('eventhub').emit('event-created', data);
  });
});
```

### 6.2. Explicar el flujo completo (3–4 frases)

1. En el navegador del admin, se ejecuta:

   ```js
   socket.emit('new-event', { name: 'Conferencia JS', city: 'Sevilla' });
   ```

   y ese evento viaja al servidor a través de la conexión de Socket.io.

2. En el servidor, dentro de `io.on('connection')`, el `socket.on('new-event', ...)` recibe esos datos (`data`) y ejecuta:

   ```js
   io.to('eventhub').emit('event-created', data);
   ```

3. Eso envía el evento `'event-created'` con `data` a **todos los sockets** que están en la sala `"eventhub"` (incluido el admin si también está en esa room).

4. En cada cliente, el listener:

   ```js
   socket.on('event-created', (data) => {
     console.log('Nuevo evento creado:', data);
   });
   ```

   se dispara y muestra en la consola del navegador el mensaje con los datos del nuevo evento.
