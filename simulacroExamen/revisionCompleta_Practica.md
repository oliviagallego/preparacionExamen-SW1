
## Problema 0 — Configuración base (calentamiento)

Complete los apartados que aparecen a continuación:

**Apartado 1 — Arranque y configuración**

1. Configure el **puerto** usando variable de entorno `PORT` o `3000`.
2. Arranque el servidor mostrando un `console.log` con el puerto.
3. Configure el motor de plantillas (**EJS**) y la carpeta **views**.
4. Configure la carpeta **public** para servir ficheros estáticos.

**Apartado 2 — Rutas mínimas**

1. Defina `GET /` que renderice `index.ejs` pasando `title`.
2. Defina `GET /login` que renderice `login.ejs` pasando `title`.
3. Defina un manejador de **404** para rutas inexistentes.

---
### Corrección: Problema 0 — Configuración base
**Apartado 1 — Arranque y configuración**
```
const express= require("express");
const path = require("path");
```
1. ```
   const PORT = process.env.PORT||3000;
   ```
2. ```
   server.listen(PORT, () => {
     console.log(`Servidor escuchando puerto: ${PORT}.`);
   });
   ```
3.  ```
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
    ```
4. ```
   app.use(express.static(path.join(__dirname, 'public')));
   app.use(express.urlencoded({extended: false}));
   ```

**Apartado 2 — Rutas mínimas**
```
const app= express(); //es lo qu enos faltaria arriba para este apartado
```

1. ```
   app.get('/', (req, res) =>{
     res.render('index', {title: "Index"});
   });
   ```
2. ```
   app.get('/login', (req, res) =>{
     res.render('login', {title: "Login"});
   });
   ```
3. ```
   app.use((req, res) =>{
      res.status(404).render("404", {title: "No encontrado"});
   });
   ```
---

## Problema 1 — Evitar hardcode (muy típico)

De momento no tenemos claro el nombre definitivo de la aplicación y ahora mismo lo tenemos hardcodeado en cada ruta. Modifique la aplicación para definir en un único sitio el nombre de la tienda, que sea accesible en las vistas y elimine el nombre que aparece ahora en las rutas. 

**Apartado 1 — Nombre global en vistas**

1. Defina el nombre en un único sitio (por ejemplo `app.locals`).
2. Haga que esté disponible en **todas** las vistas EJS.
3. Elimine el hardcode del nombre en las rutas.

**Variación habitual del mismo apartado**

* En lugar de `app.locals`, use un middleware que rellene `res.locals` en cada request.

---
### Corrección:  Problema 1 — Evitar hardcode 

**Apartado 1 — Nombre global en vistas**
1.
``` app.locals.appTitle = "Nombre definitivo";
```
2. En donde aparezca el titulo en el html debemos cambiarlo por:
```<titule> <%= appTitle %> </title> ```
3.
```
app.get("/", (req, res) => {
  res.render("index", { title: "Inicio" });
});

app.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});
```

**Variación habitual del mismo apartado,  usando un middleware**
```
app.use((req, res, next) => {
  res.locals.appTitle = "Nombre definitivo";
  next();
 });
```
---

## Problema 2 — Cookies + sesión + perfil (bomba del simulacro)

Tenemos que informar al usuario de que usamos cookies y que las acepte. Complete las siguientes tareas: 

**Apartado 1 — Banner visual fijo**

1. Cree una sección que aparezca abajo en todas las páginas:

   * Mensaje informando del uso de cookies.
   * Botón Aceptar y botón Rechazar.
   * Ocupa todo el ancho, centrado, por encima del contenido y siempre visible.
   * CSS puro (sin frameworks). 

**Apartado 2 — Rechazar**

1. Si el usuario rechaza, rediríjale a una página externa (p.ej. `google.es`). 

**Apartado 3 — Aceptar**

1. Si acepta:
   * Cierre el banner.
   * Guarde un flag en **sesión** para no volver a mostrarlo.
   * Si el usuario está logueado, guarde en su “perfil” (datos) que aceptó cookies. 

**Apartado 4 — Integración con login**

1. Al hacer login:

   * Si ya aceptó en esta sesión **o** en el perfil, no mostrar el banner.
   * Si no, debe aparecer.
     
