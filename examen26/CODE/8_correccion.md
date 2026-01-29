## Rutas
```
app.set("view", path.join(__dirname, "views"));
app.set("views engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:false}));
app.use(cookieParse());
app.use(express.json);
```
--- 
## EJERCICIO 1 (Login + sesión + mensajes)

### 1. Implementar POST /login:

En login.js:
```
function checkLogin(req, res, next){
  if(!req.session.user){
    return res.redirect("/");
  }
  return next();
}
```
```
router.post("/", (req, res)=>{
  const{user, pass} = req.body;
  if(!user || !pass){
    req.session.error= "Faltan credenciales";
    return res.redirect("/login");
  }

  // Si tenemos checkLogin:
  const u = database.users.checkLogin(user, pass);
  if(!u){
    req.session.error = "Usuario o contraseña incorrecta";
    return res.redirect("/login");
  }

  // Si es un objeto indexado por ID:
  const all = Object.values(database.users.data);
  const u = all.find(x => x.username === user);

  // Si es un objeto indexado por username:
  const u = database.users.data[user]; // OJO: user es el username

  // Si es un array:
    const u = database.users.data.find(x => x.username === user);

// Para los 3 casos anteriores:
  if (!u || u.pass !== pass) { 
    req.session.error = "Usuario o contraseña incorrecta";
    return res.redirect("/login");
  }

// Para todos:

  req.session.user = { id: u.id, username: u.username, role: u.role };
  req.session.message = "Login correcto";
  return res.redirect("/restricted");
});
```

### 2.Implementar GET /me:
En login:
```
router.get("/", (req, res)=>{
  return res.render("/", {title:"Login", user:req.session.user});
});
```
```
router.get("/me", (req, res, next)=>{
  if(req.session.user){
    return res.json({logged: true, user:{req.session.user}});
  }
  return res.status(401).json({logged:false});
});
```

Si piden que renderices:

```
router.get("/me", (req, res) => {
  if (req.session.user) {
    return res.render("me", {
      title: "Mi sesión",
      logged: true,
      user: req.session.user,
    });
  }
  return res.status(401).render("me", { title: "Mi sesión", logged: false });
});

```
### 3. En las vistas:
Mostrar message y error (si existen) en todas las páginas (layout/header o donde corresponda).

EN header.ejs:
```
<div>
  <%- message %>
  <%- error %>
</div>

```

--- 
## EJERCICIO 2 (Middlewares de protección)

### 1.Crear middleware requireLogin:

En app.js:
```
function requireLogin(req, res, next){
  if(req.session.user){
    return next();
  }
  req.session.error= "Debes iniciar session";
  return res.redirect("/login");
}

```
### 2. Crear middleware requireAdmin:
En app.js: 
```
function requireAdmin(req, res, next){
  if(req.session.user && req.session.user.role === "ADMIN"){
    return next();
  }
  req.session.error="No tienes permiso";
  return res.redirect(/restricted);
}

```

### 3. Proteger rutas:
En app.js:
```
app.use("/login", loginRouter);
app.use("/logout", requireLogin, logoutRouter);
app.use("/restricted", requireLogin, restrictedRouter);
app.use("/admin", requireAdmin, adminRouter);
```
---
## EJERCICIO 3 (Admin: tabla de usuarios + buscador + borrar)

### 1. GET /admin/users
En admin.js:
```
router.get("/users", (req, res)=>{
  const q= String(req.query.q || " ").trim().toLowerCase();
  // En all lo que hacemos es conbertir el obj en array, si fuese un array seria solo db.u.d
  const all= Object.value(database.users.data);
  const filtered= q? all.filter(u=> String(u.username || " ").toLowerCase().include(q)) : all;
  return res.render("admin_users", {title: "User", users: filtered, q});
});
```
### 3. POST /admin/users/:id/delete

En admin.js:
```
router.post("/users/:id/delete", (req, res) =>{
  const id= Number(req.params.id);
  if(!Number.isInteger(id) || id <= 0){
    req.session.error="No existe ese usuario";
    return res.return("/admin/users");
  }
  if(req.session.user && req.session.user.id === id){
    req.session.error="No te puedes borrar a ti mismo";
    return res.redirect("/admin/users");
  }
  const ok= database.users.delete(id); // el delete es la funcion de la db
  if(ok) res.session.message= "Usuario eliminado";
  else res.session.error= "Error usuario no existe";

  // En el caso de tener SEQUELIZE:
   try {
    const rows = await User.destroy({ where: { id } }); // rows = 0 o 1
    if (rows === 1) req.session.message = "Usuario eliminado";
    else req.session.error = "El usuario no existe";
    return res.redirect("/admin/users");
  } catch (e) {
    req.session.error = "Error interno borrando usuario";
    return res.redirect("/admin/users");
  }

  retun res.redirect(/users);
});
```
En la db:
```
// siendo OBJ:
delete(id) {
  if (!this.data[id]) return false;
  delete this.data[id];
  return true;
}

// siendo ARRAY:
delete(id) {
  const before = this.data.length;
  this.data = this.data.filter(u => u.id !== id);
  return this.data.length < before;
}

```

