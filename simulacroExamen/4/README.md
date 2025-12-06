# SISTEMAS WEB I – EXAMEN (SIMULACRO 4)

**Duración:** 2 horas
**Formato:** Papel
**Puntuación máxima:** 10 puntos

* **Parte A – Teoría:** 5 puntos
* **Parte B – Práctica (Node.js + Express + EJS + JS + sockets):** 5 puntos

## PARTE A – TEORÍA (5 puntos)

### Pregunta 1 – Aplicaciones para Internet y roles (1 punto)

1.1. Explica en 4–5 líneas qué es una **aplicación para Internet** y en qué se diferencia de una aplicación de escritorio clásica.

1.2. Distingue entre:
a- **Sitio web estático**
b- **Aplicación web dinámica**
c- **Servicio web / API REST**

Para cada uno indica:

* quién lo consume (persona / otra aplicación),
* un ejemplo razonable (no hace falta nombre real).

1.3. Explica brevemente qué hace un/a:

* **desarrollador/a frontend** (2 tareas y 2 tecnologías típicas),
* **desarrollador/a backend** (2 tareas y 2 tecnologías típicas).


### Pregunta 2 – HTTP, HTTPS, métodos y códigos de estado (1 punto)

2.1. Explica qué significa que HTTP sea:
a- **Stateless (sin estado)**
b- Basado en el modelo **petición–respuesta**

2.2. Compara **HTTP/1.1** y **HTTP/2** indicando **dos mejoras** de HTTP/2.

2.3. Completa la tabla, marcando con una “X”:

| Método | Safe | Idempotente |
| ------ | ---- | ----------- |
| GET    |      |             |
| POST   |      |             |
| PUT    |      |             |
| DELETE |      |             |

Explica en 1–2 líneas qué significa “safe” y qué significa “idempotente”.

2.4. Indica la categoría (1xx–5xx) y un caso de uso razonable para cada código:

* **201**
* **302**
* **404**
* **409**
* **500**

2.5. Aunque usemos HTTPS, ¿por qué está **mal diseño** enviar un formulario de login con `method="GET"`? Da al menos **dos motivos**.


### Pregunta 3 – HTML, formularios, accesibilidad y validación (1 punto)

3.1. Escribe la estructura mínima de un documento **HTML5** (solo las etiquetas principales) y di qué tipo de información se suele colocar en:

* `<head>` (2 ejemplos),
* `<body>` (2 ejemplos).

3.2. Dado el siguiente formulario:

```html
<form action="/buscar" method="GET">
  <label>Usuario</label>
  <input id="user">
  <button>Buscar</button>
</form>
```

a- Señala **al menos dos problemas** (accesibilidad, semántica, nombres, etc.).
b- Reescribe el formulario corrigiendo esos problemas.

3.3. Explica qué es un **void element** en HTML y pon **dos ejemplos**.
Indica por qué `<img>` no lleva etiqueta de cierre y qué atributo es importante para accesibilidad en `<img>`.

3.4. ¿Qué es un **validador HTML** y qué debería ocurrir en un HTML “bien” respecto a **errores** y **warnings**?

---

### Pregunta 4 – CSS: selectores, box model y responsive (1 punto)

4.1. Explica brevemente:
a- Selector de **etiqueta**
b- Selector de **clase**
c- Selector de **id**

Pon un ejemplo de CSS de cada tipo.

4.2. Describe el **modelo de caja (box model)** en CSS e indica qué representan estas propiedades:

* `margin`
* `padding`
* `border`
* `box-sizing: border-box`

4.3. ¿Qué es la **specificity** en CSS? Explica qué pasaría si dos reglas diferentes afectan al mismo elemento y dan valores distintos para la misma propiedad.

4.4. Explica qué es el **diseño responsive** y escribe una **media query** que:

* aplique `font-size: 14px;` a `<body>`
* solo cuando el ancho de la pantalla sea **menor de 600px**.

### Pregunta 5 – JavaScript, Node.js, JSON y Express (1 punto)

5.1. Explica la diferencia entre `var`, `let` y `const` respecto a:

* ámbito (scope),
* posibilidad de reasignar,
* cuál recomienda usar el profesor por defecto.

5.2. Indica el resultado de estas expresiones y explica **la más extraña** en una frase:

a- `0 == false`
b- `0 === false`
c- `"7" + 3`
d- `"7" - 3`
e- `NaN === NaN`

5.3. Enumera los **7 tipos de valores válidos en JSON**.
Indica si estos son JSON válidos o no; corrige los que no lo sean:

a- `"hola"`
b- `{ nombre: "Ana", "edad": 21 }`
c- `["a", "b", "c",]`
d- `true`
e- `{ "ok": true, "datos": null }`

5.4. Explica para qué sirve el fichero **`package.json`** y qué aporta **`package-lock.json`** en un proyecto de Node trabajando en equipo.

5.5. En Express:
a- ¿Qué es un **middleware**?
b- Explica la diferencia entre `app.locals` y `res.locals`.
c- Explica qué hace el parámetro `next` en una función middleware.


## PARTE B – PRÁCTICA (5 puntos)

Vas a trabajar con una aplicación de ejemplo llamada **“ContactHub”**, un mini gestor de contactos con login y roles.

Estructura del proyecto:

```
contacthub/
├── app.js
├── database.js
├── package.json
├── public/
│   ├── styles.css
│   └── client.js
└── views/
    ├── layout.ejs
    ├── login.ejs
    ├── contactos.ejs
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
  "maria": {
    username: "maria",
    password: "1234",
    role: "user"
  }
};

const contacts = [
  { id: 1, name: "Pablo", phone: "600111222", owner: "maria" },
  { id: 2, name: "Laura", phone: "600333444", owner: "maria" },
  { id: 3, name: "Soporte IT", phone: "900123123", owner: "admin" }
];

module.exports = { users, contacts };
```

