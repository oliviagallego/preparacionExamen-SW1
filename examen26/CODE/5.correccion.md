## Apartado 1 — Configuración del servidor
- Completar: puerto, servidor, vistas, estáticos, parseo formularios. 
- Puerto del servidor:La aplicación debe iniciar en el puerto indicado por la variable de entorno PORT o, 
                      si no existe, en el puerto 3000.
En app.js:
```
const PORT= process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());
app.use(express.json);

app.use(function(req,res, next){
  next (createError(404));
});

app.use(function(err, req, res, next){
    res.locals.message= err.message;
    res.locals.error= req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(PORT, () => {
  console.log("Servidor escuchando en el puerto: ${PORT}");
});

```
---
## Apartado 2 — Login y logout
1. GET /login Renderiza la vista login.ejs.

En login.js
```
router.get("/", (req, res)=>{
  return res.render("login", {title: "Login"});
});
```
Si lo hicieramos en app.js:
```
router.get("/login", (req, res)=>{
  return res.render("login", {title: "Login"});
});
```

2. POST /login:
    - Recibe username y password del formulario.
    - Busca el usuario en la “base de datos” en memoria.
    - Si las credenciales son correctas:
        - Actualiza last_login con la fecha actual (por ejemplo ISO string).
        - Establece el usuario como currentUser.
        - Redirige a /.
    - Si no son correctas: Muestra un mensaje de error o re-renderiza login con error.

En loging.js:
```
router.post("/login", async (req, res, next)=>{
  const {username, password}= req.body;
  if(!username || !password){
    req.session.error="Credenciales obligatorias";
    return res.redirect("/login");
  }

  const userObj= database.users.data;
  const user= usersObject[username];

  if(user && user.password === password){
    user.last_login= new Data().toISOString();
    req.session.user={username: user.name, role:user.role};
    req.session.message="Login";
    return res.redirect("/restricted");
  }

  req.session.error="Usuario o contraseña incorrectos";
  retun res.redirect("/login");
});
```

3. POST /logout: “Desloguea” al usuario (currentUser = null) y redirige a /.
En app.js
```
app.use("/logout", (req, res) =>{
  req.session.destroy(() => {
    return res.redirect("/login");
  });
});
```

## Apartado 3 + 4 — Panel de administración y Eliminar usuarios
GET /admin (solo admin), admin.ejs tabla con acciones.

En admin.js:
```
function requireAdmin(req, res, next){
   if(!req.session.user){
    req.session.error="Tiene que iniciar sesion";
    return res.redirect("/login");
  }
  if(!req.session.user.role !== "ADMIN"){
    req.session.error= "Tiene que ser admin";
    return res.redirect("/");
  }
  return next();
}

//Dashboard
router.get("/", requireAdmin, (req, res)=>{
  const users= Object.values(database.users);
  const stats= {totalUsers: database.users.count()};
  return res.render("admin", {title:"Panel Admin", users, stats});
});

//Listar
router.post("/users", (req, res){
  const users= Object.values(usersById);
  return res.render("admin_user", {title: "admin", user: req.session.user, users});
});

//Buscar
router.post("/users", (req, res){
  const q= String(req.query.q || " ").trim().toLoweCase();
  const all= Object.value(database.users);
  const finder= q? all.filter(u=> u.username.toLowerCase().includes(q)) : all;
  return redirect("/admin/users", {title: "Usuarios", finder, q});
});

//Borrar
router.post("/deleteUser", (req, res) =>{
  const id= Number(req.params.id);

  if(!Number.isInteger(id) || id<0){
    req.session.error="Id invalido";
    return res.redirect("/admin/users");
  }

  //Buscamos usuarios
  const all= Object.values(database.users);
  const target= all.find(u => u.id === id);

  if(!target){
    req.session.error="No puedes eliminar a un admin";
    return res.return("/admin/users");
  }

  //No borrar admins
  if(target.role === "ADMIN"){
    req.session.error="No puedes eliminar un admins";
    return res.return("/admin/users");
  }

  //No te puedes borrar a ti mismo:
  if(req.session.user.id === id){
    req.session.error="No te puedes eliminar.";
    return res.return("/admin/users");
  }

  delete database.users[target.username];

  req.session.message="Usuario borrado";
  return res.redirect("/admin/users");
});

```
En admin.ejs:
```
<%- include("headers", {title}) %>

<h1> <%= title %> </h1>

<form method="get" action="/admin/users">
  <input name="q" value="<% q || ' ' %>" placeholder="Buscar usuario">
  <button type="submit"> Buscar Usuario </button>
  <a href="/admin/users"> Limpiar </a>
</form>

<table>
  <thead>
    <tr><th> Username </th>  <th> Role </th>  <th> Last Login </th> <th> Delete </th> </tr>
  </thead>
  <tbody>
    <% if(!users || users.lenght===0){ %>
      <tr> <td colspan="3"> No hay datos </td> </tr>
    <% } else { %>
        <% users.forEach( u => { %>
      <tr>
        <td> <%= u.username %> </td>
        <td> <%= u.role %> </td>
        <td> <%= u.last_login %> </td>
        <td>
          <form method="post" action= "/admin/deleteUser">
            <botton type="submit"> Eliminar </botton>
          </form>
        </td>
  </tbody>
</table>
```












