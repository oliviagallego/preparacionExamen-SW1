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