# Clima en tiempo real

🔗 **[Ver sitio en vivo](https://gogoroisler.github.io/Clima/)**

Aplicación web que muestra el clima actual usando la geolocalización del usuario o búsqueda por nombre de ciudad. Construida con HTML, CSS y JavaScript vanilla — sin frameworks ni dependencias externas.

## Funcionalidades

- Detección automática de ubicación vía geolocalización del navegador
- Búsqueda de clima por nombre de ciudad
- Toggle de unidad entre °C y °F (conversión local, sin llamadas extra a la API)
- Ícono animado que diferencia condiciones diurnas y nocturnas
- Timestamp de última actualización
- Mensajes de estado para cada escenario: cargando, ubicación denegada, ciudad no encontrada, error de red
- Diseño responsive con glassmorphism (mobile, tablet y desktop)

## Habilidades demostradas

Este proyecto fue construido como parte de un portfolio orientado al desarrollo de software para los sectores de **educación** y **contabilidad**, donde estas competencias son directamente aplicables:

| Habilidad | Relevancia en educación/contabilidad |
|---|---|
| Consumo de APIs externas con `fetch` + `async/await` | Integración con APIs de AFIP, plataformas educativas, sistemas de facturación |
| Manejo explícito de estados de error | En software contable, un dato ausente es preferible a uno incorrecto |
| Separación de configuración del código (`config.js` + `.gitignore`) | Buenas prácticas de seguridad aplicables a cualquier sistema con credenciales |
| Diseño responsive | Aplicaciones de uso institucional deben funcionar en cualquier dispositivo |
| Accesibilidad básica (`aria-live`, `<label>`, `sr-only`) | Requisito en sistemas públicos y educativos |

## Tests

El proyecto incluye una suite de tests para las funciones puras de `utils.js`, sin dependencias externas.

Para correrlos:
1. Levantá el servidor local (ver sección siguiente)
2. Abrí `http://localhost:8080/tests.html` en el navegador

Los tests cubren:
- `toF` — conversión de Celsius a Fahrenheit (incluyendo bordes: 0°, -40°, temperatura corporal)
- `formatTemp` — formateo con unidad y redondeo
- `getWeatherIcon` — selección de ícono según condición y hora del día
- `degreesToCompass` — conversión de grados a puntos cardinales (N, NE, SO, etc.)
- `formatVisibility` — formato de visibilidad en metros o kilómetros
- `unixToLocalTime` — conversión de timestamp UTC a hora local de la ciudad consultada

## Tecnologías

- HTML5 / CSS3 / JavaScript (ES2020+)
- [OpenWeatherMap API](https://openweathermap.org/api) — datos del clima en tiempo real
- CSS Grid + Flexbox + Glassmorphism

## Cómo correrlo localmente

1. Cloná el repositorio
2. Copiá `config.example.js` como `config.js`:
   ```bash
   cp config.example.js config.js
   ```
3. Editá `config.js` y reemplazá `TU_API_KEY_AQUI` con tu API key de OpenWeatherMap (plan gratuito disponible en [openweathermap.org](https://openweathermap.org/api))
4. Servilo con cualquier servidor HTTP estático:
   ```bash
   python3 -m http.server 8080
   ```
5. Abrí `http://localhost:8080` en el navegador y permitís el acceso a la ubicación

## Estructura del proyecto

```
├── index.html           # Estructura y semántica
├── index.js             # Lógica: geolocalización, API, render, estado
├── utils.js             # Funciones puras: conversiones, íconos, pronóstico
├── styles.css           # Estilos, glassmorphism y responsive
├── tests.html           # Runner visual de tests (abrir en el navegador)
├── tests.js             # Suite de 33 tests para WeatherUtils
├── config.js            # API key local (excluida del repositorio)
├── config.example.js    # Plantilla de configuración
└── animated/            # Íconos SVG animados del clima
```
