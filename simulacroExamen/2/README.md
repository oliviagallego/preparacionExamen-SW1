# SISTEMAS WEB I – EXAMEN (SIMULACRO 2)

**Duración:** 2 horas
**Formato:** Papel
**Nota máxima:** 10 puntos
**Estructura:**

* **Parte A – Teoría:** 5 puntos
* **Parte B – Práctica (Node.js + Express + EJS + JS + sockets):** 5 puntos


## PARTE A – TEORÍA (5 puntos)

### Pregunta 1 – Aplicaciones para Internet y roles (1 punto)

1.1. Define en 3–4 líneas qué es una **aplicación para Internet**.

1.2. Indica **tres ventajas** y **tres desventajas** de las aplicaciones web frente a programas de escritorio.

1.3. Explica la diferencia entre:
a- **Sitio web estático**
b- **Aplicación web**
c- **Servicio web / API REST**

Pon **un ejemplo realista** de cada uno (no hace falta nombre comercial real, pero sí del estilo: “página corporativa”, “banca online”, etc.).

1.4. Explica brevemente qué hace un/a **desarrollador/a frontend** y un/a **desarrollador/a backend** e indica **dos tecnologías típicas** asociadas a cada rol.


### Pregunta 2 – HTTP y HTTPS (1 punto)

2.1. Explica qué significa que HTTP sea un protocolo **stateless**. ¿Qué consecuencias tiene a la hora de mantener la sesión de un usuario?

2.2. Compara brevemente **HTTP/1.1** y **HTTP/2**, indicando al menos dos mejoras que introduce HTTP/2.

2.3. ¿Qué diferencias hay entre **HTTP** y **HTTPS** a nivel de seguridad? Menciona al menos:

* Cifrado
* Certificados
* Puerto típico

2.4. Explica qué significan los siguientes códigos de estado HTTP y en qué situación razonable los usarías:

* 204
* 301
* 400
* 401
* 503

2.5. Explica qué significa que un método HTTP sea **safe** y qué significa que sea **idempotente**, y pon un ejemplo de cada tipo de método.


### Pregunta 3 – HTML, formularios, CSS y responsive (1 punto)

3.1. Explica la estructura mínima de un documento HTML5 y qué tipo de información se suele colocar en el `<head>` y en el `<body>`.

3.2. Dado el siguiente formulario:

```html
<form action="/buscar" method="GET">
  <label>Buscar:</label>
  <input type="text" name="q">
  <button type="submit">Enviar</button>
</form>
```

a- Señala un **problema de accesibilidad** y corrígelo.
b- Explica por qué **no deberíamos usar** `method="GET"` en un formulario de login.

3.3. Explica brevemente:
a- Qué es el **modelo de caja** (box model) en CSS.
b- La diferencia entre:

* Selector de etiqueta
* Selector de clase
* Selector de id
  con un ejemplo de cada uno.

3.4. ¿Qué es el **diseño responsive** y qué es una **media query**?
Escribe un ejemplo de media query que aplique un fondo gris solo cuando el ancho de la pantalla sea menor de 600px.


### Pregunta 4 – JavaScript en el navegador (1 punto)

4.1. Explica la diferencia entre `var`, `let` y `const` y cuál recomienda usar el profesor por defecto.

4.2. Indica el resultado de estas expresiones en JavaScript (sin ejecutarlas) y explica brevemente el caso más raro:

a- `0 == false`
b- `0 === false`
c- `'5' + 2`
d- `'5' - 2`
e- `NaN === NaN`

4.3. Explica la diferencia entre estas dos formas de manejar eventos y cuál es preferible y por qué:

```js
// Forma A
<button onclick="saludar()">Hola</button>

// Forma B
const btn = document.getElementById('btn');
btn.addEventListener('click', saludar);
```

4.4. Explica brevemente para qué sirven los atributos `defer` y `async` en una etiqueta `<script>` y en qué se diferencian.


### Pregunta 5 – Node.js, JSON y Express (1 punto)

5.1. Explica con tus palabras la diferencia entre utilizar JavaScript en el **navegador** y en **Node.js** (APIs disponibles, entorno de ejecución).

5.2. Escribe los **7 tipos de valores válidos en JSON**. Luego indica si cada uno de estos es un JSON válido o inválido y corrígelo si es necesario:

a- `"hola"`
b- `{ "nombre": "Ana", "edad": 20, }`
c- `["a", "b", "c"]`
d- `{ admin: true }`
e- `false`

5.3. Explica para qué sirve el fichero `package.json` y qué tipo de información suele contener.

5.4. ¿Qué es `package-lock.json` y por qué es importante para trabajar en equipo?

5.5. Explica brevemente qué es el **event loop** de Node.js y por qué es importante que las operaciones de disco/red se hagan de forma asíncrona.


## PARTE B – PRÁCTICA (5 puntos)

Tienes una aplicación de ejemplo de tipo **tienda online** muy sencilla donde un usuario puede ver productos y añadirlos a un carrito en memoria.

La estructura del proyecto es:

```
tienda/
├── app.js
├── database.js
├── package.json
├── public/
│   ├── styles.css
│   └── client.js
└── views/
    ├── layout.ejs
    ├── index.ejs
    ├── carrito.ejs
    └── admin.ejs
```

### Contenido de `database.js`

```js
// database.js
const products = [
  { id: 1, name: 'Camiseta', price: 20, stock: 10 },
  { id: 2, name: 'Sudadera', price: 35, stock: 5 },
  { id: 3, name: 'Taza', price: 8, stock: 100 }
];

module.exports = { products };
```