---
### Corrección:  Problema 2 — Cookies + sesión + perfil 
**Apartado 1 — Banner visual fijo**
```
<body>
  <%- body %> 
    <%if (!coockiesAccepted) { %>
      <div class = "cookie-banner">
        <p>Usamos cookies para mejorar tu experiencia. </p>
        
        <form action= "/cookies/accept" method = "POST" class="cookie-actions">
          <button type= "submit"> Aceptar </button>button>
        </form>

        <form action= "/cookies/reject" method= "POST" class= "cookie-actions">
          <button type= "submit"> Rechazar </button>
        </form>
      </div
    <% } %>
</body>
```
**Apartado 2 — Rechazar**
```
app.post('/cookies/reject', (req, res) {
  return res.redirect("http://www.google.es");
}
```
**Apartado 3 — Aceptar**
1. Si acepta:
   * Cierre el banner.
   * Guarde un flag en **sesión** para no volver a mostrarlo.
   * Si el usuario está logueado, guarde en su “perfil” (datos) que aceptó cookies.
```
const database = require("./database")
     
app.post('/cookie/accepted', (req, res){
  req.session.cookiesAccepteded = true;

  //si estamos logeados en el perfil guardar perfil:
  if(req.session.user) {
    const username= req.session.user.username;
    const user = database.users[username];
    if(user) user.cookiesAccepted= true;
  }
return res.redirect("back");
})
```
**Apartado 4 — Integración con login**

   * Si ya aceptó en esta sesión **o** en el perfil, no mostrar el banner.
   * Si no, debe aparecer.

```
app.use((req, res, next) => {
  let accepted = false;

  // 1) Si la sesión ya lo tiene
  if (req.session.cookiesAccepted) accepted = true;

  // 2) Si el usuario está logueado y en su perfil consta
  if (!accepted && req.session.user) {
    const username = req.session.user.username;
    const user = database.users[username];
    if (user && user.cookiesAccepted) accepted = true;
  }

  res.locals.cookiesAccepted = accepted;
  next();
});


app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = database.users[username];
  if (user && user.password === password) {
    user.lastLogin = new Date().toISOString();

    req.session.user = { username: user.username, role: user.role };

    // integración cookies: si el perfil ya aceptó, sesión también
    if (user.cookiesAccepted) {
      req.session.cookiesAccepted = true;
    }

    return res.redirect("/");
  }

  return res.render("login", { title: "Login", error: "Credenciales incorrectas" });
});

```

---

## Problema 3 — Login, logout y sesiones (base del “ejemplo login”)

Complete los apartados que aparecen a continuación:

**Apartado 1 — Login**

1. Cree `POST /login` que reciba `username` y `password`.
2. Valide contra `database.users` (a veces viene como **objeto** y otras como **array**).
3. Si correcto:

   * Actualice `lastLogin`.
   * Guarde en sesión `req.session.user` (sin password).
   * Redirija a `/`.
4. Si incorrecto: renderice `login.ejs` con `error: "Credenciales incorrectas"`.

**Apartado 2 — Logout**

1. Cree `POST /logout` que destruya la sesión y redirija a `/`.

**Variación habitual**

* “Si el usuario ya está logueado y entra a `/login`, rediríjale a `/`”.
---

### Corrección: Problema 3 — Login, logout y sesiones 
1. ```const database= require("./database");```
   
En el caso que user sea un arrary ponemos:
```
app.post("/login", (req, res) => {
   const {username, password}= req.body;

   
   const user= user.find(u=> u.username===username && u.password===password);
   
   if(user){
     user.lastLogin = new Date().toISOString();
     req.session.user = {
      username: user.username,
      role: user.role
     };
     res.redirect("/");
   }
   return res.status(401).render.("login", {title: "Login", error: "Credenciales incorrectas"});
});
```
En el caso que user sea un objeto ponemos:
```
app.post("/login", (req, res) => {
   const {username, password}= req.body;
   
   const user= database.users[username];
   if(user && password=== user.password){
      user.lastLogin = new Data().toSOString();
      
      req.session.user={
         username: user.username,
         role: user.role
      };
      res.redirect("/");
   }
   return res.status(401).render.("login", {title: "Login", error: "Credenciales incorrectas"});
});

```

2.```
app.post("/logout", (req, res) =>{
   req.session.destroy((err) =>{
   if(err) return res.sendStatus(500);
   res.redirect("/");
   });
})
```

**Variación habitual**
``` app.get("/login", (req, res) =>{
   if (req.session.user) return res.redirect("/");
  res.render("login", { title: "Login" });
})
```
---

