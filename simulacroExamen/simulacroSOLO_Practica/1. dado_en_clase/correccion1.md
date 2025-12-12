
## Apartado 1 – Nombre de la tienda en un solo sitio

> “Definir en un único sitio el nombre de la tienda (ahora mismo ‘Embutidos León’), que este sea accesible en las vistas y eliminar el nombre que aparece ahora en las rutas.”

### 1.1. En `app.js`: variable global para el nombre

En lugar de tener `"Embutidos León"` escrito en todas las rutas, lo definimos una sola vez con `app.locals`:

```js
// app.js

// ... require, app = express(), etc.

// Variable global disponible en TODAS las vistas como appTitle
app.locals.appTitle = 'Embutidos León';
```

Si quieres también un subtítulo, se podría hacer:

```js
app.locals.tagline = 'Los mejores productos gastronómicos';
```

> `app.locals` → variables **globales a toda la app**, accesibles en todas las plantillas EJS sin tener que pasarlas en cada `res.render`.

---

### 1.2. Cambiar las vistas para usar `appTitle`

Supón que en `layout.ejs` tenías algo tipo:

```ejs
<title>Embutidos León - Tienda</title>

<header>
  <h1>Embutidos León</h1>
</header>
```

Lo cambiamos para que **no haya texto fijo** con el nombre, sino la variable:

```ejs
<title><%= appTitle %> - Tienda</title>

<header>
  <h1><%= appTitle %></h1>
</header>
```

En el menú del anexo se ve que el logo pone “Embutidos León” arriba a la izquierda.
Todo eso debe usar `<%= appTitle %>`.

---

### 1.3. Eliminar “Embutidos León” de las rutas

Si en alguna ruta se hacía algo tipo:

```js
res.render('tienda', {
  title: 'Tienda - Embutidos León'
});
```

lo cambiamos a algo genérico:

```js
res.render('tienda', {
  title: 'Tienda'
});
```

y el título completo visible lo montamos en la vista con `<%= appTitle %> - <%= title %>`.

Ejemplo en `layout.ejs`:

```ejs
<title><%= appTitle %> - <%= title %></title>
```

Así, si mañana cambias el nombre a “Quesos Zamora”, **solo modificas una línea en `app.js`**:

```js
app.locals.appTitle = 'Quesos Zamora';
```

---

## Apartado 2 – Banner de cookies (toda la lógica)

Resumen de lo que pide el enunciado:

1. Banner fijo en la parte inferior, con mensaje + botones “Aceptar” y “Rechazar”.
2. “Rechazar” → redirigir a google.es.
3. “Aceptar”:

   * Cerrar mensaje.
   * Guardar en la **sesión** que ha aceptado (para no mostrarlo más en esa sesión).
   * Si está logueado, guardar también en su **perfil de usuario** en “BD”.
4. Al hacer **login**:

   * Si ya aceptó en la sesión, o en el perfil de usuario, **no** mostrar el mensaje.
   * En caso contrario, mostrarlo.

Vamos por partes.

---

### 2.1. Middleware global para saber si hay que mostrar el banner

En `app.js`, después de configurar sesión:

```js
app.use(session({
  secret: 'mi-secreto',
  resave: false,
  saveUninitialized: false
}));

// Usuario actual disponible en todas las vistas
app.use((req, res, next) => {
  res.locals.currentUser = req.session ? req.session.user : null;
  next();
});

// Middleware para saber si hay que mostrar el banner de cookies
app.use((req, res, next) => {
  const sessionAccepted = req.session.cookiesAccepted === true;
  const user = req.session.user;
  const userAccepted = user && user.acceptedCookies === true;

  // showCookieBanner será true SOLO si NO ha aceptado ni en sesión ni en perfil
  res.locals.showCookieBanner = !(sessionAccepted || userAccepted);

  next();
});
```

Así, en las vistas tenemos una variable booleana `showCookieBanner`.

---

### 2.2. Ruta para aceptar cookies (`routes/cookies.js`)

Creamos un router nuevo para manejar `/cookies/accept`. Supongamos una BD in-memory tipo `db.users[username]` con campo `acceptedCookies`.

```js
// routes/cookies.js
const express = require('express');
const router  = express.Router();
const db      = require('../database');   // o '../db' según se llame

// POST /cookies/accept
router.post('/accept', (req, res) => {
  // 1. Guardar en sesión
  req.session.cookiesAccepted = true;

  // 2. Si hay usuario logueado, guardar en perfil
  if (req.session.user) {
    const username = req.session.user.username;
    db.users[username].acceptedCookies = true; // o db.users.data[username].acceptedCookies = true;

    // Opcional: actualizar también la copia en sesión
    req.session.user.acceptedCookies = true;
  }

  // 3. Cerrar mensaje → basta con recargar la página,
  // el middleware ya no mostrará el banner
  res.redirect('/');
});

module.exports = router;
```

