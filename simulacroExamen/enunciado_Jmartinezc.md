
# EXAMEN PRUEBA — Sistemas Web I — PARTE PRÁCTICA (2 horas, papel)

## Contexto general

Se desea crear una aplicación web mínima con **Node.js + Express + EJS** para gestionar usuarios con roles. La aplicación tendrá un **panel de administración** accesible solo por usuarios con rol **admin**.

La base de datos será **en memoria** (un array u objeto en `app.js` o `database.js`). No es necesario persistir datos en fichero.

---

## Requisitos

La aplicación debe cumplir los siguientes puntos:

1. **Puerto del servidor**
   La aplicación debe iniciar en el puerto indicado por la variable de entorno `PORT` o, si no existe, en el puerto **3000**.

2. **Panel de administración**
   Debe existir un panel accesible únicamente por usuarios con rol **admin** que permita:

   * Visualizar un listado de usuarios.
   * Ver para cada usuario: `username`, `role`, `last_login` (si no existe, mostrar “Never”).
   * Eliminar usuarios (excepto el propio admin).

3. **Login/Logout y control de acceso**

   * Debe existir una pantalla de login.
   * Al hacer login correctamente, debe actualizarse `last_login` con la fecha actual.
   * El usuario logueado debe considerarse el `currentUser` para controlar permisos.
   * Debe existir logout.

> Nota: No es obligatorio usar express-session (puede usarse una variable `currentUser` global), pero el control de acceso debe funcionar.

---

## Estructura del proyecto (se proporciona / se debe respetar)

El proyecto tendrá la siguiente estructura:

```
prueba/
├── public/           # Archivos estáticos (CSS, JS, etc.)
├── views/            # Plantillas EJS
├── app.js            # Archivo principal
├── package.json      # Configuración del proyecto
```

Dependencias mínimas:

* `express`
* `ejs`
* `body-parser` (o `express.urlencoded` si se indica que se permite)

---

# Tareas a completar

## Apartado 1 — Configuración del servidor (1 punto)

En `app.js`, complete:

1. Crear la app de Express.
2. Configurar el **puerto** con `process.env.PORT` o `3000`.
3. Arrancar el servidor con `app.listen(...)` y mostrar un mensaje por consola con el puerto.
4. Configurar EJS como motor de plantillas y la carpeta `views`.
5. Configurar `public` para servir ficheros estáticos.
6. Configurar el parseo de formularios (body-parser o equivalente).

---

## Apartado 2 — Login y logout (1,5 puntos)

Complete:

1. `GET /login`
   Renderiza la vista `login.ejs`.

2. `POST /login`

   * Recibe `username` y `password` del formulario.
   * Busca el usuario en la “base de datos” en memoria.
   * Si las credenciales son correctas:

     * Actualiza `last_login` con la fecha actual (por ejemplo ISO string).
     * Establece el usuario como `currentUser`.
     * Redirige a `/`.
   * Si no son correctas:

     * Muestra un mensaje de error o re-renderiza login con error.

3. `POST /logout`

   * “Desloguea” al usuario (`currentUser = null`).
   * Redirige a `/`.

---

## Apartado 3 — Panel de administración (2 puntos)

Complete:

1. `GET /admin`

   * Solo debe permitir acceso si existe `currentUser` y su `role` es `"admin"`.
   * Si no es admin, redirige a `/`.
   * Si es admin, renderiza `admin.ejs` pasando la lista `users`.

2. `views/admin.ejs`

   * Muestra una tabla con columnas: `Username`, `Role`, `Last Login`, `Actions`.
   * Si `last_login` es `null`/no existe, mostrar `Never`.
   * En `Actions`, para usuarios que **no** sean admin, incluir un formulario para eliminar.

---

## Apartado 4 — Eliminar usuarios (1,5 puntos)

Complete:

1. `POST /admin/deleteUser`

   * Recibe `username` desde un formulario.
   * Solo puede ejecutarse si `currentUser.role === "admin"`.
   * Elimina el usuario de la lista en memoria.
   * Redirige de vuelta a `/admin`.

2. Restricción:

   * No debe permitir eliminar a un usuario con rol `"admin"`.

---

## Apartado 5 — Menú común (opcional / mejora)

Cree un fichero `views/header.ejs` e inclúyalo en las vistas:

* Si hay `currentUser`:

  * Mostrar enlace al panel solo si es admin.
  * Mostrar botón de logout.
* Si no hay usuario:

  * Mostrar enlace a login.

---

## Pruebas mínimas esperadas

* Arrancar en `PORT` o 3000.
* Login como admin permite entrar a `/admin`.
* Login como usuario normal no permite entrar a `/admin`.
* `last_login` se actualiza al iniciar sesión.
* Un admin puede eliminar usuarios no admin.

---

Si quieres, te lo adapto a tu temario real (con **sesiones** en vez de `currentUser`, y con `database.users` como **objeto** tipo el ejemplo login del profe).
