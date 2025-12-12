# JavaScript – Posibles PREGUNTAS TEÓRICAS y EJERCICIOS PRÁCTICOS

Este documento recoge posibles **preguntas teóricas** y **ejercicios prácticos** de JavaScript para un examen tipo “Sistemas Web I”.


## 1. Posibles PREGUNTAS TEÓRICAS de JavaScript

### 1.0. Para qué sirve JS

- ¿Para qué sirve JavaScript en una página web? Compáralo con **HTML** y **CSS**.  
    - HTML define la estructura y el contenido (títulos, párrafos, formularios, imágenes…).
    - CSS define la presentación y el diseño (colores, tamaños, posiciones, márgenes…).
    - JavaScript añade el comportamiento dinámico e interactivo: permite responder a acciones del usuario y cambiar el contenido de la página sin recargarla (mostrar/ocultar cosas, validar formularios, actualizar datos, etc.).
- Explica **3 cosas** que se pueden hacer con JS en el navegador (ejemplos concretos). 
    - Mostrar/ocultar cosas, validar formularios, animaciones.
- ¿Qué es el **“motor”** de JS? Pon un ejemplo (por ejemplo **V8**) y dónde se usa.  
    - El motor de Js es el servidor que nos permite navegar en la web, por ejemplo Chrome.


### 1.1. Cómo se mete JS en una página + `defer` / `async`

- Enumera las **dos formas básicas** de incluir JS en una página HTML y pon un ejemplo de cada una. 
    - podemos incluirlo al final del `<body>` poniendo `<script src= "documento.js">` 
    - o lo podemos incluir en el `<head>` si usamos asyn o defer.
- ¿Por qué `<script>` no es una etiqueta vacía? ¿Qué error común puede cometerse?  
    - No es una etiqueta vacía por q debe abrirse y cerrarse y siempre debe contener el código js ya sea llamando a un archivo js o escribiendolo dentro.
    - Error común sería no cerrarlo: `</script>` 
- ¿Qué problema hay en poner muchos `<script>` grandes al principio del `<head>` sin `defer` / `async`?  
    - El problema es que se ejecutaria antes de que el HTML se cargara. Pero si ponemos `defer` o `async` se ejecutaria en paralelo.El navegador se para de parsear el HTML para descargar y ejecutar cada script.
Eso retrasa que se vea el contenido de la página (la página tarda más en mostrarse).

Además, el JS puede intentar acceder a elementos del DOM que todavía no existen.
- Explica la diferencia entre `defer` y `async`:
  - ¿Cuándo se descarga el script?
    - El script se descarga en paralelo al HTML en los dos casos.
  - ¿Cuándo se ejecuta?
    - En `async` se ejecuta en cuando está listo, aunque el HTML no esté del todo terminado.
    - En `defer` se ejecuta cuando el HTML ya está parseado
  - ¿Se respeta el orden entre varios scripts? 
    - En `async` no se respeta el orden.
    - En `defer` se respeta el orden en el q aparecen los scripts en el HTML. 
- *Pregunta típica:* «¿Por qué es buena idea usar `defer`?» 
    - Usamos `defer`para que el JS no bloquee la carga del HTML y se ejecute cuando el DOM ya esté liso.



### 1.2. `alert` / `prompt` / `confirm` / `console.log`

- ¿Para qué sirve cada una: `alert`, `prompt`, `confirm`, `console.log`? ¿Qué devuelven?  
    - alert: enseña un mensaje y el usuario solo le puede dar a aceptar. 
        - Devuelve: undefines
    - prompt: sirve para enseñar un mensaje con un bloque de texto para comunicarnos con el usuario.
        - Devuelve: un string o null
    - confirm: enseña un menasaje y el usuario debe darle a true o false.
    - console.log: sirve para enseñar mensajes por consola.
        - Devuelve: undefined.
- ¿Por qué no se recomienda usar `alert` / `prompt` / `confirm` en producción? ¿Qué se usa para **depurar**?  
    - No se recomiendan en producción por que llenan la pantalla de informacion inecesaria.
    para depurar se usa console.log