## Problema 4 — Middlewares (checkAuth / checkAdmin) + ruta protegida

Complete los apartados que aparecen a continuación:

**Apartado 1 — checkAuth**

1. Cree middleware `checkAuth`:

   * Si existe `req.session.user`, `next()`.
   * Si no, redirect `/login`.

**Apartado 2 — checkAdmin**

1. Cree middleware `checkAdmin`:

   * Si `req.session.user.role === "admin"`, `next()`.
   * Si no, devuelva `403` o redirect `/`.

**Apartado 3 — /admin**

1. Cree `GET /admin` usando ambos middlewares.
2. Pase a `admin.ejs` la lista de usuarios.

   * Si `database.users` es **objeto**, conviértalo a **array** (`Object.values`).

**Variaciones típicas**

* “Mostrar enlace ‘Admin’ en el menú solo si es admin” (condición en EJS con `currentUser`).
* “En vez de 403, renderizar una vista `forbidden.ejs`”.
---

### Corrección: Problema 4- Middlewares (checkAuth / checkAdmin) + ruta protegida

**Apartado 1 — checkAuth**
funcion checkAuth(req, res, next){
   if(req.session.user){
      next();
   }
   return res.redirect("/login");
}

**Apartado 2 — checkAdmin**
funcion checkAdmin (req, res, next){
   if(req.session.user.role === "admin"){
      next();
   }
   return res.status(403);
}

**Apartado 3 — /admin**
const database = require("./database");

app.get("/admin", checkAuth, checkAdmin, (req, res) => {
  const usersArray = Object.values(database.users);
  res.render("admin", { title: "Admin", users: usersArray });
});


**Variaciones típicas**
Aplicar middleware a varias rutas: 
``` app.use("/admin", checkAuth, checkAdmin); ```


Hacer que currentUser esté en todas las vistas:
```
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});
```

Si no es admin, renderizar una vista “forbidden”:
```
return res.status(403).render("forbidden", { title: "No autorizado" });
```
---

## Problema 5 — EJS (tablas/listas + condicionales)

En una vista `admin.ejs` recibimos `users`. Complete:

**Apartado 1 — Tabla**

1. Genere una tabla con columnas:

   * Usuario, Rol, Último acceso
2. Si `lastLogin` es `null`, muestre “Nunca”.

**Apartado 2 — Condicional de sesión**

1. Si hay `currentUser`, muestre “Hola, X”.
2. Si no, muestre “Inicia sesión”.

**Variación**

* “Recorra un **objeto** en EJS” (clave/valor) en vez de un array.
---

### Corrección: Problema 5 — EJS (tablas/listas + condicionales)
**Apartado 1 — Tabla**
<table>
<thead>
   <tr>
      <th>Usuario</th>
      <th>Rol</th>
      <th>Último acceso</th>
   </tr>
