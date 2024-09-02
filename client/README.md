# 🗂️ Estructura de Carpetas

Una estructura de carpetas bien organizada es esencial para mantener el orden y la claridad en un proyecto de software. A continuación, se describe la organización propuesta para tu proyecto, dividiendo claramente el backend, frontend y archivos estáticos.

## 🌐 Backend (`server`)

La carpeta `server` contiene todo el código relacionado con el backend de la aplicación. Dentro de esta carpeta, se encuentran las siguientes subcarpetas:

- **controllers**: Aquí se alojan los controladores, que manejan la lógica de negocio y la interacción con las rutas.
  
- **db**: Contiene la configuración y los archivos relacionados con la base de datos, como esquemas, migraciones, y conexiones.

- **dto**: Esta carpeta guarda los Data Transfer Objects (DTOs), que son utilizados para transferir datos entre las diferentes capas de la aplicación.

- **routes**: Define las rutas del backend, mapeando las URL a los controladores correspondientes.

## 📁 Archivos Estáticos (`public`)

La carpeta `public` se utiliza para almacenar todos los archivos estáticos de la aplicación, como imágenes, hojas de estilo, scripts, y otros recursos que deben estar disponibles públicamente.

## 🎨 Frontend (`src`)

La carpeta `src` es la raíz del frontend de la aplicación. Está organizada en módulos, componentes reutilizables, hooks, y páginas específicas. A continuación se detallan sus subcarpetas:

- **modules**: Contiene los diferentes módulos de la aplicación, organizando el código por funcionalidades o características específicas.

- **hooks**: Guarda los hooks personalizados que se utilizan a lo largo de la aplicación para manejar lógica reutilizable en componentes funcionales.

- **components**: Incluye todos los componentes reutilizables de la interfaz de usuario, que pueden ser utilizados en diferentes partes de la aplicación.

- **pages**: Agrupa las diferentes páginas de la aplicación, con su estructura interna para organizar componentes y hooks específicos de cada página.

  - **login**
    - **components**: Almacena los componentes específicos utilizados en la página de login.
    - **hooks**: Contiene los hooks específicos que se emplean en la lógica de la página de login.

Esta estructura modular facilita el mantenimiento, escalabilidad y claridad del código, permitiendo una gestión eficiente tanto del backend como del frontend.
