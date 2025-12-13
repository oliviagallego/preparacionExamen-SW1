# Correccion simulacro 1:

## Pregunta 1 – Conceptos generales web (1 punto)

### 1.1 Diferencias

**a) Sitio web vs aplicación web**

* **Sitio web:** conjunto de páginas principalmente **informativas** (contenido estático o poco interactivo).
* **Aplicación web:** sistema orientado a **tareas/funcionalidad**, con **interacción**, lógica y a menudo **datos de usuario** (puede haber login, pero no es obligatorio).

**b) Aplicación web vs servicio web**

* **Aplicación web:** tiene **interfaz** para usuarios (navegador) + frontend/back.
* **Servicio web (web service):** expone una **API** para que otras aplicaciones se comuniquen (JSON/XML), normalmente **sin interfaz**.

---

### 1.2 Qué es una aplicación para Internet + 2 ventajas/2 desventajas vs escritorio

Una **aplicación para Internet** es una aplicación accesible mediante **red** (normalmente navegador) donde parte de la lógica/datos se ejecuta en un **servidor**.

**Ventajas (2):**

* **Multiplataforma:** funciona en distintos SO con navegador.
* **Actualizaciones centralizadas:** el usuario no instala; se actualiza en el servidor.

**Desventajas (2):**

* **Dependencia de conexión** (o peor experiencia sin red).
* **Rendimiento/latencia y limitaciones del navegador** (comparado con nativa de escritorio).

---

### 1.3 Frontend vs backend (tecnologías + salidas)

**Frontend:** parte que corre en el navegador (UI/UX).

* Tecnologías típicas: **HTML, CSS, JavaScript** (y frameworks como React/Vue).
* Salidas profesionales: **Frontend developer**, **UI/UX (maquetación/interaction)**.

**Backend:** lógica del servidor, datos, seguridad y APIs.

* Tecnologías típicas: **Node.js/Express**, bases de datos (SQL/NoSQL), APIs (REST), autenticación, sesiones, etc.
* Salidas profesionales: **Backend developer**, **API developer / Full-stack** (o DevOps junior si se orienta a despliegue).

---

## Pregunta 2 – HTTP (1 punto)

### 2.1 HTTP/1.1 vs HTTP/2 (mínimo 2 diferencias)

* **HTTP/1.1** usa texto; **HTTP/2** usa **binario**.
* **HTTP/2** permite **multiplexación** (varias peticiones/respuestas en una sola conexión sin bloquearse como en 1.1).
* **HTTP/2** incluye **compresión de cabeceras (HPACK)** y **priorización** de streams.

---

### 2.2 Safe e idempotente

* **Safe (seguro):** no debe **modificar** el estado del servidor (solo lectura, como GET).
* **Idempotente:** repetir la misma petición **produce el mismo efecto** en el servidor (ej. PUT/DELETE suelen serlo).

---

### 2.3 Safe / idempotente

* **GET:** safe **e** idempotente
* **POST:** **ni safe ni idempotente**
* **PUT:** **idempotente** (no safe)
* **DELETE:** **idempotente** (no safe)

---

### 2.4 Códigos de estado

* **201 (2xx – éxito):** *Created*, se ha creado un recurso (normalmente tras POST).
* **302 (3xx – redirección):** redirección temporal.
* **404 (4xx – error cliente):** recurso no encontrado.
* **500 (5xx – error servidor):** error interno del servidor.

---

### 2.5 Por qué no usar GET para contraseñas/datos sensibles

Porque en GET los datos van en la **URL** y pueden quedar en **historial**, **logs**, **caché**, **marcadores** y enviarse en el **Referer**.
Para credenciales se usa normalmente **POST** y, sobre todo, **HTTPS** (la seguridad la da TLS/HTTPS, no el método).

---

## Pregunta 3 – HTML, CSS y accesibilidad (1 punto)

### 3.1 3 problemas + corrección

Problemas claros del fragmento:

1. **`<img>` dentro de `<head>`** (y sin `alt`): debe ir en el body (por ejemplo en un `<header>`).
2. Formulario de login con **method="GET"**: debería ser **POST**.
3. Falta **label para password** y el orden es mejor si el label va antes del input (mejora accesibilidad).

Corrección ejemplo (válida en examen):

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Mi página</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <img src="logo.png" alt="Logo de la web">
  </header>

  <h1>Login</h1>

  <form action="/login" method="POST">
    <label for="user">Usuario</label>
    <input id="user" type="text" name="user" required>

    <label for="pass">Contraseña</label>
    <input id="pass" type="password" name="pass" required>

    <button type="submit">Enviar</button>
  </form>
