# NEXO Studio

Editor 3D en el navegador para explorar conceptos de productos, interiores, arquitectura y formas orgánicas.

## Funciones actuales

- Visor 3D con cámara orbital, zoom y enfoque del modelo.
- Interfaz clara y adaptable.
- Biblioteca de productos, muebles, vehículos, formas orgánicas y estructuras arquitectónicas: mansión, rascacielos, castillo, villa, pabellón, puente, arco, cúpula, escalera, columna, pirámide, árbol, roca y fuente, entre otras.
- Acabados mate, satín, brillante y metálico.
- **Texturas procedurales** generadas en el navegador: madera, mármol, hormigón, tela, metal rayado, fibra de carbono, terrazo, ladrillo, piedra natural y baldosas.
- Mapas de color, rugosidad y relieve para dar más lectura a las superficies.
- Ambiente de estudio para producir reflejos más naturales en metales y materiales brillantes.
- Tres niveles de calidad gráfica: estándar, alta y ultra, con distintos límites de resolución y tamaño de sombras.
- Escala de textura ajustable.
- Ajustes de color, escala, rotación, posición e iluminación.
- Duplicación, eliminación, deshacer y rehacer cambios básicos.
- Guardado automático local, exportación GLB, captura PNG y parámetros JSON.
- El campo de ideas reconoce nombres de modelos, algunos colores y varios materiales.
- GitHub Actions comprueba la sintaxis JavaScript del módulo antes de la publicación.

## Fases

**Fase 1 · Editor base:** implementada.

**Fase 2 · Formas y arquitectura:** implementada como biblioteca de estructuras y componentes con geometría procedural.

**Fase 3 · Composición de escenas:** siguiente. Permitir agregar varios objetos a una escena sin reemplazar lo que ya existe, seleccionarlos de forma independiente, agruparlos y moverlos por separado.

**Fase 4 · Medidas y planos:** planificada. Incluir unidades reales, cotas, guías y vistas ortográficas.

**Fase 5 · IA generativa:** planificada. La generación arbitraria de modelos desde texto requiere conectar un servicio de IA 3D a un backend seguro; la función actual elige un modelo base a partir de palabras clave.

## Publicar

1. Abrí [Settings → Pages](https://github.com/gomeza2/Juego/settings/pages).
2. En **Build and deployment → Source**, elegí **GitHub Actions** si todavía no está seleccionado.
3. Revisá el flujo [Actions](https://github.com/gomeza2/Juego/actions).
4. Cuando el despliegue termine correctamente, abrí https://gomeza2.github.io/Juego/

## Alcance y rendimiento

Las texturas se generan dentro del navegador, no se descargan imágenes de material. La opción Ultra aumenta la resolución de salida y de las sombras, por lo que puede requerir más memoria y potencia gráfica. Los modelos arquitectónicos son conceptos visuales y no planos certificados para construcción.

## Tecnología

HTML, CSS, JavaScript y Three.js 0.169.0, con OrbitControls, GLTFExporter y RoomEnvironment. Three.js y la tipografía se cargan desde CDN, así que se necesita conexión a internet.
