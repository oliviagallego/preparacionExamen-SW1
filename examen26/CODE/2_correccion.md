# Solucion

### 1) Roles
1) *En el login, guarda en sesión el usuario real con username y role.* 

En /routes/login.js:
```
router.post("/", async (req, res) => {
  const {user, pass}= req.body;

  if(!user || !pass){
    req.session.error= "Error en la sesion.";
    return res.redirect("/login");
  }

  const ok= await database.users.isLoginRight(user,pass);

  if(ok){
    const u = await database.users.findByUsername(user);
    req.session.user={username: u.user, role: u.role};
    req.session.message="Login ok";
    return res.redirect("/restrincted");
  }

  req.session.error= "Usuario o contraseña incorrectas";
  return res.redirect("/login");
});
```

2. *Crea middleware requireAdmin en app.js.*

En app.js:
```
function requireAdmin(req, res, next) {
  if (!req.session.user) {
    req.session.error = "Debes iniciar sesión";
    return res.redirect("/login");
  }
  if (req.session.user.role !== "ADMIN") {
    req.session.error = "No tienes permisos";
    return res.redirect("/restricted");
  }
  return next();
}
```

3. *Protege /admin para que solo entre role === "ADMIN".*

En admin.js:
```
app.use("/admin", checkLogin, requireAdmin, adminRouter);
```
o dentro de admin.js:
```
router.use(requireAdmin);
```

---
### 2) Admin dashboard
En admin.js:
```
router.get("/", async (req, res, next) => {
  const users= await database.users.list();
  const stats={ totalUsers= users.length};
  return res.render("admin", {
    title: "Panel Admin",
    stats,
  });
})
```
---
### 3) Tabla de usuarios

En admin_users.ejs:
```
<%-include("admin")%>
<h1> <%= title %> </h1>
<form method="get" action="/admin/user">
  <input name="q" value= "<%= q || q '' %> " placeholder="Bucar">
  <button type="submit">Buscar</button>
  <a href="/admin/users">Limpiar</a>
</form> 

<table>
  <thead>
    <tr>
      <th>id</th>
      <th>username</th>
      <th>role</th>
    </tr>
  </thead>
  
  <tbody>
    <% if (!users || users.length === 0) { %>
      <tr><td colspan="3">No hay resultados</td></tr>
    <% } else { %>
      <%user.forEach(u => { %>
        <tr>
          <td> <%= u.id %> </td>
          <td> <%= u.username %> </td>
          <td> <%= u.role %> </td>
        </tr>
    <% }) %>
  </tbody>
</table>

<%-incluede("footer")%>
```
en admin.js:
```
router.get("/users", (req, res) => {
  const q = String(req.query.q || "").trim().toLowerCase();

  const all = Object.values(database.users.data); // objeto -> array
  const filtered = q ? all.filter(u => u.username.toLowerCase().includes(q)) : all;

  return res.render("admin_users", { title: "Usuarios", users: filtered, q });
});
```

---
### 4) Crear usuario
En admin.js:
```
routes.get("/users/new", (req,res,next) =>{
  return res.render("admin_user_new", { title:"New admin"})
});

routes.post("/users", async (req,res) =>{
  const {username, pass, role}= req.body;
  
  if(!username || !pass){
    req.session.error = "Son campos obligatorios.";
    return res.redirect("/admin");
  }
  
  try {
    await database.users.create({ username, pass, role: role || "USER" });
    req.session.message = "Usuario creado";
    return res.redirect("/admin/users");
  } catch (e) {
    req.session.error = "No se pudo crear (¿duplicado?)";
    return res.redirect("/admin/users/new");
  }
  
}
```
---
### 5) Socket.IO

* En sockets.js:
```
socket.on("joinRoom", ({ room }) => {
  socket.join(room);
  socket.emit("joined", { room });
});
```
* cuando creas usuario (routes/admin.js), emites a la room admin:
```
const { io } = require("../sockets");

// tras crear:
io().to("admin").emit("userCreated", { username, role: role || "USER" });
```
* Cliente (admin_socket.js):
```
const socket = io();
socket.emit("joinRoom", { room: "admin" });

socket.on("userCreated", (data) => {
  console.log("Nuevo usuario:", data);
});
```












