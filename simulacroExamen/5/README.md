Vamos con el **Simulacro 5** 🤓
(2h, papel, teoría + práctica, alineado con lo que ha dicho el profe y el estilo de los repos de clase).

---

## SISTEMAS WEB I – EXAMEN (SIMULACRO 5)

**Duración:** 2 horas
**Formato:** Papel
**Puntuación máxima:** 10 puntos

* **Parte A – Teoría:** 5 puntos
* **Parte B – Práctica (Node.js + Express + EJS + JS + sockets):** 5 puntos

---

## PARTE A – TEORÍA (5 puntos)

### Pregunta 1 – Aplicaciones para Internet y roles (1 punto)

1.1. Define en 4–5 líneas qué es una **aplicación para Internet** y qué ventajas tiene frente a una aplicación de escritorio tradicional (cita al menos 2 ventajas y 1 desventaja).

1.2. Distingue entre:
a) **Sitio web estático**
b) **Aplicación web**
c) **Servicio web / API REST**

Para cada uno indica:

* quién lo consume (personas / aplicaciones),
* un ejemplo típico (no hace falta nombre real).

1.3. Explica brevemente qué tareas realiza principalmente:

* un/a **desarrollador/a frontend** (2 tareas + 2 tecnologías),
* un/a **desarrollador/a backend** (2 tareas + 2 tecnologías).

---

### Pregunta 2 – HTTP, versiones, métodos y códigos (1 punto)

2.1. Explica qué significa que HTTP sea:
a) **stateless (sin estado)**
b) basado en el modelo **petición–respuesta**

2.2. Indica **dos mejoras** de HTTP/2 respecto a HTTP/1.1.
(No hace falta hablar de estadísticas de uso.)

2.3. Sobre los métodos HTTP:
a) Explica qué significa que un método sea **safe**.
b) Explica qué significa que un método sea **idempotente**.

Completa la tabla marcando con una “X”:

| Método | Safe | Idempotente |
| ------ | ---- | ----------- |
| GET    |      |             |
| HEAD   |      |             |
| POST   |      |             |
| PUT    |      |             |
| DELETE |      |             |

2.4. Clasifica los siguientes códigos de estado indicando:

* categoría (1xx, 2xx, 3xx, 4xx, 5xx),

* descripción general de la categoría,

* caso de uso concreto para cada código:

* 204

* 301

* 400

* 401

* 503

2.5. Explica por qué, aunque usemos HTTPS, está **mal** enviar un formulario de registro con `method="GET"`. Menciona al menos **dos razones** (seguridad / diseño / usabilidad).

---

### Pregunta 3 – HTML, formularios, accesibilidad y estructura (1 punto)

3.1. Escribe la estructura mínima de un documento HTML5:
Incluye al menos: `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`.
Indica qué tipo de información suele ir en el `<head>` (2 ejemplos) y en el `<body>` (2 ejemplos).

3.2. Dado el siguiente formulario para cambiar la contraseña:

```html
<form action="/change-password" method="GET">
  <label>Nueva contraseña</label>
  <input type="password" id="pass">
  <button>Cambiar</button>
</form>
```

a) Señala **al menos tres problemas** (nombres, accesibilidad, método HTTP, etc.).
b) Reescríbelo corrigiendo los problemas, enlazando correctamente `label` con `input` y usando el método adecuado.

3.3. Explica qué es un **void element** en HTML y pon **dos ejemplos**.
¿Por qué `<br>` o `<img>` no tienen etiqueta de cierre?

3.4. ¿Qué es un **validador HTML**?
¿Qué esperamos respecto a **errores** y **warnings** si nuestro HTML está bien según las buenas prácticas de la asignatura?

---

### Pregunta 4 – CSS: selectores, box model y responsive (1 punto)

4.1. Explica y pon un ejemplo de cada tipo de selector:
a) Selector de etiqueta
b) Selector de clase
c) Selector de id
d) Selector de descendiente (combinación simple, por ejemplo `article p`)

4.2. Describe el **modelo de caja (box model)** en CSS e indica el papel de:

* `margin`
* `padding`
* `border`
* `width` y `height`

Menciona qué hace `box-sizing: border-box`.

