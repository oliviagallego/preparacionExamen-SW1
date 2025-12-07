## 1. Configuración de Express, vistas y variables globales (2 pt)

### 1.1. Vistas y middlewares básicos (1 pt)

En `app.js`, los TODO (1) y (2) quedarían así:

```js
var createError   = require('http-errors');
var express       = require('express');
var path          = require('path');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');

var indexRouter   = require('./routes/index');
var authRouter    = require('./routes/auth');
var adminRouter   = require('./routes/admin');
// TODO: añadir router de cookies si hace falta

var app = express();

// TODO (1): configurar vistas (carpeta y motor EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// TODO (2): middlewares básicos (json, urlencoded, cookieParser, estáticos)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'cineplus-secret',
  resave: false,
  saveUninitialized: false
}));

// TODO (3)...
```

### 1.2. Usuario actual en `res.locals` (0,5 pt)

Middleware del TODO (3):

```js
// TODO (3): middleware para guardar usuario actual en res.locals.currentUser
app.use(function (req, res, next) {
  res.locals.currentUser = req.session.user || null;
  next();
});
```


### 1.3. `app.locals.siteName` y `tagline` (0,5 pt)

**a- En `app.js` (TODO 4):**

```js
// TODO (4): configurar app.locals.siteName y app.locals.tagline
app.locals.siteName = 'CinePlus';
app.locals.tagline  = 'Tu cine de confianza online';
```

**b- `views/layout.ejs` usando esas variables:**

```ejs
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <title><%= siteName %> - <%= tagline %></title>
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body>
    <header>
      <h1><%= siteName %> - <%= tagline %></h1>
    </header>
    <main>
      <%- body %>
    </main>
  </body>
</html>
```

## 2. Login, logout y middlewares de autenticación + roles (3 pt)

### 2.1. POST `/auth/login` (1,5 pt)

En `routes/auth.js`:

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

// POST /auth/login
router.post('/login', function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const user = db.users.data[username];

  if (user && user.password === password) {
    // Credenciales correctas
    req.session.user = user;
    return res.redirect('/movies');
  } else {
    // Credenciales incorrectas
    return res.render('login', {
      title: 'Iniciar sesión',
      error: 'Usuario o contraseña incorrectos'
    });
  }
});

// TODO: POST /auth/logout

module.exports = router;
```

### 2.2. POST `/auth/logout` (0,5 pt)

```js
// POST /auth/logout
router.post('/logout', function (req, res) {
  req.session.destroy(function (err) {
    // Podríamos comprobar err, pero en el examen se suele ignorar
    res.redirect('/');
  });
});
```

(También valdría poner `req.session.user = null;` y redirigir, pero destruir la sesión es más completo.)


### 2.3. `requireAuth` y `requireAdmin` en `routes/admin.js` (1 pt)

```js
// routes/admin.js
var express = require('express');
var router = express.Router();
var db = require('../database');

// TODO: importar/definir middlewares

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
}

function requireAdmin(req, res, next) {
  const user = req.session.user;
  if (!user || user.role !== 'admin') {
    // dos opciones válidas:
    // return res.status(403).send('Prohibido');
    return res.redirect('/');
  }
  next();
}

// Todas las rutas de /admin pasan por estos middlewares
router.use(requireAuth);
router.use(requireAdmin);

router.get('/users', function(req, res) {
  const users = db.users.data;
  res.render('admin_users', { title: 'Administrar usuarios', users: users });
});

module.exports = router;
```


## 3. EJS: arrays, objetos y condicionales (2,5 pt)

### 3.1. Listado de películas (`movies.ejs`) (1,5 pt)

Dentro de `<main>` en `movies.ejs`:

```ejs
<main>
  <h2><%= title %></h2>

  <% if (!movies || movies.length === 0) { %>
    <p>No hay películas disponibles.</p>
  <% } else { %>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Puntuación</th>
        </tr>
      </thead>
      <tbody>
        <% movies.forEach(function(peli) { %>
          <tr>
            <td><%= peli.id %></td>
            <td><%= peli.title %></td>
            <td><%= peli.rating %></td>
          </tr>
        <% }); %>
      </tbody>
    </table>
  <% } %>
