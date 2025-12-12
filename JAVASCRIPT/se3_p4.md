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
