# SISTEMAS WEB I – Examen (versión “año pasado” reconstruida)

**Duración:** 2 horas
**Material:** solo enunciado y bolígrafo
**Estructura:**

* Parte A – Teoría (4 preguntas) – 4 puntos
* Parte B – Práctica (4 ejercicios) – 6 puntos


## PARTE A – TEORÍA (4 puntos)

### Pregunta 1 – Aplicaciones web y servicios web (1 punto)

- a Define con tus palabras:

1. **Aplicación web**
2. **Servicio web**

- b Indica **dos ventajas y dos inconvenientes** de las aplicaciones web frente a aplicaciones de escritorio.

- c Explica **una diferencia importante** entre una aplicación web y un servicio web.


### Pregunta 2 – HTTP (1,5 puntos)

- a ¿Qué es HTTP? Explica brevemente sus características principales (al menos: capa, modelo petición–respuesta, “stateless”).
- b Indica qué es una **URL** y escribe la **estructura general** de una URL, nombrando sus partes (esquema, host, puerto, ruta, query, fragmento).

- c Completa la siguiente tabla de **métodos HTTP** (no hace falta rellenar todo, pero sí como mínimo 4 métodos):

| Método | ¿Modifica el estado del servidor? (sí/no) | ¿Es safe? (sí/no) | ¿Es idempotente? (sí/no) | Uso típico (1 frase) |
| ------ | ----------------------------------------- | ----------------- | ------------------------ | -------------------- |
| GET    |                                           |                   |                          |                      |
| POST   |                                           |                   |                          |                      |
| PUT    |                                           |                   |                          |                      |
| DELETE |                                           |                   |                          |                      |

- d Clasifica los códigos HTTP en sus **5 familias** (1xx, 2xx, 3xx, 4xx, 5xx) y escribe **dos ejemplos concretos para cada familia**, indicando qué significa cada uno.
Ejemplo de formato: `404 Not Found: el recurso solicitado no existe`.


### Pregunta 3 – Accesibilidad y CI/CD (1 punto)

- a Define **accesibilidad web** y explica por qué es importante.
- b Indica **dos buenas prácticas** de accesibilidad (por ejemplo, relacionadas con HTML, diseño, texto alternativo…).

- c Explica qué significan las siglas **CI/CD** y define brevemente:

* Continuous Integration
* Continuous Delivery
* Continuous Deployment

- d Indica una **ventaja** de usar CI/CD en el desarrollo de aplicaciones web.


### Pregunta 4 – JS, Node, JSON (0,5 puntos)

- a Explica la diferencia entre incluir un script con los atributos `defer` y `async` en HTML.
- b Explica la diferencia entre `var` y `let` en JavaScript.

- c En Node.js, ¿qué significa un número de versión `MAJOR.MINOR.PATCH`?

* ¿En qué tipo de cambio subirías `MAJOR`?
* ¿En qué tipo de cambio subirías `MINOR`?
* ¿En qué tipo de cambio subirías `PATCH`?

- d ¿Qué es una versión **LTS** de Node.js?

- e A partir del siguiente texto, escribe un **JSON válido**:

> En una academia hay un curso llamado “Sistemas Web I” con 6 créditos.
> Hay dos estudiantes matriculados:
>
> * Ana (edad 20)
> * Luis (edad 22)
>   El curso tiene un profesor llamado “María López”.

Representa toda esta información en un único objeto JSON.


## PARTE B – PRÁCTICA (6 puntos)

Se quiere desarrollar, con **Node.js + Express + EJS**, una pequeña aplicación para gestionar cursos y estudiantes.

Se proporciona la siguiente “base de datos” en un fichero `db.js`:

```js
// db.js
const database = {
  courses: [
    {
      id: "sw1",
      name: "Sistemas Web I",
      credits: 6,
      students: [
        { id: "u1", name: "Ana", age: 20 },
        { id: "u2", name: "Luis", age: 22 }
      ]
    },
    {
      id: "bd",
      name: "Bases de Datos",
      credits: 6,
      students: [
        { id: "u3", name: "Carlos", age: 21 }
      ]
    }
  ]
};

module.exports = database;
```

