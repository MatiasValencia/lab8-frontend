# AutoGestión — Frontend del Laboratorio 8

Aplicación de demostración desarrollada con React, TypeScript y Vite para explorar y administrar listas de automóviles y clientes. Permite agregar, editar y eliminar registros durante la sesión, y alternar entre tema claro y oscuro.

> **Importante:** este frontend todavía no está conectado a un backend ni a una API. Los registros son temporales y se pierden al recargar la página. Para probar la sección de clientes, utiliza únicamente datos ficticios.

## 1. Antes de comenzar

Verifica que tu equipo tenga:

- **Node.js 22.12 o posterior** (incluye npm). Puedes comprobar las versiones desde una terminal:
  ```bash
  node --version
  npm --version
  ```
- **Git**, si aún no tienes una copia local del repositorio:
  ```bash
  git --version
  ```
- Un navegador web actualizado.

Si no tienes Node.js, instala una versión LTS desde [nodejs.org](https://nodejs.org/). Git se puede instalar desde [git-scm.com](https://git-scm.com/). Después de instalar cualquiera de estas herramientas, abre una terminal nueva y vuelve a comprobar sus versiones.

## 2. Descargar e instalar el proyecto

1. Clona el repositorio y entra en la carpeta del proyecto:
   ```bash
   git clone https://github.com/MatiasValencia/lab8-frontend.git
   cd lab8-frontend
   ```

   Si ya tienes el proyecto, abre una terminal en su carpeta y continúa con el paso siguiente.

2. Instala las dependencias definidas en el archivo de bloqueo:
   ```bash
   npm ci
   ```

   Espera a que termine el comando antes de iniciar la aplicación.

## 3. Ejecutar la aplicación

1. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
2. Abre en el navegador la dirección que indique Vite; normalmente es [http://localhost:5173](http://localhost:5173).
3. Desde la página de inicio, selecciona **Lista de automóviles** o **Lista de clientes**. Puedes crear, editar o eliminar registros y cambiar el tema con el control de la barra superior.
4. Para detener el servidor, vuelve a la terminal y presiona **Ctrl+C**.

## 4. Ejecutar las pruebas

En una terminal ubicada en la carpeta del proyecto, ejecuta:

```bash
npm test
```

Este comando ejecuta las pruebas automatizadas una vez con Vitest. Cubren la página de inicio, la navegación y el tema, además de los formularios y operaciones de las listas de automóviles y clientes.

## Otros comandos útiles

- `npm run lint`: revisa el código con ESLint.
- `npm run build`: verifica los tipos de TypeScript y genera la versión de producción en `dist/`.
- `npm run preview`: sirve localmente la compilación de producción; ejecútalo después de `npm run build` y abre la dirección que indique Vite.
