# SIMULACRO PRÁCTICO COMPLETO (5 ejercicios, el 5 es Socket.io)

## Contexto que te “dan”

## 1) Estructura sugerida

```
project/
  app.js
  bin/
    www
  config/
    session.js
  database/
    index.js
  routes/
    index.js
    login.js
    logout.js
    restricted.js
    admin.js
  sockets/
    index.js
  public/
    js/
      socket-client.js
  views/
    partials/
      header.ejs
      footer.ejs
    index.ejs
    login.ejs
    restricted.ejs
    admin.ejs
```

---

## 2) config/session.js (sesiones)

```js
// config/session.js
const session = require("express-session");

module.exports = session({
  secret: "dev-secret-change-me",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    // secure: true, // en HTTPS
    maxAge: 1000 * 60 * 60, // 1h
  },
});
```

---

## 3) database/index.js (DB en memoria, utilidades)

```js
// database/index.js
function makeIdGen(start = 1) {
  let id = start;
  return () => id++;
}

const nextUserId = makeIdGen(1);
const nextProductId = makeIdGen(1);

const users = {
  data: {
    // Ejemplo de admin “pre-cargado”
    1: { id: 1, username: "admin", pass: "admin", role: "ADMIN" },
    2: { id: 2, username: "alice", pass: "alice", role: "USER" },
  },

  count() {
    return Object.keys(this.data).length;
  },

  findByUsername(username) {
    const all = Object.values(this.data);
    return all.find((u) => u.username === username) || null;
  },

  checkLogin(username, pass) {
    const u = this.findByUsername(username);
    if (!u) return null;
    return u.pass === pass ? u : null;
  },

  delete(id) {
    if (!this.data[id]) return false;
    delete this.data[id];
    return true;
  },
};

const products = {
  data: {
    1: { id: 1, name: "Gorra", price: 9.99 },
    2: { id: 2, name: "Camiseta", price: 14.5 },
  },

  count() {
    return Object.keys(this.data).length;
  },

  create({ name, price }) {
    const id = nextProductId();
    const p = { id, name, price };
    this.data[id] = p;
    return p;
  },

  delete(id) {
    if (!this.data[id]) return false;
    delete this.data[id];
    return true;
  },
};

module.exports = { users, products };
```

---

## 4) sockets/index.js (patrón “init + getter io()”)

```js
// sockets/index.js
const { Server } = require("socket.io");

let _io = null;

function init(httpServer, sessionMiddleware) {
  _io = new Server(httpServer);

  // Hacer que socket.request tenga session (misma middleware que Express)
  _io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });

  _io.on("connection", (socket) => {
    // Aquí NO implemento rooms/joins/notificaciones (eso es tu EJ 5)
    // TODO (EJ 5): joins a rooms, eventos socket.on(...), etc.
  });

  return _io;
}

function io() {
  if (!_io) throw new Error("Socket.io no inicializado. Llama init() en bin/www.");
  return _io;
}

module.exports = { init, io };
```

---

## 5) bin/www (arranque servidor + socket init)

```js
// bin/www
#!/usr/bin/env node

const http = require("http");
const app = require("../app");
const sessionMiddleware = require("../config/session");
const sockets = require("../sockets");

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);

// IMPORTANTE: init sockets con el mismo sessionMiddleware
sockets.init(server, sessionMiddleware);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function normalizePort(val) {
  const p = parseInt(val, 10);
  if (Number.isNaN(p)) return val;
  if (p >= 0) return p;
  return false;
}

function onError(error) {
  if (error.syscall !== "listen") throw error;
  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requiere privilegios elevados");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " ya está en uso");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("Listening on " + bind);
}
```

---

## 6) app.js (Express + flash res.locals + rutas)

```js
// app.js
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const sessionMiddleware = require("./config/session");

const indexRouter = require("./routes/index");
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout");
const restrictedRouter = require("./routes/restricted");
const adminRouter = require("./routes/admin");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(sessionMiddleware);

/**
 * Flash simple:
 * - lee req.session.message / req.session.error
 * - lo vuelca en res.locals para las vistas
 * - y luego lo borra de sesión (para que solo aparezca una vez)
 */
app.use((req, res, next) => {
  const message = req.session.message;
  const error = req.session.error;

  delete req.session.message;
  delete req.session.error;

  // puedes devolver HTML seguro (p simple) o texto plano
  res.locals.message = message ? `<p class="flash ok">${message}</p>` : "";
  res.locals.error = error ? `<p class="flash err">${error}</p>` : "";

  // usuario accesible en vistas si lo quieres
  res.locals.currentUser = req.session.user || null;

  next();
});

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/restricted", restrictedRouter);
app.use("/admin", adminRouter);

// catch 404
app.use((req, res, next) => next(createError(404)));

// error handler
app.use((err, req, res, next) => {
  res.locals.title = "Error";
  res.locals.errorMessage = err.message;
  res.status(err.status || 500);
  res.render("index");
});

module.exports = app;
```

