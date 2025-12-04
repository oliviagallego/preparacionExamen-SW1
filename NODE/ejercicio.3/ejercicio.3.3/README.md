
- Crea un servidor en node.js.
- Que al cargar la página principal (/) muestre un nombre de usuario sugerido (username) generado automáticamente.
- El username se generará concatenando X palabras aleatorias de un diccionario y un número final.
    - Ejemplos de salida:
        sol-luna-123
        gato-perro-arbol-42
- El número de palabras (X) se indicará como parámetro en la query:
    - http://localhost:3000/?x=2 → 2 palabras + número, p.ej. nube-rio-57
    - http://localhost:3000/?x=4 → 4 palabras + número
- Si el parámetro x no está presente o no es válido (no es un número o es ≤ 0), se usará un valor por defecto de 3 palabras.
- El diccionario de palabras puede estar:
    - en un fichero diccionario.json, o
    - en un array dentro de server.js.

- Para cualquier ruta distinta de /, el servidor debe responder con 404 Not Found.