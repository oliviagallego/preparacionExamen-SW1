# Simulacro práctico – Sistemas Web I

**Formato:** examen a papel (2h aprox.)
**Tecnologías:** HTML, CSS, JavaScript, Node.js, Express, EJS, sesiones, JSON, Socket.io (hasta sockets)


## 0. Contexto general

Estamos desarrollando una aplicación llamada **CinePlus**, una pequeña web para gestionar la **cartelera de cine** y los **usuarios**.

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

Completa los apartados que se indican a continuación.


## 1. Configuración de Express, vistas y variables globales (2 puntos)

1.1. En `app.js`, completa los **TODO (1)** y **(2)** para dejar configuradas las vistas (carpeta y motor de plantillas) y los middlewares básicos de la aplicación (parseo de JSON, formularios, cookies y ficheros estáticos).

1.2. En el **TODO (3)** de `app.js`, añade un middleware que deje disponible el usuario actual en las vistas mediante `res.locals.currentUser`.

1.3. En el **TODO (4)** de `app.js`, define variables globales accesibles en todas las vistas para el nombre y el eslogan del sitio (`siteName`, `tagline`), y modifica la plantilla `views/layout.ejs` para que use esas variables en el `<title>` y en el encabezado principal en lugar de tener el texto escrito directamente.


## 2. Login, logout y middlewares de autenticación y roles (3 puntos)

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

2.1. Implementa la ruta `POST /auth/login` para gestionar el formulario de login usando los usuarios definidos en `database.js`, guardando el usuario en sesión cuando las credenciales sean correctas y redirigiendo a la cartelera de películas.

2.2. Implementa la ruta `POST /auth/logout` para cerrar la sesión del usuario y devolverlo a la página de inicio.

2.3. En `routes/admin.js`, define y aplica dos middlewares:

* uno para comprobar que el usuario está autenticado antes de acceder a `/admin`,
* otro para comprobar que el usuario autenticado tiene rol de administrador.

Haz que las rutas de `/admin` utilicen ambos middlewares antes de renderizar la vista de administración de usuarios.


## 3. EJS: recorrer arrays y objetos, condicionales (2,5 puntos)

En `routes/index.js` existe una ruta que muestra las películas:

```js
router.get('/movies', function(req, res) {
  const movies = db.movies.data; // array
  res.render('movies', { title: 'Cartelera', movies: movies });
});
```

3.1. En la vista `movies.ejs`, escribe el código EJS necesario dentro de `<main>` para:

* mostrar el título recibido,
* mostrar un mensaje adecuado cuando no haya películas,
* y, en caso contrario, mostrar los datos del array `movies` en forma de tabla (ID, título y puntuación).

3.2. En la vista `admin_users.ejs`, se recibe un objeto `users` con los usuarios de la base de datos. Escribe el código EJS necesario para recorrer este objeto y mostrar una tabla con las columnas **Username**, **Rol** y si el usuario ha aceptado cookies (texto “Sí” / “No” según corresponda). Explica brevemente por qué no sería correcto intentar usar directamente `users.forEach(...)` en este caso.


## 4. Banner de cookies, sesión y base de datos (2 puntos)

Queremos añadir un **banner de cookies** que aparezca en la parte inferior de todas las páginas, con un texto informativo y dos botones: **Aceptar** y **Rechazar**.

El comportamiento deseado es:

* el banner solo debe mostrarse mientras el usuario **no** haya aceptado las cookies,
* si el usuario hace login y ya había aceptado cookies en una sesión anterior (según la base de datos), tampoco debería mostrarse,
* al aceptar, debe recordarse esta decisión tanto en la sesión como, si corresponde, en el perfil del usuario en la base de datos,
* al rechazar, se redirigirá al usuario a una página externa.

4.1. Indica la condición lógica que se debe cumplir para que el banner se muestre en la vista, usando la información disponible en la sesión y en el usuario logueado, y escribe una condición EJS aproximada que envuelva el HTML del banner.

4.2. Supón que existe un router de cookies en `routes/cookies.js` y que el botón “Aceptar” envía un formulario `POST` a `/cookies/accept`. Implementa la ruta correspondiente para actualizar la sesión y, en caso de haber usuario logueado, el campo `acceptedCookies` de ese usuario en la base de datos, y redirigir a la página principal. Indica también cómo se conectaría este router en `app.js`.

4.3. Escribe un ejemplo de HTML para el botón “Rechazar” que envíe al usuario a `https://www.imdb.com` sin necesidad de modificar el backend, y comenta brevemente por qué en este caso no es necesario guardar nada al rechazar las cookies.


## 5. JSON y `package.json` (1,5 puntos)

5.1. Se proporciona el siguiente JSON que describe una película:

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

Indica si es un JSON válido o no, corrígelo para que lo sea y señala al menos tres errores concretos que hayas tenido que corregir.

5.2. En el fichero `package.json` de la aplicación, el servidor se arranca desde `./bin/www`. Completa la sección `"scripts"` para que se pueda lanzar el servidor con el comando `npm start`.


## 6. Socket.io – Notificación de nueva película (BONUS 0,5 puntos)

Se quiere usar **Socket.io** para notificar en tiempo real a todos los clientes cuando se añade una nueva película.

En el servidor se tiene algo parecido a:

```js
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.join('cineplus-room');

  socket.on('new-movie', (movieData) => {
    // TODO: notificar a todos los clientes de la room
  });
});
```

En el cliente:

```js
const socket = io();

socket.on('movie-created', (movie) => {
  console.log('Nueva película en cartelera:', movie.title);
});
```

6.1. Completa el código del servidor para emitir un evento adecuado a todos los clientes conectados en la sala `"cineplus-room"` cuando se reciba un nuevo `movieData`.

6.2. Explica brevemente el flujo de comunicación completo desde que un administrador ejecuta en el cliente:

```js
socket.emit('new-movie', { title: 'Avatar 3', rating: 8.2 });
```

hasta que el resto de clientes ven en consola el mensaje:

```txt
Nueva película en cartelera: Avatar 3
```
