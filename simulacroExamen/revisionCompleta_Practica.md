
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
```
app.locals.appTitle = "Nombre definitivo";
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

2.
```
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

Dispones de una aplicación **Node.js + Express + EJS** con una “base de datos” en memoria. La estructura del proyecto es:

```
miapp/
├─ app.js
├─ database.js
├─ package.json
├─ public/
└─ views/
    ├─ layout.ejs
    ├─ items.ejs
    └─ item.ejs
```

En `app.js` ya están configurados: el motor EJS, la carpeta `views`, `public` como estáticos y `express.urlencoded(...)`.

**Contexto: `database.js`**

En este examen, el profesor puede darte la base de datos en **dos formatos distintos**. Debes detectar el formato y actuar correctamente.

**Formato A (OBJETO / diccionario):**

```js
const items = {
  "p1": { id: "p1", name: "Jamón", price: 15.5, stock: 3 },
  "p2": { id: "p2", name: "Queso", price: 8.0, stock: 10 },
  "p3": { id: "p3", name: "Aceite", price: 6.2, stock: 0 }
};
module.exports = { items };
```

**Formato B (ARRAY):**

```js
const items = [
  { id: "p1", name: "Jamón", price: 15.5, stock: 3 },
  { id: "p2", name: "Queso", price: 8.0, stock: 10 },
  { id: "p3", name: "Aceite", price: 6.2, stock: 0 }
];
module.exports = { items };
```

> En el examen se indicará cuál de los dos formatos es el que está usando la aplicación (A o B), pero **las tareas son las mismas**.

**Apartado 1 — Listado (0,75 pt)**

Cree en `app.js` la ruta:

**GET `/items`** que haga lo siguiente:

1. Obtenga `items` desde `database.js`.
2. **Renderice** la vista `items.ejs` pasando una variable `items` que sea un **array**.
3. Si los datos vienen en **formato A (objeto/diccionario)**:
   * conviértalos a array (por ejemplo usando `Object.values(...)`).
4. Si los datos vienen en **formato B (array)**:
   * mantenga el array y use métodos de array cuando haga falta (`map`, `filter`, etc.).
5. Pase también a la vista `title: "Listado"`.

**No hace falta escribir `items.ejs`**, solo la ruta.

**Apartado 2 — Búsqueda con query `?q=` (0,75 pt)**

Modifique la ruta **GET `/items`** para que soporte un filtro opcional:

* Si llega una query `?q=texto`, el listado debe incluir **solo** los items cuyo `name` contenga ese texto.
* La búsqueda debe ser **case-insensitive** (ignorar mayúsculas/minúsculas).
* Si `q` está vacío o no existe, se muestran todos.

Ejemplo:

* `/items?q=que` debería devolver “Queso”
* `/items?q=JA` debería devolver “Jamón”

> No hace falta paginación. Basta con filtrar en memoria.

---

### Corrección: Problema 7 — Recorrer objeto vs recorrer array (pregunta-trampa)
**Apartado 1 — Listado**
```
const express= require ("express");
const app= express();
const database= require("./database")

app.get("/items", (req, res) => {
   try {
    const raw = database.items;
    const arr = Array.isArray(raw) ? raw : Object.values(raw);

    return res.render("items", {
      title: "Listado",
      items: itemsArray
    });

  } catch (err) {
    res.status(500).json({ ok: false, error: "Error interno" });
  }

}); 
```

**Apartado 2 — Búsqueda**
```
app.get("/items", (req, res) => {
  try {
    const raw = database.items;
    let itemsArray = Array.isArray(raw) ? raw : Object.values(raw);

    const q = (req.query.q || "").trim().toLowerCase();

    if (q) {
      itemsArray = itemsArray.filter(item =>
        item.name.toLowerCase().includes(q)
      );
    }

    return res.render("items", {
      title: "Listado",
      items: itemsArray,
      q // opcional, por si quieres mostrar la búsqueda en la vista
    });
  } catch (err) {
    return res.status(500).send("Error interno");
  }
});

```

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

### Corrección:  Problema 8 — CRUD sencillo (crear/editar/borrar)

**Apartado 1 — Listado**
```
app.get("/products", (req, res) => {
   res.render("products", {title: "Productos", products: database.products});
});
```
Le pasas products: database.products para que en EJS puedas hacer un forEach y pintarlos.

**Apartado 2 — Crear**
```
app.get("/products/new", (req, res) =>{
      res.render("products-form", {
         title: "Nuevos productos",
         errors:[],
         valores:{name:"", price: "", stock: ""
      }});
});
```
Esto solo muestra el formulario vacío.
Pasas errors: [] (sin errores al principio) y values vacíos para rellenar inputs si lo necesitas.

