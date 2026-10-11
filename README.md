# NEXO Studio

Editor 3D en el navegador para crear conceptos de productos, interiores, formas orgánicas y arquitectura. Está construido con HTML, CSS, JavaScript y Three.js.

## Fases del proyecto

### Fase 1 · Editor y materiales — implementada
- Visor 3D con órbita, zoom y enfoque.
- Iluminación de estudio, reflejos de entorno y sombras.
- Acabados mate, satín, brillante y metálico.
- Texturas procedurales: madera, mármol, hormigón, tela, metal rayado, fibra de carbono, terrazo, ladrillo, piedra y baldosas.
- Tres niveles gráficos: estándar, alta y ultra.
- Color, escala, rotación, posición, duplicación y eliminación.
- Guardado automático local y deshacer/rehacer cambios.

### Fase 2 · Formas y arquitectura — implementada
La biblioteca contiene productos, dispositivos, muebles, vehículos, formas orgánicas y modelos de arquitectura: mansión, rascacielos, castillo, villa, pabellón, puente, arco, cúpula, escalera, columna, pirámide, árbol, roca y fuente, entre otros. Se generan con geometría procedural, no con capturas estáticas.

### Fase 3 · Composición de escenas — implementada
- Modo **Añadir piezas** para mantener lo existente al incorporar otro modelo.
- Jerarquía de objetos con selección independiente.
- Mostrar/ocultar objetos.
- Agrupar varios objetos seleccionados y separar grupos.
- Duplicación y borrado de objetos.
- Transformaciones y materiales por objeto.
- Guardado y recuperación de escenas con objetos, grupos, materiales, vistas y ajustes.
- Exportación de la escena completa a JSON y de la geometría a GLB.
- Importación de modelos GLB externos y apertura de proyectos JSON desde el menú **Exportar**.

### Fase 4 · Medidas y planos de referencia — implementada
- Unidades mostradas en m, cm, mm y ft.
- Dimensiones X/Y/Z del volumen envolvente y cotas visuales.
- Vistas ortográficas superior, frontal y lateral, además de perspectiva.
- Exportación de una ficha SVG con las medidas de referencia y datos del objeto.
- El archivo JSON conserva las transformaciones y la estructura completa de la escena.
- Importación de proyectos JSON guardados; los modelos generados almacenados en IndexedDB pueden recuperarse en el mismo navegador.

**Importante:** las cotas describen la caja envolvente del objeto. La ficha SVG sirve como referencia conceptual; no es un plano constructivo certificado, no comprueba resistencia estructural, tolerancias, códigos de construcción ni preparación para fabricación.

### Fase 5 · Edición de precisión y espacio claro — implementada
- Interfaz de trabajo con fondo claro y paneles blancos, manteniendo el visor 3D en tonos neutros.
- Rotación numérica independiente alrededor de X, Y y Z, además del control rápido de giro sobre Y.
- Ajuste de posición a una cuadrícula de 0,5 m, guardado con el proyecto y respetando las unidades visibles.
- Acción «Centrar y apoyar en el suelo» para recentrar una pieza en X/Z y llevar la base a Y = 0.
- La restauración de modelos guardados enfoca únicamente la pieza seleccionada, sin saltar a otra mientras se recuperan varios assets.

### Fase 6 · Productividad en la escena — implementada
- Renombrar cada objeto para organizar composiciones grandes, con el nombre visible en la jerarquía y conservado en el proyecto.
- Atajos: **Ctrl/Cmd + D** para duplicar, **F** para enfocar la pieza seleccionada, además de los atajos existentes para deshacer, rehacer y crear un proyecto.
- Los atajos de edición no se disparan mientras el usuario escribe en campos de texto, número o listas desplegables.

### Fase 7 · Asistente de diseño e IA 3D — parcialmente implementada
El asistente procedural local reconoce familias de objetos y puede componer algunas escenas desde una descripción. Por ejemplo, «mansión con cuatro árboles y una fuente de mármol» crea un conjunto a partir de modelos disponibles. Esto funciona en la publicación estática sin una API externa.