### 2. Vista admin_users.ejs
```
<%- inlcude("header", {title}) %>

<h1><%= title %></h1>

<form method="get" action="/admin/user">
  <input name="q" value="<% q || ' ' %>" placeholder="Buscar usuario">
  <button type="submit"> Buscar </button>
  <a href="/admin/users"> Limpiar </a>
</form>

<table>
  <thead>
    <tr>
      <th> Id </th>
      <th> Username </th>
      <th> Role </th>
      <th> Acciones </th>
    </tr>
  </thead>
  
  <tbody>
    <% if (!users || users.lenght === 0) {%>
      <tr> <td colspan="4"> No hay datos</td> </tr>
    <% }else{ %>
      <!-- OBJECTO -->
      <% Object.values(users).forEach(u => { %>
      <!-- ARRAY -->
      <% users.forEach( u => { %>
        <tr>
          <td> <%= u.id %> </td>
          <td> <%= u.username %> </td>
          <td> <%= u.role %> </td>
          <td>
            <form method="post" action= "/admin/users/<%= u.id%>/delete">
              <button type="submit"> Eliminar </button>
            </form>
          </td>
        </tr>
  </tbody>
  
</table>

<%- include("footer")%>
```

---
## EJERCICIO 4 (Admin: productos: tabla + buscador + crear + borrar)

### 1. GET /admin/products
```
router.get("/products", requireAdmin, (req, res)=>{
  const q= String(req.query.q || " ").trim().toLowerCase();
  const all= Object.values(database.products.data);
  const filtered= q? all.(p=> String(p.name || " ").toLowerCase().include(q)) : all;
  return res.render("admin_product", {"title":"Product", filtered, q});
});
```
### 2. Vista admin_products.ejs
```
<%- include("header", {title}) %>

<h1> <%= title %> </h1>

<form method="get" action="/admin/products">
  <input name="q" value="<%= q || '' %>" placeholder= "Buscar producto">
  <button type=submit> Buscar </button>
  <a href="/admin/products"> Limpiar </a>
</form>

<h2> Crear Producto </h2>
<form method="post" action="/admin/products" >
  <label for="name"> Name </label>
  <input name="name" id="name" required>
  <label for="price"> Price </label>
  <input name="price" id="price" required>
  <button type="submit"> Crear </button>
</form>

<table>
  <thead>
    <tr>
      <th> Id </th>
      <th> Name </th>
      <th> Price </th>
      <th> Borrar Producto </th>
    </tr>
  </thead>

  <tbody>
    <% if(!product || pruduct.length === 0) %>
      <tr> <td colspan="4"> No hay datos </td> </tr>
    <% }else { %>
      <% Object.values(products).forEach( p => { %>
        <tr>  
          <td> <%= p.id %> </td>
          <td> <%= p.name %> </td>
          <td> <%= p.price %> </td>
          <td>
            <form method="post" action="/admin/products/<%= p.id %>/delete" >
              <button type="submit"> Eliminar </button>
            </form>
          </td>
        </tr>
      <% }) } %>
  </tbody>
  
</table>

<%- include("footer") %>
```
### 3. Crear producto:
En admin.js:
 1. GET /admin/products/new renderiza admin_product_new.ejs
```
router.get("/products/new", (req, res) => {
  res.render("admin_product_new", {title:"Crear usuario", user: req.session.user}); 
});
```
 2. POST /admin/products 
