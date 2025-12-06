# SISTEMAS WEB I – EXAMEN (SIMULACRO COMPLETO)

**Duración:** 2 horas
**Formato:** Papel. No se permite ningún material.
**Nota máxima:** 10 puntos
**Estructura:**

* **Parte A – Teoría:** 5 puntos
* **Parte B – Práctica (Node.js + Express + EJS + JS):** 5 puntos


## PARTE A – TEORÍA (5 puntos)

### Pregunta 1 – Conceptos generales web (1 punto)

1.1. Explica brevemente la diferencia entre:
a-  **Sitio web** y **aplicación web**.
b- **Aplicación web** y **servicio web**.

1.2. Define qué es una **aplicación para Internet** y menciona **dos ventajas** y **dos desventajas** frente a una aplicación de escritorio tradicional.

1.3. Explica la diferencia entre **frontend** y **backend**, indicando:

* Qué tipo de tecnologías suele usar cada uno.
* Dos posibles salidas profesionales típicas de cada perfil.


### Pregunta 2 – HTTP (1 punto)

2.1. Explica brevemente las diferencias principales entre **HTTP/1.1** y **HTTP/2** (menciona al menos 2 diferencias).

2.2. Define qué significa que un método HTTP sea:

* **Safe (seguro)**
* **Idempotente**

2.3. Indica, para cada método, si es **safe**, **idempotente**, ambos o ninguno:

* GET
* POST
* PUT
* DELETE

2.4. Indica **a qué categoría de código de estado** pertenecen estos códigos y qué significan de forma breve:

* 201
* 302
* 404
* 500

2.5. Explica por qué **no se deben enviar contraseñas** o datos sensibles usando una petición **GET**.


### Pregunta 3 – HTML, CSS y accesibilidad (1 punto)

3.1. Dado el siguiente fragmento HTML, señala **3 problemas** (de estructura, semántica o buenas prácticas) y propón una corrección para cada uno:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Mi pagina</title>
  <img src="logo.png">
  <style>
    h1 { color: red }
  </style>
</head>
<body>
  <div id="titulo">
    <h1>Login</h1>
  </div>
  <form action="/login" method="GET">
    <input id="user" type="text" name="user">
    <input type="password" name="pass">
    <label for="user">Usuario</label>
    <button>Enviar</button>
  </form>
</body>
</html>
```

3.2. Explica qué es el **modelo de caja** (*box model*) en CSS e indica qué representan:

* `margin`
* `border`
* `padding`
* `width` / `height`

3.3. Escribe un selector CSS que seleccione:

* a) Todos los elementos `<p>` dentro de un `<article>`.
* b) Todo elemento que tenga la clase `error`.
* c) El elemento con id `main-header`.

3.4. Menciona **dos buenas prácticas de accesibilidad web** relacionadas con HTML (por ejemplo, formularios, imágenes, estructura…).


### Pregunta 4 – JavaScript en el navegador (1 punto)

4.1. Explica la diferencia entre `==` y `===` en JavaScript y pon un ejemplo donde den resultados distintos.

4.2. Explica brevemente qué son:

* `NaN`
* `undefined`

4.3. Dado este código:

```html
<button id="btn">Púlsame</button>
<script>
  const btn = document.getElementById('btn');
  btn.onclick = function() {
    console.log('Click 1');
  };
  btn.addEventListener('click', function() {
    console.log('Click 2');
  });
</script>
```

a- ¿Qué se imprime en la consola al pulsar el botón una vez?
b- Explica por qué en general es preferible usar `addEventListener` frente a asignar `onclick`.

4.4. Explica brevemente qué hacen los atributos `defer` y `async` cuando los usamos en etiquetas `<script>`.


### Pregunta 5 – Node.js, JSON y Express (1 punto)

5.1. Explica brevemente la diferencia entre ejecutar JavaScript en el **navegador** y en **Node.js**.

5.2. Enumera los **7 tipos de valores válidos en JSON**.
Indica si cada uno de los siguientes JSON es **válido o no**, y corrígelo si no lo es:

a- `true`
b- `{ name: "Ana", "age": 20 }`
c- `["rojo", "verde", , "azul"]`
d- `{"ok": true, "data": [1, 2, 3]}`

5.3. Explica para qué sirven los ficheros:

* `package.json`
* `package-lock.json`

5.4. ¿Qué es una **variable de entorno** en Node.js? Pon un ejemplo de cómo acceder a una en código.

5.5. Explica con tus palabras qué es el **event loop** en Node.js.


## PARTE B – PRÁCTICA (5 puntos)

Dispones de 2 horas para contestar **todo el examen**, así que ajusta el tiempo.
En esta parte se espera **código razonablemente correcto y legible**, aunque no se pueda ejecutar.

Trabajaremos con una aplicación de ejemplo similar al “login” visto en clase.

La estructura del proyecto es:

```
miapp/
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

En `database.js` tenemos algo así:

