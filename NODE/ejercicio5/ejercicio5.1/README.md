# Ejercicio – Catálogo simple con Express

- Crea un proyecto nuevo usando express-generator con vistas en EJS.
- Modifica la aplicación para que tenga lo siguiente:

1. Página inicial /

- Muestra un listado de productos (o pelis, libros… lo que quieras) que se cargan desde el servidor.
- Cada elemento tendrá al menos:
    - id
    - nombre
    - precio
- Los datos se deberán definir en el servidor (por ejemplo, en un array en routes/index.js) y pasarse a la vista con res.render.

_Ejemplo de lo que debe verse:_
    - Producto 1 – 10€
    - Producto 2 – 25€
    - …
Cada producto tendrá un enlace “Ver detalles” que apunte a /product/:id.

2. Página de detalle /product/:id

- Define una ruta dinámica en Express para /product/:id.
- La ruta deberá:
    - Leer el parámetro id de la URL.
    - Buscar el producto correspondiente en el array del servidor.
    - Renderizar una vista product.ejs mostrando:
        - nombre
        - precio
        - una descripción (puede ser un texto fijo creado en el servidor)
- Si el id no existe, la página debe mostrar un mensaje de “Producto no encontrado”.

3. Formulario de “contacto” o “comentario” en el detalle

- En la vista product.ejs, añade un formulario con:
    - Campo de texto para el nombre del usuario.
    - Textarea para un comentario.
    - Botón “Enviar”.
- El formulario debe mandar un POST a /product/:id/comment.
- Crea la ruta POST /product/:id/comment que:
    - Reciba los datos del formulario.
    - Por simplicidad, NO es necesario guardar nada; puede:
        - Mostrar un mensaje de “Comentario recibido para el producto X”.
        - O redirigir de vuelta a /product/:id mostrando un aviso (opcional).

4. Requisitos técnicos

- Usar express-generator para crear la estructura inicial del proyecto.
- Usar EJS como motor de plantillas.
- Los datos de productos deben definirse en el servidor (no hardcodeados en la vista).
- Usar res.render para pasar datos a las vistas.
- Utilizar al menos:
    - una ruta estática (/)
    - una ruta con parámetro (/product/:id)
    - una ruta POST para manejar el formulario.