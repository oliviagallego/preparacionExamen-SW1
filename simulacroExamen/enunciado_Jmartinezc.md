
# EXAMEN PRUEBA — Sistemas Web I — PARTE PRÁCTICA (2 horas, papel)

## Contexto general

Se desea crear una aplicación web mínima con **Node.js + Express + EJS** para gestionar usuarios con roles. La aplicación tendrá un **panel de administración** accesible solo por usuarios con rol **admin**.

La base de datos será **en memoria** (un array u objeto en `app.js` o `database.js`). No es necesario persistir datos en fichero.

---

## Requisitos

La aplicación debe cumplir los siguientes puntos:

1. **Puerto del servidor**
   La aplicación debe iniciar en el puerto indicado por la variable de entorno `PORT` o, si no existe, en el puerto **3000**.

2. **Panel de administración**
   Debe existir un panel accesible únicamente por usuarios con rol **admin** que permita:

   * Visualizar un listado de usuarios.
   * Ver para cada usuario: `username`, `role`, `last_login` (si no existe, mostrar “Never”).
   * Eliminar usuarios (excepto el propio admin).

3. **Login/Logout y control de acceso**

   * Debe existir una pantalla de login.
   * Al hacer login correctamente, debe actualizarse `last_login` con la fecha actual.
   * El usuario logueado debe considerarse el `currentUser` para controlar permisos.
   * Debe existir logout.

> Nota: No es obligatorio usar express-session (puede usarse una variable `currentUser` global), pero el control de acceso debe funcionar.

---

## Estructura del proyecto (se proporciona / se debe respetar)

El proyecto tendrá la siguiente estructura:

```
prueba/
├── public/           # Archivos estáticos (CSS, JS, etc.)
├── views/            # Plantillas EJS
├── app.js            # Archivo principal
├── package.json      # Configuración del proyecto
```

Dependencias mínimas:

* `express`
* `ejs`
* `body-parser` (o `express.urlencoded` si se indica que se permite)

---

# Tareas a completar

## Apartado 1 — Configuración del servidor (1 punto)

En `app.js`, complete:

1. Crear la app de Express.
2. Configurar el **puerto** con `process.env.PORT` o `3000`.
3. Arrancar el servidor con `app.listen(...)` y mostrar un mensaje por consola con el puerto.
4. Configurar EJS como motor de plantillas y la carpeta `views`.
5. Configurar `public` para servir ficheros estáticos.
6. Configurar el parseo de formularios (body-parser o equivalente).

---

## Apartado 2 — Login y logout (1,5 puntos)

Complete:

1. `GET /login`
   Renderiza la vista `login.ejs`.

2. `POST /login`

   * Recibe `username` y `password` del formulario.
   * Busca el usuario en la “base de datos” en memoria.
   * Si las credenciales son correctas:

     * Actualiza `last_login` con la fecha actual (por ejemplo ISO string).
     * Establece el usuario como `currentUser`.
     * Redirige a `/`.
   * Si no son correctas:

     * Muestra un mensaje de error o re-renderiza login con error.

3. `POST /logout`

   * “Desloguea” al usuario (`currentUser = null`).
   * Redirige a `/`.

---

## Apartado 3 — Panel de administración (2 puntos)

Complete:

1. `GET /admin`

   * Solo debe permitir acceso si existe `currentUser` y su `role` es `"admin"`.
   * Si no es admin, redirige a `/`.
   * Si es admin, renderiza `admin.ejs` pasando la lista `users`.

2. `views/admin.ejs`

   * Muestra una tabla con columnas: `Username`, `Role`, `Last Login`, `Actions`.
   * Si `last_login` es `null`/no existe, mostrar `Never`.
   * En `Actions`, para usuarios que **no** sean admin, incluir un formulario para eliminar.

---

## Apartado 4 — Eliminar usuarios (1,5 puntos)

Complete:

1. `POST /admin/deleteUser`

   * Recibe `username` desde un formulario.
   * Solo puede ejecutarse si `currentUser.role === "admin"`.
   * Elimina el usuario de la lista en memoria.
   * Redirige de vuelta a `/admin`.

2. Restricción:

   * No debe permitir eliminar a un usuario con rol `"admin"`.

