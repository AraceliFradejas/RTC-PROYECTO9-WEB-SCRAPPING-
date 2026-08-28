# Memoria técnica · Books to Scrape con Puppeteer

## Datos del proyecto

| Dato | Información |
| --- | --- |
| Proyecto | Web scraping de un catálogo paginado |
| Módulo | Backend Node, Mongo y API REST |
| Formación | Máster Rock The Code · The Power Tech School |
| Autora | Araceli Fradejas Muñoz |
| Tecnologías principales | Node.js, JavaScript y Puppeteer |
| Fuente | [Books to Scrape](https://books.toscrape.com/) |
| Repositorio | [RTC-PROYECTO9-WEB-SCRAPPING-](https://github.com/AraceliFradejas/RTC-PROYECTO9-WEB-SCRAPPING-) |
| Licencia del código | [MIT](../LICENSE) |

> Esta memoria recoge el desarrollo real del proyecto. Las cifras proceden de la ejecución y validación de `products.json`, y las evidencias incorporadas corresponden a capturas reales del proceso.

## 1. Contexto y motivación

Este proyecto continúa el aprendizaje que inicié con [Advanced Web Extractor](https://github.com/AraceliFradejas/urls-testLDAAFM). En aquel trabajo desarrollé en Python un sistema para extraer contenido de numerosas páginas de Línea Directa y convertirlo en documentos Markdown y PDF destinados a una base de conocimiento.

Mi proyecto anterior combinaba Playwright, BeautifulSoup, requests, pandas y WeasyPrint. Las URLs procedían de diferentes pestañas de un archivo Excel y el principal reto era revelar contenido dinámico: acordeones, pestañas y elementos con carga diferida.

En este proyecto he cambiado tanto el entorno como el tipo de información. He utilizado JavaScript, Node.js y Puppeteer para recorrer un catálogo paginado y producir un único archivo JSON con productos uniformes.

Elegí Books to Scrape porque es una web creada para practicar web scraping, ofrece un volumen suficiente de datos y utiliza una paginación clara. Sus 1.000 libros distribuidos en 50 páginas permiten comprobar de forma objetiva que el recorrido ha llegado hasta el final.

## 2. Objetivos

Mi objetivo principal ha sido crear un scraper que pueda:

- abrir un navegador controlado mediante Puppeteer;
- visitar la primera página del catálogo;
- detectar posibles modales o elementos superpuestos;
- extraer todos los productos de cada listado;
- obtener el nombre, el precio y la imagen exigidos;
- recopilar también URL, moneda, disponibilidad y valoración;
- descubrir la siguiente página mediante el DOM;
- continuar hasta que desaparezca el enlace `Next`;
- normalizar y validar los resultados;
- evitar productos duplicados;
- generar `products.json` al finalizar;
- ejecutarse con `npm run scrape`.

Como objetivos de calidad me propuse separar responsabilidades, cerrar siempre Chromium, limitar el ritmo de peticiones y crear pruebas automáticas para la validación.

## 3. Requisitos y cumplimiento

| Requisito | Implementación | Estado |
| --- | --- | :---: |
| Utilizar Puppeteer | Chromium se inicia desde `src/scraper.js` | Cumplido |
| Web con paginación | Books to Scrape dispone de 50 páginas | Cumplido |
| Quitar modales molestos | Se comprueban varios selectores en cada página | Cumplido |
| Seleccionar todos los productos | Se evalúa `article.product_pod` | Cumplido |
| Avanzar hasta el final | Se sigue `li.next a` mientras exista | Cumplido |
| Guardar nombre | Se obtiene del atributo `title` | Cumplido |
| Guardar precio | Se limpia y convierte a `Number` | Cumplido |
| Guardar imagen | Se convierte la ruta en una URL absoluta | Cumplido |
| Generar `products.json` | Se escribe tras validar todo el conjunto | Cumplido |
| Incluir un script sencillo | `npm run scrape` | Cumplido |

Durante la ejecución documentada no apareció ningún modal, por lo que el contador final fue 0. El requisito no se ha representado de forma ficticia: el scraper incorpora la detección y el cierre, pero informa del resultado real observado.

## 4. Tecnologías

### Node.js

He utilizado Node.js como entorno de ejecución. El proyecto requiere Node.js 18 o posterior y está configurado con ES Modules para utilizar `import` y `export`.

### Puppeteer

Puppeteer controla Chromium, visita cada URL, espera los productos, consulta el DOM y obtiene el enlace de la página siguiente. La versión instalada y fijada en el proyecto es la registrada en `package-lock.json`.

### Test runner de Node.js

He utilizado `node:test` y `node:assert/strict` para probar la validación sin instalar un framework adicional ni abrir el navegador.

### JSON

He elegido JSON como formato de salida porque conserva tipos de datos como números y permite reutilizar fácilmente el resultado desde JavaScript, una API o una base de datos.

## 5. Arquitectura

```text
src/
├── config/
│   └── scraperConfig.js
├── services/
│   └── extractProducts.js
├── utils/
│   ├── closeObstructions.js
│   ├── getNextPageUrl.js
│   ├── saveProducts.js
│   └── validateProducts.js
└── scraper.js
```

### `scraper.js`

Es el punto de entrada. Inicio Chromium, creo una página, coordino el bucle, acumulo productos y cierro el navegador dentro de `finally`.

### `scraperConfig.js`

Centralizo la URL inicial, los selectores, los tiempos de espera y la ubicación de `products.json`. De esta manera no disperso valores de configuración por diferentes archivos.

### `extractProducts.js`

Contiene la función que se ejecuta sobre las tarjetas del DOM. Convierte cada tarjeta en un objeto JavaScript uniforme.

### Utilidades

- `closeObstructions.js` busca elementos superpuestos visibles e intenta cerrarlos.
- `getNextPageUrl.js` devuelve la URL de `Next` o `null` en la última página.
- `saveProducts.js` convierte el array a JSON con sangría y lo escribe en disco.
- `validateProducts.js` rechaza colecciones vacías, productos incompletos y URLs duplicadas.

## 6. Flujo del scraper

```text
Inicio
  ↓
Abrir Chromium y crear una página
  ↓
Visitar la URL actual
  ↓
Esperar las tarjetas y comprobar modales
  ↓
Extraer y acumular todos los productos
  ↓
¿Existe el enlace Next?
  ├─ Sí → esperar 250 ms y visitar la siguiente página
  └─ No → validar todos los productos
                    ↓
              Escribir products.json
                    ↓
              Cerrar Chromium
```

No he escrito un bucle limitado a 50 iteraciones. El criterio de finalización es la ausencia del enlace `Next`. También guardo las URLs ya visitadas en un `Set`; si una URL se repitiera, detendría el proceso para evitar un ciclo infinito.

## 7. Extracción y normalización

Cada producto contiene:

| Campo | Tipo | Tratamiento |
| --- | --- | --- |
| `name` | String | Leo el atributo `title` y elimino espacios exteriores |
| `price` | Number | Retiro el símbolo monetario y convierto el texto |
| `currency` | String | Registro `GBP`, moneda utilizada por el catálogo |
| `image` | String | Convierto la ruta relativa en URL absoluta |
| `url` | String | Convierto el enlace relativo en URL absoluta |
| `availability` | String | Normalizo saltos y espacios repetidos |
| `rating` | Number | Transformo las clases `One` a `Five` en valores 1 a 5 |

No he incorporado `category` al resultado final. La categoría no aparece en las tarjetas del listado y obtenerla requeriría visitar las 1.000 fichas individuales. He preferido evitar 1.000 peticiones adicionales porque no es un requisito y no aporta suficiente valor a esta entrega.

## 8. Gestión de errores y comportamiento responsable

He aplicado las siguientes medidas:

- tiempos máximos en la navegación y espera de selectores;
- detección de ciclos de paginación;
- validación antes de guardar;
- escritura del JSON solo cuando termina todo el recorrido;
- pausa de 250 milisegundos entre páginas;
- cierre de Chromium dentro de `finally`;
- mensaje de error y código de salida distinto de cero cuando falla el proceso.

He utilizado una web preparada para practicar scraping y no he intentado eludir autenticación, captchas ni protecciones antibot.

## 9. Pruebas

El comando utilizado es:

```bash
npm test
```

He creado cuatro casos para `validateProducts`:

1. acepta una colección con productos completos y únicos;
2. rechaza una colección vacía;
3. rechaza un producto sin un campo obligatorio;
4. rechaza productos con la misma URL.

Resultado verificado: **4 pruebas superadas y 0 fallos**.

Después de separar el código en módulos volví a ejecutar las 50 páginas. Comparé el archivo nuevo con una copia anterior y ambos fueron idénticos, por lo que la refactorización no alteró los datos.

## 10. Resultados

| Métrica | Resultado verificado |
| --- | ---: |
| Páginas procesadas | 50 |
| Productos extraídos | 1.000 |
| Productos por página | 20 |
| Productos incompletos | 0 |
| URLs de producto duplicadas | 0 |
| URLs de imagen inválidas | 0 |
| Valoraciones inválidas | 0 |
| Precio mínimo | 10,00 GBP |
| Precio máximo | 59,99 GBP |
| Precio medio | 35,07 GBP |
| Tamaño de `products.json` | 357.119 bytes |

### Distribución de valoraciones

| Valoración | Libros |
| ---: | ---: |
| 1 estrella | 226 |
| 2 estrellas | 196 |
| 3 estrellas | 203 |
| 4 estrellas | 179 |
| 5 estrellas | 196 |

## 11. Evolución del desarrollo

He organizado el trabajo en hitos reproducibles:

1. documentación y objetivos iniciales;
2. configuración de Node.js y Puppeteer;
3. extracción de los 20 productos de la primera página;
4. incorporación de la paginación hasta los 1.000 productos;
5. separación en módulos y pruebas automáticas;
6. memoria técnica y plan de evidencias.

Este orden me permitió comprobar primero los selectores sobre una página y ampliar después el proceso. Así pude distinguir los errores de extracción de los problemas relacionados con la paginación.

## 12. Evidencias

He almacenado las capturas en `screenshots/` siguiendo la [guía de evidencias](../screenshots/README.md). Todas proceden de la navegación, la ejecución y los archivos reales del proyecto.

| N.º | Evidencia | Archivo previsto | Estado |
| ---: | --- | --- | :---: |
| 1 | Catálogo inicial de Books to Scrape | `01-books-to-scrape-inicio.png` | Completada |
| 2 | Tarjeta inspeccionada y selectores | `02-inspeccion-tarjeta.png` | Completada |
| 3 | Inicio de `npm run scrape` | `03-scraper-inicio.png` | Completada |
| 4 | Progreso intermedio | `04-scraper-progreso.png` | Completada |
| 5 | Resumen de 50 páginas y 1.000 productos | `05-scraper-resultado.png` | Completada |
| 6 | Primeros objetos de `products.json` | `06-products-inicio.png` | Completada |
| 7 | Último objeto de `products.json` | `07-products-final.png` | Completada |
| 8 | Cuatro pruebas superadas | `08-pruebas.png` | Completada |

### 12.1. Web seleccionada

La página inicial muestra el catálogo, los datos visibles de cada libro y el total de 1.000 resultados.

![Página inicial de Books to Scrape con el catálogo de libros](../screenshots/01-books-to-scrape-inicio.png)

### 12.2. Inspección de una tarjeta

En las herramientas de desarrollo comprobé `article.product_pod`, la imagen, el atributo `title`, la valoración, el precio y la disponibilidad.

![Inspección del HTML de la primera tarjeta de producto](../screenshots/02-inspeccion-tarjeta.png)

### 12.3. Inicio de la extracción

La terminal muestra el comando `npm run scrape`, las primeras URLs y el incremento de 20 productos por página.

![Inicio del scraper y primeras páginas procesadas](../screenshots/03-scraper-inicio.png)

### 12.4. Progreso de la paginación

La zona intermedia documenta el recorrido desde la página 20 hasta la 40 y el crecimiento del acumulado de 400 a 800 productos.

![Progreso intermedio del scraper entre las páginas 20 y 40](../screenshots/04-scraper-progreso.png)

### 12.5. Finalización del scraper

La ejecución llega a la página 50, alcanza 1.000 productos, guarda el archivo y cierra Chromium correctamente.

![Resumen final con 50 páginas y 1.000 productos](../screenshots/05-scraper-resultado.png)

### 12.6. Inicio del archivo generado

Los primeros objetos muestran los campos normalizados, los precios numéricos y las URLs absolutas.

![Primeros productos almacenados en products.json](../screenshots/06-products-inicio.png)

### 12.7. Final del archivo generado

La captura incluye los últimos objetos, el libro final y el corchete que cierra correctamente el array JSON en la línea 9002.

![Últimos productos y cierre del archivo products.json](../screenshots/07-products-final.png)

### 12.8. Pruebas automáticas

El test runner confirma cuatro pruebas superadas y ningún fallo.

![Resultado de npm test con cuatro pruebas superadas](../screenshots/08-pruebas.png)

Estas ocho capturas documentan la fase de scraping. Las evidencias de MongoDB Atlas e Insomnia se incorporarán en la ampliación del proyecto cuando la API esté implementada y probada.

## 13. Dificultades y decisiones

### Rutas relativas

Las imágenes y fichas utilizan rutas relativas. Las he convertido con `new URL(ruta, window.location.href)` para que `products.json` contenga enlaces reutilizables fuera de la página original.

### Precio como texto

El precio aparece acompañado por el símbolo de la libra. He eliminado los caracteres no numéricos y lo he convertido a `Number`, conservando la moneda en otro campo.

### Final de la paginación

En lugar de suponer que existen 50 páginas, utilizo el propio enlace `Next`. Esto hace que el scraper responda a la estructura actual del catálogo.

### Modales

Books to Scrape no mostró modales durante las pruebas. Aun así, compruebo selectores habituales y solo hago clic cuando el elemento existe y es visible.

### Alcance de los datos

He descartado visitar cada ficha para obtener la categoría. Esta decisión reduce considerablemente el número de navegaciones y mantiene el proyecto centrado en los requisitos evaluables.

## 14. Qué he aprendido

He aprendido a trasladar mi experiencia anterior con Playwright en Python a Puppeteer en Node.js. Aunque ambas herramientas controlan navegadores, en este proyecto he practicado los módulos de JavaScript, la evaluación del DOM y la escritura asíncrona de archivos JSON.

He comprendido que la paginación debe depender de una condición observable. Buscar `Next` resulta más mantenible que escribir un número fijo de páginas. También he aprendido a proteger ese bucle mediante un registro de URLs visitadas.

Otra parte importante ha sido la normalización. Extraer texto no es suficiente: el precio debe convertirse en número, las rutas deben convertirse en URLs absolutas y los espacios deben limpiarse antes de guardar los datos.

Finalmente, he comprobado el valor de separar responsabilidades y probar las funciones que no dependen del navegador. La comparación del JSON antes y después de la refactorización me ha permitido verificar que una mejora interna no cambió el comportamiento observable.

## 15. Posibles mejoras

- incorporar reintentos limitados para errores temporales de red;
- permitir configurar URL, pausa y archivo de salida mediante argumentos;
- crear pruebas de integración con una página HTML local;
- generar un resumen estadístico como archivo independiente;
- documentar tiempos de ejecución en distintos entornos.

## 16. Ampliación del proyecto: del scraping a una API REST

Tras completar y verificar el scraper, he decidido utilizar sus resultados para continuar practicando MongoDB y API REST con un conjunto diferente y más voluminoso de datos.

Esta ampliación parte de mi experiencia en APIs anteriores inspiradas en Taylor Swift. En el proyecto sobre *The Eras Tour* trabajé con 149 conciertos y 238 canciones relacionadas. Los 1.000 libros actuales me permitirán observar el funcionamiento de una semilla idempotente, las consultas paginadas y los filtros sobre una colección de mayor tamaño.

### Objetivos de la ampliación

- conectar la aplicación con MongoDB Atlas mediante Mongoose;
- crear un modelo `Book` basado en la estructura de `products.json`;
- importar los libros sin duplicarlos cuando repita la semilla;
- implementar un CRUD completo con Express;
- paginar las consultas de lectura;
- filtrar por nombre, precio y valoración;
- calcular estadísticas del conjunto de datos;
- probar y documentar los endpoints con Insomnia;
- añadir evidencias reales de MongoDB Atlas e Insomnia.

### Integración con el scraping

`products.json` seguirá siendo la salida obligatoria del scraping y funcionará sin MongoDB. La base de datos consumirá ese archivo como fuente para su semilla, conectando ambas fases sin acoplar su ejecución.

No utilizaré Cloudinary para las portadas. Las imágenes ya tienen URLs absolutas y volver a alojar 1.000 archivos aumentaría el consumo de recursos, duplicaría contenido ajeno y no aportaría valor al objetivo de esta práctica.

### Estado

En esta versión he definido el alcance de la ampliación. La implementación de MongoDB y la API REST se realizará en hitos posteriores, manteniendo commits separados para configuración, semilla, CRUD, filtros, pruebas y evidencias.

## 17. Conclusión

He completado el objetivo principal: el scraper recorre por sí mismo toda la paginación de Books to Scrape, extrae los productos y genera `products.json`. El resultado contiene 1.000 libros válidos y sin URLs duplicadas.

El proyecto no se limita a una extracción puntual. He incorporado validación, cierre seguro del navegador, una pausa responsable, detección de ciclos, arquitectura modular y pruebas automáticas. Estos elementos hacen que el proceso sea más comprensible, verificable y mantenible.

---

**Araceli Fradejas Muñoz**  
Proyecto académico del máster Rock The Code · The Power Tech School.
