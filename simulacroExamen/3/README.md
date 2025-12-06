# SISTEMAS WEB I – EXAMEN (SIMULACRO 3)

**Duración:** 2 horas
**Formato:** Papel
**Puntuación máxima:** 10 puntos

* **Parte A – Teoría:** 5 puntos
* **Parte B – Práctica:** 5 puntos


## PARTE A – TEORÍA (5 puntos)

### Pregunta 1 – Aplicaciones para Internet y roles (1 punto)

1.1. Define en 3–4 líneas qué es una **aplicación para Internet**.

1.2. Compara brevemente:
a- **Sitio web estático**
b- **Aplicación web dinámica**
c- **Servicio web / API REST**

Indica para cada uno:

* qué tipo de usuario/consumidor tiene (persona, otra aplicación…),
* un ejemplo razonable (tipo “blog personal”, “banca online”, “API de clima”…).

1.3. Explica qué hacen, a grandes rasgos:
a- Un/a **desarrollador/a frontend** (2 responsabilidades y 2 tecnologías típicas).
b- Un/a **desarrollador/a backend** (2 responsabilidades y 2 tecnologías típicas).


### Pregunta 2 – HTTP, HTTPS y métodos (1 punto)

2.1. Explica qué significa que HTTP sea:
a- **Sin estado (stateless)**
b- Basado en el modelo **petición–respuesta**

2.2. Explica **dos diferencias técnicas** importantes entre **HTTP/1.1** y **HTTP/2**.

2.3. Sobre métodos HTTP:
a- Explica qué significa que un método sea **safe**.
b- Explica qué significa que un método sea **idempotente**.

Rellena la tabla marcando con una “X”:

| Método | Safe | Idempotente |
| ------ | ---- | ----------- |
| GET    |      |             |
| POST   |      |             |
| PUT    |      |             |
| DELETE |      |             |

2.4. Clasifica los siguientes códigos de estado indicando:

* categoría (1xx–5xx)

* descripción breve

* ejemplo de cuándo lo usarías

* 200
* 201
* 304
* 403
* 500

2.5. Explica por qué **no deberíamos enviar contraseñas** mediante una URL (GET) aunque usemos HTTPS.


### Pregunta 3 – HTML, formularios, CSS y accesibilidad (1 punto)

3.1. Escribe la estructura mínima de un documento HTML5 (solo las etiquetas principales) e indica:

* Dos tipos de información que van en el `<head>`.
* Dos tipos de información que van en el `<body>`.

3.2. Dado este formulario de login:

```html
<form action="/login" method="GET">
  <input type="text" name="user">
  <input type="password" name="pass">
  <button>Entrar</button>
</form>
```

a- Indica **dos problemas** (semántica, accesibilidad, seguridad, buenas prácticas).
b- Reescribe el formulario corrigiendo esos problemas (no hace falta diseño).

3.3. Explica brevemente qué es el **modelo de caja (box model)** en CSS.
Indica qué representa cada una de estas propiedades:

* `margin`
* `padding`
* `border`
* `width`

3.4. Escribe un ejemplo de CSS que cumpla todo:

* Seleccione todos los párrafos dentro de un `<article>`.
* Cambie el tamaño de letra a 14px.
* Ponga un margen superior de 10px.

3.5. ¿Qué es el **diseño responsive**? Explica qué es una **media query** y escribe un ejemplo de media query que cambie el color de fondo del `<body>` a azul cuando el ancho sea menor de 768px.


### Pregunta 4 – JavaScript en el navegador (1 punto)

4.1. Explica la diferencia entre `var`, `let` y `const` en cuanto a:

* ámbito (scope)
* posibilidad de reasignar
* qué recomienda usar el profesor por defecto

4.2. Indica el resultado de las siguientes expresiones, y el motivo en una frase:

a- `1 == "1"`
b- `1 === "1"`
c- `"10" - 3`
d- `"10" + 3`
e- `NaN === NaN`

4.3. Explica la diferencia entre estas dos formas de añadir un manejador de eventos:

a-

```html
<button onclick="sumar()">Sumar</button>
```