---

## Apartado 5 — Menú común (opcional / mejora)

Cree un fichero `views/header.ejs` e inclúyalo en las vistas:

* Si hay `currentUser`:

  * Mostrar enlace al panel solo si es admin.
  * Mostrar botón de logout.
* Si no hay usuario:

  * Mostrar enlace a login.

---

## Pruebas mínimas esperadas

* Arrancar en `PORT` o 3000.
* Login como admin permite entrar a `/admin`.
* Login como usuario normal no permite entrar a `/admin`.
* `last_login` se actualiza al iniciar sesión.
* Un admin puede eliminar usuarios no admin.

---
## CORRECCIÓN:

### Apartado 1 — Configuración del servidor
```
const express = require("express");
const path= require("path");
const app = express();

// Configuracion del puerto
const PORT= process.env.PORT || 3000;

// Configuracion vistas y motor:
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//Middleware estáticos y formularios
app.use(express.json());
app.use(express.urlencoded({extended:false})); //pareo de formularios
app.use(express.static(path.join(__dirname, "public")));

// Arrancamos resvidor
app.listen(PORT, () =>{
   console.log(`Servidor escuchhando en el puerto: ${PORT}`);
})
```
---
## Apartado 2 — Login y logout (1,5 puntos)
```
//Renderizar la vidta login.ejs, lo hariamos en el documento app.js
app.get("/login", (req, res) =>{
   return res.render("login", {title: "Login"});
})


// Hacer el login posible
const database= require("./database");

// si la base de datos esta en formato ARRAY:
app.post("/login", (req, res)=>{
   const {username, password}= req.body; //el post envia siempre la informacion en el body mientras que el                                            get en la url.
   //buscamos al usuario con ese nombre y contraseña
   const user= database.users.find(u=> u.username === username && u.password === password);
   
   //si encontramos al usuario entra y actualizamos la fecha de ultima conextion
   if(user){
      const lastLogin= new Date().toISOString();
      req.session.user ={username : user.username, role : user.role};
      return res.redirect("/");
   }

   //si las credenciales son incorrectas
   resturn res.status(401).render.("login", {title: "Login", error: "Credenciales incorrectas"});
})


// si la base de datos esta en formato object:
app.post("/login", (req, res)=>{
   const {username, password}= req.body; //el post envia siempre la informacion en el body mientras que el                                            get en la url.
   const user= database.users[username];
   if(user && password === user.password){
      const lastLogin= new Date().toISOString();
      req.session.user={username: user.username, role: user.role};
      return res.redirect("/");
   }

   return res.status(401).render.("login", {title: "Login", error: "Credenciales incorrectas"});
})


//Hacer el logout
app.post("/logout", (req, res) =>{
   req.session.user =null;
   return res.redirect("/");
})

```
---
## Apartado 3 — Panel de administración 

Si en la base de datos users es un array:
```
app.get("/admin", (req, res) => {
   const currentUser= req.sesson.user;

   // 1) Comprobar si hay usuario logueado y si es admin
  if (!currentUser || currentUser.role !== "admin") {
    return res.redirect("/");
  }

   // 2) Sacar la lista de usuarios de la "BD"
   const raw = database.users;

   // 3) Renderizar admin.ejs pasando la lista de usuarios
  return res.render("admin", {
    title: "Admin panel",
    users
  });

});
```

Si en la base de datos users es un objeto:
```
app.get("/admin", (req, res) => {
   // 1) saco el usuario de la sesión
   const currentUser= req.sesson.user;

   // 2) si no hay user o no es admin, fuera
  if (!currentUser || currentUser.role !== "admin") {
    return res.redirect("/");
  }

   // 3) saco los usuarios de la BD
  const raw = database.users;

  // Si es objeto, lo convertimos a array
  const users = Array.isArray(raw) ? raw : Object.values(raw);

   // 3) Renderizar admin.ejs pasando la lista de usuarios, osea pinto la vista
  return res.render("admin", {
    title: "Admin panel",
    users
  });

});
```
* /login es la puerta de entrada: ahí sí miras username y password, comparas con la BD y, si todo está bien, guardas el usuario en algún sitio (por ejemplo req.session.user).

