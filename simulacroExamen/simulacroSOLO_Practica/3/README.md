# SIMULACRO PRÁCTICO – SISTEMAS WEB I

**Duración orientativa:** 2 horas
**Tecnologías:** Node.js, Express, EJS, sesiones, JSON, Socket.io (hasta sockets, como dijo el profe)


### Contexto general

Dispones de una aplicación web llamada **EventHub**, para gestionar **eventos** y **usuarios**.

Estructura del proyecto:

```txt
eventhub/
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
 │   ├─ events.ejs
 │   └─ admin_events.ejs
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
      "marta": {
        username: "marta",
        password: "1234",
        role: "user",
        acceptedCookies: false
      },
      "pablo": {
        username: "pablo",
        password: "1234",
        role: "user",
        acceptedCookies: true
      }
    }
  },
  events: {
    data: [
      { id: 1, name: "Concierto Rock", city: "Madrid", seats: 100 },
      { id: 2, name: "Charla Web",     city: "Oviedo", seats: 50  }
    ]
  }
};

module.exports = db;
```

Fichero `app.js` (resumen):

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

// TODO 2: middlewares básicos

app.use(session({
  secret: 'eventhub-secret',
  resave: false,
  saveUninitialized: false
}));

// TODO 3: res.locals.currentUser

// TODO 4: app.locals.siteName y siteDescription

// Rutas
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);

// 404
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
```


## Apartado 1 – Configuración de Express, vistas y `app.locals` (2 puntos)

### 1.1. Configuración de vistas (0,75 pt)

Rellena los **TODO 1 y 2** de `app.js`:

* Configurar:

  * carpeta de vistas: `views` en el directorio actual,
  * motor de plantillas: `ejs`.
* Añadir los middlewares básicos:

  * `express.json()`
  * `express.urlencoded({ extended: false })`
  * `cookieParser()`
  * servir estáticos desde `public`.

Escribe el código correspondiente en orden razonable.


### 1.2. Usuario actual en `res.locals` (0,5 pt)

En el **TODO 3**, queremos que todas las vistas tengan disponible el usuario actual como `currentUser`.

* Escribe un middleware que:

  * tome `req.session.user` (si existe),
  * lo guarde en `res.locals.currentUser`,
  * llame a `next()`.


### 1.3. `app.locals.siteName` y uso en la vista (0,75 pt)

En el **TODO 4**, queremos definir:

* `app.locals.siteName = "EventHub";`
* `app.locals.siteDescription = "Gestión sencilla de eventos";`

* a- Escribe las líneas necesarias en `app.js` para configurar estas dos variables globales.

* b- Dada la plantilla `views/layout.ejs`:

```ejs
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <title>EventHub - Gestión sencilla de eventos</title>
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body>
    <header>
      <h1>EventHub - Gestión sencilla de eventos</h1>
    </header>
    <main>
      <%- body %>
    </main>
  </body>
</html>
```

Modifícala para que **no tenga el texto hardcodeado**, sino que use:

* `<%= siteName %>` en el título y cabecera
* `<%= siteDescription %>` donde corresponda.


## Apartado 2 – Login, logout y middleware `requireAuth` + roles (3 puntos)

Ruta `routes/auth.js` (simplificada):

```js
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

// TODO: POST /auth/login

// TODO: POST /auth/logout

module.exports = router;
```

### 2.1. Login (1 pt)

Completa el **POST `/auth/login`**:

* Recibe `username` y `password` desde `req.body`.
* Comprueba si existe `db.users.data[username]` y si la contraseña coincide.
* Si las credenciales son correctas:

  * guarda el usuario en `req.session.user`,
  * redirige a `/events` (ruta que ya existe en `index.js`).
* Si son incorrectas:

  * vuelve a renderizar `login.ejs` con:

    * `title: 'Login'`
    * `error: 'Credenciales incorrectas'`


### 2.2. Logout (0,5 pt)

Completa el **POST `/auth/logout`**:

* destruye la sesión,
* redirige al usuario a `/`.


### 2.3. Middleware `requireAuth` (0,75 pt)

En `routes/index.js` tenemos algo así:

```js
var express = require('express');
var router = express.Router();
var db = require('../database');

