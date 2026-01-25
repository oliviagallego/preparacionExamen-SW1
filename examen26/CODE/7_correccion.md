## 1.1. Vistas y middlewares básicos 
En app.js:

```
app.set("views", path.join(__dirname, "views"));
app.set("views engine", "ejs");

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json);
app.use(cookieParser());

app.use(function(req, res, next) =>{
  next(createError(404));
});

app.use(function(req, res, next) => {
  res.locals.message= err.message;
  res.locals.error= req.app.get('env')==='development'?err:{};
  res.status(err.statsu || 500);
  res.render("error");
});
```
## 1.2. Usuario actual en res.locals

En app.js:
a)
```
app.locals.appName = "StudyBoard";
app.locals.tagline = "Organiza tus asignaturas y tareas";
```
b)
```
<title><%= appName %> - <%= tagline %></title>
<h1><%= appName %> - <%= tagline %></h1>
```

## 2.1. Ruta POST /auth/login 
En auth.js:
```
router.post("/login", (req, res) => {
  const {username, password}= req.body;
  if(!username || !password){
    req.session.error="Credenciales obligatorias";
    return res.redirect("/login");
  }
  const user= Object.values(database.db.users.data[username]);
  if(!user && user.password !== password){
    req.session.error="Credenciales incorrectas";
    return res.redirect("/login");
  }
  
  return res.render("login", {title:"Login"});
});
```
En auth.ejs:
```
<%- include("header", {title}) %>
<h1><%= title %></h1>
<table>
<thead>
  <tr> <th>Username</th> <th>Role</th> <th>Accepted Cookies</th> </tr>
</thead>
<tbody>
  <% if(!user || user.lenght<0) {%>
    <tr> <td colspan="3"> No hay datos </td> </tr>
  <% }else{ %>
    <% users.data.forEach( u => { %>
    <tr>
      <td> <%= u.username %> </td>
      <td> <%= u.role %> </td>
      <td> <%= u.acceptedCookies %> </td>
    </tr>
</tbody>
</table>
```
## 2.2. Ruta POST /auth/logout 
En app.js:
```
app.use("/logout", function (req, res) => {
  req.session.destroy( () => { return res.redirect("/login") });
});
```
## 2.3. requireAuth y requireAdmin 
```
function requireAuth (req, res, next){
  if(!req.session.user){ return res.redirect("/auth/login") };
  return next();
}

function requireAdmin (req, res, next)
  if(req.session.user.role !== "ADMIN"){
    return res.status(403).send("Prohibido");
  }
  return next();
}
```
a) Proteger TODO /tasks: en routes/tasks.js
```
router.use(requireAuth);
```

## 3.1. Lista de asignaturas (subjects.ejs) 
subjects.ejs
```
<%- include("header", {title}) %>
<h1><%= title %></h1>
<table>
<thead>
  <tr> <th>Id</th> <th>subjectId</th> <th>title</th> <th>done</th> </tr>
</thead>
<tbody>
  <% if(!task || task.lenght<0) {%>
    <tr> <td colspan="4"> No hay datos </td> </tr>
  <% }else{ %>
    <% task.data.forEach( u => { %>
    <tr>
      <td> <%= u.id %> </td>
      <td> <%= u.subjectId %> </td>
      <td> <%= u.title %> </td>
      <td> <%= u.done %> </td>
    </tr>
</tbody>
</table>
```
















































