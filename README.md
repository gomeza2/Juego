# NEXO Studio

Un espacio de diseño 3D en el navegador, creado con HTML, CSS y Three.js.

## Qué incluye esta primera versión

- Visor 3D en tiempo real con cámara orbital, zoom y enfoque del modelo.
- Modelos de partida: habitación, auriculares, avión, cohete, sillón, mesa, lámpara, botella, smartphone, cubo y esfera.
- Ajustes de color, acabado, iluminación, escala, rotación y posición.
- Duplicación y eliminación de objetos.
- Guardado local automático en el navegador.
- Deshacer y rehacer cambios comunes.
- Exportación de modelo 3D en GLB, imagen PNG y parámetros del proyecto en JSON.
- Interfaz adaptable a pantallas pequeñas.
- Flujo de publicación automática con GitHub Actions.

## Publicar la web

1. Abrí la pestaña **Settings** de este repositorio.
2. En la barra lateral, entrá en **Pages**.
3. En **Build and deployment → Source**, elegí **GitHub Actions**.
4. Entrá en la pestaña **Actions** del repositorio y verificá que termine correctamente el flujo **Deploy NEXO Studio to GitHub Pages**.
5. Cuando el despliegue termine, abrí: https://gomeza2.github.io/Juego/

El flujo se ejecuta en cada cambio de la rama `main`. El archivo principal es `index.html`; no hace falta instalar dependencias ni ejecutar un servidor local. Three.js se carga desde jsDelivr mediante módulos del navegador.

## Importante

Esta versión crea geometría 3D procedural a partir de modelos base editables. El campo para describir ideas reconoce palabras clave y elige una base aproximada; todavía **no** genera modelos arbitrarios mediante IA ni es un sistema CAD profesional con medidas de fabricación. Para sumar generación real por IA, conviene integrar un backend seguro y mantener las claves de API fuera del navegador. La exportación GLB permite continuar el trabajo en herramientas 3D compatibles.

## Desarrollo

La mayor parte de la aplicación está en `index.html`. Usa Three.js 0.169.0, OrbitControls y GLTFExporter cargados desde CDN. Se requiere conexión a internet para cargar esas bibliotecas y la fuente tipográfica.
