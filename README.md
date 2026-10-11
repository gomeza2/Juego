# NEXO Studio

Editor 3D en el navegador para explorar y personalizar conceptos de productos, interiores, muebles y vehículos.

## Incluye

- Interfaz clara y adaptable a pantallas pequeñas.
- Visor 3D en tiempo real con órbita, zoom, enfoque y cuadrícula.
- Biblioteca de modelos base: habitación, auriculares, avión, cohete, sillón, mesa, lámpara, botella, smartphone, auto, drone, cámara, nave espacial, sofá, jarrón, altavoz, reloj inteligente, cubo y esfera.
- Ajustes de color, acabado, iluminación, escala, rotación y posición.
- Duplicar, eliminar, deshacer y rehacer.
- Guardado automático en el navegador.
- Exportar modelo GLB, captura PNG y parámetros del proyecto JSON.
- Campo de texto que interpreta términos de algunas categorías para crear una base aproximada.
- Despliegue automático con GitHub Actions.

## Publicar

El workflow `.github/workflows/deploy.yml` publica el contenido automáticamente una vez que GitHub Pages queda habilitado.

1. Abrí [Settings → Pages](https://github.com/gomeza2/Juego/settings/pages).
2. En **Build and deployment → Source**, seleccioná **GitHub Actions** y guardá. Esta configuración inicial debe hacerse desde GitHub.
3. Abrí la pestaña **Actions** y revisá el flujo **Deploy NEXO Studio to GitHub Pages**.
4. Cuando el flujo termine en verde, abrí https://gomeza2.github.io/Juego/

## Alcance actual

Los modelos son geometría procedural de partida, personalizable y exportable. El texto elige el modelo base mediante palabras clave; no es todavía un generador IA capaz de construir cualquier objeto arbitrario ni un CAD profesional con medidas de fabricación. Para añadir generación real por IA hace falta integrar un servicio de generación 3D en un backend seguro, sin exponer claves privadas en el navegador.

## Tecnología

HTML, CSS, JavaScript y Three.js 0.169.0. Three.js y la tipografía se cargan desde CDNs, por lo que se necesita conexión a internet para iniciar el editor.
