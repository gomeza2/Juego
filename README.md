# NEXO Studio

Editor 3D en el navegador para explorar y personalizar conceptos de productos, interiores, formas orgánicas y estructuras arquitectónicas.

## Lo que ya está implementado

- Interfaz clara y adaptable a pantallas pequeñas.
- Visor 3D en tiempo real con órbita, zoom, enfoque y cuadrícula.
- Modelos de partida para productos, mobiliario, vehículos y decoración.
- Biblioteca arquitectónica: mansión de dos plantas, rascacielos con niveles y ventanas, castillo con torres cilíndricas y techos cónicos, villa moderna con grandes paños vidriados, pabellón con cúpula y puente arqueado.
- Sólidos y formas menos cuadradas: toroide, cono, cilindro, cápsula, nudo toroidal y jarrón con geometría de revolución.
- Detalles arquitectónicos procedurales como tejados a dos aguas, ventanas arqueadas, columnas, cúpulas, molduras, terrazas y escalones.
- Ajustes de color, acabado, iluminación, escala, rotación y posición.
- Duplicar, eliminar, deshacer y rehacer cambios básicos.
- Guardado automático en el navegador.
- Exportar modelo GLB, captura PNG y parámetros del proyecto JSON.
- Campo de texto que interpreta términos de algunas categorías para crear una base aproximada.
- Verificación de sintaxis JavaScript y despliegue automático con GitHub Actions.

## Fases de desarrollo

**Fase 1 · Editor base — implementada.** Visor 3D, cámara, materiales, iluminación, controles básicos y exportación.

**Fase 2 · Volúmenes y arquitectura — implementada en esta versión.** Formas orgánicas y varios modelos grandes con geometrías compuestas, tejados, arcos, ventanas y cúpulas.

**Fase 3 · Composición de escenas — siguiente.** Añadir distintas piezas sin reemplazar el diseño actual, seleccionar objetos de una escena, agruparlos y moverlos de forma independiente.

**Fase 4 · Medidas y documentación — planificada.** Unidades reales, cotas, guías, vistas ortográficas y planos básicos. Para uso de construcción real hará falta validar los diseños con profesionales y herramientas adecuadas.

**Fase 5 · Generación 3D con IA — planificada.** Conectar un servicio de generación de modelos desde descripciones o referencias. La integración debe hacerse en un backend seguro y no debe exponer claves de API en el navegador.

## Publicar

1. Abrí [Settings → Pages](https://github.com/gomeza2/Juego/settings/pages).
2. En **Build and deployment → Source**, seleccioná **GitHub Actions** y guardá. Es la configuración inicial de GitHub Pages.
3. Abrí [Actions](https://github.com/gomeza2/Juego/actions) y revisá el flujo **Deploy NEXO Studio to GitHub Pages**.
4. Cuando el flujo termine en verde, abrí https://gomeza2.github.io/Juego/

## Alcance actual

Los modelos son geometría procedural de partida, personalizable y exportable; no son planos de obra certificados. El texto elige un modelo base mediante palabras clave, no es todavía un generador que construya cualquier objeto mediante IA. Las piezas dentro de cada estructura arquitectónica son actualmente parte de un modelo agrupado; la composición libre entre modelos distintos está contemplada para la fase 3.

## Tecnología

HTML, CSS, JavaScript y Three.js 0.169.0. Three.js y la tipografía se cargan desde CDNs, por lo que se necesita conexión a internet para iniciar el editor.