```js
// database.js
const users = {
  "admin": {
    username: "admin",
    password: "admin",
    role: "admin",
    lastLogin: null
  },
  "maria": {
    username: "maria",
    password: "1234",
    role: "user",
    lastLogin: null
  }
};

module.exports = { users };
```

En `app.js` ya están instalados `express`, `express-session` y `ejs`.


### Ejercicio B1 – Configuración básica y rutas principales (1,5 puntos)

B1.1. (0,5 pt)
Escribe el código necesario en `app.js` para:

* Importar `express` y `path`.
* Crear la aplicación `app`.
* Configurar el puerto para que se coja de la variable de entorno `PORT` o, si no existe, el 3000.
* Arrancar el servidor mostrando un `console.log` con el puerto.

*(Se espera algo del estilo `const PORT = process.env.PORT || 3000;` y `app.listen(...)`.)*


B1.2. (0,5 pt)
Configura en `app.js`:

* Que el motor de plantillas sea **EJS**.
* Que las vistas estén en la carpeta `views`.
* Que la carpeta `public` contenga los ficheros estáticos (CSS, JS del cliente, imágenes…).

Escribe las líneas necesarias.


B1.3. (0,5 pt)
Define las siguientes rutas:

* `GET /` → Renderiza la vista `index.ejs` con una variable `title: "Inicio"`
* `GET /login` → Renderiza la vista `login.ejs` con una variable `title: "Login"`

No hace falta escribir las plantillas, solo las rutas en `app.js`.


### Ejercicio B2 – Login, sesiones y panel de administración (2 puntos)

Queremos implementar un sistema muy sencillo de login con roles (`admin` y `user`) y un panel de administración solo para el rol `admin`.

Supón que ya está inicializada la sesión:

```js
const session = require('express-session');

app.use(session({
  secret: 'secreto-examen',
  resave: false,
  saveUninitialized: false
}));
```

B2.1. (0,5 pt)
Escribe una ruta `POST /login` que:

* Reciba `username` y `password` desde un formulario.
* Busque el usuario en `database.users`.
* Si el usuario existe y la contraseña coincide:

  * Actualice `lastLogin` con la fecha actual (cadena o `new Date().toISOString()`).
  * Guarde en la sesión `req.session.user` el objeto usuario.
  * Redirija a `/`.
* Si no coincide, renderice `login.ejs` mostrando un mensaje de error (`error: "Credenciales incorrectas"`).

No hace falta escribir el formulario, solo la ruta.


B2.2. (0,5 pt)
Define un **middleware** `checkAuth` que:

* Compruebe si existe `req.session.user`.
* Si existe, llame a `next()`.
* Si no existe, redirija a `/login`.

Escribe la función middleware y muestra un ejemplo de cómo se usaría para proteger la ruta `/admin`.


B2.3. (0,5 pt)
Define un **middleware** `checkAdmin` que:

* Asuma que `req.session.user` existe.
* Compruebe si `req.session.user.role === "admin"`.
* Si lo es, llame a `next()`.
* Si no lo es, redirija a `/` o devuelva un 403.

Escribe la función y muestra cómo usarías **los dos middlewares** (`checkAuth` y `checkAdmin`) en la ruta `/admin`.


B2.4. (0,5 pt)
Escribe la ruta `GET /admin` que:

* Use `checkAuth` y `checkAdmin`.
* Obtenga la lista de usuarios desde `database.users`.
* Pase a la vista `admin.ejs` una variable `users` que sea un **array** de usuarios (por ejemplo, usando `Object.values(database.users)`).

No hace falta escribir `admin.ejs` aquí, solo la ruta.


### Ejercicio B3 – EJS, JSON y Socket.io (1,5 puntos)

B3.1. (0,5 pt) – EJS
Supón que en `admin.ejs` recibimos la variable `users` que es un array de objetos con las propiedades: `username`, `role` y `lastLogin`.

Escribe el código EJS necesario para mostrar una tabla con las columnas:

* Usuario
* Rol
* Último acceso (si es `null`, mostrar el texto `"Nunca"`)

y una fila por cada usuario.


B3.2. (0,5 pt) – JSON
El profesor te da el siguiente fragmento que dice que es un JSON:

```json
{
  "name": "Test",
  "active": true,
  "roles": ["admin", "user",],
  lastLogin: null
}
```

a- Explica **al menos 3 errores** que tiene (respecto al formato JSON).
b- Escribe la versión corregida y válida.


B3.3. (0,5 pt) – Socket.io
En otra práctica, usasteis `socket.io` para crear un pequeño juego tipo kahoot. El profesor te da este fragmento:

```js
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.join('sala-examen');

  socket.on('respuesta', (data) => {
    io.to('sala-examen').emit('nueva-respuesta', {
      usuario: data.usuario,
      opcion: data.opcion
    });
  });
});
```

Responde:

a- ¿Qué hace la línea `socket.join('sala-examen');`?
b- ¿Qué diferencia hay entre usar `socket.emit(...)` y `io.to('sala-examen').emit(...)`?
c- Explica con tus palabras (2–3 líneas) qué ocurre cuando un cliente emite el evento `'respuesta'`.
