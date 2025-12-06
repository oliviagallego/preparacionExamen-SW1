# Simulacro práctico – Sistemas Web I

**Formato:** examen a papel (2h aprox.)
**Tecnologías:** HTML, CSS, JavaScript, Node.js, Express, EJS, sesiones, JSON, Socket.io (hasta sockets)


## 0. Contexto general

Estamos desarrollando una aplicación llamada **CinePlus**, una pequeña web para gestionar **cartelera de cine** y **usuarios**.

Estructura del proyecto:

```txt
cineplus/
 ├─ bin/
 │   └─ www
 ├─ app.js
 ├─ database.js
 ├─ package.json
 ├─ routes/
 │   ├─ index.js
 │   ├─ auth.js
 │   └─ admin.js
 ├─ views/
 │   ├─ layout.ejs
 │   ├─ index.ejs
 │   ├─ login.ejs
 │   ├─ movies.ejs
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
      "admin":  { username: "admin",  password: "admin", role: "admin",  acceptedCookies: false },
      "lucia":  { username: "lucia",  password: "1234", role: "user",   acceptedCookies: false },
      "raul":   { username: "raul",   password: "1234", role: "user",   acceptedCookies: true }
    }
  },
  movies: {
    data: [
      { id: 1, title: "Interstellar",   rating: 8.7 },
      { id: 2, title: "Inception",      rating: 8.8 },
      { id: 3, title: "Inside Out 2",   rating: 8.4 }
    ]
  }
};

module.exports = db;
```

Fichero `app.js` (parcial):

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
// TODO: añadir router de cookies si hace falta

var app = express();

// TODO (1): configurar vistas (carpeta y motor EJS)

// TODO (2): middlewares básicos (json, urlencoded, cookieParser, estáticos)

app.use(session({
  secret: 'cineplus-secret',
  resave: false,
  saveUninitialized: false
}));

// TODO (3): middleware para guardar usuario actual en res.locals.currentUser

// TODO (4): configurar app.locals.siteName y app.locals.tagline

// Rutas
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
// TODO: usar router de cookies si se ha creado

// 404
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
```

## 1. Configuración de Express, vistas y variables globales (2 puntos)

### 1.1. Configuración de vistas y middlewares básicos (1 punto)

Rellena los **TODO (1)** y **TODO (2)** de `app.js`:

1. Configura las vistas para que:

   * la carpeta de vistas sea `views` dentro del directorio actual,
   * el motor de plantillas sea **EJS**.
2. Añade los middlewares básicos en este orden razonable:

   * `express.json()`
   * `express.urlencoded({ extended: false })`
   * `cookieParser()`
   * `express.static(path.join(__dirname, 'public'))`

Escribe el código que añadirías en `app.js` en esas zonas marcadas como TODO.


### 1.2. Usuario actual en `res.locals` (0,5 puntos)

Completa el **TODO (3)**:

* Define un middleware que:

  * lea `req.session.user` (si existe),
  * lo guarde en `res.locals.currentUser`,
  * llame a `next()`.

Escribe el código del middleware y el `app.use` correspondiente.


### 1.3. `app.locals.siteName` y `tagline` (0,5 puntos)

Completa el **TODO (4)**:

* Crea dos variables globales accesibles en todas las vistas:

  * `siteName = "CinePlus"`
  * `tagline = "Tu cine de confianza online"`

* a- Escribe las líneas que añadirías en `app.js`.
* b- Modifica este fragmento de `views/layout.ejs` para que no tenga el texto “a pelo”:

```ejs
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <title>CinePlus - Tu cine de confianza online</title>
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body>
    <header>
      <h1>CinePlus - Tu cine de confianza online</h1>
    </header>
    <main>
      <%- body %>
    </main>
  </body>
