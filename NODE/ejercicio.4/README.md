- Extraer datos de páginas web
    - De forma automática haciendo uso de bots
    - Una vez extraída la información se procesa
    - Se repite el proceso a lo largo del tiempo para comparar la evolución de los datos
- _Ejemplos_:
    - Google extrayendo información de las webs para el buscador
    - Internet Archive para conservar webs antiguas
    - Páginas de comparación de precios
- Crea un servidor
    - Inicializa package.json
    - Que descargue periódicamente el HTML de una web
    - Que lo procese para extraer una información específica
    - Opcional: usa algún paquete como cheerio para manipular el DOM
- Cuidado
    - Algunas webs requieren JS para visualizarse
    - No hagas muchas peticiones en poco tiempo

### NOTA:
En el repaso de lo que entraba para el examne no se mencionó como algo importante.
Además hacer esto en papel sería demasiado largo y muy dependiente de probarlo en ordenador.
- _Idea muy sencilla a saber_:
    - Web scraping = programa que descarga HTML de webs automáticamente, extrae datos concretos y lo repite cada cierto tiempo (por ejemplo, para comparar precios o guardar copias de webs).
    - Y que a veces se usa una librería tipo cheerio para tratar el HTML como si fuera DOM.

#### Comienzo del ejercicio por consola:
npm init -y          --> crea package.json rápido
npm install cheerio  --> para manipular HTML