### 1.3. Sentencias y punto y coma

- ¿Qué es una **“sentencia” (statement)** en JS? Pon **2 ejemplos**.  
    - Una sentencia (statement) en JavaScript es una instrucción completa que el intérprete puede ejecutar.
    Es decir, una línea (o bloque) de código que hace algo: declarar una variable, ejecutar un if, llamar a una función, etc.
- ¿Qué es la **Automatic Semicolon Insertion**?  
    - La Automatic Semicolon Insertion (ASI) es una característica del lenguaje por la cual el motor de JavaScript añade puntos y coma automáticamente en algunos sitios donde faltan, según unas reglas (fin de línea, cierre de bloque, etc.), para intentar corregir el código.
- ¿Por qué el profesor recomienda escribir siempre `;` al final?  
    - Evitamos errores sutiles, el codigo será más claro.
- Te dan un ejemplo tipo:  

  ```js
  alert("Hola")
  [1,2].forEach(alert)
  ```

Explica qué problema puede ocurrir aquí.
 ```js
  alert("Hola");
  [1,2].forEach(alert);
  ```
Podemos añadir `;` para q no se junten las dos lineas y quede claro.

### 1.4. Variables: `let`, `const`, `var`

* Diferencias entre `let` y `const`. Pon un ejemplo de cada uno.
    - `let`: el valor de la variable puede cambiar
    - `const`: el valor no cambia.
* ¿Por qué el profesor dice “olvídate de `var`”? Cita al menos **2 problemas** de `var`.
    - `var` es una variable que se puede usar antes de ser declarada, no tiene scope de bloque y se puede reescribir
* Explica qué significa **“scope de bloque”**.
    - Es q una variable que se declare dentro de un bloque, por ejemplo un bucle for, no existe fuera de el.
* ¿Qué es el **hoisting** en el caso de `var`? Ilústalo con un ejemplo sencillo.
    - hoisting: qu ese puede usar antes de ser declaradas pero lleva a bugs


### 1.5. Tipos, `NaN`, conversiones, `+` con strings

* Enumera los tipos básicos de JS que ha visto el profesor:
  `number`, `string`, `boolean`, `null`, `undefined` (y menciona `NaN`, `Infinity`).
* ¿Qué es `NaN`? Pon un ejemplo de operación que lo produzca.
    - NaN quiere decir "Not  a Number", y se usa en las comprobaciones de mensajes recibidos por pantalla o por ejemplo en una operacin numerica rara: "true"/2.
* Diferencia entre `null` y `undefined` (intención vs. “aún no tiene valor”).
    - null es un valor vacio mientras undefined es q no tiene todavia valor.
* Explica qué hace `String(...)`, `Number(...)`, `Boolean(...)` sobre distintos valores (por ejemplo `"23"`, `""`, `"0"`, `0`, `1`, `null`, `undefined`).
    -  Esos metodos se usan para convertir datos a string, numeros o boolean.
    - `String("23")`= 23, `String("")` =null, `String("0")`= 0, `String(0)`=null, `String(1)`= 1, `String(null)`=null, `String(undefined)`= undefined.
    - `Number("23")`= 23, `Number("")` =0, `Number("0")`= 0, `Number(0)`=0, `Number(1)`= 1, `Number(null)`=NaN, `Number(undefined)`=NaN.
    - `Boolean("23")`= true, `Boolean("")` =false, `Boolean("0")`= true, `Boolean(0)`=false, `Boolean(1)`= true, `Boolean(null)`=false, `Boolean(undefined)`=false.
* Pregunta tipo test: ¿Cuál es el resultado de `Boolean("0")`, `Boolean("")`, `Number("hola")`?
    - `Boolean("0")`= true, `Boolean("")`=false, `Number("hola")`=NaN
* ¿Por qué hay que ir con cuidado con el operador `+` mezclando strings y números? Pon **3 ejemplos**.
    - Por que depende de donde lo ponas sale una cosa u otra por pantalla:
    console.log(2+3); //5
    console.log("2" + 3); //23
    console.log(3+ "2"); //5
    console.log(+"3"+ "2"); //32