También está preparado el conector para generación real mediante el flujo de dos pasos de [Meshy Text-to-3D API](https://docs.meshy.ai/en/api/text-to-3d): primero genera geometría preliminar y luego crea el modelo texturizado con materiales PBR. El modelo final se importa al visor como GLB y se guarda en IndexedDB del navegador para poder recuperar la escena en ese mismo perfil del navegador. También podés importar archivos GLB de otros programas y abrir JSON guardados desde el menú de exportación.

**La generación real no funciona desde GitHub Pages por sí sola.** Pages es estático y no ejecuta la función de servidor de este repositorio. Para activarla, hace falta desplegar el proyecto en un hosting que ejecute funciones Node, configurar las dos variables privadas siguientes y tener una cuenta del proveedor con créditos disponibles:
- `MESHY_API_KEY`: clave privada del proveedor, únicamente en el servidor.
- `NEXO_AI_ACCESS_CODE`: código privado que elegís y que la web solicitará al usar el botón **IA 3D**.

El backend está en `api/ai3d.js`. El código de acceso evita que el endpoint quede abierto simplemente por conocer la dirección, pero no reemplaza una protección profesional contra abuso, límites de uso o controles de cuenta al lanzar un servicio público. No pongas estas variables en `index.html`, commits, README ni archivos descargables.

#### Activar el endpoint real
1. Importá este repositorio en un proveedor de hosting compatible con funciones Node, por ejemplo [Vercel](https://vercel.com/).
2. En la configuración del proyecto, añadí las variables de entorno `MESHY_API_KEY` y `NEXO_AI_ACCESS_CODE` como secretos de producción. Elegí tu propio código de acceso.
3. Volvé a desplegar el proyecto. En la URL del hosting, el endpoint `/api/ai3d` se ejecuta en el servidor; en `github.io`, el editor sigue funcionando sin la generación externa.
4. Abrí el editor desplegado en ese hosting, describí el modelo y pulsá **IA 3D**. El navegador te pedirá el código privado al iniciar la sesión.
5. Tené en cuenta que generar la geometría y después aplicar texturas utiliza los créditos del proveedor. Revisá sus [documentos de API](https://docs.meshy.ai/en/api/text-to-3d), [guía de inicio](https://docs.meshy.ai/en/api/quick-start) y condiciones de uso antes de activar la función.

Si el endpoint no está configurado, el asistente local y todas las herramientas de modelado siguen disponibles; no se simula una respuesta de IA.

### Fase 8 · Composición avanzada de escenas — implementada
- Seleccioná piezas con las casillas de la jerarquía y alineá sus bordes iniciales, centros o bordes finales.
- Elegí el eje X, Y o Z para que la alineación sirva tanto para objetos de escritorio como para elementos verticales de edificios.
- Distribuí uniformemente tres o más piezas a lo largo de un eje; la herramienta conserva los tamaños y el espacio entre extremos, y avisa si no hay espacio suficiente para evitar superposiciones.
- Las acciones se integran con deshacer/rehacer y guardado automático.
- La alineación usa las cajas envolventes visibles en el modelo, por lo que sirve para composición y referencia, no para tolerancias de fabricación.

### Fase 9 · Componentes arquitectónicos paramétricos — implementada
- Biblioteca nueva con pared modular, piso/losa, puerta y ventana.
- Medidas editables X/Y/Z desde el panel de propiedades; para los pisos, Y representa el espesor y Z el fondo.
- Unidades compatibles con m, cm, mm y ft. Los componentes guardan sus dimensiones personalizadas en escenas JSON y se incluyen en la exportación GLB.
- Puertas con marco, hoja y manija; ventanas con marco y panel de vidrio; paredes y losas como volúmenes independientes que admiten acabados y texturas.
- El prompt local reconoce pedidos simples de pared, piso, puerta y ventana, además de la biblioteca visual.
- Son elementos conceptuales independientes: la ventana no perfora automáticamente una pared ni se generan uniones constructivas, instalaciones o cálculos estructurales. Para planos de obra hacen falta medidas y validaciones profesionales.

### Fase 10 · Lienzo vacío y constructor de escenas — implementada
- Un proyecto nuevo arranca en blanco, sin obligarte a borrar un modelo de muestra. Los proyectos anteriores siguen recuperándose desde el almacenamiento local.
- Agregado rápido desde el panel de escena: cubo, esfera, cilindro, cono, toroide, cápsula, pirámide, prisma hexagonal, estrella sólida, octaedro, engranaje, cuña/rampa, tubo hueco y piezas arquitectónicas.
- El constructor local ahora puede interpretar pedidos con varios objetos y cantidades en español (por ejemplo, «3 cubos azules y 2 esferas rojas»), acomodarlos en una cuadrícula o en una composición alrededor de un edificio, y elegir colores por objeto.
- Reconoce medidas explícitas en componentes arquitectónicos, por ejemplo «pared de 4 m de ancho y 3 m de alto» o dimensiones tipo «4x3x0,2».
- Distingue acabados y texturas comunes al generar modelos; cada pieza creada conserva su propio estilo y se puede cambiar individualmente.
- **Límite de la IA:** el constructor local es un intérprete procedural por reglas, no un modelo de lenguaje ni un generador neuronal. La generación externa real de mallas y texturas requiere desplegar la API de servidor y configurar sus secretos privados; GitHub Pages no la ejecuta por sí solo.

### Fase 11 · Herramientas de modelado editable — implementada
- Biblioteca visual de círculo/disco, triángulo extruido, rectángulo de bordes suaves, polígono de 3 a 16 lados, cubo con bisel y espacio interior con piso y tres paredes (frente abierto para editar desde dentro).
- Escala independiente X/Y/Z, además de escala uniforme, posición y rotación. Los cambios permiten estirar o aplanar un objeto sin afectar a los otros ejes.
- Las paredes pueden llevar un hueco geométrico pasante para puerta o ventana; se configuran el ancho y el alto de la abertura, y el hueco se conserva al guardar el proyecto.
- Dimensiones paramétricas para las formas nuevas, control del número de lados del polígono y radio de bisel para placas/cubos redondeados.
- Los proyectos JSON guardan dimensiones, escalas, biseles, cantidad de lados y aberturas; la exportación GLB conserva la geometría generada.
- Inspirado en herramientas de flujo 3D como mover/rotar/escalar, extrusión y bisel, adaptadas a una interfaz propia más directa. No pretende reemplazar un editor de malla completo tipo Blender: todavía no tiene selección de caras/vértices, cortes libres ni booleanos arbitrarios.
- El primer arranque migra la plantilla antigua de auriculares al lienzo vacío; los proyectos con nombre/escena propios se siguen restaurando.


### Fase 12 · Manipulación 3D directa — implementada
- Manipuladores interactivos dentro del visor para mover, rotar y escalar un objeto arrastrando sus ejes y anillos, en lugar de depender únicamente de campos numéricos.
- Herramientas **Mover**, **Rotar** y **Escalar**, más modo **Orbitar** para esconder el manipulador cuando quieras navegar libremente por la escena.
- Atajos **G** (mover), **R** (rotar) y **S** (escalar), inspirados en los flujos comunes de edición 3D.
- El ajuste de posición a la cuadrícula también se aplica al movimiento con el manipulador. La navegación de cámara se pausa mientras arrastrás el gizmo y se reanuda al terminar.
- Los campos de posición, rotación y escala se sincronizan con el arrastre; la transformación queda en el historial de deshacer/rehacer y en el guardado local.
- El manipulador se reconstruye al cambiar entre perspectiva y vistas ortográficas para seguir usando la cámara activa.
- Esta fase agrega transformación de objetos completos. Todavía no incluye edición libre de vértices/caras ni operaciones booleanas arbitrarias.

## Publicación en GitHub Pages

La versión pública está prevista en https://gomeza2.github.io/Juego/

El workflow `.github/workflows/deploy.yml` comprueba la sintaxis JavaScript del editor y del endpoint, y ejecuta pruebas de regresión del constructor local (cantidades, colores, texturas y conversiones de medidas) antes de publicar el contenido. Para activar o revisar Pages:
1. Abrí [Settings → Pages](https://github.com/gomeza2/Juego/settings/pages) y seleccioná **GitHub Actions** como fuente.
2. Revisá las ejecuciones en [Actions](https://github.com/gomeza2/Juego/actions).

## Tecnología y límites

- Three.js 0.169.0, OrbitControls, GLTFExporter, GLTFLoader, RoomEnvironment y geometría procedural.
- Las bibliotecas se cargan desde CDN; el editor necesita conexión a internet.
- Los proyectos locales se guardan en el navegador. Los modelos IA cacheados se guardan en IndexedDB en ese perfil de navegador, así que conviene exportar un GLB y un JSON si querés conservar una copia portable.
- El constructor local interpreta descripciones mediante reglas y las convierte en piezas; no equivale a un modelo generativo neuronal. La generación externa real necesita su función de servidor activa.
- Los modelos arquitectónicos y las medidas son de diseño conceptual, no documentación lista para construir.