// TODO: requireAuth

router.get('/', function(req, res) {
  res.render('index', { title: 'Bienvenido a EventHub' });
});

router.get('/events', function(req, res) {
  const events = db.events.data;
  res.render('events', { title: 'Eventos disponibles', events: events });
});

module.exports = router;
```

Define un middleware `requireAuth(req, res, next)` que:

* compruebe si `req.session.user` existe;
* si **no** existe:

  * redirija a `/auth/login`;
* si existe:

  * llame a `next()`.

Aplica este middleware para que **solo** `/events` requiera estar logueado.


### 2.4. Middleware `requireAdmin` (0,75 pt)

En `routes/admin.js`:

```js
var express = require('express');
var router = express.Router();
var db = require('../database');

// TODO: requireAuth (reutilizar)
// TODO: requireAdmin

router.get('/events', function(req, res) {
  const events = db.events.data;
  res.render('admin_events', { title: 'Admin eventos', events: events });
});

module.exports = router;
```

Define y usa un middleware `requireAdmin` que:

* asuma que `req.session.user` existe,
* compruebe que `req.session.user.role === "admin"`,
* si no es admin:

  * responda con `res.status(403).send("Prohibido")` **o** redirija a `/`,
* si es admin:

  * llame a `next()`.

Asegúrate de que las rutas de `/admin` usen **tanto** `requireAuth` como `requireAdmin`.


## Apartado 3 – EJS, recorrer objetos/arrays y condicionales (2,5 puntos)

### 3.1. Lista de eventos (`events.ejs`) (1 pt)

`/events` pasa a la vista:

```js
res.render('events', {
  title: 'Eventos disponibles',
  events: db.events.data
});
```

Sabemos que `events` es un **array** de objetos:

```js
[
  { id: 1, name: "Concierto Rock", city: "Madrid", seats: 100 },
  { id: 2, name: "Charla Web",     city: "Oviedo", seats: 50  }
]
```

Escribe el **contenido del `<main>`** de `events.ejs` para:

* Mostrar `<h2><%= title %></h2>`.
* Si `events` está vacío, mostrar el mensaje:
  `"No hay eventos disponibles"`.
* Si **no** está vacío, mostrar una tabla con columnas: `ID`, `Nombre`, `Ciudad`, `Plazas`.

Usa un bucle EJS adecuado para recorrer el array.

### 3.2. Listado de usuarios (`admin_events.ejs`) – cuidado objeto (1,5 pt)

Supón que en el panel de admin queremos mostrar también **usuarios**. Para ello, en `admin.js` añadimos:

```js
router.get('/users', function(req, res) {
  const users = db.users.data; // objeto
  res.render('admin_users', { title: 'Admin usuarios', users: users });
});
```

Sabemos que `users` es un **objeto**:

```js
{
  "admin":  { username: "admin",  role: "admin", acceptedCookies: false },
  "marta":  { username: "marta",  role: "user",  acceptedCookies: false },
  "pablo":  { username: "pablo",  role: "user",  acceptedCookies: true }
}
```

* a- En `admin_users.ejs`, escribe el EJS necesario para:

* Recorrer correctamente las **claves** del objeto `users`,
* Mostrar una tabla con columnas: `Username`, `Rol`, `Cookies` (mostrar “Sí” / “No” según `acceptedCookies`).

* b- Explica por qué **no** funcionaría hacer directamente:

```ejs
<% users.forEach(function(u) { ... }) %>
```

en este caso.


## Apartado 4 – Banner de cookies + sesión + base de datos (2 puntos)

Queremos un banner de cookies en todas las páginas que:

* aparezca mientras:

  * el usuario **no** haya aceptado cookies en la sesión actual, **y**
  * si está logueado, su `acceptedCookies` en BD sea `false`.
* tenga dos botones: **Aceptar** y **Rechazar**.

### 4.1. Lógica de cuándo mostrar el banner (0,75 pt)

* a- Explica, en términos de **condición lógica**, cuándo mostrarías el banner.
Puedes usar estas variables:

* `req.session.cookiesAccepted` (booleano, puede ser `undefined`),
* `req.session.user` (objeto o `undefined`),
* `req.session.user.acceptedCookies` (booleano).

* b- Escribe una condición EJS aproximada, por ejemplo en `layout.ejs`, que envuelva el banner, algo del estilo:

```ejs
<% if ( /* condición */ ) { %>
  <!-- banner -->
<% } %>
```

(No hace falta que sea perfecta, pero sí que se vea claramente la idea.)


### 4.2. Ruta `/cookies/accept` (0,75 pt)

Suponiendo que el botón Aceptar hace:

```html
<form method="POST" action="/cookies/accept">
  <button type="submit">Aceptar</button>
