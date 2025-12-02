- Crea un servidor en node.js.

- Que al cargar la página principal (/) muestre una frase motivacional aleatoria.

- La frase debe generarse a partir de X frases base almacenadas en un “diccionario” (puede ser un array en el código o un fichero JSON).

- El número de frases (X) que se concatenan se indicará como parámetro en la query:

    - Ejemplo:

    http://localhost:3000/?x=1 → muestra 1 frase aleatoria

    http://localhost:3000/?x=3 → muestra 3 frases aleatorias unidas con espacios

- Si el parámetro x no está presente o no es válido (no numérico, <= 0), se usará un valor por defecto de 2 frases.

- Para cualquier ruta distinta de /, el servidor debe devolver 404 Not Found.