---

## 7) routes (stubs sin tus soluciones)

### routes/index.js

```js
// routes/index.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  return res.render("index", { title: "Inicio" });
});

module.exports = router;
```

### routes/login.js

```js
// routes/login.js
const express = require("express");
const database = require("../database");
const router = express.Router();

router.get("/", (req, res) => {
  return res.render("login", { title: "Login" });
});

// TODO (EJ 1): POST /login (validación, checkLogin, session.user, message/error, redirect)

module.exports = router;
```

### routes/logout.js

```js
// routes/logout.js
const express = require("express");
const router = express.Router();

// TODO (EJ 5 opcional / logout+socket): destruir sesión y desconectar sockets si te lo piden
router.post("/", (req, res) => {
  req.session.destroy(() => {
    return res.redirect("/");
  });
});

module.exports = router;
```

### routes/restricted.js

```js
// routes/restricted.js
const express = require("express");
const router = express.Router();

// TODO (EJ 2): requireLogin middleware y proteger esta ruta
router.get("/", (req, res) => {
  return res.render("restricted", { title: "Restricted" });
});

module.exports = router;
```

### routes/admin.js

```js
// routes/admin.js
const express = require("express");
const database = require("../database");
const { io } = require("../sockets");
const router = express.Router();

// TODO (EJ 2): requireAdmin y aplicarlo a TODO /admin/*

// Admin dashboard base (sin tu lógica extra)
router.get("/", (req, res) => {
  // TODO (EJ 2 + EJ 4): proteger con requireAdmin
  const stats = {
    totalUsers: database.users.count(),
    totalProducts: database.products.count(),
  };
  return res.render("admin", { title: "Panel admin", stats });
});

// TODO (EJ 3): GET /admin/users (buscador + render admin_users.ejs)
// TODO (EJ 3): POST /admin/users/:id/delete (mensajes + redirect + notificar admins con socket si lo piden)
// TODO (EJ 4): GET /admin/products (buscador + render admin_products.ejs)
// TODO (EJ 4): GET/POST create producto + delete
// TODO (EJ 5): usar io().to("admins").emit(...) etc. (solo si el enunciado lo pide)

module.exports = router;
```

---

## 8) views (partials + páginas base)

### views/partials/header.ejs

```ejs
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title><%= title || "App" %></title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    .flash{padding:.6rem;border-radius:.5rem}
    .ok{background:#e9fff0}
    .err{background:#ffecec}
    nav a{margin-right:.7rem}
  </style>
</head>
<body>
  <nav>
    <a href="/">Inicio</a>
    <a href="/login">Login</a>
    <form action="/logout" method="post" style="display:inline">
      <button type="submit">Logout</button>
    </form>
    <a href="/restricted">Restricted</a>
    <a href="/admin">Admin</a>
  </nav>

  <div>
    <%- message %>
    <%- error %>
  </div>

  <hr/>
```

### views/partials/footer.ejs

```ejs
  <hr/>
  <small>Demo examen</small>

  <script src="/socket.io/socket.io.js"></script>
  <script src="/js/socket-client.js"></script>
</body>
</html>
```

### views/index.ejs

```ejs
<%- include("partials/header", { title }) %>

<h1><%= title %></h1>

<% if (currentUser) { %>
  <p>Logeado como: <strong><%= currentUser.username %></strong> (<%= currentUser.role %>)</p>
<% } else { %>
  <p>No hay sesión activa.</p>
<% } %>

<%- include("partials/footer") %>
```

### views/login.ejs

```ejs
<%- include("partials/header", { title }) %>

<h1><%= title %></h1>

<form method="post" action="/login">
  <label>Usuario</label>
  <input name="user" autocomplete="username" />

  <label>Pass</label>
  <input name="pass" type="password" autocomplete="current-password" />

  <button type="submit">Entrar</button>
</form>

<%- include("partials/footer") %>
```

### views/restricted.ejs

```ejs
<%- include("partials/header", { title }) %>

<h1><%= title %></h1>
<p>Zona restringida (debe ir protegida con middleware).</p>

<%- include("partials/footer") %>
```

### views/admin.ejs

```ejs
<%- include("partials/header", { title }) %>

<h1><%= title %></h1>

<ul>
  <li>Total users: <%= stats.totalUsers %></li>
  <li>Total products: <%= stats.totalProducts %></li>
</ul>

<p>
  <a href="/admin/users">Users</a>
  <a href="/admin/products">Products</a>
</p>

<%- include("partials/footer") %>
```

---

## 9) public/js/socket-client.js (solo conexión base)

```js
// public/js/socket-client.js
(() => {
  // Conecta con el servidor Socket.io
  const socket = window.io();

  socket.on("connect", () => {
    // NO hago joins ni listeners del examen (eso es tu EJ 5)
    // TODO (EJ 5): emitir join_room desde un form, escuchar room_joined/admin_notice/kicked, etc.
    // console.log("socket connected:", socket.id);
  });
})();
```


