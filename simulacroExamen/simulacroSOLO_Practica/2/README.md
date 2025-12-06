# SIMULACRO – Sistemas Web I

### PARTE PRÁCTICA (solo papel)

### Enunciado general

Dispones de una aplicación web escrita en **Node.js + Express** para gestionar una pequeña plataforma llamada **BookHub**, donde los usuarios pueden registrarse, hacer login y ver una lista de libros.

La estructura simplificada del proyecto es:

```txt
bookhub/
 ├─ bin/
 │   └─ www
 ├─ app.js
 ├─ database.js
 ├─ package.json
 ├─ routes/
 │   ├─ index.js
 │   ├─ login.js
 │   └─ admin.js
 ├─ views/
 │   ├─ layout.ejs
 │   ├─ index.ejs
 │   ├─ login.ejs
 │   └─ admin_users.ejs
 └─ public/
     ├─ styles.css
     └─ js/
         └─ main.js
```

Cuando se arranca la aplicación, se crean usuarios de prueba en `database.js` con esta forma:

```js
// database.js
const db = {
  users: {
    data: {
      "alberto": { username: "alberto", password: "1234", role: "admin", acceptedCookies: false },
      "ana":     { username: "ana",     password: "1234", role: "user",  acceptedCookies: false },
      "daniel":  { username: "daniel",  password: "1234", role: "user",  acceptedCookies: false },
      "silvia":  { username: "silvia",  password: "1234", role: "user",  acceptedCookies: false }
    }
  },
  books: {
    data: [
      { id: 1, title: "Clean Code", author: "Robert C. Martin" },
      { id: 2, title: "You Don't Know JS", author: "Kyle Simpson" }
    ]
  }
};

module.exports = db;
```

El fichero `app.js` (resumido) es:

```js
// app.js
var createError   = require('http-errors');
var express       = require('express');
var path          = require('path');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');

var indexRouter   = require('./routes/index');
var loginRouter   = require('./routes/login');
var adminRouter   = require('./routes/admin');

var app = express();

// Configuración vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware básicos
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Sesión
app.use(session({
  secret: 'bookhub-secret',
  resave: false,
  saveUninitialized: false
}));

// Hacer disponible el usuario en todas las vistas
app.use(function(req, res, next) {
  res.locals.currentUser = req.session.user || null;
  next();
});

// Rutas
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/admin', adminRouter);

// 404
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
```

### Apartado 1 – Configuración global y `app.locals` (1,5 puntos)

Ahora mismo, el título **“BookHub – Tu biblioteca online”** está escrito “a pelo” en varias plantillas. Queremos:

1.1.
Configurar en **un único sitio** el nombre de la aplicación (`BookHub – Tu biblioteca online`) para poder usarlo en todas las vistas sin repetirlo.

* a- Escribe el código que añadirías en `app.js` para definir una variable global accesible desde todas las vistas usando **`app.locals`**.
* b- Explica brevemente (en 2–3 frases) la **diferencia práctica** entre `app.locals` y `res.locals` en esta aplicación.

1.2.
La plantilla `layout.ejs` comienza así:

```ejs
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>BookHub – Tu biblioteca online</title>
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body>
    <header>
      <h1>BookHub – Tu biblioteca online</h1>
    </header>
    <main>
      <%- body %>
    </main>
  </body>
</html>
```

Modifica el fragmento anterior para **usar la variable global** que has definido con `app.locals` en vez de tener el texto duplicado.

### Apartado 2 – Middleware `checkLogin` y roles (3 puntos)

En `routes/admin.js` tenemos:

```js
var express = require('express');
var router = express.Router();
var db = require('../database');

// TODO: aquí irá el middleware checkLogin

router.get('/', function(req, res) {
  res.render('admin_home');
});

router.get('/users', function(req, res) {
  const users = db.users.data;
  res.render('admin_users', { users: users });
});

module.exports = router;
```

2.1.
Define un middleware `checkLogin` que:

* compruebe si existe `req.session.user`;
* si **no** existe, redirija al usuario a `/login` y guarde un mensaje de error en `req.session.error`;
* si existe, llame a `next()` para continuar.

Escribe el código completo del middleware y cómo lo aplicarías para que **todas las rutas de `/admin`** lo usen.

2.2.
Queremos que solo los usuarios con `role: "admin"` puedan acceder a `/admin`. Amplía el middleware anterior para que:

* además de comprobar que hay usuario en sesión, compruebe que `req.session.user.role === "admin"`;
* si el usuario **no** es admin, le redirija a `/` (página principal) con un mensaje de error adecuado en la sesión.

2.3.
Explica con tus palabras qué hace `next()` dentro de un middleware y qué pasaría si **no se llamara nunca** a `next()` ni se enviara respuesta (`res.send`, `res.render`, etc.).


