##Ejercicio – Web scraping de noticias

- Crea un servidor en Node.js
    - Inicializa package.json.
- El servidor deberá, de forma periódica:
    - Descargar el HTML de la portada de una web de noticias (por ejemplo, https://elpais.com o la que quieras).
    - Procesar el HTML para extraer los titulares principales (por ejemplo, los 5 primeros <h2> de noticias).
    - Guardar esos titulares en memoria en un array (o en un fichero, si quieres complicarlo).

- Exponer al menos estas rutas HTTP:
    - GET /
        - Devuelve un mensaje de texto indicando que el servidor de noticias está activo y cómo consultar los titulares.
    - GET /headlines
        - Devuelve la lista de titulares más recientes en formato JSON:
            {
            "updatedAt": "2025-12-03T10:30:00Z",
            "headlines": [
                "Titular 1",
                "Titular 2",
                "Titular 3",
                "Titular 4",
                "Titular 5"
            ]
            }

- Requisitos técnicos:
    - El intervalo de scraping (en milisegundos) y la URL a scrapear deberán leerse de un fichero de configuración (config.json).
    - El scraping se realizará de forma periódica mediante setInterval.
    - *Opcional*: usar algún paquete como cheerio para manipular el DOM y seleccionar los titulares.

- Cuidado:
    - No hagas demasiadas peticiones en poco tiempo (elige un intervalo razonable, por ejemplo, 30–60 segundos).
    - Algunas webs pueden cambiar su estructura HTML; intenta que tu código sea fácil de ajustar (selector en una constante, etc.).