b-

```js
const btn = document.getElementById('btnSumar');
btn.addEventListener('click', sumar);
```

Indica cuál es preferible y por qué.

4.4. Explica brevemente qué hacen `defer` y `async` cuando se usan en `<script>`:

```html
<script src="app.js" defer></script>
<script src="otro.js" async></script>
```


### Pregunta 5 – Node.js, JSON y Express (1 punto)

5.1. Explica dos diferencias entre ejecutar JavaScript en **Node.js** y en el **navegador** (por ejemplo, APIs disponibles, entorno…).

5.2. Enumera los **7 tipos de valores válidos en JSON**.

Indica si estos ejemplos son JSON válidos o no y corrige los que no lo sean:

a- `42`
b- `{ nombre: "Ana", "edad": 21 }`
c- `["a", "b", "c",]`
d- `{"ok": true, "datos": null}`
e- `{ "roles": ["admin", "user"], "activo": true }`

5.3. Explica qué es `package.json` y menciona al menos tres campos habituales (por ejemplo, `name`, `version`, `scripts`, …) y qué significan.

5.4. Explica qué es `package-lock.json` y cuál es su función en un proyecto de Node, especialmente en un equipo de varias personas.

5.5. Define brevemente:
a- **Event loop** en Node.js.
b- Qué es una **variable de entorno** y cómo se accedería a una llamada `PORT` desde Node.js.


## PARTE B – PRÁCTICA (5 puntos)

Vas a trabajar sobre una aplicación muy sencilla de tipo **“Gestor de tareas”** con login y roles.
La estructura del proyecto es:

```
tareas/
├── app.js
├── database.js
├── package.json
├── public/
│   └── styles.css
└── views/
    ├── layout.ejs
    ├── index.ejs
    ├── login.ejs
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
  "luis": {
    username: "luis",
    password: "1234",
    role: "user"
  }
};

const tasks = [
  { id: 1, title: "Comprar pan", done: false, owner: "luis" },
  { id: 2, title: "Corregir exámenes", done: false, owner: "admin" }
];

module.exports = { users, tasks };
```

En `app.js` ya está instalado `express`, `express-session` y `ejs` mediante `npm`.


### Ejercicio B1 – Configuración básica de Express (1 punto)

B1.1. (0,5 pt)
Escribe el código necesario en `app.js` para:

* Importar `express`, `path` y `database.js`.
* Crear la aplicación `app`.
* Configurar el motor de plantillas **EJS** y la carpeta de vistas `views`.
* Servir ficheros estáticos desde la carpeta `public`.

*(Escribe las líneas clave, no hace falta que sea exactamente igual que en clase, pero debe ser correcto.)*


B1.2. (0,5 pt)
Configura el servidor para:

* Leer el puerto desde `process.env.PORT` o usar 3000 por defecto.
* Iniciar el servidor y mostrar por consola un mensaje del tipo:
  `Servidor escuchando en http://localhost:PUERTO`


### Ejercicio B2 – Login, sesiones y middlewares (2 puntos)

Suponemos que ya se ha inicializado la sesión:

```js
const session = require('express-session');

app.use(session({
  secret: 'secreto-examen',
  resave: false,
  saveUninitialized: false
}));
```

B2.1. (0,5 pt) – Rutas de login
Define las rutas:

* `GET /login` → renderiza `login.ejs` con `title: "Login"` y sin error.
* `POST /login` →

  * Recibe `username` y `password` desde `req.body`.
  * Comprueba si el usuario existe en `database.users` y si la contraseña coincide.
  * Si es correcto:

    * Guarda el objeto usuario en `req.session.user`.
    * Redirige a `/`.
  * Si no es correcto:

    * Renderiza `login.ejs` de nuevo con `title: "Login"` y `error: "Credenciales incorrectas"`.

*(No hace falta escribir el formulario de `login.ejs` ahora.)*


B2.2. (0,5 pt) – Logout
Define la ruta:

* `POST /logout` que:

  * Destruya la sesión del usuario.
  * Redirija a `/login`.