```
router.post("/products", requireAdmin, (req, res) =>{
  const name= String(req.body.name || " ").trim();
  const price= Number(req.body.price);
  const{name, price} = req.body;
  if(!name || ! price){
    req.session.error="Son datos obligatorios",
    return res.redirect("/admin/producs");
  }
  const id = nextId++;
  
  //para un Objeto:
  database.products.data[id] = {id, name, price};
  
  //para un Array:
  database.products.data.push({id, name, price});

  //para un Method
  database.products.create({ name, price });

  req.session.message=" Producto creado";
  return res.redirect("/admin/products");
});
```
### 4. Borrar producto: POST /admin/products/:id/delete
```
router.post("/produts/:id/delete", (req, res) => {
  const id= Number(req.params.id);
  if(!Number.isInteger(id) || id <=0 ){
    req.session.error="El id no es valido";
    return res.redirect("/products");
  }

  //Objeto
  const exists = !!database.products.data[id]; //convertimos a booleano
  if (exists) {
    delete database.products.data[id];
    req.session.message = "Producto eliminado";
  } else {
    req.session.error = "No existe ese producto";
  }

  //Array
  const before = database.products.data.length;
  database.products.data = database.products.data.filter(p => p.id !== id);

  if (database.products.data.length < before) req.session.message = "Producto eliminado";
  else req.session.error = "No existe ese producto";

  
  return res.redirect("/products");
});
```
## EJERCICIO 5 (Socket.io: salas + notificaciones + desconexión)

### 1. Al conectar un cliente por Socket.io:
Si el usuario está logeado, únele automáticamente a una sala identificable. 
Además, si el usuario es admin, únele también a la sala "admins"

En el server.js:
```
// IMPORTANTE: initSockets recibe el server y el sessionMiddleware
initSockets(server, sessionMiddleware);
```
En sockets.js:
```
const { Server } = require("socket.io");

let _io;

function initSockets(httpServer, sessionMiddleware) {
  _io = new Server(httpServer);

  // 1) “Inyectar” session en socket.request
  _io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });

  // 2) Connection handler
  _io.on("connection", (socket) => {
    const sess = socket.request.session;

    // Si NO hay sesión o NO hay usuario logeado, no auto-join
    if (!sess || !sess.user) return;

    // Opción A: room = session.id (muy útil para logout+disconnect)
    const roomA = sess.id;

    // Opción B: room = username (útil para “kicked” por username)
    const roomB = sess.user.username;

    // El examen suele pedir elegir UNA. Si quieres ser pro: únete a ambas:
    socket.join(roomA);
    socket.join(roomB);

    // Si es admin -> sala "admins"
    if (sess.user.role === "ADMIN") {
      socket.join("admins");
    }

    // Guardar info útil en el socket
    socket.data.sessionId = roomA;
    socket.data.username = roomB;
    socket.data.role = sess.user.role;
  });
}

function io() {
  return _io;
}

module.exports = { initSockets, io, initSockets };
```
### 2. Evento de cliente → servidor:

Dentro del connection:
```
_io.on("connection", (socket) => {
  socket.on("join_room", ({ room } = {}) => {
    const clean = String(room || "").trim();

    // Validación mínima típica de examen
    const isValid = clean.length >= 1 && clean.length <= 40;

    if (!isValid) {
      return socket.emit("room_error", { error: "Room inválida" });
    }

    socket.join(clean);
    socket.emit("room_joined", { room: clean });
  });
});
```
### 3. Cuando un admin borra un usuario (del ejercicio 3):
A) Notificación a admins (siempre):
```
io().to("admins").emit("admin_notice", {
  text: `Se ha borrado el usuario ${username}`
});
```
B) Si tienes forma de saber la sala del usuario borrado (p.ej. sessionId guardado).
En login, cuando se logea, guardas también el sessionId actual en el user (o un campo room).

En login (cuando ok):
```
req.session.user = { username: user, role: found.role };
database.users.data[userId].sessionId = req.session.id; // o room = username
```
En delete:
```
const userRoom = deletedUser.sessionId; // o deletedUser.username
io().to(userRoom).emit("kicked", { reason: "Tu usuario ha sido eliminado" });
io().in(userRoom).disconnectSockets(true);
```

### 4. Logout con sockets: destruir sesión + desconectar sockets del usuario

En tu routes/logout.js
```
router.post("/logout", (req, res) => {
  const sessionId = req.session.id;

  req.session.destroy(() => {
    // desconecta todos los sockets que estén en la room del sessionId
    io().in(sessionId).disconnectSockets(true);
    res.redirect("/");
  });
});
```
### 5) Cliente (public/js): formulario “entrar a sala” + listeners + pintar en pantalla

```
<form id="roomForm">
  <input id="roomInput" placeholder="room (ej: admins, sala1...)" />
  <button type="submit">Entrar</button>
</form>

<ul id="log"></ul>

<script src="/socket.io/socket.io.js"></script>
<script src="/js/client.js"></script>
```