### 1.6. Comparaciones + `==` vs `===`

* ¿Qué **operadores de comparación** existen en JS?
    - <, >, <=, >=, ===, ==, !==
* Explica por qué `==` puede dar sorpresas. Pon **3 ejemplos**.
* ¿Qué diferencia hay entre `==` y `===`?
    - == : es para comparar
    - === : es equivalente
* ¿Por qué se recomienda usar siempre `===` y `!==`?
    - Porque no hacen conversión de tipo automática, el resultado es: más predecible, más fácil de razonar, menos bugs raros.
* Preguntas tipo:

  * ¿Qué devuelve `"2" == 2`? true
  * ¿Y `"2" === 2`? false
  * ¿Y `null == undefined` --> true / `null === undefined`--> false? 
* ¿Cómo se comparan las cadenas de texto en JS? ¿Qué significa que sea **lexicográfico / orden Unicode**?
    - En JS, cuando comparas strings con <, >, <=, >=

### 1.7. Condicionales y bucles

* Sintaxis básica de `if` / `else if` / `else`.
* ¿Cuándo es útil `switch` en lugar de varios `if`?
    - Cuando queremos tener muchos casos diferentes dependiendo de la respuesta (predecible) del usuario. Por ejemplo en una calculadora. 
* Diferencias entre `for`, `while` y `do...while`.
* ¿Qué hace `break` y `continue`?
* ¿Qué diferencia hay entre `for`, `for...of` y (si lo ha visto) `for...in`? ¿Para qué usarías cada uno?


### 1.8. Funciones, arrow functions, scope y `this` (nivel que haya dado)

* Sintaxis de una **función normal** y de una **arrow function**.
    - Funcion normal: 
    ```
    function sum(a,b){
        return a+b;
    }
    ```
    - Funcion arrow: 
    ```
    const sum = (a,b) => a+b;
    ```
* Diferencias importantes entre función normal y arrow (`this`, no `arguments`...).
    - Las arrow functions tienen sintaxis más corta, no tienen su propio this ni arguments, y no sirven como constructores. El this de una arrow es el del contexto donde se definió.
* ¿Qué es un **parámetro con valor por defecto**?
    - Es un parámetro al que le damos un valor inicial en la definición de la función, que se usa si el llamador no pasa nada (o pasa undefined).

### 1.9. Arrays y objetos

* ¿Cómo se crea un array en JS? ¿Cómo se accede al **primer** y **último** elemento?
    - const nums = [10, 20, 30];
    - Primer elemento: nums[0]
    - Último elemento: nums[nums.length - 1]

* Métodos básicos de `Array`: `push`, `pop`, `length`, etc. (a nivel de explicar qué hacen).
    - array.length → número de elementos.
    - array.push(elem) → añade al final. Devuelve la nueva longitud.
    - array.pop() → quita y devuelve el último elemento.
    - array.unshift(elem) → añade al principio.
    - array.shift() → quita y devuelve el primer elemento.
* ¿Qué es un **objeto literal**? Sintaxis general `{ clave: valor, ... }`.
    - Un objeto literal es un objeto que escribimos directamente con {} en el código, con pares clave: valor.
* Diferencia entre acceder con `obj.prop` y `obj["prop"]`.
    - obj.prop
        - La propiedad es un identificador válido (sin espacios, sin empezar por número)
        - El nombre es fijo en el código.
    - obj["prop"]
        - La clave es una cadena → puede venir de una variable o tener espacios.

* ¿Cómo recorres un array? ¿Y cómo recorres las propiedades de un objeto? (mencionar `for`, `for...of`, `for...in`, `Object.keys`).


### 1.10. DOM + eventos

* ¿Qué es el **DOM**? ¿Qué representa?