</form>
```

Crea un fichero `routes/cookies.js` con una ruta `POST /accept` que:

* marque `req.session.cookiesAccepted = true;`,

* si hay usuario en sesión, también ponga su `acceptedCookies` en la BD a `true`, por ejemplo:

  ```js
  const username = req.session.user.username;
  db.users.data[username].acceptedCookies = true;
  ```

* redirija al usuario a `/`.

Escribe el contenido básico de `routes/cookies.js`:

* `require('express')`,
* `require('../database')`,
* definición de `router`,
* ruta `POST /accept`,
* `module.exports = router`.

Y añade en `app.js` la línea necesaria para usar este router (no hace falta escribir todo `app.js` de nuevo, solo la línea de `app.use`).


### 4.3. Botón Rechazar (0,5 pt)

El botón **Rechazar** debe redirigir al usuario a `https://www.wikipedia.org` (o similar).

* a- Indica una forma sencilla de hacerlo solo con HTML (sin tocar el backend).
* b- Explica brevemente por qué **no** guardarías nada en sesión/BD para el botón Rechazar en este ejercicio.


## Apartado 5 – JSON y `package.json` (1,5 puntos)

### 5.1. Corrección JSON (1 pt)

Te dan este supuesto JSON con configuración de un evento:

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

* a- Di si es JSON válido o no.
* b- Corrígelo para que sea JSON completamente válido.
* c- Señala al menos **tres errores concretos** que has corregido.


### 5.2. Scripts en `package.json` (0,5 pt)

En `package.json` tenemos:

```json
{
  "name": "eventhub",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

Queremos poder arrancar la app con:

```bash
npm start
```

sabiendo que el servidor Express se arranca desde `./bin/www` (como en los ejemplos de clase).

Escribe el contenido del objeto `"scripts"` para que esto funcione.

## Apartado 6 – Socket.io: notificación de nuevo evento (BONUS 0,5 puntos)

Queremos que, cuando un admin cree un nuevo evento, se notifique en tiempo real a todos los clientes conectados.

En el servidor:

```js
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.join('eventhub');

  socket.on('new-event', (data) => {
    // TODO: notificar a todos los clientes de la room "eventhub" el nuevo evento
  });
});
```

En el cliente:

```js
const socket = io();

socket.on('event-created', (data) => {
  console.log('Nuevo evento creado:', data);
});
```

* a- Escribe la línea que falta en el `TODO` para emitir el evento `'event-created'` con los datos `data` a todos los clientes de la room `"eventhub"`.

* b- Explica en 3–4 líneas qué pasa (flujo completo) desde que un admin ejecuta en el cliente:

```js
socket.emit('new-event', { name: 'Conferencia JS', city: 'Sevilla' });
```

hasta que el resto de clientes ven el `console.log('Nuevo evento creado:', data);`.
