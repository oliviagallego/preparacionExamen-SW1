## Apartado 1 – `app.locals` (1,5 puntos)

### 1.1.a) Definir variable global con `app.locals`

En `app.js`, después de crear `app` y **antes** de las rutas, podrías poner:

```js
var app = express();

// ...

// Variables globales para todas las vistas
app.locals.appTitle = 'BookHub – Tu biblioteca online';
```

Así, en cualquier plantilla EJS tendrás disponible `appTitle`.


### 1.1.b) Diferencia práctica entre `app.locals` y `res.locals`

* `app.locals` son **variables globales de la aplicación**: las defines una vez al arrancar el servidor y valen para **todas las peticiones y todas las vistas** (por ejemplo, el título de la web).
* `res.locals` son **variables por petición**: cambian en cada request. En el código tienes `res.locals.currentUser = req.session.user || null;`, así cada usuario ve su propio `currentUser`.
  En resumen: `app.locals` es “siempre igual para todos”, `res.locals` es “depende de la petición / usuario”.


### 1.2. Modificar `layout.ejs` para usar `app.locals`

Suponiendo que has definido `app.locals.appTitle`, en `layout.ejs`:

```ejs
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title><%= appTitle %></title>
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body>
    <header>
      <h1><%= appTitle %></h1>
    </header>
    <main>
      <%- body %>
    </main>
  </body>
</html>
```


## Apartado 2 – Middleware `checkLogin` y roles (3 puntos)

### 2.1. Middleware `checkLogin` básico y cómo aplicarlo

En `routes/admin.js`:

```js
var express = require('express');
var router = express.Router();
var db = require('../database');

// Middleware checkLogin
function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.session.error = 'Debes iniciar sesión para acceder al área de administración';
    return res.redirect('/login');
  }
  next();
}

// Aplicar el middleware a TODAS las rutas de /admin
router.use(checkLogin);

router.get('/', function(req, res) {
  res.render('admin_home');
});

router.get('/users', function(req, res) {
  const users = db.users.data;
  res.render('admin_users', { users: users });
});

module.exports = router;
```


### 2.2. Ampliar el middleware para exigir `role: "admin"`

Mismo archivo, versión completa del middleware:

```js
function checkLogin(req, res, next) {
  const user = req.session.user;

  // 1) Comprobar que hay usuario en sesión
  if (!user) {
    req.session.error = 'Debes iniciar sesión para acceder al área de administración';
    return res.redirect('/login');
  }

  // 2) Comprobar que es admin
  if (user.role !== 'admin') {
    req.session.error = 'No tienes permisos de administrador';
    return res.redirect('/');
  }

  // 3) Todo ok, seguimos
  next();
}

router.use(checkLogin);
```


### 2.3. ¿Qué hace `next()` y qué pasa si no se llama?

* `next()` le dice a Express: **“este middleware ha terminado, pasa al siguiente middleware o a la ruta”**.
* Si **nunca** llamas a `next()` y tampoco haces `res.send`, `res.render`, `res.redirect`, etc., la petición se queda **colgada**: el navegador se queda cargando hasta que hace timeout, porque el servidor nunca envía respuesta.


## Apartado 3 – Listado de usuarios (2,5 puntos)

### 3.1. Recorrer el objeto `users` en EJS

En `admin_users.ejs`:

```ejs
<h2>Listado de usuarios</h2>

<table>
  <thead>
    <tr>
      <th>Username</th>
      <th>Rol</th>
      <th>Cookies aceptadas</th>
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
    <% }) %>
  </tbody>
</table>
```

Usamos `Object.keys(users)` porque `users` es un **objeto** cuyas claves son `"alberto"`, `"ana"`, etc.


### 3.2. ¿Por qué no vale `users.forEach(...)`?

* `forEach` es un método de los **arrays**, pero `users` no es un array, es un **objeto** normal (`{ "alberto": {...}, "ana": {...}, ... }`).
* Si haces `users.forEach(...)` te dará error de tipo (`users.forEach is not a function`).
  Por eso primero hay que obtener un array de claves (`Object.keys(users)`) o de valores (`Object.values(users)`) y hacer el `forEach` sobre ese array.


