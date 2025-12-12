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