</html>
```

Usa `siteName` y `tagline` en el `<title>` y en el `<h1>`.


## 2. Login, logout y middleware de autenticación + roles (3 puntos)

Fichero `routes/auth.js` (incompleto):

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

### 2.1. Implementar `POST /auth/login` (1,5 puntos)

Completa la ruta:

* Recibe `username` y `password` desde `req.body`.
* Comprueba si existe un usuario `db.users.data[username]`.
* Verifica que la contraseña coincide.
* Si las credenciales son correctas:

  * guarda el usuario completo en `req.session.user`,
  * redirige a `/movies` (suponemos que esa ruta existe en `index.js`).
* Si las credenciales son incorrectas:

  * vuelve a renderizar `login.ejs` con:

    * `title: 'Iniciar sesión'`
    * `error: 'Usuario o contraseña incorrectos'`

Escribe el código completo de esa ruta.


### 2.2. Implementar `POST /auth/logout` (0,5 puntos)

Completa la ruta:

* Destruye la sesión (o elimina `req.session.user`),
* Redirige al usuario a la página de inicio `/`.


### 2.3. Middleware `requireAuth` y `requireAdmin` (1 punto)

En `routes/admin.js`:

```js
var express = require('express');
var router = express.Router();
var db = require('../database');

// TODO: importar/definir middlewares

router.get('/users', function(req, res) {
  const users = db.users.data;
  res.render('admin_users', { title: 'Administrar usuarios', users: users });
});

module.exports = router;
```

Define y aplica dos middlewares:

1. `requireAuth(req, res, next)`:

   * comprueba si `req.session.user` existe,
   * si no existe, redirige a `/auth/login`,
   * si existe, llama a `next()`.

2. `requireAdmin(req, res, next)`:

   * asume que ya hay usuario en sesión,
   * comprueba que `req.session.user.role === "admin"`,
   * si no es admin, responde con `res.status(403).send("Prohibido")` **o** redirige a `/`,
   * si es admin, llama a `next()`.

Haz que **todas** las rutas de `/admin` usen ambos middlewares.


## 3. EJS: recorrer arrays y objetos, condicionales (2,5 puntos)

### 3.1. Listado de películas (`movies.ejs`) (1,5 puntos)

En `routes/index.js` tenemos, entre otras:

```js
router.get('/movies', function(req, res) {
  const movies = db.movies.data; // array
  res.render('movies', { title: 'Cartelera', movies: movies });
});
```

Sabemos que `movies` es un **array** de objetos:

```js
[
  { id: 1, title: "Interstellar", rating: 8.7 },
  { id: 2, title: "Inception",    rating: 8.8 },
  { id: 3, title: "Inside Out 2", rating: 8.4 }
]
```

En la vista `movies.ejs`:

1. Muestra un `<h2><%= title %></h2>`.
2. Si `movies` está vacío, muestra el texto:
   `No hay películas disponibles.`
3. Si **no** está vacío, muestra una tabla con columnas:

   * ID
   * Título
   * Puntuación

Escribe el fragmento de EJS que iría dentro de `<main>` para conseguir esto.


### 3.2. Listado de usuarios (`admin_users.ejs`) – objeto (1 punto)

En `admin.js`, la ruta `/admin/users` pasa a la vista:

```js
const users = db.users.data; // objeto
res.render('admin_users', { title: 'Administrar usuarios', users: users });
```

Y `users` es un **objeto**:

```js
{
  "admin": { username: "admin", role: "admin",  acceptedCookies: false },
  "lucia": { username: "lucia", role: "user",   acceptedCookies: false },
  "raul":  { username: "raul",  role: "user",   acceptedCookies: true }
}
```

* a- Escribe el código EJS para:

* Recorrer correctamente las **claves** de `users`,
* Mostrar una tabla con columnas:

  * Username
  * Rol
  * Cookies (texto “Sí” si `acceptedCookies` es `true`, “No” si es `false`).

* b- Explica brevemente por qué **no** funciona hacer:

```ejs
<% users.forEach(function(u) { ... }) %>
```

en este caso concreto.


## 4. Banner de cookies + sesión + base de datos (2 puntos)

Queremos añadir un **banner de cookies** que:

* Aparezca en la parte inferior de todas las páginas.
* Tenga:

  * un texto breve,
  * un botón “Aceptar”,
  * un botón “Rechazar”.
* Se oculte cuando:

  * en la sesión haya `cookiesAccepted = true`, **o**
  * el usuario logueado tenga `acceptedCookies = true` en la base de datos.

### 4.1. Condición para mostrar el banner (0,75 puntos)

* a- Escribe la condición lógica (en español o pseudocódigo) que determina cuándo se **debe mostrar** el banner en la vista, utilizando:

* `req.session.cookiesAccepted`
* `req.session.user`
* `req.session.user.acceptedCookies`

* b- Escribe una condición EJS aproximada en `layout.ejs`:

```ejs
<% if ( /* condición aquí */ ) { %>
  <!-- HTML del banner -->
<% } %>
```

No hace falta que sea perfecta, pero debe reflejar la idea de “solo mostrar si aún no ha aceptado”.


### 4.2. Ruta `POST /cookies/accept` (0,75 puntos)

Suponemos que existe un fichero `routes/cookies.js` y que el formulario del banner es:

```html
<form method="POST" action="/cookies/accept">
  <button type="submit">Aceptar</button>