## Apartado 4 – Banner de cookies (2,5 puntos)

### 4.1. Estructura HTML + propiedades CSS clave

HTML básico (conceptual):

```html
<div class="cookie-banner">
  <p>Usamos cookies para mejorar tu experiencia en BookHub.</p>
  <form method="POST" action="/cookies/accept">
    <button type="submit">Aceptar</button>
  </form>
  <form method="POST" action="/cookies/reject">
    <button type="submit">Rechazar</button>
  </form>
</div>
```

Propiedades CSS clave que mencionaría:

* `position: fixed;` → para que permanezca siempre en la misma posición al hacer scroll.
* `bottom: 0; left: 0;` → fijarlo pegado a la parte inferior de la pantalla.
* `width: 100%;` → que ocupe todo el ancho.
* `z-index: ...;` → para que quede por encima del resto de contenido.
* Opcionalmente: `display: flex;`, `justify-content: space-between;`, `padding`, `background-color`, etc., para maquetarlo y que se vea bien.


### 4.2. Ruta `/cookies/accept` en Express

Archivo `routes/cookies.js`:

```js
var express = require('express');
var router = express.Router();
var db = require('../database');

router.post('/accept', function(req, res) {
  // Marcar en la sesión que se han aceptado cookies
  req.session.cookiesAccepted = true;

  // Si hay usuario logeado, actualizar también en la "base de datos"
  if (req.session.user) {
    const username = req.session.user.username;
    if (db.users.data[username]) {
      db.users.data[username].acceptedCookies = true;
    }
  }

  // Volver a la página principal
  res.redirect('/');
});

module.exports = router;
```

(En `app.js` se montaría con algo tipo `var cookiesRouter = require('./routes/cookies'); app.use('/cookies', cookiesRouter);`.)


### 4.3. ¿Cómo decidir si mostrar el banner en EJS?

Idea lógica: **mostrar el banner solo si el usuario no ha aceptado cookies ni en la sesión ni en su usuario**.

Por ejemplo, en un middleware podrías hacer:

```js
app.use(function(req, res, next) {
  res.locals.cookiesAccepted = req.session.cookiesAccepted || false;
  next();
});
```

Y en `layout.ejs` algo así:

```ejs
<% if (!(cookiesAccepted || (currentUser && currentUser.acceptedCookies))) { %>
  <!-- Aquí el banner de cookies -->
  <div class="cookie-banner">
    ...
  </div>
<% } %>
```

Traducción: si **no** (cookies en sesión aceptadas **o** usuario logeado con `acceptedCookies` a `true`), mostramos el banner.


## Apartado 5 – JSON y `package.json` (1,5 puntos)

### 5.1. JSON válido / inválido y corrección

El JSON dado **no es válido**. Versión corregida:

```json
{
  "users": {
    "alberto": {
      "username": "alberto",
      "password": "1234",
      "role": "admin"
    },
    "ana": {
      "username": "ana",
      "password": "1234",
      "role": "user"
    }
  }
}
```

Errores corregidos:

1. Las claves del objeto (`users`) deben ir entre comillas → `"users"`.
2. El valor `admin` debe ser una cadena → `"admin"`, no una palabra sin comillas.
3. No se permiten comas finales:

   * Coma después de `"role": "user",` → quitada.
   * Coma después del último usuario (`},`) → quitada.


### 5.2. Sección `scripts` en `package.json`

Solo el objeto `scripts` quedaría:

```json
"scripts": {
  "start": "node ./bin/www"
}
```


## Apartado 6 – Socket.io (BONUS 0,5 puntos)

Código que falta:

```js
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('join-room', (roomName) => {
    // Unir al socket a la sala roomName
    socket.join(roomName);
  });

  socket.on('new-message', (msg) => {
    // Enviar msg a TODOS los clientes de la sala "chat-main"
    io.to('chat-main').emit('new-message', msg);
  });
});
```