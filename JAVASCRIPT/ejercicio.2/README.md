Esta página web (https://laboro-spain.blogspot.com/2024/09/despido-primer-dia-trabajo.html) evita que seleccionemos el texto desde el segundo párrafo: 

- ¿Qué está pasando?
En esa página han puesto una capa transparente (“div”) por encima del texto a partir de cierto punto (más o menos desde el segundo párrafo).

Esa capa está encima del texto con position: absolute/fixed y z-index alto.

Cuando mueves el ratón, en realidad no estás tocando el texto, sino esa capa transparente.

Como esa capa no tiene texto seleccionable, no puedes marcar nada con el ratón.

Es un truco típico para impedir que la gente seleccione y copie el texto usando solo el ratón.

- ¿Cómo lo evitamos?
Para el ejercicio, lo que interesa es la idea general, no que lo hagas todos los días:

Abrir las herramientas de desarrollador (F12).

Usar el icono de selección de elementos y pasar el ratón por la zona donde ya no se puede seleccionar.

Verás un <div> enorme (o similar) que cubre el artículo.

Puedes:

Borrar ese <div> desde el inspector (Supr), o

Desactivar las reglas CSS que le dan tamaño/posición (position, top, height, z-index…).

En cuanto quitas esa capa, el ratón vuelve a “tocar” el texto real y ya se puede seleccionar.

Otra opción genérica para este tipo de trucos es desactivar JavaScript para esa página y recargar: muchas veces es JS quien inserta esa capa.

- ¿Por qué no aparece el cursor de seleccionar texto?
Porque el puntero no está realmente sobre un elemento de texto, está sobre la capa transparente.

El navegador piensa: “estoy encima de un div vacío” → cursor normal de flecha.

Si estuviera encima de un <p> con texto, mostraría el cursor de texto y permitiría seleccionar.

Como toda la zona está tapada por ese div, nunca llegas a “tocar” el párrafo, por eso no hay cursor de selección ni se marca nada.