## 1) Roles + protección por rol
En el login se guarde en sesión el usuario con username, id y role:
En login.js:

```
router.post("/", (req, res) =>{
  const {username, pass}= req.login;
  if (!username || !pass){
    req.session.error="Campos obligatorios";
    return res.redirect("/login");
  }

  const u= database.users.findByUsername(username);
  if(!u || u.pass !== pass){
    req.session.error="Usuario incorrecto";
    return res.redirect("/login");
  }
  req.session.user= {id: u.id, username: u.username, pass: u.pass, role: u.role}
  req.session.message="Credenciales correctas";
  return res.redirect("/restricted");
});
```
Crea un middleware requireAdmin que solo deje entrar a usuarios con role === "ADMIN":
En app.js:

```
function requireAdmin (req, res, next){
  if(!req.session.user){
    req.session.error= "Debes iniciar sesión";
    return res.redirect("/login");
  }
  if(req.session.user.role !== "ADMIN"){
    req.session.error= "No tienes permiso";
    return res.redirect("/restricted");
  }
  return next();
});

app.use("/admin", requireAdmin, adminRouter);
```
---
## 2) Admin dashboard
Añade la ruta GET /admin para que: solo entren admins, renderice admin.ejs,...

En admin.js:
```
router.get("/", requireAdmin, (req, res) =>{
  const stats= {totalUsers: database.users.count(), totalProducts: database.products.count()};
  return res.render("admin", {title: "Panel admin", stats}
})
```
En admin.ejs:
```
<%- include("header", {title}) %>
<h1><%= title %></h1>

<ul>
  <li> Total users: <%= stats.totalUsers %> </li>
  <li> Total products: <%= stats.totalProducts %> </li>
</ul>

<p>
  <a href="/admin/users"> Users </a>
  <a href="/admin/products"> Products </a>
</p>

```

---
## 3) Admin users: tabla + buscador + borrar

### A) GET /admin/users

En admin.js:
```
router.get("/users", (req, res) =>{
  const q= String(req.query.q || ' ' ).trim().toLowerCase();
  const all= Object.value(database.users.data);
  const finder= q? all.filter(u => u.username.toLowerCase().include(q)) : all;
  return res.render("admin_users", {title: "Usuarion", user:finder, q});
})
```
En admin_users.ejs:
```
<%- include("header", {title}) %>

<form method="get" action="/admin/users">
  <input name="q" value="<% q || ' ' %>" placeholder="Buscar User">
  <button type="submit"> Buscar User </button>
  <a href="/admin/user"> Limpiar </a>
</form>

<table>
  <thead>
    <tr>
      <th> Id </th>
      <th> Username </th>
      <th> Role </th>
    </tr>
  </thead>

 <tbody>

    <%if(!user || user.lenght === 0) { %>
      <tr> <td colspan="3"> No hay usuarios </td> </tr>
    <% }else{ %>
      <% user.forEach( u => { %> 
        <tr>
          <td> <%= u.id %> </td>
          <td> <%= u.username %> </td>
          <td> <%= u.role %> </td>
        </tr>
      <% }) %> 
    <% } %>

</tbody>

</table>
<%- include("footer") %>
```

### B) POST /admin/users/:id/delete

En admin.js:
```
router.post("/users/:id/delete", (req, res) => {
  const id= Number(req.params.id);
  if(!Number.isInteger(id) || id <= 0){
    req.session.error= "No existe ese usuario";
    return res.redirect("/admin/users");
  }

  if(req.session.id === id){
    req.session.error="No te puedes eliminar a ti mismo";
    return res.redirect("/admin/users");
  }

  const ok= database.users.deleteById(id);
  if(ok) req.session.message= "Usuario eliminado";
  else req.session.error= "No existe ese usuario";

  return res.redirect("/admin/users");
})
```
En login.js
```
req.session.user = {id: u.id, username: u.username, role: u.role};
```
En admin.ejs
```
<form method="post" action:"/users/:id/delete">
  <button type="submit"> Delete user </button>
</form>
```

---
## 4) Admin products: tabla + buscador + borrar + crear