</form>
```

En `routes/cookies.js`:

1. Importa `express` y `../database`.

2. Crea un `router`.

3. Implementa la ruta `POST /accept` que:

   * ponga `req.session.cookiesAccepted = true;`

   * si existe `req.session.user`, actualice también:

     ```js
     const username = req.session.user.username;
     db.users.data[username].acceptedCookies = true;
     ```

   * redirija al usuario a `/`.

4. Exporta el router con `module.exports = router;`.

Además, muestra la línea que habría que añadir en `app.js` para usar este router.


### 4.3. Botón “Rechazar” (0,5 puntos)

Queremos que el botón “Rechazar” envíe al usuario a `https://www.imdb.com`.

* a- Escribe el HTML de un botón o enlace que haga esto **sin tocar el backend**.
* b- Explica por qué en este ejercicio **no es necesario** guardar nada en sesión o base de datos cuando el usuario rechaza las cookies.


## 5. JSON y `package.json` (1,5 puntos)

### 5.1. Corrección de JSON (1 punto)

Analiza el siguiente supuesto JSON que describe una película:

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

* a-  Di si es un JSON válido o no.
* b-  Corrígelo para que sea un JSON **completamente válido**.
* c- Enumera al menos **tres errores concretos** que has tenido que corregir.

### 5.2. Scripts de `package.json` (0,5 puntos)

En `package.json` tenemos:

```json
{
  "name": "cineplus",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

El servidor Express se arranca desde `./bin/www`. Queremos poder lanzar la app con:

```bash
npm start
```

Escribe el contenido completo del objeto `"scripts"` para que esto funcione.


## 6. Socket.io – Notificación de nueva película (BONUS 0,5 puntos)

En el servidor, usamos Socket.io para mandar a todos los clientes un aviso cuando se añade una nueva película a la cartelera.

Servidor (`socket.js` o similar):

```js
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.join('cineplus-room');

  socket.on('new-movie', (movieData) => {
    // TODO: notificar a todos los clientes de la room "cineplus-room"
    // que se ha creado una nueva película
  });
});
```

Cliente (JavaScript en el navegador):

```js
const socket = io();

socket.on('movie-created', (movie) => {
  console.log('Nueva película en cartelera:', movie.title);
});
```

* a- Escribe la línea que falta en el `TODO` del servidor para emitir el evento `'movie-created'` a **todos** los clientes que estén en la sala `"cineplus-room"`, enviando `movieData`.

* b- Explica en 3–4 líneas qué ocurre desde que un administrador ejecuta en el cliente:

```js
socket.emit('new-movie', { title: 'Avatar 3', rating: 8.2 });
```

hasta que el resto de clientes ven en consola el mensaje:

```txt
Nueva película en cartelera: Avatar 3
```

