# Galería de Waifus

[![Open Source](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://opensource.org/)

Una galería de código abierto para visualizar y compartir tus waifus favoritas. Incluye funcionalidades de subida de imágenes y almacenamiento de datos. Desarrollada con Node.js, Express y EJS.

## Características

- Galería visual de waifus con vista de cuadrícula
- Subida de imágenes
- Almacenamiento persistente de datos en formato JSON
- Interfaz responsiva
- Filtrado y búsqueda de waifus

## Requisitos Previos

- Node.js (v14 o superior)
- npm (v6 o superior)

## Instalación

1. Clona el repositorio:
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd waifus-wa
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea las carpetas necesarias (se crearán automáticamente al iniciar la aplicación):
   - `./data` - Para almacenar los datos de las waifus
   - `./public/uploads` - Para almacenar las imágenes subidas

## Configuración

La aplicación no requiere configuración adicional para entornos de desarrollo. Para producción, se recomienda configurar las variables de entorno adecuadas.

## Uso

### Galería Web

1. Inicia el servidor de desarrollo:
   ```bash
   node app.js
   ```

2. Abre tu navegador y ve a:
   ```
   http://localhost:3000
   ```

3. Explora la galería para ver, agregar o gestionar tus waifus favoritas.

### Uso de la API

La galería incluye una API RESTful para interactuar con las imágenes de waifus:

#### Obtener todas las categorías
```http
GET /api/categories
```

#### Obtener imágenes por categoría
```http
GET /api/categories/:category
```

Parámetros opcionales:
- `limit`: Número máximo de resultados (por defecto: 10)
- `offset`: Número de resultados a omitir (por defecto: 0)

#### Obtener una imagen aleatoria
```http
GET /api/random
```

Parámetros opcionales:
- `category`: Filtrar por categoría específica

#### Buscar imágenes
```http
GET /api/search?q=término
```

Parámetros requeridos:
- `q`: Término de búsqueda (busca en nombres de waifus y categorías)

#### Respuesta de ejemplo (éxito):
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "name": "Nombre de la waifu",
      "image": "http://localhost:3000/uploads/filename.jpg"
    }
  ]
}
```

#### Respuesta de ejemplo (error):
```json
{
  "success": false,
  "message": "Mensaje de error descriptivo"
}
```

## Estructura de la Galería

```
waifus-wa/
├── data/                  # Datos de la aplicación (se crea automáticamente)
├── node_modules/         # Dependencias de Node.js
├── public/               # Archivos estáticos
│   └── uploads/          # Imágenes subidas (se crea automáticamente)
├── routes/               # Rutas de la aplicación
├── views/                # Plantillas EJS
├── app.js               # Punto de entrada de la aplicación
├── package.json         # Configuración del proyecto y dependencias
└── README.md            # Este archivo
```

## Tecnologías Utilizadas

- Express: Framework web para Node.js
- EJS: Motor de plantillas
- Multer: Manejo de subida de archivos
- Sharp: Procesamiento de imágenes
- CORS: Middleware para habilitar CORS
- Axios: Cliente HTTP

## Iniciar la Galería

Para iniciar la galería localmente:

```bash
node app.js
```

La galería estará disponible en `http://localhost:3000`

## Contribución

¡Las contribuciones son bienvenidas! Si deseas contribuir a este proyecto de código abierto, por favor:

1. Haz un Fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Haz commit de tus cambios (`git commit -am 'Añade nueva característica'`)
4. Haz push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Si tienes preguntas o comentarios, por favor abre un issue en el repositorio.