</thead>
<tbody>
   <tr>
      <% users.forEach(user => { %>
         <td> <=% user.username %> </td>
         <td> <=% user.role %> </td>
         <td> <=% user.lastLogin ? user.lastLogin : 'Nunca' %> </td>
   </tr>
</tbody>

**Apartado 2 — Condicional de sesión**
<% if (currentUser) { %>
  <p>Hola, <%= currentUser.username %></p>
<% } else { %>
  <p>Inicia sesión</p>
<% } %>


**Variación**

* “Recorra un **objeto** en EJS” (clave/valor) en vez de un array.
<% Object.value(users).forEach(users => { %>
   <div> <% user.username %> </div>
   <div> <% user.role %> </div>
   <div> <% user.lastLogin ? user.lastLogin : "Nunca" %> </div>
<% }) %>

---

## Problema 6 — JSON (validar / corregir / generar)
Dispones de una aplicación **Node.js + Express + EJS** con una “base de datos” en memoria. La estructura del proyecto es:

```
miapp/
├─ app.js
├─ database.js
├─ package.json
├─ public/
└─ views/
```

En `database.js` existe una estructura con usuarios (puede ser objeto o array según se indique en cada apartado). No se permite usar librerías externas para JSON.

**Apartado 1 — JSON inválido (0,5 pt)**

El profesor te entrega el siguiente fragmento diciendo que es “un JSON”.

```js
{
  name: 'Ana',
  "active": True,
  "roles": ["admin", "user",],
  "profile": {
    "email": ana@example.com,
    "age": 20,
  }
}
```

1. Explica **al menos 3 errores** respecto al formato JSON (no JavaScript).
2. Escribe debajo la **versión corregida y válida** del JSON.

> Nota: Recuerda que JSON tiene reglas estrictas (comillas, booleanos, comas finales, strings…).

**Apartado 2 — Construcción de JSON (0,5 pt)**

A partir del siguiente texto, escribe un **JSON válido** que lo represente:

> “El usuario **maria** tiene id **7** y está activo.
> Tiene **dos roles** (en este orden): `user`, `editor`.
> Sus permisos por módulo son:
>
> * módulo `products`: `read` y `create`
> * módulo `admin`: `read`
>   Su último login es `null` (nunca ha entrado).
>   Además, el usuario tiene una lista de direcciones (en orden):
>
> 1. { ciudad: Madrid, cp: 28001 }
> 2. { ciudad: Valencia, cp: 46001 }”

Requisitos:

* Usa **arrays** cuando el orden importe (roles, direcciones, permisos de un módulo).
* Usa **objetos** para pares clave/valor (por ejemplo permisos por módulo).
* El JSON debe ser **estrictamente válido**.

**Apartado 3 — API JSON (0,5 pt)**

En `app.js`, crea una ruta:

**GET `/api/users`** que devuelva JSON.

Requisitos:

1. Obtén los usuarios desde `database.js`.
2. Devuelve:

```json
{ "ok": true, "data": [...] }
```

donde `data` es un **array** de usuarios.
3) El array debe contener usuarios **sin contraseña** (no incluir `password`).
4) Si ocurre un error (por ejemplo, la estructura no existe), devuelve:

```json
{ "ok": false, "error": "..." }
```

con un **status adecuado** (por ejemplo 500).

> Nota: Si en `database.js` los usuarios vienen como objeto, conviértelos a array antes de devolverlos.

---
### Corrección: Problema 6 — JSON (validar / corregir / generar)
**Apartado 1 — JSON inválido**
- En JSON los strings (es decir texto como en la clave name), debe ir entre comillas dobles, encontramos 3 errores de ese estilo con name, en Ana, y en el email
- El array de roles tiene una coma detras de user cuando no hay ningun valor después.
- En el ultimo valor de un objeto no hace falta poner una coma.

```js
{
  "name": "Ana",
  "active": True,
  "roles": ["admin", "user"],
  "profile": {
    "email": "ana@example.com",
    "age": 20
  }
}
```

**Apartado 2 — Construcción de JSON (0,5 pt)**

A partir del siguiente texto, escribe un **JSON válido** que lo represente:

> “El usuario **maria** tiene id **7** y está activo.
> Tiene **dos roles** (en este orden): `user`, `editor`.
> Sus permisos por módulo son:
>
> * módulo `products`: `read` y `create`
> * módulo `admin`: `read`
>   Su último login es `null` (nunca ha entrado).
>   Además, el usuario tiene una lista de direcciones (en orden):
>
> 1. { ciudad: Madrid, cp: 28001 }
> 2. { ciudad: Valencia, cp: 46001 }”

Requisitos:
```js
{
"user" :{
   "name": "maria", 
   "id": 7, 
   "activo": true, 
   "roles": ["user", "editor"], 
   "permissions": {"producto": ["read", "create"]}, "admin": ["read"]},
   "direcciones": [{ "ciudad": "Madrid", "cp": 28001 },  { "ciudad": "Valencia", "cp": 46001 }]
}
}
```

**Apartado 3 — API JSON (0,5 pt)**
```
const database = require("./database");

app.get("/api/users", (req, res) => {
  try {
    const raw = database.users;
    const arr = Array.isArray(raw) ? raw : Object.values(raw);

    const safe = arr.map(u => {
      const { password, ...rest } = u;
      return rest;
    });

    res.json({ ok: true, data: safe });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Error interno" });
  }
});

```
---

## Problema 7 — Recorrer objeto vs recorrer array (pregunta-trampa)

Se proporciona una “base de datos” en memoria. Complete:

**Apartado 1 — Listado**

1. Renderice una vista con todos los elementos.
2. Si los datos vienen como **objeto** (diccionario), conviértalo a array.
3. Si vienen como **array**, use `.find`, `.filter`, `.map`.

**Apartado 2 — Búsqueda**

1. Añada filtro con query `?q=`.
2. Debe ignorar mayúsculas/minúsculas.

---

