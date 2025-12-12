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

