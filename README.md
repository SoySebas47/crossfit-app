# CrossFit Mobile App (React Native + Expo)

Una aplicación móvil moderna diseñada para atletas y practicantes de **CrossFit**, con estética de alto rendimiento (modo oscuro, colores de alto contraste volt/carmesí/cian) y navegación fluida entre 5 secciones principales.

Esta versión es **100% frontend y diseño interactivo** (sin persistencia en base de datos), ideal para validar flujos, ergonomía de pantalla y experiencia de usuario.

---

## 📱 Estructura de Navegación y Pantallas

La app cuenta con una barra inferior de 5 pestañas principales (`BottomTabNavigator`) y una pila de navegación para pantallas de detalle (`RootNavigator`):

### 1. ⚡ Inicio (`HomeScreen.tsx`)
- **Tarjeta Destacada (WOD del Día)**: Presenta la sesión clave ("TITAN 24") con tiempo estimado y botón directo para comenzar el entrenamiento.
- **Resumen Último Entrenamiento**: Tarjeta con score, calorías quemadas y frecuencia cardíaca media del último benchmark (Fran), con enlace a la vista detallada en Historial.
- **Constancia Semanal**: Gráfico de barras de 7 días (L M X J V S D) con días completados, volumen de kilos movidos y horas de entreno.
- **Widget de Descanso Rápido**: Previsualización de temporizador de 90s con presets y enlace directo a la pantalla de Descanso.
- **Movimientos Recientes**: Carrusel de ejercicios destacados y botón hacia la Biblioteca.
- **Accesos directos rápidos**: Botones inferiores para navegar instantáneamente.

### 2. 🏋️ Entrenar (`WorkoutScreen.tsx`)
- **Plantilla de Sesión Completa**:
  - Calentamiento específico (movilidad y técnica con barra vacía).
  - Bloque de Fuerza (Clean & Jerk pesado con 5 series progresivas).
  - Bloque Metcon ("Ghost Protocol" 4 RFT con Thrusters, Chest-to-Bar y Burpees Facing Bar).
- **Interactividad visual**:
  - Selector de división: **RX** vs **Escalado**.
  - Filtro por pestañas: *Todos*, *Calentamiento*, *Fuerza*, *Metcon*.
  - Tabla de series: Serie #, Registro Anterior, Objetivo de Reps, Peso (kg) y Casilla de verificación interactiva (`Checkmark`) para simular la finalización de series en tiempo real.
  - Botón "+ Añadir Serie" funcional en estado.
  - Barra de progreso que calcula el % completado de la sesión en vivo.
  - Botón "Finalizar WOD" con modal de resumen y celebración del entrenamiento.

### 3. 📜 Historial (`HistoryScreen.tsx` & `WorkoutDetailScreen.tsx`)
- **Métricas Globales del Atleta**: 48 sesiones, 12 PRs, 36 horas acumuladas, 88% constancia.
- **Filtros Rápidos**: *Todos*, *FOR TIME*, *AMRAP*, *HEAVY SINGLE*, *EMOM*.
- **Lista de WODs Históricos**: Fran, Murph (con chaleco), Heavy Snatch Complex, Cindy, DT, Remo + Burpees.
- **Detalle Visual (`WorkoutDetailScreen`)**:
  - Marcador de tiempo/score en grande con medalla de logro.
  - Desglose movimiento por movimiento con estándares cumplidos.
  - Visualizador de zonas de intensidad cardíaca (Z2 a Z5 de umbral láctico).
  - Cuaderno de notas y sensaciones del atleta.
  - Botón para repetir el WOD.

### 4. ⏱️ Descanso (`RestScreen.tsx`)
- **Marcador LED Digital de CrossFit Box**: Visualización de minutos y segundos en números grandes con indicador de estado (En marcha / Pausado / ¡Tiempo!).
- **Modos de Temporizador**:
  - *Descanso entre series*: Cuenta regresiva configurable.
  - *EMOM*: Cada minuto en el minuto (con contador de rondas).
  - *Tabata*: 8 rondas de alta intensidad.
  - *For Time*: Cronómetro ascendente.
- **Controles táctiles**: Play/Pausa en tiempo real, Reset, incrementos rápidos (+15s, +30s, +60s, -15s) y botón de aviso acústico ("Beep").
- **Presets de Descanso**: 30s rápido, 60s hipertrofia, 90s fuerza, 2:00 pesado, 3:00 1RM.
- **Próxima serie sugerida**: Tarjeta con el ejercicio y peso objetivo en espera.

### 5. 📖 Ejercicios (`ExercisesScreen.tsx`)
- **Buscador en tiempo real**: Filtra instantáneamente por nombre, tipo de ejercicio o término de búsqueda.
- **Filtro por Grupo Muscular**: Piernas, Espalda, Hombros, Core, Cuerpo Completo.
- **Filtro por Material**: Barra, Mancuerna, Kettlebell, Gimnásticos, Cajón, Cuerda, Cardio.
- **12 Movimientos icónicos de CrossFit**: Thrusters, Snatch, Bar Muscle-Up, Clean & Jerk, Toes-to-Bar, Double Unders, Box Jump Over, Burpee Over Bar, HSPU, Deadlift, Wall Balls, Echo Bike.
- **Ficha Técnica (Modal)**:
  - Estándares de movimiento oficiales (puntos clave para repetición válida RX).
  - Consejos de coaching.
  - Errores comunes que provocan "No Rep".

---

## 🚀 Cómo ejecutar la aplicación

El proyecto se encuentra ubicado en:
`C:\Users\Usuario\.gemini\antigravity-ide\scratch\crossfit-app`

1. Abre tu terminal en la carpeta del proyecto:
```bash
cd C:\Users\Usuario\.gemini\antigravity-ide\scratch\crossfit-app
```

2. Inicia el servidor de desarrollo de Expo:
```bash
npx expo start
```

3. Para visualizar la app en tu móvil:
   - Abre la app **Expo Go** en tu smartphone (Android o iOS).
   - Escanea el código QR que aparecerá en la consola.
   - ¡Listo! Podrás navegar e interactuar de inmediato con todas las pantallas y animaciones.