### Apartado 3 – Listado de usuarios en la vista (EJS + objetos) (2,5 puntos)

En la ruta `/admin/users` se pasa a la vista un objeto `users` que contiene todos los usuarios:

```js
const users = db.users.data;
res.render('admin_users', { users: users });
```

Recordamos que `users` tiene esta forma:

```js
{
  "alberto": { username: "alberto", password: "1234", role: "admin", acceptedCookies: true },
  "ana":     { username: "ana",     password: "1234", role: "user",  acceptedCookies: false },
  ...
}
```

La plantilla `views/admin_users.ejs` tiene este fragmento incompleto:

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
    <% /* TODO: recorrer aquí el objeto users */ %>
  </tbody>
</table>
```

3.1.
Escribe el código EJS necesario para **recorrer el objeto `users` correctamente** y mostrar una fila por cada usuario.
Recuerda que `users` es un **objeto**, no un array.

* Muestra en la tabla: `username`, `role` y `acceptedCookies` como “Sí” / “No”.

3.2.
Explica brevemente (2–3 frases) por qué **no es correcto** intentar hacer directamente algo tipo:

```ejs
<% users.forEach(function(user) { ... }) %>
```

en este caso concreto.


### Apartado 4 – Banner de cookies + sesión + base de datos (2,5 puntos)

Por normativa, queremos añadir un **banner de cookies** al estilo del simulacro de “Embutidos León”.

4.1. (HTML / CSS conceptual – sin mucho detalle)
Describe **qué estructura HTML básica** tendría un banner fijo en la parte inferior de todas las páginas con:

* un texto breve informando del uso de cookies;
* un botón “Aceptar”;
* un botón “Rechazar”.

Explica también **qué propiedades CSS** (mención de propiedades, no valores exactos) harías para que:

* ocupe todo el ancho de la pantalla,
* esté **siempre visible** encima de cualquier contenido.

(No hace falta escribir todo el CSS completo, solo indicar las propiedades clave y su intención: por ejemplo, “position: …”, “bottom: …”, etc.)

4.2. (Back-end con Express)
Suponiendo que el botón “Aceptar” hace un `POST` a `/cookies/accept`:

```html
<form method="POST" action="/cookies/accept">
  <button type="submit">Aceptar</button>
</form>
```

Escribe una ruta Express (en un archivo `routes/cookies.js`, por ejemplo) que:

* marque en la **sesión actual** que el usuario ha aceptado cookies (`req.session.cookiesAccepted = true`);
* si existe `req.session.user`, actualice también en `db.users.data[username].acceptedCookies = true;`
* redirija al usuario de vuelta a la página principal `/`.

No hace falta que importes todo, pero indica claramente:

* el `require` de `express` y de `database.js`,
* la definición del router,
* la ruta `POST /accept`,
* el `module.exports`.

4.3.
Explica cómo comprobarías en una plantilla EJS (por ejemplo en `layout.ejs`) si **debes mostrar o no** el banner de cookies, usando lo que has guardado en la sesión y/o en el usuario logeado.

(No hace falta escribir EJS perfecto, basta con indicar la condición lógica que usarías).


### Apartado 5 – JSON y `package.json` (1,5 puntos)

5.1. (Corrección JSON – 1 punto)
Indica si el siguiente JSON es **válido** o no. Si no lo es, corrígelo para que sea un JSON **válido**:

```json
{
  users: {
    "alberto": {
      "username": "alberto",
      "password": "1234",
      "role": admin
    },
    "ana": {
      "username": "ana",
      "password": "1234",
      "role": "user",
    },
  }
}
```

Justifica brevemente los errores que hayas corregido.

5.2. (Scripts en `package.json` – 0,5 puntos)
Dado el siguiente `package.json` incompleto:

```json
{
  "name": "bookhub",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    // TODO
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

Escribe la sección `scripts` para que:

* haya un script `start` que arranque la aplicación usando `node ./bin/www`.

(Escribe solo el objeto `"scripts"` correcto.)


### Apartado 6 – Pregunta corta sobre Socket.io (BONUS 0,5 puntos)

En el servidor tenemos este código para gestionar un chat simple:

```js
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('join-room', (roomName) => {
    // TODO: unir al socket a la sala roomName
  });

  socket.on('new-message', (msg) => {
    // TODO: enviar msg a TODOS los clientes de la sala "chat-main"
  });
});
```

6.1.
Escribe las dos líneas de código que faltarían en los `TODO` para:

* unir al usuario a la sala `roomName`;
* emitir el mensaje `msg` a **todos** los clientes conectados a la sala `"chat-main"`.