4.3. ¿Qué es la **specificity** en CSS?
Explica qué regla se aplica si estas dos reglas afectan al mismo elemento:

```css
p { color: blue; }
#destacado { color: red; }
```

y el elemento es `<p id="destacado">Hola</p>`.

4.4. ¿Qué es el **diseño responsive**?
Escribe una **media query** que aplique:

* `font-size: 14px;` al `<body>`
  cuando el ancho de la ventana sea **máximo 768px**.

---

### Pregunta 5 – JavaScript, Node.js, JSON y Express (1 punto)

5.1. Explica la diferencia entre `var`, `let` y `const` en cuanto a:

* ámbito (scope),
* posibilidad de reasignación,
* qué recomienda usar el profesor por defecto.

5.2. Indica el resultado de estas expresiones y justifica brevemente:

a) `2 == "2"`
b) `2 === "2"`
c) `"5" + 1`
d) `"5" - 1`
e) `typeof NaN`

5.3. Enumera los **7 tipos de valores válidos en JSON**.
Di si estos son JSON válidos o no, y corrige los que no lo sean:

a) `123`
b) `{ nombre: "Pepe", "edad": 20 }`
c) `["a", "b", "c",]`
d) `"hola"`
e) `{ "activo": true, "tags": ["uni", "web"] }`

5.4. Explica brevemente el papel de:
a) `package.json` en un proyecto Node.js (2 funciones).
b) `package-lock.json` y por qué es importante cuando varias personas clonan el mismo repositorio.

5.5. En Express:
a) Define qué es un **middleware** y qué parámetros recibe normalmente.
b) Explica qué hacen `res.locals` y `app.locals`.
c) ¿Qué hace la llamada a `next()` dentro de un middleware?

---

## PARTE B – PRÁCTICA (5 puntos)

Vamos a trabajar con una mini aplicación tipo **“BookShelf”**, un gestor de libros con login y roles.

Estructura del proyecto:

```
bookshelf/
├── app.js
├── database.js
├── package.json
├── public/
│   ├── styles.css
│   └── client.js
└── views/
    ├── layout.ejs
    ├── login.ejs
    ├── books.ejs
    └── admin.ejs
```

### Fichero `database.js`

```js
// database.js
const users = {
  "admin": {
    username: "admin",
    password: "admin",
    role: "admin"
  },
  "ana": {
    username: "ana",
    password: "1234",
    role: "user"
  }
};

const books = [
  { id: 1, title: "El Quijote", author: "Cervantes", owner: "ana" },
  { id: 2, title: "Fundación", author: "Asimov", owner: "ana" },
  { id: 3, title: "Clean Code", author: "Martin", owner: "admin" }
];

module.exports = { users, books };
```

Se supone que ya has hecho `npm install express express-session ejs`.

---

### B1 – Configuración básica de Express (1 punto)

B1.1. (0,5 pt)
En `app.js`, escribe el código necesario para:

* Importar `express`, `path` y `database.js`.
* Crear la aplicación `app`.
* Configurar el motor de vistas para usar EJS.
* Configurar la carpeta `views` como carpeta de plantillas.
* Servir ficheros estáticos desde la carpeta `public`.

*(Solo las líneas clave, pero deben ser correctas.)*

---

B1.2. (0,5 pt)
Configura el servidor para:

* Leer el puerto de `process.env.PORT` o usar `3000` por defecto.
* Escuchar en ese puerto y mostrar por consola:
  `Servidor escuchando en http://localhost:PUERTO`

---

### B2 – Login, sesión y middlewares (2 puntos)

En `app.js` se ha importado `express-session`:

```js
const session = require('express-session');
```

y ya están estas líneas:

```js
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'secreto-bookshelf',
  resave: false,
  saveUninitialized: false
}));
```

#### B2.1 – Rutas de login (0,75 pt)

Define las rutas:

* `GET /login`

  * Renderiza `login.ejs` con:

    * `title: "Login"`
    * `error: null`

* `POST /login`

  * Recibe `username` y `password` desde `req.body`.
  * Comprueba si existe `database.users[username]` y si la contraseña coincide.
  * Si son correctos:

    * Guarda el usuario en `req.session.user`.
    * Redirige a `/books`.
  * Si son incorrectos:

    * Vuelve a renderizar `login.ejs` con `title: "Login"` y `error: "Credenciales incorrectas"`.