* Diferencias entre `document.getElementById`, `querySelector` y `querySelectorAll`.
* Explica cómo cambiar el texto de un elemento con id `mensaje` usando JS.
* ¿Qué es un **manejador de eventos**? Diferencia entre `element.onclick = ...` y `addEventListener`.
* Nombra **3 eventos de teclado** y **3 de ratón**. ¿Qué información trae el objeto `event`?
* ¿Para qué sirve `event.preventDefault()` en el **submit** de un formulario?


### 1.11. Canvas + `setTimeout` / `setInterval` / `requestAnimationFrame`

* ¿Qué es `<canvas>`? ¿Se dibuja solo o hace falta JS?
* Explica el **patrón típico de animación** con `requestAnimationFrame`.
* Diferencias entre `setTimeout`, `setInterval` y `requestAnimationFrame`. ¿Cuál es mejor para animaciones y por qué?



### 1.12. Callbacks

* ¿Qué es una **función callback**? Pon un ejemplo con `setTimeout` o `forEach`.
* ¿Qué problema se conoce como **“callback hell”**?



### 1.13. Strict mode

* ¿Qué hace `"use strict"` en un fichero JS?
* Pon un ejemplo de algo que da error en strict mode y no en modo normal (usar variable sin declarar).



### 1.14. Módulos (`import` / `export`)

* ¿Para qué sirven los **módulos** en JS?
* Explica brevemente cómo se declara un módulo en HTML (`<script type="module">`).
* Diferencia entre `export` y `import`. Pon un ejemplo de cada.
* ¿Por qué los módulos están siempre en **modo estricto**? ¿A dónde van las cosas importadas (global o no)?



### 1.15. Clases

* ¿Qué es una **clase** en JS? ¿Para qué sirve `constructor`?
* Diferencia entre **campo de instancia**, campo **estático** (`static`) y campo **privado** (`#id`).
* Explica qué hace `extends` y `super()` en una **clase hija**.
* ¿Qué son los **getters y setters** (`get` / `set`) en una clase?



### 1.16. Ajax, Promesas, `fetch`, `async/await`

* ¿Qué es **Ajax** (a nivel conceptual)? ¿Qué es `XMLHttpRequest`?
* ¿Qué es una **Promesa** en JS? Enumera sus **3 estados** típicos.
* Explica la diferencia entre usar **callbacks anidados** y usar `.then().catch()`.
* ¿Para qué sirve `Promise.all`? ¿Qué pasa si una promesa falla?
* ¿Qué hace `fetch`? ¿Sobre qué está basado internamente?
* Escribe con palabras el flujo típico de `fetch`: **petición GET, procesar texto, manejar errores**.
* ¿Qué ventaja tiene `async/await` frente a usar solo `.then()`?
* ¿En qué contexto puedes usar `await`? ¿Qué pasa si lo usas fuera?



## 2. Posibles EJERCICIOS PRÁCTICOS de JavaScript

Ahora ejercicios como los que pondría tu profe en papel.


### 2.1. Lectura de código y salida

#### Comparaciones y tipos

Te da código como:

```js
console.log("2" == 2);
console.log("2" === 2);
console.log(null == undefined);
console.log(null === undefined);
console.log(Boolean("0"), Boolean(""));
```

Pide: **escribe la salida** y explica brevemente cada línea.

#### Coerciones raras

```js
let a = "4" + 2;
let b = 4 + 2 + "px";
let c = "10" - 3;
let d = "hola" / 2;
console.log(a, b, c, d);
```

* Escribir resultado de `a`, `b`, `c`, `d` y **tipo** de cada uno.

#### Arrays y objetos

```js
const alumnos = [
  { nombre: "Ana", nota: 9 },
  { nombre: "Luis", nota: 4 },
  { nombre: "Marta", nota: 7 },
];

let suma = 0;
for (const alumno of alumnos) {
  suma = suma + alumno.nota;
}
const media = suma / alumnos.length;
console.log(media);
```

Preguntas:

a) ¿Qué se imprime?
b) ¿Qué tipo de estructura es `alumnos`? (array de qué)
c) Reescribe el bucle con `for` clásico.

---

### 2.2. Encontrar y corregir errores

#### Errores con `var` / `let` / `const`

Te da:

```js
if (true) {
  var x = 5;
}
console.log(x);

const PI;
PI = 3.14;
```

* Señala los errores (de estilo o de ejecución) y corrige usando `let` / `const`.

#### Errores con punto y coma y comparación

```js
let x = 3
if (x = 5) {
  console.log("Cinco");
}
```

a) ¿Qué hace realmente este código?
b) Corrige para que compare correctamente con 5 y usa `===`.

#### Errores en JSON

```json
{
  "nombre": "Ana",
  "edad": 23,
  "aprobado": "true",
  "hobbies": ["leer", "cine", ],
}
```

* Encuentra y corrige los errores para que sea JSON válido (y con tipos lógicos).

---

### 2.3. Escribir funciones sencillas

#### Clasificar notas

Escribe una función `califica(nota)` que reciba un número y devuelva:

* `"Sobresaliente"` si `nota >= 9`
* `"Notable"` si `nota >= 7`
* `"Aprobado"` si `nota >= 5`
* `"Suspenso"` en otro caso.

#### Filtrar aprobados

Dado un array `alumnos` con objetos `{ nombre, nota }`, escribe un fragmento de código que muestre por consola **solo los nombres** de los alumnos con `nota >= 5`.

#### Contar elementos

Dado un array de números, escribe un bucle que cuente cuántos son **pares** y cuántos **impares**.

---

### 2.4. DOM + eventos (en papel)

#### Click y mostrar texto

Escribe el código JS (sin HTML) para:

* Leer el valor de un `<input id="nombre">`.
* Cuando se pulse un botón con id `"btn"`, mostrar `“Hola, NOMBRE”` en un `<p id="saludo">`.

#### Validar formulario

En un formulario de login, si el usuario deja vacío el campo contraseña, **evita el envío** del formulario y muestra un mensaje `“La contraseña es obligatoria”`.

---

### 2.5. Canvas + animaciones (nivel entender)

#### Entender código canvas

Te da algo como:

```js
const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

let x = 0;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(x, 10, 50, 50);
  x = x + 2;
  requestAnimationFrame(draw);
}

draw();
```

a) Explica qué hace este código a nivel **visual**.
b) ¿Qué pasaría si en vez de `requestAnimationFrame` usáramos `setInterval(draw, 16)`?

---

### 2.6. Callbacks, strict mode, módulos

#### Callback simple

Escribe una función `esperaYSaluda(ms)` que reciba un número de milisegundos y, usando `setTimeout`, muestre por consola `"Hola"` después de ese tiempo.

#### Strict mode

Reescribe un pequeño script añadiendo `"use strict";` al principio y corrige las líneas que fallarían, por ejemplo variables sin `let` / `const`.

#### Módulos

Te pide que escribas:

* Un fichero `math.js` que exporte una función `suma(a,b)`.
* Un fichero `main.js` que la importe y la use para mostrar `suma(2,3)` por consola.

---

### 2.7. Clases

#### Clase `Rectangle`

Define una clase `Rectangle` con:

* Propiedades `height` y `width`.
* Un método `getArea()` que devuelva el área.

Crea un objeto y muestra su área.

#### Herencia

Crea una clase `Animal` con propiedad `name` y una clase `Dog` que extienda de `Animal`. En el constructor de `Dog` llama a `super(name)` y añade una propiedad `breed`.

---

### 2.8. Promesas, `fetch`, `async/await`

#### Explicar `then` / `catch`

Te dan:

```js
fetch("diccionario.txt")
  .then(response => response.text())
  .then(text => {
    const palabras = text.split("\n");
    console.log(palabras.length);
  })
  .catch(err => console.error(err));
```

a) Explica paso a paso qué hace este código.
b) ¿Qué se está haciendo en el `.catch`?

#### Reescribir con `async/await`

Reescribe el ejercicio anterior usando `async function` y `await`.

#### Promise simple

Define una función `wait(ms)` que devuelva una promesa que se resuelva tras `ms` milisegundos, y úsala para imprimir `"Ha pasado 1 segundo"`.