## Problema 8 — CRUD sencillo (crear/editar/borrar)

Tenemos `products` con `{ id, name, price, stock }`. Complete:

**Apartado 1 — Listado**

1. `GET /products` renderiza `products.ejs` con todos.

**Apartado 2 — Crear**

1. `GET /products/new` renderiza formulario.
2. `POST /products` valida:

   * `name` no vacío
   * `price` > 0
   * `stock` entero >= 0
3. Si error, re-render con `errors` y valores previos.

**Apartado 3 — Editar**

1. `GET /products/:id/edit` carga el producto.
2. `POST /products/:id` actualiza.

**Apartado 4 — Borrar**

1. `POST /products/:id/delete` elimina el producto.
2. Proteja esta ruta para admin.

---

## Problema 9 — Cliente JS (DOM + eventos) sin jQuery

Complete los apartados que aparecen a continuación:

**Apartado 1 — Eventos**

1. Un botón “Cargar” añade un elemento a una lista.
2. Use `addEventListener` (no `onclick`).
3. Muestre por consola “Click 1 / Click 2” con dos listeners para el mismo click.

**Apartado 2 — Validación en cliente**

1. Si un input está vacío, añada clase CSS `error` y muestre un mensaje.

**Variación**

* “Explique qué hace `defer` y `async` y cuál usaría para scripts del cliente”.

---

## Problema 10 — Fetch + async/await (más importante que Ajax)

Complete los apartados que aparecen a continuación:

**Apartado 1 — Endpoint**

1. Cree `GET /api/products` que devuelva JSON `{ ok, data }`.

**Apartado 2 — Cliente**

1. En `public/app.js`:

   * haga `fetch('/api/products')`
   * rellene un `<ul>` con los datos
   * si falla (`!res.ok`), muestre error en un `<p>`.

**Variaciones**

* “Implemente paginación con `?page=` y `?limit=`”.
* “Implemente `POST /api/products` leyendo JSON del body”.

---

## Problema 11 — Express: middleware “global” de usuario

Complete:

**Apartado 1 — res.locals**

1. Cree un middleware que haga:

   * `res.locals.currentUser = req.session.user || null;`
2. Debe ejecutarse antes de las rutas.

**Apartado 2 — Uso en vistas**

1. En el navbar, muestre links distintos si `currentUser` existe.

---

## Problema 12 — Variables de entorno + scripts npm

Complete:

**Apartado 1 — Variables de entorno**

1. Use `process.env.PORT`, `process.env.NODE_ENV` y un fallback.

**Apartado 2 — package.json**

1. Añada un script `"start"` y otro `"dev"` (por ejemplo con nodemon si se menciona).
2. Explique brevemente qué aporta `package-lock.json` en un equipo.

---

## Problema 13 — Node core (fs/path) + JSON fichero

Complete los apartados que aparecen a continuación:

**Apartado 1 — Guardar**

1. Reciba un objeto JS y guárdelo en un fichero `.json` (con `fs`).
2. La salida debe ser JSON válido.

**Apartado 2 — Leer**

1. Lea el fichero y muestre por consola una propiedad concreta.
2. Maneje el error si el fichero no existe.

**Variación**

* “Use `path.join(__dirname, ...)` para rutas correctas”.

---

## Problema 14 — Socket.io (rooms + emit) estilo kahoot

Complete:

**Apartado 1 — Conexión**

1. Al conectar, el cliente entra en una sala (`socket.join('sala-x')`).
2. Explique diferencia entre:

   * `socket.emit(...)`
   * `io.emit(...)`
   * `io.to('sala-x').emit(...)`

**Apartado 2 — Evento**

1. Evento `"respuesta"`: reemitir `"nueva-respuesta"` a la sala.
2. Añada timestamp.

**Variaciones**

* “Enviar mensaje solo al resto de la sala (excluyendo al emisor)” (con `socket.to(room).emit(...)`).
* “Contador de usuarios conectados y broadcast al entrar/salir”.

---

## Problema 15 — HTML “está bien / está mal” + buenas prácticas

Complete:

**Apartado 1 — Errores en HTML**

1. Se le da un HTML con errores.
2. Identifique 3 errores y proponga corrección:

   * `img` sin `alt`, labels mal enlazados, method incorrecto, estructura head/body, etc.

**Apartado 2 — Accesibilidad**

1. Mencione 2 buenas prácticas aplicadas al fragmento (labels, alt, headings, semántica).