---

#### B2.2 – Logout (0,25 pt)

Define la ruta:

* `POST /logout` que destruye la sesión y redirige a `/login`.

---

#### B2.3 – Middleware `requireAuth` (0,5 pt)

Escribe un middleware llamado `requireAuth` que:

* Compruebe si existe `req.session.user`.
* Si existe, llama a `next()`.
* Si no existe, redirige a `/login`.

Muestra cómo se usaría para proteger `GET /books`.

---

#### B2.4 – Middleware `requireAdmin` (0,5 pt)

Escribe un middleware llamado `requireAdmin` que:

* Asume que `req.session.user` existe.
* Comprueba si `req.session.user.role === "admin"`.
* Si es admin, llama a `next()`.
* Si no lo es, responde con `res.status(403).send("Prohibido")` o redirige a `/books`.

Escribe cómo se usaría para proteger `GET /admin`.

---

### B3 – Listado de libros y panel admin (2 puntos)

#### B3.1 – Ruta `/books` (0,75 pt)

Define la ruta `GET /books` que:

* Usa `requireAuth`.
* Obtiene el usuario actual de `req.session.user`.
* Filtra los libros de `database.books` cuyo `owner` coincida con `user.username`.
* Renderiza `books.ejs` pasando:

  * `title: "Mis libros"`
  * `user: req.session.user`
  * `books: booksDelUsuario`

---

#### B3.2 – Vista `books.ejs` (0,75 pt)

Escribe el **cuerpo** (`<body>...</body>`) de `books.ejs` usando EJS para:

* Mostrar `<h1><%= title %></h1>`.
* Mostrar un párrafo: `"Hola, <%= user.username %>"`.
* Si `books` está vacío, mostrar `"No tienes libros"`.
* Si no está vacío, mostrar una tabla con columnas: Título y Autor, recorriendo `books` con un bucle EJS.

*(No hace falta diseño especial, solo la estructura y EJS bien usada.)*

---

#### B3.3 – Ruta y vista `admin.ejs` (0,5 pt)

Queremos un panel de administración para ver todos los libros.

a) Define la ruta `GET /admin` que:

* Usa `requireAuth` y `requireAdmin`.
* Renderiza `admin.ejs` pasando:

  * `title: "Panel de administración"`
  * `books: database.books`

b) Escribe el **cuerpo** de `admin.ejs` para mostrar una tabla con columnas:

* ID
* Título
* Autor
* Propietario (`owner`)

Usa un bucle EJS para recorrer `books`.

---

### B4 – JSON y Socket.io (1 punto)

#### B4.1 – JSON (0,5 pt)

Te dan este supuesto JSON con la información de un libro:

```json
{
  "id": 10,
  "title": "JavaScript: The Good Parts",
  "authors": ["Douglas Crockford", ],
  "available": true,
}
```

a) Indica **al menos 2 errores de formato** que hacen que no sea JSON válido.
b) Escribe la versión corregida.

---

#### B4.2 – Socket.io (0,5 pt)

En una ampliación del proyecto, cuando un admin añade un libro nuevo, se quiere notificar a todos los clientes conectados en tiempo real.

En el servidor:

```js
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.join('bookshelf');

  socket.on('nuevo-libro', (data) => {
    console.log('Libro recibido:', data);
    io.to('bookshelf').emit('libro-creado', data);
  });
});
```

En el cliente:

```js
const socket = io();

socket.on('libro-creado', (data) => {
  console.log('Nuevo libro:', data);
});
```

Responde:

a) ¿Qué hace exactamente `socket.join('bookshelf')`? Explica qué es una **room**.

b) ¿Qué diferencia hay entre usar `socket.emit('libro-creado', ...)` desde el servidor y usar `io.to('bookshelf').emit('libro-creado', ...)`?

c) Describe en 3–4 líneas qué sucede desde que un cliente ejecuta `socket.emit('nuevo-libro', data)` hasta que los demás clientes ven `"Nuevo libro:"` en su consola.