### A) GET /admin/products y D) POST /admin/products/:id/delete
En admin.js:
```
router.get("/products", (req, res) => {
  const q= String(req.query.q).trim().toLowerCase();
  const all= Object.value(database.products.data);
  const finder= q? all.filter(p=> String(p.name || " ").toLowercase().include(q)) || all;
  return res.render("admin_products", products: finder, q);
})

router.post("/products/:id/delete", (req, res) => {
  const id= Number(req.params.id);

  if(!Number(id.isInteger(id)) || id <=0){
    req.session.error= "No existe ese producto.";
    return res.redirect("/admin/products"); 
  }
  const ok= database.products.deleteById(id);

  if(ok) req.session.message= "Producto Borrado";
  else req.session.message= "Error al borrar producto";

  return res.redirect("/admin/products");
})

```
En admin.ejs
```
<%- include("header", {´title}) %>
<form method="get" action="/admin/productos">
  <input name="q" value="<% q || ' ' %>" placeholder="Buscar Producto">
  <button type="submit"> Buscar </button>
  <a href="/admin/products"> Limpiar </a>
</form>

<table>
  <thead>
    <tr>
    <th> Id </th>
    <th> Name </th>
    <th> Price </th>
    <th> Accion </th>
    </tr>
  </thead>
  <tbody>
    <% if (!products || products.lenght === 0) {%>
      <tr><td colspan="3"> No hay productos </td></tr>
    <% } else { %>
      <% products.forEach(p => { %>
        <tr>
          <td> <%= p.id %> </td>
          <td> <%= p.name %> </td>
          <td> <%= p.price %> </td>
          <td>
            <form method="post" action="/admin/products/<%= id %>/delete">
              <button type="sumbit"> Borrar </button>
            </form>
          </td>
        </tr>
      <% }) %>
    <% } %>
  </tbody>
</table>

```
### B) GET /admin/products/new
En admin.js:
```
router.get("/products/new", (req,res) =>{
  return res.render("admin_product_new", {title: "Nuevo Producto"});
})
```
### C) POST /admin/products
En admin.js:
```
router.post("/products", (req,res) =>{
  const name= String(req.body.name || " ").trim();
  const priceNum= Number(req.body.price);
  if(!name || !Number.isFinite(priceNum) || price <= 0){
    req.session.error="Datos invalidos";
    return res.redirect("/admin/products/news");
  }
  database.products.create({name, price: priceNum});
  req.session.message= "Producto creado";
  return res.redirect("/admin/products");
});
```
---
## 5) Socket.IO

### A) Room de admins

window.me es una variable global en el navegador que usamos para guardar “quién soy yo (el usuario logueado)” y que cualquier script pueda leerla.
client.js
```
const socket = io();

socket.on("server:hello", (data) => {
  console.log("hello:", data);
});

// A) Si soy admin, me uno a la room "admins"
if (window.me && window.me.role === "ADMIN") {
  socket.emit("room:join", "admins");
}

```
header.ejs
```
<script>
  window.me = <%- JSON.stringify(me || null) %>;
</script>

<script src="/socket.io/socket.io.js"></script>
<script src="/js/client.js"></script>
```
### B) Notificaciones en tiempo real
admin.js
```
const { io } = require("../sockets");

// ... dentro del POST /admin/users/:id/delete (cuando borras OK)
io().to("admins").emit("admin:notice", {
  type: "user_deleted",
  text: `Usuario ${id} eliminado`
});

// ... dentro del POST /admin/products/:id/delete (cuando borras OK)
io().to("admins").emit("admin:notice", {
  type: "product_deleted",
  text: `Producto ${id} eliminado`
});
```
client.js
```
socket.on("admin:notice", (payload) => {
  console.log("ADMIN NOTICE:", payload);

  const live = document.getElementById("live");
  if (live) {
    const p = document.createElement("p");
    p.textContent = `[${payload.type}] ${payload.text}`;
    live.prepend(p);
  }
});

```

### C) Desconectar sockets del usuario borrado

Aquí hay 2 piezas:
- que cada socket se meta en su room user:<id> al conectar
- al borrar: io().to("user:<id>").disconnectSockets(true)

En sockets.js:
```
let _io = null;

function initSockets(server) {
  const { Server } = require("socket.io");
  const sessionMiddleware = require("./config/session");

  _io = new Server(server);

  // IMPORTANTÍSIMO: enganchar la sesión de Express a socket.request
  _io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });

  _io.on("connection", (socket) => {
    socket.emit("server:hello", { ok: true });

    // C) Room por usuario (si hay sesión y user.id)
    const user = socket.request.session?.user;
    if (user && user.id != null) {
      socket.join(`user:${user.id}`);
    }

    socket.on("room:join", (room) => {
      socket.join(String(room));
    });
  });
}

function io() {
  if (!_io) throw new Error("Socket.io no inicializado");
  return _io;
}

module.exports = { initSockets, io };

```
En admin.js:
```
const { io } = require("../sockets");

// tras borrar usuario id correctamente:
io().to(`user:${id}`).disconnectSockets(true);

```

