---

## EJERCICIO 1 (Login + sesión + mensajes)

**Modifica o añade el código necesario para:**

1. Implementar `POST /login`:

* Si faltan datos → `req.session.error = "Faltan credenciales"` y redirect a `/login`.
* Si credenciales correctas:

  * Guardar en sesión: `req.session.user = { id, username, role }`
  * `req.session.message = "Login correcto"`
  * Redirigir a `/restricted`
* Si credenciales incorrectas:

  * `req.session.error = "Usuario o contraseña incorrectos"`
  * Redirigir a `/login`

2. Implementar `GET /me`:

* Si hay sesión → responde JSON `{ logged: true, user: {...} }`
* Si no hay sesión → `401` con `{ logged: false }`

3. En las vistas:

* Mostrar **message** y **error** (si existen) en todas las páginas (layout/header o donde corresponda).

---

## EJERCICIO 2 (Middlewares de protección)

**Modifica o añade el código necesario para:**

1. Crear middleware `requireLogin`:

* Si `req.session.user` existe → `next()`
* Si no → `req.session.error = "Debes iniciar sesión"` y redirect a `/login`

2. Crear middleware `requireAdmin`:

* Si no hay user → redirect `/login` con error
* Si hay user pero `role !== "ADMIN"` → `req.session.error = "No tienes permisos"` y redirect `/restricted`
* Si es admin → `next()`

3. Proteger rutas:

* `/restricted` requiere login
* `/admin` y todo lo que cuelgue de admin requiere admin

---

## EJERCICIO 3 (Admin: tabla de usuarios + buscador + borrar)

**Modifica o añade el código necesario para:**

1. `GET /admin/users`

* Soporta buscador: `/admin/users?q=al`
* Filtra por `username` (case-insensitive)
* Renderiza `admin_users.ejs` con `{ title, users, q }`

2. Vista `admin_users.ejs`

* Incluye header/footer con EJS includes
* Formulario GET con input `q`, botón Buscar, enlace Limpiar
* Tabla con columnas: `id | username | role | acciones`
* Si no hay resultados: fila “No hay resultados”
* En acciones: botón **Borrar** por cada usuario (form POST)

3. `POST /admin/users/:id/delete`

* Borra el usuario por id
* Si borra: `req.session.message = "Usuario eliminado"`
* Si no existe: `req.session.error = "No existe ese usuario"`
* **Extra típico**: impedir que un admin se borre a sí mismo (mensaje error)

---

## EJERCICIO 4 (Admin: productos: tabla + buscador + crear + borrar)

**Modifica o añade el código necesario para:**

1. `GET /admin/products`

* Soporta buscador: `/admin/products?q=go`
* Filtra por `name` (case-insensitive)
* Renderiza `admin_products.ejs` con `{ title, products, q }`

2. Vista `admin_products.ejs`

* Formulario GET de búsqueda igual que users
* Tabla: `id | name | price | acciones`
* Botón Borrar por producto

3. Crear producto:

* `GET /admin/products/new` renderiza `admin_product_new.ejs`
* `POST /admin/products`

  * Valida `name` y `price`
  * Crea producto en `database.products`
  * `req.session.message = "Producto creado"`
  * Redirect a `/admin/products`

4. Borrar producto:

* `POST /admin/products/:id/delete`

  * Borra y pone mensaje o error
  * Redirect a `/admin/products`

---

## EJERCICIO 5 (Socket.io: salas + notificaciones + desconexión)

Este es el último y el que más cae.

**Modifica o añade el código necesario para:**

1. Al conectar un cliente por Socket.io:

* Si el usuario está logeado, **únele automáticamente** a una sala identificable:

  * Opción A: `room = req.session.id`
  * Opción B: `room = req.session.user.username`
* Además, si el usuario es admin, únele también a la sala `"admins"`

2. Evento de cliente → servidor:

* `socket.on("join_room", ({ room }) => ...)`
* Si `room` es válido: `socket.join(room)` y confirma con `socket.emit("room_joined", { room })`

3. Cuando un admin borra un usuario (del ejercicio 3):

* Emitir notificación a todos los admins:

  * `io.to("admins").emit("admin_notice", { text: "Se ha borrado el usuario X" })`
* Si tienes forma de saber la sala del usuario borrado (p.ej. sessionId guardado), también:

  * `io.to(userRoom).emit("kicked", { reason: "Tu usuario ha sido eliminado" })`
  * y desconectar sus sockets (`disconnectSockets()`)

4. Logout con sockets:

* Al hacer logout:

  * destruir sesión
  * desconectar sockets del usuario (por ejemplo usando la sala de sessionId)

5. Cliente (public/js):

* Formulario “entrar a sala”:

  * al enviar, hace `socket.emit("join_room", { room })`
  * escucha `room_joined`, `admin_notice`, `kicked` y lo pinta en pantalla
