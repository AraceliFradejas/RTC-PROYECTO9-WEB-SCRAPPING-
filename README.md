# Books to Scrape · Web Scraping con Puppeteer

Proyecto académico de web scraping del **Módulo 5: Backend [Node | Mongo | API REST]** del máster **Rock The Code** de **The Power Tech School**.

En este proyecto voy a desarrollar un scraper con Node.js y Puppeteer capaz de recorrer todas las páginas del catálogo de [Books to Scrape](https://books.toscrape.com/), obtener todos sus libros y guardar los resultados en un archivo llamado `products.json`.

> **Estado del proyecto:** scraper paginado completado y verificado con 1.000 productos extraídos de 50 páginas.

## Motivación

Este proyecto continúa una línea de aprendizaje que comencé con [Advanced Web Extractor](https://github.com/AraceliFradejas/urls-testLDAAFM), una herramienta que desarrollé en Python para extraer contenido de numerosas páginas de Línea Directa y convertirlo en documentos Markdown y PDF destinados a una base de conocimiento.

En aquel proyecto trabajé con Playwright, BeautifulSoup, requests, pandas y WeasyPrint. Procesé URLs procedentes de distintas pestañas de un archivo Excel, ejecuté JavaScript, desplegué acordeones, activé pestañas y provoqué la carga diferida de contenido mediante desplazamiento. También incorporé control del progreso, tratamiento de errores y generación automatizada de documentos.

Para este nuevo proyecto quiero aplicar parte de aquel aprendizaje en un contexto diferente. En lugar de recopilar contenido documental desde una lista previa de URLs, voy a recorrer automáticamente un catálogo paginado. También cambio el entorno tecnológico: utilizaré JavaScript, Node.js y Puppeteer para generar un conjunto de datos JSON con una estructura uniforme.

Buscando una web con muchos productos, una paginación clara y una estructura estable, encontré Books to Scrape. Elegí esta página porque está preparada específicamente para practicar web scraping y contiene 1.000 libros distribuidos en 50 páginas. Su estructura me permitirá comprobar visualmente los datos obligatorios del ejercicio y centrarme en comprender correctamente la navegación automatizada.

## Objetivo principal

Mi objetivo es construir un scraper que:

- abra Books to Scrape mediante Puppeteer;
- detecte y cierre posibles modales o elementos que dificulten la navegación;
- seleccione todos los productos mostrados en cada página;
- extraiga, como mínimo, el nombre, el precio y la imagen de cada libro;
- avance automáticamente a la siguiente página;
- continúe hasta detectar el final del catálogo;
- valide y normalice la información obtenida;
- genere un archivo `products.json` con todos los resultados;
- pueda ejecutarse mediante un comando sencillo definido en `package.json`.

No fijaré manualmente el número de páginas que debe recorrer el scraper. La finalización dependerá de la existencia del enlace de página siguiente, de modo que el proceso pueda adaptarse si el catálogo cambia.

## Datos previstos

Cada producto incluirá los tres campos exigidos en el enunciado:

| Campo | Descripción |
| --- | --- |
| `name` | Nombre completo del libro |
| `price` | Precio normalizado como valor numérico |
| `image` | URL absoluta de la imagen |

Como mejora, estudiaré la incorporación de otros datos disponibles que aporten valor al resultado:

| Campo | Descripción |
| --- | --- |
| `currency` | Moneda correspondiente al precio |
| `url` | Dirección de la ficha del libro |
| `availability` | Disponibilidad indicada en la web |
| `rating` | Valoración del producto |
| `category` | Categoría a la que pertenece |

La estructura definitiva dependerá de las comprobaciones realizadas durante el desarrollo. No incorporaré datos adicionales si no puedo extraerlos y validarlos de forma consistente.

## Estructura del resultado

El archivo `products.json` tendrá una estructura similar a la siguiente:

```json
[
  {
    "name": "A Light in the Attic",
    "price": 51.77,
    "currency": "GBP",
    "image": "https://books.toscrape.com/media/cache/...",
    "url": "https://books.toscrape.com/catalogue/...",
    "availability": "In stock",
    "rating": 3
  }
]
```

Este ejemplo reproduce la estructura real generada. La categoría permanece como una posible mejora porque no aparece en las tarjetas del listado y obtenerla exigiría visitar individualmente las 1.000 fichas.

### Resultado verificado

La ejecución completa ha producido los siguientes resultados:

- 50 páginas visitadas;
- 1.000 productos extraídos;
- 0 productos con campos obligatorios incompletos;
- 0 URLs de producto duplicadas;
- 0 URLs de imagen inválidas;
- 0 valoraciones fuera del rango de 1 a 5;
- 0 elementos superpuestos encontrados durante el recorrido del catálogo.

El scraper no contiene el número 50 como límite. Después de procesar cada listado busca el enlace `Next`, obtiene su URL y continúa mientras ese enlace exista. En la última página no encuentra el enlace y finaliza el bucle.

## Enfoque de desarrollo

Voy a construir el proyecto de manera progresiva:

1. Prepararé el entorno de Node.js e instalaré Puppeteer.
2. Analizaré el HTML de Books to Scrape y localizaré selectores estables.
3. Extraeré primero los productos de una sola página.
4. Normalizaré nombres, precios, imágenes y enlaces.
5. Incorporaré la navegación automática por todas las páginas.
6. Gestionaré modales, esperas, errores de navegación y cierre del navegador.
7. Validaré campos obligatorios y posibles productos duplicados.
8. Generaré `products.json` solamente cuando termine la extracción.
9. Documentaré la ejecución y las conclusiones mediante evidencias reales.

## Comparación con mi proyecto anterior

| Advanced Web Extractor | Books to Scrape |
| --- | --- |
| Python | JavaScript y Node.js |
| Playwright | Puppeteer |
| URLs procedentes de Excel | Páginas descubiertas mediante paginación |
| Contenido documental | Productos de un catálogo |
| Salida en Markdown y PDF | Salida en JSON estructurado |
| Acordeones, pestañas y *lazy loading* | Tarjetas de producto y enlace a la página siguiente |
| Base de conocimiento para Copilot | Conjunto de datos reutilizable |

## Mejoras previstas

Además de los requisitos obligatorios, estudiaré las siguientes mejoras:

- selectores centralizados para facilitar su mantenimiento;
- separación de responsabilidades en archivos pequeños;
- URLs absolutas para imágenes y fichas de producto;
- precios almacenados como números;
- prevención de duplicados;
- validación de campos obligatorios;
- mensajes de progreso por página;
- resumen final de la ejecución;
- reintentos limitados ante errores recuperables;
- cierre seguro del navegador aunque se produzca un error;
- pruebas automáticas de las funciones de normalización y validación.

Una posible ampliación posterior sería almacenar los resultados en MongoDB y crear un CRUD. Esta parte es opcional y solo la incorporaré cuando el scraper obligatorio esté terminado y comprobado.

## Tecnologías

- Node.js
- JavaScript
- Puppeteer
- JSON
- Git y GitHub

## Instalación y ejecución

Para preparar el proyecto en local necesito Node.js 18 o una versión posterior. Después de clonar el repositorio instalaré las dependencias declaradas en `package.json`:

```bash
git clone https://github.com/AraceliFradejas/RTC-PROYECTO9-WEB-SCRAPPING-.git
cd RTC-PROYECTO9-WEB-SCRAPPING-
npm install
```

Cuando el scraper esté implementado podré ejecutarlo mediante el script incluido en `package.json`:

```bash
npm run scrape
```

## Estructura prevista

```text
.
├── docs/
│   └── MEMORIA.md
├── screenshots/
├── src/
│   ├── config/
│   ├── utils/
│   └── scraper.js
├── products.json
├── package.json
└── README.md
```

Esta estructura es una propuesta inicial y podrá evolucionar cuando conozca mejor las responsabilidades reales del código.

## Memoria y evidencias

Voy a documentar el proceso en `docs/MEMORIA.md`, siguiendo la línea de mis proyectos anteriores de API REST. La memoria recogerá:

- contexto y objetivos;
- análisis de la web elegida;
- arquitectura y decisiones técnicas;
- explicación progresiva del scraper;
- tratamiento de la paginación;
- normalización y validación de datos;
- dificultades encontradas y soluciones aplicadas;
- pruebas realizadas;
- resultados finales;
- conclusiones y posibles mejoras.

Las evidencias se añadirán cuando las acciones correspondientes se hayan realizado. Está previsto documentar:

1. La página inicial de Books to Scrape.
2. La inspección de una tarjeta de producto.
3. La ejecución de `npm run scrape`.
4. El progreso de las distintas páginas en la terminal.
5. El resumen final de productos obtenidos.
6. Una muestra inicial de `products.json`.
7. Los últimos productos almacenados.
8. La validación de campos obligatorios y duplicados.

Si desarrollo posteriormente una API con MongoDB, ampliaré la memoria con evidencias reales de MongoDB Atlas e Insomnia.

## Consideraciones responsables

He elegido una web creada para practicar web scraping. Durante el desarrollo evitaré realizar peticiones innecesarias, introduciré esperas razonables cuando sean necesarias y no intentaré eludir sistemas de seguridad, autenticación o protección antibot.

El archivo `.env` no será necesario para la funcionalidad inicial. Si la ampliación con MongoDB requiere credenciales, utilizaré un `.env.example` sin secretos en el repositorio y entregaré las credenciales reales exclusivamente mediante el canal privado indicado para la corrección.

## Qué he aprendido

Antes de comenzar la implementación, he aprendido a delimitar el objetivo del scraper y a elegir una fuente apropiada para una práctica académica. También he analizado las diferencias entre mi extractor anterior y este nuevo ejercicio: no necesito partir de una lista cerrada de URLs, sino descubrir las páginas mediante la propia navegación del catálogo.

En esta primera implementación he aprendido a iniciar Chromium desde Puppeteer, abrir una página, esperar a que aparezcan las tarjetas y ejecutar una función dentro del DOM mediante `$$eval`. He utilizado selectores CSS para obtener el nombre, el precio, la imagen, el enlace, la disponibilidad y la valoración de cada libro.

También he comprobado que los datos visibles no siempre tienen el formato adecuado para guardarlos. He eliminado el símbolo monetario para convertir el precio en un número, he transformado las rutas relativas en URLs absolutas y he normalizado los espacios de la disponibilidad. Antes de escribir el JSON valido que todos los productos tengan los campos obligatorios.

Por último, he incorporado un bloque `finally` para cerrar el navegador tanto si la extracción termina correctamente como si se produce un error.

Al incorporar la paginación he aprendido a controlar un bucle mediante la propia estructura de la web. Después de cada extracción busco el enlace `Next`: si existe, continúo con su URL; si no existe, el proceso ha llegado al final. De esta manera no dependo de conocer previamente el número de páginas.

También he añadido un conjunto de URLs visitadas para detectar un posible ciclo de navegación, una pausa breve entre peticiones y una validación final de URLs duplicadas. He decidido escribir `products.json` solamente después de completar y validar todo el catálogo, evitando guardar como resultado definitivo una extracción parcial.

## Autora

**Araceli Fradejas Muñoz**

Proyecto realizado para The Power Tech School, máster Rock The Code.

## Redes sociales y enlaces

- GitHub: <https://github.com/AraceliFradejas>
- LinkedIn: <https://www.linkedin.com/in/araceli-fradejas-munoz-transformaciondigital/>
- Instagram: <https://www.instagram.com/goldilocks1013x/>
- X (Twitter): <https://x.com/AraceliFradejas>
- TikTok: <https://www.tiktok.com/@arucci1>
- YouTube: <https://www.youtube.com/@aracelifradejasmunoz2758>
- Medium: <https://medium.com/@araceli.fradejas>

## Nota académica

Este repositorio corresponde a un proyecto educativo de web scraping. Books to Scrape y las imágenes o datos mostrados en su catálogo pertenecen a sus respectivos responsables. Los resultados se utilizarán exclusivamente con fines de aprendizaje.