En `app.js` lo conectamos:

```js
const cookiesRouter = require('./routes/cookies');
app.use('/cookies', cookiesRouter);
```

---

### 2.3. Botón “Aceptar” y “Rechazar” en la vista

En el `layout.ejs`, cerca del final del `<body>`, ponemos el banner condicionado:

```ejs
<% if (showCookieBanner) { %>
  <div class="cookie-banner">
    <p>Nos vemos obligados a informarte del uso de cookies necesarias para que funcione esta aplicación web.</p>

    <form action="/cookies/accept" method="POST" style="display:inline;">
      <button type="submit">Aceptar</button>
    </form>

    <!-- Rechazar: simple enlace a Google -->
    <a href="https://www.google.es">
      <button type="button">Rechazar</button>
    </a>
  </div>
<% } %>
```

También se puede hacer el botón Rechazar directamente como `<a>` sin `<button>`, por ejemplo:

```ejs
<a class="btn-reject" href="https://www.google.es">Rechazar</a>
```

*Eso ya cumple el punto 2 del enunciado: al rechazar te vas a google.es, sin tocar sesión ni BD.*

---

### 2.4. CSS del banner (puro CSS, fijo abajo)

En `public/styles.css` añadimos algo así:

```css
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;

  background-color: #ddd;
  border-top: 1px solid #aaa;

  text-align: center;
  padding: 10px 0;

  z-index: 9999;           /* por encima del resto de contenido */
}

.cookie-banner p {
  margin: 0 0 8px 0;
}

.cookie-banner button,
.cookie-banner a {
  margin: 0 5px;
}
```

Esto hace:

* **Ocupar todo el ancho** (`width: 100%`).
* Estar siempre al fondo (`position: fixed; bottom: 0;`).
* Estar por encima de todo (`z-index` alto).
* Texto y botones centrados (`text-align: center`).

La captura del anexo muestra algo muy parecido: franja gris grande con texto centrado y dos botones.

---

### 2.5. Guardar aceptación en sesión y BD cuando hace login (punto 4)

El enunciado dice: cuando un usuario hace login, **si en la sesión actual ya ha aceptado cookies o en su perfil ya las aceptó, no debe mostrarse el mensaje**.

Esto ya lo tenemos cubierto con el middleware de `showCookieBanner`, porque:

```js
const sessionAccepted = req.session.cookiesAccepted === true;
const userAccepted    = user && user.acceptedCookies === true;

res.locals.showCookieBanner = !(sessionAccepted || userAccepted);
```

Aun así, es buena práctica que cuando el usuario se loguea y su perfil indica `acceptedCookies = true`, marquemos también la sesión:

```js
// ejemplo de login, tras comprobar usuario y contraseña
req.session.user = user;

// si su perfil indica que ya aceptó cookies en otra sesión:
if (user.acceptedCookies) {
  req.session.cookiesAccepted = true;
}
```

Con esto:

* Si el usuario aceptó las cookies en otra sesión previa → su perfil tiene `acceptedCookies = true` → al loguearse, marcamos la sesión → banner no se muestra.
* Si nunca las aceptó y en la sesión actual tampoco → `showCookieBanner` será `true` y se mostrará.

---

### 2.6. Resumen del flujo

* Usuario entra por primera vez → no hay `cookiesAccepted` en sesión y no está logueado → se muestra banner.
* Pulsa **Rechazar** → lo mandamos a Google → no se guarda nada, y si vuelve, el banner seguirá saliendo (correcto para el enunciado).
* Pulsa **Aceptar**:

  * `POST /cookies/accept` marca `req.session.cookiesAccepted = true`.
  * Si estaba logueado, también marca `acceptedCookies = true` en su “BD”.
  * Redirige a `/`; el middleware ve que `sessionAccepted` es `true` → `showCookieBanner = false` → banner desaparece.
* Más tarde, en otra sesión, si se loguea y su perfil tiene `acceptedCookies = true`, el banner tampoco se muestra.

---

### 2.7. Relación con el snippet que tenías

El snippet de tus apuntes:

```js
app.locals.appTitle = 'Mi tienda';

app.use((req, res, next) => {
  res.locals.currentUser = req.session ? req.session.user : null;
  next();
});
```

es exactamente la **idea general**:

* `app.locals.appTitle` → centralizar el nombre de la tienda (Apartado 1).
* `res.locals.currentUser` → usuario actual en todas las vistas (útil para mostrar menú diferente si está logueado).

En nuestro simulacro de “Embutidos León” hemos aplicado esa misma idea y además hemos añadido:

* `res.locals.showCookieBanner` para controlar el banner.
* Router `/cookies/accept` para la lógica de aceptación.
* CSS + EJS para el banner.