* /admin NO es otra puerta de login. Es una habitación privada a la que solo entra gente que ya pasó por la puerta y tiene la “pulserita de admin”.

- Por eso, en /admin NO se vuelve a mirar username y password

views/admin.ejs, si en la base de datos users es un array:
```
<table>
   <thead>
      <tr>
         <th> Username </th>
         <th> Role </th>
         <th> Last Login </th>
         <th> Action </th>
      </tr>
   <thead>
   <tbody>
      <% users.forEach(user => { %>
         <tr>
            <td> <%= user.username %> </td>
            <td> <%= user.role %> </td>
            <td> <%= user.lastLogin ? user.lastLogin : 'Never' %> </td>

            <td>  <% if (user.role !== "admin") { %>
              <form action="/admin/deleteUser" method="POST" style="display:inline;">
                <input type="hidden" name="username" value="<%= user.username %>">
                <button type="submit">Delete</button>
              </form>
            <% } else { %>
              -
            <% } %>
          </td>

      <% }) %>
</table>
```

views/admin.ejs, si en la base de datos users es un objeto:
```
<table>
   <thead>
      <tr>
         <th> Username </th>
         <th> Role </th>
         <th> Last Login </th>
         <th> Action </th>
      </tr>
   <thead>
   <tbody>
      <% Object.value(users).forEach(user => { %>
         <tr>
            <td> <% user.username %> </td>
            <td> <% user.role %> </td>
            <td> <% user.latLogin ? user.lastLogin : 'Never' %> </td>
            <td>  <% if (user.role !== "admin") { %>
              <form action="/admin/deleteUser" method="POST" style="display:inline;">
                <input type="hidden" name="username" value="<%= user.username %>">
                <button type="submit">Delete</button>
              </form>
            <% } else { %>
              -
            <% } %>
          </td>
      <% }) %>
</table>
```
---
## Apartado 4 — Eliminar usuarios

Si en la base de datos users es un array:
```
app.post("/admin/deleteUser", (req, res) =>{
   const {username} = req.body;

   const current= req.session.user;

   // 1) Comprobar que hay usuario logueado y que es admin
     if (!current || current.role !== "admin") {
       // no tiene permiso
       return res.redirect("/");
     }

   // En un array para borrar un elemento necesitamos su posicion
   //2) Buscamos en el array al usuario:
   const index= database.users.findIndex(u => u.username === username);

   if(index=== -1){
    // usuario no existe -> volvemos al panel
    return res.redirect("/admin");
   }

   const user= database.users[index];

   //3) No permitir borrar admins
   if(user.role === "admin"){
      return res.redirect("admin");
   }
  
   return res.redirect("/");

})

```

Si la base de datos users es un objeto:
```
app.post("/admin/deleteUser", (req, res) =>{
   const {username} = req.body;
   const current= req.session.user;

  // 1) Comprobar que hay usuario logueado y que es admin
   if(!current.role !== "admin" || !current){
      return res.redirect("/");
   }

   // 2) Buscamos el usuario en el objeto
   const user = database.users[username];

   if(!user){
      //usuario no existe
      return res.redirect("/admin");
   }

   3) No permitir borrar admins
   if (user.role === "admin"){
      return res.redirect("/admin");
   }

   //4) Borramos el objeto
   delete database.users[username];

   //5) Volver al panel 
   return res.redirect("/");

})
```
---
## Apartado 5 — Menú común
Primero hacemos un middleware de global en app.js:
```
// Middleware global: poner el usuario actual en res.locals
app.use((req, res, next) => {
  res.locals.currentUser = req.session ? req.session.user : null;
  next();
});

```
views/header.ejs:
```
<nav>
  <a href="/">Home</a>

  <% if (currentUser) { %>
    <span>Hola, <%= currentUser.username %></span>

    <% if (currentUser.role === "admin") { %>
      <a href="/admin">Panel admin</a>
    <% } %>

    <form action="/logout" method="POST" style="display:inline;">
      <button type="submit">Logout</button>
    </form>
  <% } else { %>
    <a href="/login">Login</a>
  <% } %>
</nav>
<hr>
```





