```
app.post("/products", (req, res) => {
  const { name, price, stock } = req.body;

  const errors = [];
  const values = { name, price, stock };

  // Validaciones
  if (!name || !name.trim()) errors.push("El nombre es obligatorio.");

  const priceNum = Number(price);
  if (!Number.isFinite(priceNum) || priceNum <= 0) {
    errors.push("El precio debe ser un número mayor que 0.");
  }

  const stockNum = Number(stock);
  if (!Number.isInteger(stockNum) || stockNum < 0) {
    errors.push("El stock debe ser un entero mayor o igual que 0.");
  }

  if (errors.length > 0) {
    return res.status(400).render("product-form", {
      title: "Nuevo producto",
      errors,
      values
    });
  }

  // Crear producto (id incremental)
  const nextId =
    database.products.length > 0
      ? Math.max(...database.products.map(p => p.id)) + 1
      : 1;

  database.products.push({
    id: nextId,
    name: name.trim(),
    price: priceNum,
    stock: stockNum
  });

  return res.redirect("/products");
});

   
```
**Apartado 3 — Editar**
```
app.get("/products/:id/edit", (req, res) => {
  const id = Number(req.params.id);
  const product = database.products.find(p => p.id === id);

  if (!product) return res.sendStatus(404);

  return res.render("product-form", {
    title: "Editar producto",
    errors: [],
    values: {
      name: product.name,
      price: String(product.price),
      stock: String(product.stock)
    },
    productId: product.id // opcional para el action del form
  });
});
```
```
app.post("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = database.products.find(p => p.id === id);
  if (!product) return res.sendStatus(404);

  const { name, price, stock } = req.body;
  const errors = [];
  const values = { name, price, stock };

  if (!name || !name.trim()) errors.push("El nombre es obligatorio.");

  const priceNum = Number(price);
  if (!Number.isFinite(priceNum) || priceNum <= 0) {
    errors.push("El precio debe ser un número mayor que 0.");
  }

  const stockNum = Number(stock);
  if (!Number.isInteger(stockNum) || stockNum < 0) {
    errors.push("El stock debe ser un entero mayor o igual que 0.");
  }

  if (errors.length > 0) {
    return res.status(400).render("product-form", {
      title: "Editar producto",
      errors,
      values,
      productId: id
    });
  }

  product.name = name.trim();
  product.price = priceNum;
  product.stock = stockNum;

  return res.redirect("/products");
});
```
```
app.post("/products/:id/delete", checkAuth, checkAdmin, (req, res) => {
  const id = Number(req.params.id);

  const idx = database.products.findIndex(p => p.id === id);
  if (idx === -1) return res.sendStatus(404);

  database.products.splice(idx, 1);
  return res.redirect("/products");
});

```
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
### Corrección: Problema 9 — Cliente JS (DOM + eventos)

**Apartado 1 — Eventos**
En el HTML:
```
<input id="txt" type="text">
<button id="btn"> Cargar </button>
<sript rc="/app.js" defer> </script>
```
En app.js:
```
const btn = document.getElementById("btn");
const list = document.getElementById("list");
const txt = document.getElementById("txt");

// Listener 1
btn.addEventListener("click", () => {
  console.log("Click 1");
});

// Listener 2
btn.addEventListener("click", () => {
  console.log("Click 2");
});

// Añadir elemento a la lista
btn.addEventListener("click", () => {
  const li = document.createElement("li");
  li.textContent = txt.value || "Elemento vacío";
  list.appendChild(li);
});
```
**Apartado 2 — Validación en cliente**
En HTML:
```
<p id="msg"></p>
```
En app.js:
```
const msg = document.getElementById("msg");

btn.addEventListener("click", (e) => {
  // si está vacío, no añadimos y marcamos error
  if (!txt.value.trim()) {
    txt.classList.add("error");
    msg.textContent = "El campo no puede estar vacío";
    return;
  }

  // si está bien, quitamos error y mensaje
  txt.classList.remove("error");
  msg.textContent = "";
});
```
CSS:
```
.error {
  border: 2px solid red;
}
```
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
### Corrección: Problema 10 — Fetch + async/await 
**Apartado 1 — Endpoint**
```
const database = require("./database");

app.get("/api/products", (req, res) => {
  try {
    const raw = database.products;
    const data = Array.isArray(raw) ? raw : Object.values(raw);

    return res.json({ ok: true, data });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "Error interno" });
  }
});
```

**Apartado 2 — Cliente**
En HTML:
```
<ul id="products"></ul>
<p id="error"></p>
<script src="/app.js" defer></script>
```
En app.js:
```
const ul = document.getElementById("products");
const pError = document.getElementById("error");

async function loadProducts() {
  try {
    pError.textContent = "";
    ul.innerHTML = "";

    const res = await fetch("/api/products");

    if (!res.ok) {
      throw new Error("HTTP " + res.status);
    }

    const json = await res.json();

    if (!json.ok) {
      throw new Error(json.error || "Respuesta inválida");
    }

    json.data.forEach((p) => {
      const li = document.createElement("li");
      li.textContent = `${p.name} - ${p.price}€ (stock: ${p.stock})`;
      ul.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    pError.textContent = "Error cargando productos";
  }
}

loadProducts();
```

---
## Problema 11 — Express: middleware “global” de usuario

Complete:

**Apartado 1 — res.locals**

1. Cree un middleware que haga: que todas las vistas tengan disponible el usuario actual, si está logueado:
   * `res.locals.currentUser = req.session.user || null;`
2. Debe ejecutarse antes de las rutas.

**Apartado 2 — Uso en vistas**

1. En el navbar, muestre links distintos si `currentUser` existe.

---
### Correción: Problema 11 — Express: middleware “global” de usuario

**Apartado 1 — res.locals**
```
app.use((req, res, next) => {
  res.locals.currentUser = (req.session && req.session.user) ? req.session.user : null;
  next();
});
```

**Apartado 2 — Uso en vistas**
```
<nav>
  <a href="/">Inicio</a>

  <% if (currentUser) { %>
    <span>Hola, <%= currentUser.username %></span>
    <form action="/logout" method="POST" style="display:inline;">
      <button type="submit">Logout</button>
    </form>

    <% if (currentUser.role === "admin") { %>
      <a href="/admin">Admin</a>
    <% } %>
  <% } else { %>
    <a href="/login">Login</a>
  <% } %>
</nav>
```
---

## Problema 12 — Variables de entorno + scripts npm

Complete:

**Apartado 1 — Variables de entorno**

1. Use `process.env.PORT`, `process.env.NODE_ENV` y un fallback.

**Apartado 2 — package.json**

1. Añada un script `"start"` y otro `"dev"` (por ejemplo con nodemon si se menciona).
2. Explique brevemente qué aporta `package-lock.json` en un equipo.

---
### Correción: Problema 12 — Variables de entorno + scripts npm
**Apartado 1 — Variables de entorno**
```
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
```
**Apartado 2 — package.json**
```
{
  "scripts": {
    "start": "node ./bin/www",
    "dev": "nodemon ./bin/www"
  }
}
```
Explicación breve package-lock.json:
Guarda el árbol exacto de dependencias y versiones instaladas, para que todo el equipo instale lo mismo y evitar “en mi PC funciona”.

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
### Correción: Problema 13 — Node core (fs/path) + JSON fichero

**Apartado 1 — Guardar**
```
const fs = require("fs");
const path = require("path");

function saveToFile(obj) {
  const filePath = path.join(__dirname, "data.json");
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), "utf8");
}
```

**Apartado 2 — Leer**

```
function readFromFile() {
  const filePath = path.join(__dirname, "data.json");

  try {
    const content = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(content);

    console.log(data.name); // ejemplo: propiedad concreta
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log("El fichero no existe");
    } else {
      console.log("Error leyendo/parsing JSON");
    }
  }
}
```
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
### Correción: Problema 14 — Socket.io (rooms + emit) estilo kahoot

**Apartado 1 — Conexión**
```
io.on("connection", (socket) => {
  socket.join("sala-x");
});
```

**Apartado 2 — Evento**
```
io.on("connection", (socket) => {
  socket.join("sala-x");

  socket.on("respuesta", (data) => {
    io.to("sala-x").emit("nueva-respuesta", {
      usuario: data.usuario,
      opcion: data.opcion,
      timestamp: new Date().toISOString()
    });
  });
});
```

**Variaciones**
```
socket.to("sala-x").emit("nueva-respuesta", {...});
```
```
io.on("connection", (socket) => {
  socket.join("sala-x");

  io.to("sala-x").emit("count", io.sockets.adapter.rooms.get("sala-x")?.size || 0);

  socket.on("disconnect", () => {
    io.to("sala-x").emit("count", io.sockets.adapter.rooms.get("sala-x")?.size || 0);
  });
});
```

---

## Problema 15 — HTML “está bien / está mal” + buenas prácticas

Complete:

**Apartado 1 — Errores en HTML**

1. Se le da un HTML con errores.
2. Identifique 3 errores y proponga corrección:

   * `img` sin `alt`, labels mal enlazados, method incorrecto, estructura head/body, etc.

**Apartado 2 — Accesibilidad**

1. Mencione 2 buenas prácticas aplicadas al fragmento (labels, alt, headings, semántica).

---
### Correción: Problema 15 — HTML “está bien / está mal” + buenas prácticas

**Apartado 1 — Errores en HTML**
Ejemplos válidos (coges 3):
1. <img> sin alt
   Mal: <img src="logo.png">
   Bien: <img src="logo.png" alt="Logo de la web">
2. label mal enlazado
   Mal: <label for="user">Usuario</label> pero el input no tiene id="user"
   Bien: <input id="user" ...> + <label for="user">Usuario</label>
3. Contraseñas con GET
   Mal: <form method="GET"> con password
   Bien: <form method="POST">

(Otros: cosas en <head> que deberían ir en <body>, falta <meta charset>, uso excesivo de <div> cuando hay <header>, <main>, etc.)

**Apartado 2 — Accesibilidad**
- Usar label asociado con for/id en inputs.
- alt descriptivo en imágenes.
- Estructura semántica (<header> <main> <nav> <footer>).
- Jerarquía correcta de headings (h1 único y ordenado).