</main>
```

### 3.2. Listado de usuarios (`admin_users.ejs`) – objeto (1 pt)

**a- Recorrer el objeto `users`:**

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
    <% Object.keys(users).forEach(function(key) {
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

**b- Por qué no funciona `users.forEach(...)`**

Porque `users` no es un array, sino un **objeto**:

```js
{
  "admin": {...},
  "lucia": {...},
  "raul": {...}
}
```

Los objetos de JS **no tienen** el método `.forEach()`.
Si haces `users.forEach(...)` obtienes un error del tipo:
`users.forEach is not a function`.
Primero hay que convertir las claves o valores en array (`Object.keys`, `Object.values`).


## 4. Banner de cookies + sesión + base de datos (2 pt)

### 4.1. Condición para mostrar el banner (0,75 pt)

Queremos mostrar el banner solo si **todavía no ha aceptado**.

**a- En lógica:**

Mostrar el banner si:

* `req.session.cookiesAccepted` **no es `true`**,
  **y además**, se cumple que:

  * o bien no hay usuario logueado (`!req.session.user`)
  * o bien el usuario logueado tiene `acceptedCookies === false`.

Algo así:

```js
if (!req.session.cookiesAccepted &&
    (!req.session.user || req.session.user.acceptedCookies === false)) {
  // mostrar banner
}
```

**b- En EJS (en `layout.ejs`, de forma aproximada):**

Suponiendo que en `res.locals` has copiado estos valores (`cookiesAccepted` y `currentUser`):

```ejs
<% if (!cookiesAccepted && (!currentUser || !currentUser.acceptedCookies)) { %>
  <!-- HTML del banner de cookies -->
<% } %>
```


### 4.2. Ruta POST `/cookies/accept` (0,75 pt)

**`routes/cookies.js`:**

```js
// routes/cookies.js
var express = require('express');
var router = express.Router();
var db = require('../database');

router.post('/accept', function (req, res) {
  // marcar en la sesión
  req.session.cookiesAccepted = true;

  // si hay usuario logueado, actualizar también en la BD
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

**En `app.js` para usar este router:**

```js
var cookiesRouter = require('./routes/cookies');
app.use('/cookies', cookiesRouter);
```


### 4.3. Botón “Rechazar” (0,5 pt)

**a- Solo HTML (sin backend):**

Por ejemplo:

```html
<a href="https://www.imdb.com">
  <button type="button">Rechazar</button>
</a>
```

o:

```html
<button type="button" onclick="window.location.href='https://www.imdb.com'">
  Rechazar
</button>
```

**b- Por qué no guardamos nada en sesión/BD al rechazar**

Porque “rechazar cookies” significa precisamente **no dar consentimiento** para que les guardemos cosas.
En este ejercicio, además, el usuario se va a otra web (IMDb), así que no necesitamos recordar nada: no queremos crear cookies nuevas ni almacenar su decisión en la base de datos.


## 5. JSON y `package.json` (1,5 pt)

### 5.1. Corrección de JSON (1 pt)

JSON dado:

```json
{
  "id": 10,
  "title": "Matrix",
  "rating": 8.6,
  "tags": ["accion", "ciencia ficcion",],
  "adult": false,
  duration: 136
}
```

**a-** No es JSON válido.

**b- Versión válida:**

```json
{
  "id": 10,
  "title": "Matrix",
  "rating": 8.6,
  "tags": ["accion", "ciencia ficcion"],
  "adult": false,
  "duration": 136
}
```

**c- Errores concretos corregidos:**

1. Coma sobrante en el array: `"ciencia ficcion",]` → quitamos la coma antes del cierre del array.
2. Clave `duration` sin comillas → en JSON todas las claves deben ir entre comillas: `"duration"`.
3. (Opcional comentar) si hubiera una coma final después del último campo también sería error; aquí no la hay, pero la del array sí cuenta como error claro.


### 5.2. `scripts` en `package.json` (0,5 pt)

Objeto `"scripts"` completo:

```json
"scripts": {
  "start": "node ./bin/www"
}
```

Con eso, `npm start` ejecuta `node ./bin/www`.

## 6. Socket.io – Notificación de nueva película (BONUS 0,5 pt)

### 6.1. Línea que falta en el servidor

```js
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.join('cineplus-room');

  socket.on('new-movie', (movieData) => {
    // TODO: notificar a todos los clientes de la room "cineplus-room"
    io.to('cineplus-room').emit('movie-created', movieData);
  });
});
```


### 6.2. Explicar el flujo (3–4 líneas)

1. Un administrador en su navegador ejecuta:

   ```js
   socket.emit('new-movie', { title: 'Avatar 3', rating: 8.2 });
   ```

   Ese evento viaja al servidor a través de la conexión de Socket.io.

2. En el servidor, el `socket.on('new-movie', ...)` recibe `movieData` y ejecuta:

   ```js
   io.to('cineplus-room').emit('movie-created', movieData);
   ```

   Esto envía el evento `'movie-created'` con los datos de la película a **todos** los clientes conectados a la sala `"cineplus-room"`.

3. En los navegadores de los clientes, el listener:

   ```js
   socket.on('movie-created', (movie) => {
     console.log('Nueva película en cartelera:', movie.title);
   });
   ```

   se dispara y muestra en la consola:
   `Nueva película en cartelera: Avatar 3`.