### Ejercicio B1 – Configuración básica de Express (1 punto)

B1.1. (0,5 pt)
Escribe el código necesario en `app.js` para:

* Importar `express` y `path`.
* Crear la aplicación `app`.
* Configurar el motor de vistas como **EJS** y la carpeta de vistas como `views`.
* Configurar la carpeta `public` como carpeta de **ficheros estáticos**.

*(Escribe las líneas clave, no hace falta el `require` completo si te falta tiempo, pero que se entienda.)*


B1.2. (0,5 pt)
Configura el servidor para que:

* El puerto se obtenga de `process.env.PORT` o, si no existe, sea `3000`.
* El servidor escuche en ese puerto y muestre en consola:
  `Servidor escuchando en http://localhost:PUERTO`


### Ejercicio B2 – Rutas de la tienda y carrito (2 puntos)

Queremos implementar las siguientes funcionalidades:

* ver la lista de productos (`GET /`),
* añadir productos al carrito (`POST /carrito/add`),
* ver el carrito (`GET /carrito`).

Supón que tenemos un **carrito muy simple** guardado en memoria por ahora:

```js
// En app.js (por simplicidad, un carrito global, no por sesión)
let cart = [];
```

Cada elemento de `cart` será un objeto `{ id, name, price, quantity }`.


B2.1. (0,5 pt) – Lista de productos
Define la ruta `GET /` que:

* Importe los productos desde `database.js`.
* Renderice la vista `index.ejs` pasándole:

  * `title: "Tienda"`
  * `products: products`

No hace falta escribir la vista aún, solo la ruta.


B2.2. (0,5 pt) – Añadir al carrito
Define una ruta `POST /carrito/add` que:

* Reciba desde un formulario el campo `productId`.
* Busque el producto correspondiente en `database.products`.
* Si existe, añada una entrada al carrito `cart`. Si ya existe en el carrito, **aumenta su `quantity` en 1** en lugar de añadir uno nuevo.
* Redirija a `/carrito`.

*(No hace falta controlar stock perfecto, basta la lógica básica.)*


B2.3. (0,5 pt) – Ver el carrito
Define una ruta `GET /carrito` que:

* Calcule el **total** del carrito (sumando `price * quantity` de cada elemento).
* Renderice la vista `carrito.ejs` pasándole:

  * `title: "Carrito"`
  * `cart: cart`
  * `total: total`


B2.4. (0,5 pt) – Pequeño middleware
Define un **middleware** `logRequests` que:

* Muestre por consola el método y la URL de cada petición, por ejemplo:
  `GET /carrito`
* Se aplique a **todas las rutas** de la aplicación.

Escribe la función y cómo la registrarías en `app.js`.


### Ejercicio B3 – Vistas EJS (1,5 puntos)

B3.1. (0,75 pt) – `index.ejs`

Escribe el código EJS (solo el `<body>`, no hace falta todo el HTML) para mostrar:

* Un título con `<h1><%= title %></h1>`
* Una tabla/lista de productos con las columnas: Nombre, Precio y un botón “Añadir al carrito”.
* Cada botón debe ser un formulario `POST` a `/carrito/add` con un campo oculto `productId` con el `id` del producto.

*(No hace falta que salga perfecto, pero se debe ver claramente el bucle y los campos.)*


B3.2. (0,75 pt) – `carrito.ejs`

Escribe el código EJS (solo el `<body>`) para:

* Mostrar un `<h1><%= title %></h1>`.
* Si el carrito está vacío (`cart.length === 0`), mostrar el mensaje: `"Tu carrito está vacío"`.
* Si no, mostrar una tabla con columnas: Producto, Precio unitario, Cantidad, Subtotal.
* Debajo de la tabla, mostrar el total con algo como: `"Total: <%= total %> €"`.


### Ejercicio B4 – JSON y Socket.io (1,5 puntos)

B4.1. (0,5 pt) – JSON

El profesor te da este supuesto JSON que describe un pedido:

```json
{
  "id": 1234,
  "cliente": "Ana",
  "pagado": true,
  "productos": [
    { "name": "Camiseta", "price": 20, "quantity": 2 },
    { "name": "Taza", "price": 8, "quantity": 1, }
  ],
  "comentarios": null,
}
```

a- Señala al menos **3 errores de formato** que hacen que no sea JSON válido.
b- Escribe la versión corregida.


B4.2. (1 punto) – Socket.io (teoría aplicada)

En otra práctica (tipo kahoot/chat), tenías este código en el servidor:

```js
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.join('sala-tienda');

  socket.on('nuevo-pedido', (data) => {
    console.log('Pedido recibido:', data);
    io.to('sala-tienda').emit('pedido-actualizado', data);
  });
});
```

Y en el cliente:

```js
const socket = io();

socket.on('connect', () => {
  console.log('Conectado con id:', socket.id);
});

socket.on('pedido-actualizado', (data) => {
  console.log('Nuevo pedido:', data);
});

function enviarPedido(pedido) {
  socket.emit('nuevo-pedido', pedido);
}
```

Responde:

a- Explica qué hace `socket.join('sala-tienda')` y qué es una **room**.

b- Explica la diferencia entre usar `socket.emit(...)` y `io.to('sala-tienda').emit(...)` en el servidor.

c- Describe en 3–4 líneas el flujo completo cuando un cliente llama a `enviarPedido(pedido)`:

* Qué se envía al servidor
* Qué hace el servidor
* Qué reciben los clientes conectados a la room `"sala-tienda"`