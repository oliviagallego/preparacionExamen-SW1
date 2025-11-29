# Ejercicio X – Servidor de logs del sistema

- Crea un servidor en **Node.js**.

- El servidor deberá leer al iniciar un fichero de configuración `config.json` donde se indique:
  - Puerto de escucha del servidor.
  - Intervalo (en segundos) al que se tomarán las medidas.
  - Nombre del fichero de log donde se guardará la información.

- Que al iniciar muestre por consola la siguiente información:
  - Versión de Node.js.
  - Plataforma y arquitectura del sistema (`linux`, `win32`, `darwin`, `x64`, `arm`, …).
  - Directorio actual de trabajo del proceso.

- De forma **periódica**, según el intervalo definido en el fichero de configuración, deberá:
  - Calcular un porcentaje aproximado de memoria usada por el proceso de Node.js  
    (por ejemplo a partir de `heapUsed` y `heapTotal`).
  - Obtener el número de CPUs del sistema.
  - Añadir una línea al fichero de log con la siguiente información:
    - Fecha y hora actuales.
    - Porcentaje de memoria usada.
    - Número de CPUs.
  - Formato sugerido de cada línea:  
    `YYYY-MM-DD HH:MM:SS - MEM: XX.X% - CPUS: N`

- El servidor HTTP deberá exponer al menos las siguientes rutas:

  - `GET /`  
    - Responde con un mensaje indicando que el servidor de logs está activo y cómo consultar la última medida registrada.

  - `GET /last`  
    - Lee el fichero de log y devuelve **solo la última línea** registrada (puede devolverse como texto plano o en formato JSON).

- Toda la información periódica (intervalo, nombre del fichero de log y puerto de escucha) debe ser **configurable exclusivamente** a través del fichero `config.json`, sin modificar el código fuente.