B2.3. (0,5 pt) – Middleware `requireAuth`
Escribe un middleware llamado `requireAuth` que:

* Compruebe si existe `req.session.user`.
* Si existe, llama a `next()`.
* Si no existe, redirige a `/login`.

Escribe la función y un ejemplo de cómo proteger la ruta `GET /` para que solo usuarios autenticados puedan acceder.


B2.4. (0,5 pt) – Middleware `requireAdmin`
Escribe un middleware llamado `requireAdmin` que:

* Asume que `req.session.user` existe.
* Comprueba si `req.session.user.role === "admin"`.
* Si es admin, llama a `next()`.
* Si no, redirige a `/` o devuelve un código 403.

Muestra cómo se usaría para proteger la ruta `GET /admin`.


### Ejercicio B3 – Listado de tareas y vista admin (2 puntos)

B3.1. (0,75 pt) – Ruta principal `/`
Define la ruta `GET /` que:

* Usa el middleware `requireAuth`.
* Obtiene el usuario actual de `req.session.user`.
* Obtiene las tareas de ese usuario filtrando `database.tasks` por `owner === usuario.username`.
* Renderiza `index.ejs` pasando:

  * `title: "Mis tareas"`
  * `user: req.session.user`
  * `tasks: tasksDelUsuario`


B3.2. (0,75 pt) – `index.ejs`

Escribe el código EJS del `<body>` de `index.ejs` para:

* Mostrar un encabezado `<h1><%= title %></h1>`.
* Mostrar un párrafo del tipo: `"Hola, <%= user.username %>"`.
* Si el array `tasks` está vacío, mostrar `"No tienes tareas"`.
* Si no está vacío, mostrar una lista `<ul>` con una `<li>` por cada tarea con el título y si está hecha o no (por ejemplo, “(hecha)” o “(pendiente)”).

*(No hace falta diseño, solo estructura y uso correcto de EJS.)*


B3.3. (0,5 pt) – Vista admin y roles

Queremos que la ruta `GET /admin` (protegida con `requireAuth` y `requireAdmin`) muestre **todas las tareas de todos los usuarios**.

a- Escribe la ruta `GET /admin` que:

* Usa `requireAuth` y `requireAdmin`.
* Pasa a la vista `admin.ejs`:

  * `title: "Panel de administración"`
  * `tasks: database.tasks`

b- Escribe el cuerpo de `admin.ejs` para mostrar una tabla con columnas:

* ID
* Título
* Propietario (`owner`)
* Estado (“hecha” / “pendiente”)

Usa un bucle EJS para recorrer `tasks`.


### Ejercicio B4 – JSON y Socket.io (1 punto)

B4.1. (0,5 pt) – JSON
Te dan el siguiente JSON que supuestamente representa una tarea:

```json
{
  "id": 10,
  "title": "Estudiar para el examen",
  "done": false,
  "labels": ["uni", "importante", ],
}
```

a- Indica **al menos 2 errores de formato** que hacen que no sea JSON válido.
b- Escribe la versión corregida.


B4.2. (0,5 pt) – Socket.io (teoría)

En otra práctica de clase, tenías este código en el servidor para notificar nuevas tareas en tiempo real:

```js
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);

  socket.join('sala-tareas');

  socket.on('nueva-tarea', (data) => {
    console.log('Tarea recibida:', data);
    io.to('sala-tareas').emit('tarea-creada', data);
  });
});
```

Y en el cliente:

```js
const socket = io();

socket.on('tarea-creada', (data) => {
  console.log('Tarea nueva:', data);
});
```

Responde:

a- ¿Qué hace exactamente `socket.join('sala-tareas')`? ¿Qué es una **room**?

b- ¿Qué diferencia hay entre usar `socket.emit('tarea-creada', ...)` desde el servidor y usar `io.to('sala-tareas').emit('tarea-creada', ...)`?

c- Describe en 3–4 líneas qué ocurre desde que un cliente emite `socket.emit('nueva-tarea', data)` hasta que otros clientes ven el mensaje `'Tarea nueva:'` en su consola.