Se supone que ya has hecho `npm install express express-session ejs`.


### B1 – Configuración básica de Express (1 punto)

B1.1. (0,5 pt)
En `app.js`, escribe el código necesario para:

* Importar `express`, `path` y `database.js`.
* Crear la aplicación `app`.
* Configurar el motor de vistas para usar **EJS**.
* Configurar la carpeta `views` como carpeta de plantillas.
* Servir ficheros estáticos desde la carpeta `public`.

*(Solo las líneas esenciales, pero correctas.)*


B1.2. (0,5 pt)
Configura el servidor para:

* Leer el puerto de `process.env.PORT` o usar `3000` por defecto.
* Arrancar el servidor y mostrar por consola:
  `Servidor escuchando en http://localhost:PUERTO`


### B2 – Login, sesión y middlewares (2 puntos)

En `app.js` se ha importado ya `express-session`:

```js
const session = require('express-session');
```

y se ha añadido al principio:

```js
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'secreto-contacthub',
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

    * Guarda el usuario completo en `req.session.user`.
    * Redirige a `/contactos`.
  * Si son incorrectos:

    * Renderiza `login.ejs` de nuevo con `title: "Login"` y `error: "Credenciales incorrectas"`.

*(No hace falta escribir todavía la vista `login.ejs`.)*


#### B2.2 – Logout (0,25 pt)

Define la ruta:

* `POST /logout` que destruye la sesión y redirige a `/login`.


#### B2.3 – Middleware `requireAuth` (0,5 pt)

Escribe un middleware llamado `requireAuth` que:

* Compruebe si **existe** `req.session.user`.
* Si existe, llame a `next()`.
* Si no existe, redirija a `/login`.

Muestra cómo se usaría para proteger la ruta `GET /contactos`.


#### B2.4 – Middleware `requireAdmin` (0,5 pt)

Escribe un middleware llamado `requireAdmin` que:

* Supone que `req.session.user` existe (se usará después de `requireAuth`).
* Comprueba si `req.session.user.role === "admin"`.
* Si es admin, llama a `next()`.
* Si no, redirige a `/contactos` o responde con `res.status(403).send("Prohibido")`.

Muestra cómo se usaría para proteger la ruta `GET /admin`.


### B3 – Listado de contactos y panel de administración (2 puntos)

#### B3.1 – Ruta `/contactos` (0,75 pt)

Define la ruta `GET /contactos` que:

* Usa el middleware `requireAuth`.
* Obtiene el usuario actual de `req.session.user`.
* Filtra los contactos de `database.contacts` cuyo `owner` coincida con `user.username`.
* Renderiza `contactos.ejs` pasando:

  * `title: "Mis contactos"`
  * `user: req.session.user`
  * `contacts: contactsDelUsuario`


#### B3.2 – Vista `contactos.ejs` (0,75 pt)

Escribe el **cuerpo** (`<body>...</body>`) de `contactos.ejs` usando EJS para:

* Mostrar `<h1><%= title %></h1>`.
* Mostrar un párrafo: `"Hola, <%= user.username %>"`.
* Si `contacts.length === 0`, mostrar `"No tienes contactos"`.
* Si no está vacío, mostrar una tabla con columnas: Nombre y Teléfono, recorriendo `contacts` con un bucle EJS.

*(No hace falta diseño bonito, solo que la lógica esté bien.)*


#### B3.3 – Ruta y vista `admin.ejs` (0,5 pt)

Queremos un panel de administración que muestre **todos los contactos de todos los usuarios**.

a- Define la ruta `GET /admin` que:

* Usa `requireAuth` y `requireAdmin`.
* Renderiza `admin.ejs` pasando:

  * `title: "Panel de administración"`
  * `contacts: database.contacts`

b- Escribe el cuerpo de `admin.ejs` para mostrar una tabla con las columnas:

* ID
* Nombre
* Teléfono
* Propietario (`owner`)

Usa un bucle EJS para recorrer `contacts`.


### B4 – JSON y Socket.io (1 punto)

#### B4.1 – JSON (0,5 pt)

Te dan este supuesto JSON con información de un contacto:

```json
{
  "id": 10,
  "name": "Carlos",
  "phones": ["600111222", "911223344", ],
  "favorite": true,
}
```

a- Indica **al menos 2 errores de formato** que hacen que no sea un JSON válido.
b- Escribe la versión corregida.


#### B4.2 – Socket.io (0,5 pt)

En una ampliación de la práctica, cuando se crea un contacto nuevo, queremos notificarlo en tiempo real a todos los clientes conectados.

En el servidor:

```js
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.join('contacthub');

  socket.on('nuevo-contacto', (data) => {
    console.log('Contacto recibido:', data);
    io.to('contacthub').emit('contacto-creado', data);
  });
});
```

En el cliente:

```js
const socket = io();

socket.on('contacto-creado', (data) => {
  console.log('Nuevo contacto:', data);
});
```

Responde:

a- ¿Qué hace exactamente `socket.join('contacthub')`? Explica qué es una **room**.

b- ¿Qué diferencia hay entre usar `socket.emit('contacto-creado', ...)` en el servidor y usar `io.to('contacthub').emit('contacto-creado', ...)`?

c- Describe en 3–4 líneas qué ocurre desde que un cliente ejecuta `socket.emit('nuevo-contacto', data)` hasta que los demás clientes ven `"Nuevo contacto:"` en su consola.
