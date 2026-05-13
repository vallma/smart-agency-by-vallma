<p align="center">
  <img src="public/images/the-delegation.svg" width="256" alt="Smart Agency by Vallma Logo">
</p>

<p align="center">
  <b>Lanzar Smart Agency by Vallma · Experiencia Completa *</b>
</p>

> [!IMPORTANT]
> **\*** Esta experiencia requiere **BYOK (Bring Your Own Key)**. Necesitaréis una **[clave API de Gemini](https://aistudio.google.com/app/apikey)** para ejecutar la simulación. La integración profunda habilita soporte nativo para texto y generación multimodal (**Nano Banana**, **Lyria 3**, **Veo 3.1**). También podéis **clonar o hacer fork** de este repositorio para ejecutarlo en local.
<div align="center">
  <img src="public/images/the-delegation-UI.jpg" width="100%" alt="Smart Agency by Vallma Hero">
</div>

<br/>

## ¿Qué es Smart Agency by Vallma?

# Un playground 3D sin código para explorar, diseñar e interactuar con sistemas de IA Agéntica

Este proyecto está diseñado para **entusiastas de la IA, educadores y desarrolladores creativos** que quieran entender la colaboración multi-agente en una oficina 3D viva, sin escribir una sola línea de código.

## Primeros Pasos

1. **Instalar dependencias:**

```bash
npm install
```

2. **Iniciar el servidor de desarrollo:**

```bash
npm run dev
```

3. **Abrir la app:** Navegad a la URL local que aparece en el terminal (normalmente `http://localhost:3000/smart-agency-by-vallma`).

## Funcionalidades

### Sistema de IA Agéntica (v0.2.0)

- **Editor de Equipos (React Flow):** Cread vuestros propios [patrones de diseño multi-agente](https://developers.googleblog.com/developers-guide-to-multi-agent-patterns-in-adk/) mediante una interfaz interactiva basada en nodos.
- **6 Equipos Predefinidos:** Plantillas específicas por sector (Creative Agency, Film Studio, PR Agency, etc.) para empezar rápidamente.
- **Salidas Multimodales:** Generación de activos profesionales en texto, imagen (Nano Banana), música (Lyria 3) y vídeo (Veo 3.1) directamente desde vuestros equipos de agentes.
- **LLM por Agente:** Asignad distintos [Modelos Gemini](https://ai.google.dev/gemini-api/docs/models) a roles específicos (p. ej., Flash para velocidad, Pro para razonamiento).
- **Seguimiento de Costes y Tokens:** Estimación en tiempo real del uso y el coste para una transparencia total.
- **Flujos de Trabajo estilo PR:** Aprended sobre los flujos de Pull Request y revisión, donde los agentes con la propiedad `human-in-the-loop` requieren vuestra aprobación para continuar.
- **Guardarraíles:** Generación controlada con la opción `Auto-approve output`, que garantiza la calidad antes de la producción final del activo.
- **Registros Técnicos:** Mayor visibilidad sobre las trazas LLM en bruto, las llamadas a herramientas y las respuestas estructuradas de los agentes.

### Simulación Encarnada

- **Arquitectura Híbrida GPU/CPU:** Una **simulación 3D** de alto rendimiento construida con **Three.js WebGPU**, donde personajes autónomos impulsados por LLM colaboran en un espacio de trabajo físico compartido.
- **Pathfinding Inteligente:** Los NPCs utilizan un NavMesh para navegar por la oficina y reclamar "Puntos de Interés" específicos (escritorios, asientos, ordenadores) según su tarea actual. El pathfinding está impulsado por [three-pathfinding](https://github.com/donmccurdy/three-pathfinding).
- **Máquina de Estados Dinámica:** Los personajes transicionan de forma natural entre caminar, sentarse, trabajar y hablar, con bocadillos 3D y expresiones sincronizadas.

### Interfaz Interactiva

- **Visualizador de Flujo de Equipo:** Vista en tiempo real basada en nodos de la jerarquía de agentes y los flujos de tareas.
- **Revisiones PR Simuladas:** Modales interactivos para revisar propuestas de agentes, proporcionar feedback y fusionar tareas.
- **Overlay 3D en Tiempo Real:** Indicadores de estado y menús de interacción proyectados desde el espacio 3D en una UI refinada.
- **Inspector de Agentes:** Seleccionad cualquier agente para ver sus "pensamientos", misión e historial.
- **Kanban y Registros de Actividad:** Transparencia completa sobre el progreso de la agencia y las interacciones a nivel de herramienta.

## Stack Tecnológico en Profundidad

- **Motor:** [Three.js](https://threejs.org/) (WebGPU & TSL) para renderizado y cómputo avanzados.
- **UI:** [React](https://react.dev/) y [React Flow](https://reactflow.dev/) para la visualización de equipos basada en nodos.
- **IA:** [Gemini API](https://deepmind.google/technologies/gemini/) es el proveedor LLM principal. Seguimos las mejores prácticas oficiales de prompting para:
    - **Imágenes:** [Nano Banana Prompt Guide](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-nano-banana)
    - **Vídeo:** [Veo 3.1 Prompt Guide](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1)
    - **Música:** [Lyria 3 Prompt Guide](https://deepmind.google/models/lyria/prompt-guide/)
- **Estado:** [Zustand](https://github.com/pmndrs/zustand) para un store unificado y reactivo a lo largo del mundo 3D y la UI de React.
- **Assets 3D:** Modelos y animaciones personalizados rigged en [Blender](https://blender.org), usando un sistema de animación por instancias.

## Hoja de Ruta

- **World Building**
    - [ ] **Editor de Oficina/Espacio 3D:** Layout del espacio de trabajo y personalización de POIs mediante arrastrar y soltar.
    - [ ] **Entorno Dinámico:** Generación de props en tiempo real y modificación del entorno por parte de los agentes.
- **Interacciones Avanzadas**
    - [ ] **IA Encarnada Avanzada:** Integración más profunda entre el razonamiento de los agentes y las acciones en el mundo 3D físico.
    - [ ] **Animaciones Mejoradas:** Expresiones de personajes más ricas y animaciones más fluidas y conscientes del contexto.
    - [ ] **Interacción Espacial Humano-Agente:** Colaboración directa e interacciones multi-parte más ricas en la oficina 3D.
    - [ ] **Compartición de Conocimiento entre Agentes:** Memoria a largo plazo para equipos de agentes entre proyectos.
- **Refinamiento**
    - [ ] **Desacoplamiento de Arquitectura:** Mayor separación de la lógica central del entorno de simulación.
    - [ ] **Revisión de UX/UI:** Estilos CSS unificados basados en la identidad de marca "Smart Agency by Vallma".

## Nota del Desarrollador

Esta versión (**v0.2.0**) fue desarrollada íntegramente usando **Google Antigravity** como IDE principal e impulsada por **Gemini 3 Flash**.

## Licencia y Propiedad Intelectual

Este proyecto sigue un modelo de doble licencia:

- **Código Fuente (MIT):** Toda la lógica, los shaders y el código de UI son libres de usar, modificar y distribuir.
- **Modelos 3D y Assets (CC BY-NC 4.0):** La oficina 3D personalizada y los modelos de personajes son libres para uso personal y educativo, pero _no pueden_ usarse con fines comerciales sin permiso.