Y el fichero principal `app.js`:

```js
// app.js
const express = require('express');
const path = require('path');
const database = require('./db');

const app = express();
const PORT = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

// TODO: aquí irán las rutas

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
```

En la carpeta `views/` existe un fichero `index.ejs` vacío y un fichero `course.ejs` también vacío.

### Ejercicio 5 – Listado de cursos (1,5 puntos)

* a- Escribe en `app.js` la ruta GET `/` que:

1. Obtenga de `database.courses` la lista de cursos.
2. Renderice la vista `index.ejs` pasando un objeto con la lista de cursos con la clave `courses`.

(basta con escribir el código de la ruta dentro de `app.js`).

* b- Escribe el contenido mínimo de `views/index.ejs` para que se muestre:

* Un título `<h1>`: “Listado de cursos”.
* Una lista en HTML (`<ul>`) donde cada elemento muestre el **nombre** del curso y sus **créditos** con el formato:
  `Sistemas Web I (6 créditos)`.

Puedes usar EJS como prefieras (`<% %>`, `<%= %>`, etc.).


### Ejercicio 6 – Detalle de un curso (1,5 puntos)

Queremos una ruta que muestre la información detallada de un curso y sus estudiantes.

* a- Escribe en `app.js` la ruta GET `/course/:id` que:

1. Busque en `database.courses` el curso cuyo `id` coincida con `req.params.id`.
2. Si no existe, responda con código de estado **404** y un mensaje de texto sencillo.
3. Si existe, renderice la vista `course.ejs` pasando el curso encontrado bajo la clave `course`.

* b- Escribe el contenido mínimo de `views/course.ejs` para que se muestre:

* Un `<h1>` con el nombre del curso.
* Un párrafo con los créditos.
* Una tabla HTML con las columnas: ID, Nombre, Edad, donde aparezcan los estudiantes del curso.

(Puedes suponer que siempre que llegas a la vista, `course.students` es un array de objetos con `id`, `name`, `age`).


### Ejercicio 7 – Comprender JSON anidado (1,5 puntos)

Observa el siguiente fragmento de JSON (ojo: **JSON**, no JavaScript):

```json
{
  "department": "Informática",
  "courses": [
    {
      "id": "sw1",
      "name": "Sistemas Web I",
      "teacher": {
        "name": "María López",
        "email": "mlopez@example.com"
      }
    },
    {
      "id": "bd",
      "name": "Bases de Datos",
      "teacher": {
        "name": "Juan Pérez",
        "email": "jperez@example.com"
      }
    }
  ]
}
```

* a- ¿Es este un JSON válido? Justifica brevemente tu respuesta.
* b- Escribe una expresión de JavaScript (no hace falta contexto) para acceder al **email del profesor** del curso con índice 0 del array `courses`.
* c- Explica, con tus palabras, la diferencia entre:

* Un **objeto** JSON
* Un **array** JSON

* d- Reescribe el JSON anterior de manera que:

* El campo `"department"` se llame ahora `"dept"`.
* Además de `name` y `email` del profesor, se añada un campo `"office"` con el valor `"D-201"` para ambos profesores.


### Ejercicio 8 – HTML con errores (1,5 puntos)

Se proporciona el siguiente fragmento de HTML que se usará como plantilla de una vista:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Datos curso</title>
  <body>
    <h1>Datos curso<h1>
    <img src="img/curso.png"></img>
    <ul>
      <li id="course">Nombre curso: Sistemas Web I</li>
      <li id="course">Créditos: 6</li>
    </ul>
  </body>
</html>
```

* a- Encuentra **al menos 4 errores o malas prácticas** en este HTML (pueden ser de estructura, cierre de etiquetas, atributos, accesibilidad…).
* b- Reescribe el fragmento corregido, aplicando buenas prácticas mínimas (por ejemplo: uso correcto de `alt` en imágenes, IDs únicos, cierre correcto de etiquetas, etc.).
