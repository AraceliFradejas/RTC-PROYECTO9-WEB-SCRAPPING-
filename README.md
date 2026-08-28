# Books to Scrape · Web Scraping con Puppeteer

He realizado este proyecto académico para el módulo de Backend con Node.js, MongoDB y API REST del máster Rock The Code de The Power Tech School.

En este repositorio he reunido la solución completa del ejercicio: scraping paginado con Puppeteer, exportación a `products.json`, validación de datos y ampliación a una API REST conectada a MongoDB Atlas.

[Memoria técnica](docs/MEMORIA.md) · [Guía de capturas](screenshots/README.md) · [Repositorio](https://github.com/AraceliFradejas/RTC-PROYECTO9-WEB-SCRAPPING-) · [English version](#english-version)

> Estado del proyecto: finalizado y validado con 14 pruebas automatizadas superadas.

## Resumen

- Scraper con Puppeteer que recorre la paginación completa de Books to Scrape.
- Extracción de nombre, precio, imagen y URL de cada producto.
- Validación de productos obligatorios, duplicados y estructura de datos.
- Generación del archivo `products.json` con 1.000 registros.
- Carga de datos en MongoDB mediante semilla idempotente.
- Exposición de un CRUD completo con Express y Mongoose.
- Documentación de evidencias, pruebas y endpoints.

## Motivación y contexto

Este proyecto continúa el aprendizaje que inicié con [Advanced Web Extractor](https://github.com/AraceliFradejas/urls-testLDAAFM). En aquel trabajo utilicé Python para extraer contenido de distintas páginas de Línea Directa y transformarlo en documentos Markdown y PDF destinados a una base de conocimiento.

En esta ocasión quería practicar una navegación diferente. En lugar de partir de una lista cerrada de URLs, necesitaba descubrir cada página mediante la propia paginación. Buscando una web con muchos productos y una estructura fácil de comprobar, encontré Books to Scrape. La elegí porque está preparada para practicar scraping y contiene 1.000 libros distribuidos en 50 páginas.

## Tecnologías

- Node.js
- JavaScript
- Puppeteer
- Express
- MongoDB Atlas
- Mongoose
- dotenv
- CORS
- Morgan
- JSON
- Git y GitHub

## Objetivo del proyecto

He organizado el ejercicio en dos fases:

1. Web scraping y extracción estructurada de un catálogo paginado.
2. Persistencia y consulta de esos datos en una base de datos y una API REST.

Mi objetivo principal era automatizar la recogida de todos los productos del catálogo, evitar errores de navegación y dejar una salida fiable para su posterior uso.

No he fijado manualmente el número de páginas. Después de extraer cada listado busco el enlace `Next`; si existe continúo con su URL y, si no existe, doy por terminada la extracción. También compruebo posibles elementos superpuestos, aunque la web no mostró ninguno durante la ejecución final.

## Resultados verificados

- 50 páginas recorridas
- 1.000 productos extraídos
- 0 productos incompletos
- 0 URLs duplicadas
- 0 validaciones fallidas en la colección final
- 14 pruebas automatizadas superadas

## Estructura de datos

Cada producto se normaliza con estos campos:

| Campo | Descripción |
| --- | --- |
| `name` | Nombre del libro |
| `price` | Precio como valor numérico |
| `image` | URL absoluta de la imagen |
| `url` | Enlace a la ficha del producto |
| `currency` | Moneda del precio |
| `availability` | Disponibilidad indicada en la web |
| `rating` | Valoración extraída desde el listado |

Ejemplo de salida:

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

## Evidencias de la entrega

### Scraping y validación

![Catálogo inicial de Books to Scrape](screenshots/BooksToScrape1-Catalog-Overview.png)

![Detalle de un producto y selectores del HTML](screenshots/Browser2-Product-Card-Inspection.png)

![Final del recorrido paginado](screenshots/Terminal5-Scraper-Completed.png)

![Primeros registros en products.json](screenshots/VSCode6-Products-JSON-Start.png)

![Pruebas finales superadas](screenshots/Terminal24-Final-Tests.png)

### MongoDB y API REST

![Estado de la API en Insomnia](screenshots/Insomnia10-API-Status.png)

![Paginación de libros en Insomnia](screenshots/Insomnia11-Books-Pagination.png)

![Filtrado y estadísticas de la API](screenshots/Insomnia12-Books-Filters.png)

![Colección de MongoDB Atlas](screenshots/MongoAtlas16-Project-Overview.png)

![Documentos cargados en la colección Books](screenshots/MongoAtlas18-Books-Collection-1001.png)

![Creación de un libro en Insomnia](screenshots/Insomnia14-Book-POST.png)

![Actualización y eliminación del documento](screenshots/Insomnia20-Book-PUT.png)

## Instalación y uso

Requisitos:

- Node.js 18 o superior
- acceso a Internet para realizar el scraping
- una cadena `MONGODB_URI` válida si se quiere ejecutar la API REST

Clonar el proyecto:

```bash
git clone https://github.com/AraceliFradejas/RTC-PROYECTO9-WEB-SCRAPPING-.git
cd RTC-PROYECTO9-WEB-SCRAPPING-
npm install
```

Ejecutar el scraper:

```bash
npm run scrape
```

Ejecutar las pruebas:

```bash
npm test
```

Ejecutar la semilla y la API REST:

```bash
cp .env.example .env
npm run seed
npm run api
```

> El archivo `.env` no se incluye en el repositorio por seguridad. El ejemplo de configuración está disponible en `.env.example`.

## Variables de entorno

```env
PORT=5050
MONGODB_URI=mongodb+srv://USUARIO:CONTRASENA@CLUSTER.mongodb.net/books-scraping?retryWrites=true&w=majority
NODE_ENV=development
```

## Endpoints de la API

| Método | Ruta | Función |
| --- | --- | --- |
| GET | `/api` | Comprobar el estado de la API |
| GET | `/api/books` | Listar y paginar libros |
| GET | `/api/books/stats` | Ver estadísticas generales |
| GET | `/api/books/:id` | Obtener un libro por ID |
| POST | `/api/books` | Crear un libro |
| PUT | `/api/books/:id` | Actualizar un libro |
| DELETE | `/api/books/:id` | Eliminar un libro |

Ejemplo de consulta:

```text
http://localhost:5050/api/books?page=1&limit=20&minPrice=10&maxPrice=30&rating=4
```

## Estructura del proyecto

```text
.
├── src/
│   ├── api/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seeds/
│   │   └── utils/
│   ├── config/
│   ├── services/
│   ├── scraper.js
│   └── utils/
├── tests/
├── docs/
├── screenshots/
├── .env.example
├── package.json
├── products.json
├── README.md
└── LICENSE
```

## Qué he aprendido

He aprendido a trasladar mi experiencia anterior con Playwright a Puppeteer, recorrer una paginación sin depender de un número fijo y ejecutar funciones dentro del DOM para transformar cada tarjeta en un objeto uniforme.

También he practicado la normalización de precios, la conversión de rutas relativas en URLs absolutas y la validación de una colección completa antes de escribir el archivo definitivo. Con la ampliación he seguido el recorrido del dato desde la web hasta MongoDB: extracción, JSON, semilla idempotente, persistencia y consulta mediante una API REST.

Las pruebas de Insomnia y MongoDB Atlas me han permitido comprobar visualmente la creación, consulta, actualización y eliminación de un libro temporal. Después de terminar el recorrido eliminé ese documento y confirmé que la colección volvía a contener los 1.000 libros originales.

## Autora

**Araceli Fradejas Muñoz**

Proyecto académico del máster Rock The Code · The Power Tech School.

## Redes sociales y enlaces

- GitHub: <https://github.com/AraceliFradejas>
- LinkedIn: <https://www.linkedin.com/in/araceli-fradejas-munoz-transformaciondigital/>
- Instagram: <https://www.instagram.com/goldilocks1013x/>
- X: <https://x.com/AraceliFradejas>
- TikTok: <https://www.tiktok.com/@arucci1>
- YouTube: <https://www.youtube.com/@aracelifradejasmunoz2758>
- Medium: <https://medium.com/@araceli.fradejas>

## Licencia y uso educativo

Publico el código bajo la [licencia MIT](LICENSE). Los textos, datos e imágenes de Books to Scrape pertenecen a sus respectivos responsables y los utilizo exclusivamente con fines educativos.

## Notas finales

En la entrega final combino dos partes del módulo: la extracción automatizada de datos desde una web y la transformación de esa información en una API funcional con persistencia en MongoDB. He separado las responsabilidades del código, documentado las comprobaciones y añadido pruebas para poder entender y mantener mejor el proyecto.

---

## English version

# Books to Scrape · Web Scraping with Puppeteer

I completed this academic project for the Backend module with Node.js, MongoDB and REST API in The Power Tech School's Rock The Code master's programme.

In this repository I have included the complete solution: paginated scraping with Puppeteer, export to `products.json`, data validation and an extended REST API connected to MongoDB Atlas.

[Technical memory](docs/MEMORIA.md) · [Capture guide](screenshots/README.md) · [Repository](https://github.com/AraceliFradejas/RTC-PROYECTO9-WEB-SCRAPPING-) · [Versión en español](#books-to-scrape--web-scraping-con-puppeteer)

> Project status: completed and validated with 14 automated tests passing.

## Summary

- Puppeteer scraper that traverses the full pagination of Books to Scrape.
- Extraction of title, price, image and product URL.
- Validation of required fields, duplicate records and malformed data.
- Generation of the `products.json` file with 1,000 records.
- Loading of data into MongoDB using an idempotent seed.
- Exposure of a complete CRUD with Express and Mongoose.
- Documentation of evidence, tests and endpoints.

## Background and motivation

This project continues the learning path I began with [Advanced Web Extractor](https://github.com/AraceliFradejas/urls-testLDAAFM). In that project I used Python to extract content from different Línea Directa pages and convert it into Markdown and PDF documents for a knowledge base.

This time I wanted to practise a different navigation model. Instead of starting with a fixed list of URLs, I needed to discover each page through the catalogue pagination. I chose Books to Scrape because it is intended for scraping practice and contains 1,000 books across 50 pages.

## Technologies

- Node.js
- JavaScript
- Puppeteer
- Express
- MongoDB Atlas
- Mongoose
- dotenv
- CORS
- Morgan
- JSON
- Git and GitHub

## Project goal

I divided the exercise into two phases:

1. Web scraping and structured extraction from a paginated catalog.
2. Persistence and query of that data through a database and a REST API.

My main objective was to automate the collection of every product, avoid navigation errors and generate a reliable output for later use.

I did not hard-code the number of pages. After extracting each listing, I search for the `Next` link. If it exists, I continue with its URL; if it does not, I finish the extraction.

## Verified results

- 50 pages processed
- 1,000 products extracted
- 0 incomplete products
- 0 duplicate product URLs
- 0 validation failures in the final collection
- 14 automated tests passed

## Data structure

Each product is normalized with the following fields:

| Field | Description |
| --- | --- |
| `name` | Book title |
| `price` | Price as a numeric value |
| `image` | Absolute URL of the image |
| `url` | Link to the product page |
| `currency` | Currency of the price |
| `availability` | Availability extracted from the page |
| `rating` | Rating from the product list |

Example output:

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

## Evidence of the delivery

### Scraping and validation

![Books to Scrape catalog overview](screenshots/BooksToScrape1-Catalog-Overview.png)

![Product card with selectors in the HTML](screenshots/Browser2-Product-Card-Inspection.png)

![Scraper completion after full pagination](screenshots/Terminal5-Scraper-Completed.png)

![First records in products.json](screenshots/VSCode6-Products-JSON-Start.png)

![Final automated tests passing](screenshots/Terminal24-Final-Tests.png)

### MongoDB and REST API

![API status in Insomnia](screenshots/Insomnia10-API-Status.png)

![Books pagination in Insomnia](screenshots/Insomnia11-Books-Pagination.png)

![Filters and statistics](screenshots/Insomnia12-Books-Filters.png)

![MongoDB Atlas collection overview](screenshots/MongoAtlas16-Project-Overview.png)

![Books collection with imported documents](screenshots/MongoAtlas18-Books-Collection-1001.png)

![Create book request in Insomnia](screenshots/Insomnia14-Book-POST.png)

![Update and delete flow in Insomnia](screenshots/Insomnia20-Book-PUT.png)

## Installation and usage

Requirements:

- Node.js 18 or newer
- internet access for the scraper
- a valid `MONGODB_URI` for the REST API execution

Clone the project:

```bash
git clone https://github.com/AraceliFradejas/RTC-PROYECTO9-WEB-SCRAPPING-.git
cd RTC-PROYECTO9-WEB-SCRAPPING-
npm install
```

Run the scraper:

```bash
npm run scrape
```

Run the tests:

```bash
npm test
```

Run the seed and the REST API:

```bash
cp .env.example .env
npm run seed
npm run api
```

> The `.env` file is not included in the repository for security reasons. A configuration example is available in `.env.example`.

## Environment variables

```env
PORT=5050
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/books-scraping?retryWrites=true&w=majority
NODE_ENV=development
```

## API endpoints

| Method | Route | Function |
| --- | --- | --- |
| GET | `/api` | Check API status |
| GET | `/api/books` | List and paginate books |
| GET | `/api/books/stats` | View general statistics |
| GET | `/api/books/:id` | Get a book by id |
| POST | `/api/books` | Create a book |
| PUT | `/api/books/:id` | Update a book |
| DELETE | `/api/books/:id` | Delete a book |

Example query:

```text
http://localhost:5050/api/books?page=1&limit=20&minPrice=10&maxPrice=30&rating=4
```

## What I learned

I learned how to transfer my previous Playwright experience to Puppeteer, navigate a catalogue without relying on a fixed page count and transform DOM cards into consistent JavaScript objects.

I also practised price normalisation, conversion of relative paths into absolute URLs and validation of a complete collection before writing the final file. The extension helped me follow the complete data flow from the website to MongoDB: extraction, JSON generation, idempotent seeding, persistence and REST API queries.

By testing the API in Insomnia and checking the documents in MongoDB Atlas, I verified the creation, retrieval, update and deletion of a temporary book. I then removed that test document and restored the original collection of 1,000 books.

## Author

**Araceli Fradejas Muñoz**

Academic project for The Power Tech School · Rock The Code master's programme.

## Links

- GitHub: <https://github.com/AraceliFradejas>
- LinkedIn: <https://www.linkedin.com/in/araceli-fradejas-munoz-transformaciondigital/>
- Instagram: <https://www.instagram.com/goldilocks1013x/>
- X: <https://x.com/AraceliFradejas>
- TikTok: <https://www.tiktok.com/@arucci1>
- YouTube: <https://www.youtube.com/@aracelifradejasmunoz2758>
- Medium: <https://medium.com/@araceli.fradejas>

## Licence and educational use

I publish the code under the [MIT licence](LICENSE). Books to Scrape and its catalogue content belong to their respective owners. I use the extracted information exclusively for educational purposes.

## Final note

In this final deliverable I combine two parts of the module: automated extraction from a website and the transformation of that information into a functional API with MongoDB persistence. I separated the code responsibilities, documented the checks and added tests so I can understand and maintain the project more easily.