</body>
</html>
```

*(Nota: poner `<style>` en el head no es “incorrecto”, pero en proyecto real suele preferirse CSS externo.)*

---

### 3.2 Box model (margin, border, padding, width/height)

El **box model** describe cómo se calcula el tamaño de un elemento: **contenido + padding + border + margin**.

* **width/height:** tamaño del **contenido** (por defecto).
* **padding:** espacio entre contenido y borde.
* **border:** borde alrededor del padding/contenido.
* **margin:** espacio exterior que separa la caja de otras.

---

### 3.3 Selectores CSS

a) Todos los `<p>` dentro de un `<article>`:

```css
article p { }
```

b) Cualquier elemento con clase `error`:

```css
.error { }
```

c) Elemento con id `main-header`:

```css
#main-header { }
```

---

### 3.4 2 buenas prácticas de accesibilidad (HTML)

* Usar **`<label for="">`** asociado a cada input (y `id` en el input).
* Poner **`alt` descriptivo** en imágenes informativas (y no dejarlo vacío salvo decorativas).

(Otras válidas: jerarquía de headings correcta, botones con texto claro, `lang="es"`, etc.)

---

## Pregunta 4 – JavaScript en el navegador (1 punto)

### 4.1 `==` vs `===` (corregido)

* `==` compara con **conversión de tipos** (coerción).
* `===` compara **tipo y valor** sin convertir.
  Ejemplo:

```js
"1" == 1   // true
"1" === 1  // false
```

---

### 4.2 NaN y undefined (mejor redactado)

* **NaN:** “Not a Number”; valor numérico especial que indica que el resultado **no es un número válido** (`Number("hola")` da NaN).
* **undefined:** valor de una variable **no inicializada** o de una propiedad inexistente.

---

### 4.3 Código del botón

**a) ¿Qué imprime con un click?**
Imprime **dos líneas**:

* `Click 1`
* `Click 2`

**b) Por qué es preferible `addEventListener`**
Porque permite **varios listeners** sin sobrescribir, se puede **quitar** con `removeEventListener`, y soporta opciones como captura/once. Con `onclick` puedes **pisar** un handler anterior.

---

### 4.4 `defer` y `async`

* **Ambos** descargan el script en paralelo mientras se parsea HTML.
* **async:** ejecuta el script **en cuanto termina de descargarse**, **sin respetar orden** y puede interrumpir el parseo.
* **defer:** ejecuta **al final del parseo**, **en orden**, antes de `DOMContentLoaded`.

---

## Pregunta 5 – Node.js, JSON y Express (1 punto)

### 5.1 JS en navegador vs en Node.js

* En **navegador**: JS tiene APIs del navegador (**DOM**, `window`, eventos de UI, etc.).
* En **Node.js**: JS corre en el servidor; no hay DOM, pero hay APIs del sistema (**fs**, red, procesos, etc.) y se usa para backend.

---

### 5.2 JSON: tipos válidos + validez de ejemplos

**Tipos válidos en JSON (7):** `string`, `number`, `object`, `array`, `true`, `false`, `null`.

Ejemplos:

* a) `true` ✅ válido
* b) `{ name: "Ana", "age": 20 }` ❌ inválido (clave sin comillas)
  ✅ correcto:

  ```json
  { "name": "Ana", "age": 20 }
  ```
* c) `["rojo", "verde", , "azul"]` ❌ inválido (hueco)
  ✅ correcto:

  ```json
  ["rojo", "verde", "azul"]
  ```
* d) `{"ok": true, "data": [1, 2, 3]}` ✅ válido

---

### 5.3 package.json y package-lock.json

* **package.json:** metadatos del proyecto (nombre, versión), **scripts**, y dependencias (dependencies/devDependencies).
* **package-lock.json:** fija el **árbol exacto** de dependencias y versiones para instalaciones reproducibles.

---

### 5.4 Variable de entorno en Node.js + ejemplo

Es un valor de configuración que viene del **entorno del sistema** (sin hardcodearlo en el código), accesible en Node con `process.env`.

Ejemplo:

```js
const PORT = process.env.PORT || 3000;
```

---

### 5.5 Event loop en Node.js

Es el mecanismo que permite a Node (monohilo en JS) gestionar **muchas operaciones** sin bloquear: ejecuta el código, y cuando terminan operaciones asíncronas (I/O, timers), mete sus callbacks en la cola para ejecutarlos cuando toca.

