import { ExerciseItem } from '../types';

export const EXERCISES_DATA: ExerciseItem[] = [
  // ==========================================
  // PECHO (CHEST)
  // ==========================================
  {
    id: 'ex-pecho-1',
    name: 'Bench Press (Press de Banca)',
    category: 'Fuerza',
    muscleGroup: 'Pecho',
    equipment: 'Barra Olímpica',
    difficulty: 'Intermedio',
    level: 'Intermedio',
    description: 'Levantamiento de fuerza fundamental en banco plano donde la barra desciende de forma controlada hasta rozar el esternón y se presiona hasta el bloqueo total.',
    execution: '1. Acuéstate con los ojos directamente bajo la barra, pies planos y firmes contra el suelo.\n2. Retrae y deprime activamente las escápulas, creando un arco lumbar anatómico seguro.\n3. Desenvaina la barra y desciende en arco suave con los codos a 45°-60° respecto al torso hasta hacer contacto ligero en el tercio inferior del esternón.\n4. Empuja con fuerza explosiva empujando el suelo con los pies (leg drive) y bloquea los codos arriba.',
    injuryPrevention: [
      'Mantén los codos en un ángulo de 45° a 70° respecto al torso; nunca a 90° para evitar pinzamiento del manguito rotador.',
      'Mantén las muñecas neutras y alineadas con los antebrazos; aprieta la barra con firmeza sobre la base de la palma.',
      'Nunca despegues los glúteos del banco durante el empuje máximo para no sobrecargar las vértebras lumbares.',
      'Controla siempre la bajada sin rebotar la barra en las costillas o esternón.'
    ],
    primaryMuscles: ['Pectoral Mayor (haz esternocostal)', 'Pectoral Menor'],
    secondaryMuscles: ['Tríceps Braquial', 'Deltoides Anterior', 'Serrato Anterior', 'Dorsal Ancho (estabilizador)'],
    benefits: [
      'Desarrollo máximo de fuerza y masa muscular en la caja torácica.',
      'Aumento de la densidad ósea en el tren superior.',
      'Transferencia de empuje directo para flexiones, dips y empujes atléticos.'
    ],
    graphicType: 'bench_press',
    standards: [
      'Glúteos y escápulas en contacto con el banco durante toda la repetición.',
      'La barra debe contactar claramente el pecho.',
      'Bloqueo simultáneo y completo de ambos codos en la vertical.'
    ],
    tips: [
      'Imagina que quieres doblar la barra con las manos para activar el dorsal ancho.',
      'Inhala profundo y aprieta el core antes de iniciar el descenso.'
    ],
    commonErrors: [
      'Rebotar la barra en el esternón.',
      'Abrir los codos en forma de T perpendicular.',
      'Levantar la cabeza o la cadera del banco.'
    ],
    prsRecord: '120 kg / 265 lbs'
  },
  {
    id: 'ex-pecho-2',
    name: 'Push-Ups (Flexiones de Pecho)',
    category: 'Gimnásticos',
    muscleGroup: 'Pecho',
    equipment: 'Peso Corporal',
    difficulty: 'Principiante',
    level: 'Principiante',
    description: 'Empuje horizontal en plancha isométrica donde el cuerpo desciende en bloque rígido hasta que el pecho toca el suelo y regresa a extensión total.',
    execution: '1. Manos apoyadas en el suelo a la anchura de hombros o ligeramente más amplias, dedos abiertos.\n2. Contrae glúteos, cuádriceps y abdomen para formar una línea recta perfecta desde la cabeza a los talones.\n3. Desciende flexionando los codos hacia atrás formando una flecha con el cuerpo hasta que el pecho toque el suelo.\n4. Presiona con las palmas alejando el suelo hasta el bloqueo total de codos.',
    injuryPrevention: [
      'Evita que la pelvis caiga hacia el suelo (lordosis lumbar); aprieta glúteos y ombligo hacia la columna.',
      'Dirige los codos hacia atrás a 45°, no perpendiculares hacia afuera.',
      'Mantén la cabeza neutra mirando hacia el suelo a 20 cm por delante de tus manos; no hiper-extiendas el cuello.'
    ],
    primaryMuscles: ['Pectoral Mayor', 'Tríceps Braquial'],
    secondaryMuscles: ['Deltoides Anterior', 'Core (Recto y Transverso)', 'Serrato Anterior'],
    benefits: [
      'Fuerza funcional de empuje sin necesidad de equipamiento.',
      'Refuerzo de la estabilidad escapular y manguito de los rotadores.',
      'Acondicionamiento metabólico y resistencia muscular localizada.'
    ],
    graphicType: 'push_ups',
    standards: [
      'El pecho debe tocar el suelo en cada repetición.',
      'Cuerpo en bloque rígido sin que las rodillas o cadera toquen antes que el pecho.',
      'Extensión completa de codos en la posición superior.'
    ],
    tips: [
      'Empuja activamente el suelo en la cima para redondear suavemente las escápulas (protracción).',
      'Mantén los talones juntos para activar mejor los glúteos.'
    ],
    commonErrors: [
      'Caderas caídas dejando la columna arqueada.',
      'Rango incompleto sin tocar el pecho abajo o sin bloquear arriba.',
      'Cuello colapsado intentando tocar el suelo con la barbilla.'
    ],
    prsRecord: 'Max Unbroken: 45 reps'
  },
  {
    id: 'ex-pecho-3',
    name: 'Ring Dips (Fondos en Anillas)',
    category: 'Gimnásticos',
    muscleGroup: 'Pecho',
    equipment: 'Anillas',
    difficulty: 'Intermedio',
    level: 'Intermedio',
    description: 'Fondo gimnástico en suspensión inestable que recluta fibras pectorales profundas y demanda control neuromuscular superior.',
    execution: '1. Sube a soporte de anillas con codos bloqueados y palmas ligeramente rotadas hacia afuera (turnout).\n2. Inclina el torso sutilmente hacia adelante para priorizar la activación pectoral.\n3. Desciende flexionando codos controladamente hasta que los hombros queden por debajo del nivel de los codos.\n4. Empuja con fuerza manteniendo las anillas pegadas al cuerpo hasta volver al bloqueo superior.',
    injuryPrevention: [
      'No desciendas más allá de tu rango activo de movilidad torácica para no comprometer la cápsula articular anterior del hombro.',
      'Mantén las anillas pegadas a tus costados en todo momento; si se separan, el estrés sobre los tendones aumenta drásticamente.',
      'Deprime activamente las escápulas; no permitas que los hombros suban tapando las orejas.'
    ],
    primaryMuscles: ['Pectoral Mayor (fibras inferiores y esternales)', 'Tríceps Braquial'],
    secondaryMuscles: ['Deltoides Anterior', 'Pectoral Menor', 'Romboides', 'Core Estabilizador'],
    benefits: [
      'Nivel extremo de fuerza y estabilidad en la cintura escapular.',
      'Estimulación hipertrófica en la porción inferior del pecho y tríceps.',
      'Movimiento prerrequisito indispensable para el Ring Muscle-Up.'
    ],
    graphicType: 'dips',
    standards: [
      'Inicio con soporte en anillas con codos extendidos.',
      'Biceps/hombro desciende por debajo de la línea del codo.',
      'Bloqueo final con anillas controladas sin balanceo excesivo.'
    ],
    tips: [
      'Gira las anillas hacia afuera en la parte alta (turn-out) para demostrar control total.',
      'Cruza los tobillos o mantén piernas en L si tienes suficiente fuerza de core.'
    ],
    commonErrors: [
      'Dejar que las anillas se abran hacia los laterales.',
      'Profundidad insuficiente por miedo a la inestabilidad.',
      'Subir con un hombro más rápido que el otro.'
    ],
    prsRecord: 'Max Unbroken: 22 reps'
  },
  {
    id: 'ex-pecho-4',
    name: 'Dumbbell Incline Press (Press Inclinado)',
    category: 'Fuerza',
    muscleGroup: 'Pecho',
    equipment: 'Mancuerna',
    difficulty: 'Principiante',
    level: 'Principiante',
    description: 'Empuje con mancuernas en banco inclinado a 30° con trayectoria convergente para enfatizar la porción clavicular superior del pecho.',
    execution: '1. Ajusta el banco entre 30° y 45° de inclinación.\n2. Sube las mancuernas impulsándolas con las rodillas hasta el pecho.\n3. Retrae escápulas firmes contra el respaldo y apoya pies planos.\n4. Presiona en arco suave convergiendo las mancuernas sobre la parte superior del pecho sin chocarlas.\n5. Desciende en 2-3 segundos sintiendo el estiramiento pectoral.',
    injuryPrevention: [
      'No excedas los 45° de inclinación en el banco o el esfuerzo pasará casi en su totalidad al deltoides anterior.',
      'Evita abrir los codos en 90°; mantén un ángulo natural en flecha (aprox. 50°-60°).',
      'Baja las mancuernas hacia los muslos al terminar la serie, nunca las tires lateralmente con los hombros en rotación.'
    ],
    primaryMuscles: ['Pectoral Mayor (haz clavicular / superior)'],
    secondaryMuscles: ['Deltoides Anterior', 'Tríceps Braquial', 'Serrato Anterior'],
    benefits: [
      'Desarrollo del grosor de la parte superior del pecho.',
      'Equilibrio bilateral al trabajar cada brazo de forma independiente.',
      'Menor estrés en la articulación del hombro gracias al agarre neutro/semipronado.'
    ],
    graphicType: 'incline_press',
    standards: [
      'Las mancuernas deben descender hasta el nivel del pecho superior.',
      'Extensión completa de brazos en la cima.',
      'Espalda y glúteos firmes en el banco.'
    ],
    tips: [
      'Mantén los antebrazos completamente verticales en todo el recorrido.',
      'Pausa medio segundo en la posición más baja para eliminar el rebote elástico.'
    ],
    commonErrors: [
      'Chocar violentamente las mancuernas arriba.',
      'Despegar las escápulas del banco para alcanzar más altura.',
      'Inclinación de banco demasiado vertical.'
    ],
    prsRecord: '36 kg / 80 lbs cada mano'
  },

  // ==========================================
  // ESPALDA (BACK)
  // ==========================================
  {
    id: 'ex-espalda-1',
    name: 'Deadlift (Peso Muerto)',
    category: 'Fuerza',
    muscleGroup: 'Espalda',
    equipment: 'Barra Olímpica',
    difficulty: 'Principiante',
    level: 'Principiante',
    description: 'El levantamiento rey de la cadena posterior. Levanta la barra desde el suelo mediante bisagra de cadera hasta la bipedestación completa.',
    execution: '1. Pies a la anchura de las caderas, barra a 2 cm de las espinillas sobre la mitad del pie.\n2. Bisagra de cadera hacia atrás con espalda neutra y agarre prono por fuera de las piernas.\n3. Abre el pecho, tira los hombros hacia atrás y activa los dorsales como si exprimieras naranjas en las axilas.\n4. Empuja el suelo con las piernas manteniendo la barra en contacto con las espinillas y muslos hasta erguirte con bloqueo de caderas y rodillas.',
    injuryPrevention: [
      'Mantén la columna en posición neutra en todo momento; jamás redondees la zona lumbar al despegar la barra del suelo.',
      'La barra debe viajar rozando las piernas; si se separa, el brazo de palanca destruye la zona lumbar.',
      'No hiperextiendas la espalda hacia atrás al finalizar la repetición; es suficiente con bloquear caderas y glúteos.',
      'Utiliza calzado plano sin cámara de aire o entrena descalzo para máxima propiocepción y base firme.'
    ],
    primaryMuscles: ['Erectores Espinales', 'Dorsal Ancho', 'Glúteo Mayor', 'Isquiosurales'],
    secondaryMuscles: ['Trapecio (superior, medio e inferior)', 'Romboides', 'Antebrazos (agarre)', 'Core'],
    benefits: [
      'Fuerza máxima y potencia atlética en toda la cadena posterior.',
      'Protección vertebral y refuerzo neuromuscular de la postura diaria.',
      'Aumento masivo de la densidad mineral ósea corporal.'
    ],
    graphicType: 'deadlift',
    standards: [
      'La barra inicia inmóvil en el suelo.',
      'Extensión simultánea y completa de cadera y rodillas al finalizar.',
      'Hombros alineados o ligeramente por detrás de la barra en el bloqueo.'
    ],
    tips: [
      'Tensa la barra ("pull the slack") antes de despegarla del suelo para evitar tirones secos.',
      'Visualiza empujar el suelo lejos de ti en lugar de tirar de la barra hacia arriba.'
    ],
    commonErrors: [
      'Redondear la columna lumbar al despegar cargas elevadas.',
      'Subir la cadera primero dejando la espalda horizontal como una grúa.',
      'Hiper-extensión excesiva de espalda en la cima.'
    ],
    prsRecord: '190 kg / 418 lbs'
  },
  {
    id: 'ex-espalda-2',
    name: 'Strict Pull-Ups (Dominadas Estrictas)',
    category: 'Gimnásticos',
    muscleGroup: 'Espalda',
    equipment: 'Gimnásticos',
    difficulty: 'Intermedio',
    level: 'Intermedio',
    description: 'Tracción vertical estricta colgado de la barra hasta pasar la barbilla por encima, sin balanceo ni impulso de cadera.',
    execution: '1. Cuélgate con agarre prono ligeramente más ancho que los hombros y brazos totalmente extendidos.\n2. Activa las escápulas tirándolas hacia abajo y hacia el centro (retracción y depresión).\n3. Tira con los codos apuntando hacia tus costillas y hacia el suelo.\n4. Eleva el cuerpo hasta que la barbilla supere con claridad la barra.\n5. Desciende de forma controlada hasta la suspensión completa sin soltar la tensión escapular.',
    injuryPrevention: [
      'Activa siempre las escápulas antes de comenzar la tracción; no tires de golpe con los hombros relajados en las orejas.',
      'Evita adelantar la barbilla o hiper-extender el cuello forzando las vértebras cervicales.',
      'Desciende con control excéntrico; no te dejes caer a plomo al estirar los brazos para proteger los tendones del bíceps.'
    ],
    primaryMuscles: ['Dorsal Ancho', 'Redondo Mayor', 'Bíceps Braquial'],
    secondaryMuscles: ['Romboides', 'Trapecio Medio e Inferior', 'Braquial Anterior', 'Core (Hollow)'],
    benefits: [
      'Construcción de la clásica espalda en V ancha y densa.',
      'Descompresión natural de la columna vertebral bajo peso corporal.',
      'Fuerza relativa funcional de tracción para cualquier disciplina.'
    ],
    graphicType: 'pull_ups',
    standards: [
      'Comienzo desde suspensión completa con codos bloqueados.',
      'La barbilla debe pasar claramente el plano horizontal superior de la barra.',
      'Sin balanceo de piernas ni kipping (estrictas).'
    ],
    tips: [
      'Piensa en llevar los codos a tus bolsillos traseros en lugar de tirar con las manos.',
      'Mantén los pies juntos y piernas ligeramente al frente en posición de hollow.'
    ],
    commonErrors: [
      'Kipping o patear para completar la repetición.',
      'No bloquear los brazos en la parte inferior.',
      'Estirar el cuello hacia arriba como una tortuga.'
    ],
    prsRecord: 'Max Unbroken Estrictas: 20 reps'
  },
  {
    id: 'ex-espalda-3',
    name: 'Pendlay Barbell Row (Remo con Barra)',
    category: 'Fuerza',
    muscleGroup: 'Espalda',
    equipment: 'Barra Olímpica',
    difficulty: 'Intermedio',
    level: 'Intermedio',
    description: 'Tracción horizontal explosiva con el torso estrictamente paralelo al suelo, iniciando y terminando cada repetición sobre la tarima.',
    execution: '1. Pies a la anchura de caderas, barra sobre el empeine como en un peso muerto.\n2. Inclina el torso a 90° con la espalda recta y rodillas ligeramente flexionadas.\n3. Sujeta la barra con agarre prono ancho.\n4. Tira explosivamente de la barra hasta tocar la parte baja del pecho o esternón con los codos subiendo hacia el techo.\n5. Devuelve la barra al suelo con control y pausa un instante antes de la siguiente repetición.',
    injuryPrevention: [
      'No permitas que la espalda lumbar se curve en ningún momento; mantén el pecho orgulloso y el core activo.',
      'Evita impulsar el torso hacia arriba cambiando el ángulo para mover más peso (cheating).',
      'No dejes caer la barra descontrolada; amortigua la bajada.'
    ],
    primaryMuscles: ['Dorsal Ancho', 'Romboides', 'Trapecio Medio'],
    secondaryMuscles: ['Deltoides Posterior', 'Bíceps Braquial', 'Braquial', 'Erectores Espinales'],
    benefits: [
      'Desarrollo masivo del espesor y densidad de la espalda media y alta.',
      'Fuerza estabilizadora estática para soportar sentadillas pesadas.',
      'Equilibrio postural contra el exceso de empujes de pecho.'
    ],
    graphicType: 'barbell_row',
    standards: [
      'La barra descansa en el suelo al inicio de cada repetición.',
      'Contacto nítido de la barra en el torso.',
      'El torso permanece estático y paralelo al suelo.'
    ],
    tips: [
      'Aprieta los omóplatos fuertemente en la parte superior del tirón.',
      'Clava los talones en el suelo para anclar la cadera.'
    ],
    commonErrors: [
      'Elevar el torso a 45° convirtiéndolo en un remo convencional.',
      'Tirar solo con los brazos sin activar las escápulas.',
      'Rebotar los discos violentamente en el suelo.'
    ],
    prsRecord: '105 kg / 231 lbs'
  },
  {
    id: 'ex-espalda-4',
    name: 'Chest-to-Bar Pull-ups (C2B)',
    category: 'Gimnásticos',
    muscleGroup: 'Espalda',
    equipment: 'Gimnásticos',
    difficulty: 'Intermedio',
    level: 'Intermedio',
    description: 'Tracción gimnástica de rango ampliado donde el esternón o clavícula contacta físicamente la barra de dominadas en cada repetición.',
    execution: '1. Salta a la barra con agarre prono firme.\n2. Inicia un kip fluido pasando de arco a posición hueca.\n3. Empuja la barra hacia abajo con los dorsales mientras la cadera sube.\n4. Inclina la cabeza y torso ligeramente hacia atrás permitiendo que el esternón toque la barra por debajo de la clavícula.\n5. Empuja la barra al descender para encadenar el siguiente balanceo.',
    injuryPrevention: [
      'Domina un mínimo de 8 dominadas estrictas antes de encadenar repeticiones con kipping.',
      'Mantén los hombros activos durante el descenso; no permitas que la inercia abra violentamente la articulación.',
      'Usa calleras o magnesio para proteger la piel de las manos y evitar desgarros.'
    ],
    primaryMuscles: ['Dorsal Ancho', 'Redondo Mayor', 'Romboides'],
    secondaryMuscles: ['Bíceps', 'Deltoides Posterior', 'Core', 'Trapecio Inferior'],
    benefits: [
      'Estándar obligatorio en competiciones oficiales de CrossFit.',
      'Rango completo de tracción que fortalece tendones y ligamentos del tren superior.',
      'Potencia gimnástica de transición al Muscle-Up.'
    ],
    graphicType: 'chest_to_bar',
    standards: [
      'Inicio con brazos completamente estirados en suspensión.',
      'Contacto físico claro del pecho (esternón o bajo clavícula) con la barra.',
      'Pies por detrás del plano vertical de la barra en el inicio del kip.'
    ],
    tips: [
      'Imagina dar un codazo hacia el suelo para elevar el torso más alto.',
      'Mantén las piernas juntas para transferir mejor la energía.'
    ],
    commonErrors: [
      'No tocar la barra con el pecho (no rep típica).',
      'Flexionar el cuello hacia atrás sin que el torso llegue a la barra.',
      'Perder el ritmo del kip y empezar a balancearse descoordinado.'
    ],
    prsRecord: 'Max Unbroken: 25 reps'
  },

  // ==========================================
  // PIERNAS (LEGS)
  // ==========================================
  {
    id: 'ex-piernas-1',
    name: 'Back Squat (Sentadilla Trasera)',
    category: 'Fuerza',
    muscleGroup: 'Piernas',
    equipment: 'Barra Olímpica',
    difficulty: 'Principiante',
    level: 'Principiante',
    description: 'La reina del desarrollo del tren inferior. Carga la barra sobre los trapecios y desciende hasta romper el paralelo de las rodillas.',
    execution: '1. Barra apoyada sobre la musculatura de los trapecios (barra alta o baja), pies a la anchura de hombros con puntas a 15°-30°.\n2. Inhala aire al abdomen creando presión intra-abdominal firme (Valsalva).\n3. Inicia el descenso simultáneo de caderas y rodillas manteniendo el torso firme y rodillas alineadas con los pies.\n4. Rompe el paralelo (pliegue de la cadera por debajo de la parte superior de la rótula).\n5. Empuja el suelo con toda la planta del pie para subir explosivo.',
    injuryPrevention: [
      'Evita el valgo de rodilla (que las rodillas colapsen hacia adentro al subir); empújalas activamente hacia afuera.',
      'Mantén los talones firmemente pegados al suelo en todo el trayecto; no transfieras el peso a las puntas.',
      'Evita la retroversión pélvica excesiva ("butt wink") al final del rango si tu movilidad de tobillo es limitada.',
      'Usa soportes de seguridad (safety pins) graduados a la altura adecuada.'
    ],
    primaryMuscles: ['Cuádriceps (Vasto Lateral, Medial, Intermedio y Recto Femoral)', 'Glúteo Mayor'],
    secondaryMuscles: ['Isquiosurales', 'Aductores', 'Erectores Espinales', 'Core'],
    benefits: [
      'Máximo estímulo hipertrófico y de fuerza en piernas y glúteos.',
      'Estimulación hormonal sistémica anabólica.',
      'Transferencia total a saltos, carreras y levantamientos olímpicos.'
    ],
    graphicType: 'back_squat',
    standards: [
      'El pliegue de la cadera debe descender claramente por debajo de la parte superior de la rodilla.',
      'Extensión completa de cadera y rodillas en la parte superior.',
      'La barra permanece quieta sobre la espalda.'
    ],
    tips: [
      'Presiona el suelo con tres puntos de apoyo: talón, base del dedo gordo y dedo pequeño.',
      'Mantén los codos apuntando al suelo y el pecho orgulloso.'
    ],
    commonErrors: [
      'No romper el paralelo (media sentadilla).',
      'Inclinar el torso hacia adelante convirtiéndolo en un "buenos días".',
      'Levantar los talones del suelo al descender.'
    ],
    prsRecord: '160 kg / 352 lbs'
  },
  {
    id: 'ex-piernas-2',
    name: 'Front Squat (Sentadilla Frontal)',
    category: 'Halterofilia',
    muscleGroup: 'Piernas',
    equipment: 'Barra Olímpica',
    difficulty: 'Intermedio',
    level: 'Intermedio',
    description: 'Sentadilla con la barra en posición de rack frontal sobre hombros y clavículas, exigiendo un torso completamente vertical y reclutamiento masivo de cuádriceps.',
    execution: '1. Barra descansando sobre los deltoides anteriores con codos altos apuntando al frente y yemas de los dedos sujetando la barra.\n2. Pies a la anchura de hombros con peso bien equilibrado.\n3. Desciende manteniendo los codos paralelos al suelo en todo momento para evitar que el torso se incline.\n4. Rompe el paralelo con control manteniendo el pecho alto.\n5. Presiona hacia arriba con potencia manteniendo la mirada al frente.',
    injuryPrevention: [
      'No permitas que los codos caigan; si bajan, la barra rodará hacia adelante y flexionará peligrosamente la espalda dorsal.',
      'Si tienes rigidez en muñecas, amplía el agarre o sujeta con solo 2 o 3 dedos manteniendo la barra sobre los hombros.',
      'Mantén el core blindado para no colapsar la columna torácica bajo cargas elevadas.'
    ],
    primaryMuscles: ['Cuádriceps', 'Core / Recto Abdominal'],
    secondaryMuscles: ['Glúteos', 'Espalda Alta (Romboides y Trapecio)', 'Erectores Espinales'],
    benefits: [
      'Menor estrés por compresión en la zona lumbar en comparación con la sentadilla trasera.',
      'Construcción de una postura corporal erguida indestructible.',
      'Fase de recepción directa del Clean (cargada) de Halterofilia.'
    ],
    graphicType: 'front_squat',
    standards: [
      'Codos altos por delante de la barra durante toda la repetición.',
      'Romper el paralelo en el fondo.',
      'Extensión completa de cadera y rodillas al ponerse de pie.'
    ],
    tips: [
      'Imagina apuntar con linternas desde tus codos hacia la pared de enfrente.',
      'Respira hondo antes de iniciar la bajada para crear un escudo torácico.'
    ],
    commonErrors: [
      'Dejar caer los codos golpeando las rodillas.',
      'Sostener el peso con las muñecas en vez de con los hombros.',
      'Perder la verticalidad inclinando el torso.'
    ],
    prsRecord: '135 kg / 297 lbs'
  },
  {
    id: 'ex-piernas-3',
    name: 'Romanian Deadlift (Peso Muerto Rumano)',
    category: 'Fuerza',
    muscleGroup: 'Piernas',
    equipment: 'Barra Olímpica',
    difficulty: 'Principiante',
    level: 'Principiante',
    description: 'Bisagra de cadera pura con rodillas semi-flexionadas que estira y carga intensamente los isquiotibiales y glúteos en fase excéntrica.',
    execution: '1. Comienza erguido sosteniendo la barra frente a los muslos con agarre prono.\n2. Flexiona suavemente las rodillas a unos 15°-20° y bloquea ese ángulo.\n3. Empuja las caderas hacia atrás como si quisieras tocar la pared trasera con los glúteos.\n4. Desciende la barra pegada a los muslos y espinillas hasta justo por debajo de las rodillas, sintiendo tensión máxima en isquiotibiales.\n5. Contrae glúteos para regresar a la posición vertical.',
    injuryPrevention: [
      'Detén el descenso cuando tus caderas dejen de moverse hacia atrás; bajar más forzaría la flexión de la columna lumbar.',
      'No flexiones las rodillas en exceso o convertirás el ejercicio en una sentadilla perdiendo el foco en los isquiotibiales.',
      'Mantén la barra siempre en contacto deslizante con las piernas.'
    ],
    primaryMuscles: ['Isquiosurales (Bíceps Femoral, Semitendinoso, Semimembranoso)', 'Glúteo Mayor'],
    secondaryMuscles: ['Erectores Espinales', 'Dorsal Ancho', 'Core', 'Gemelos'],
    benefits: [
      'Prevención fundamental contra desgarros musculares en sprints y cambios de dirección.',
      'Equilibrio anatómico frente a la dominancia habitual de cuádriceps.',
      'Aumento de la fuerza de salto y aceleración atlética.'
    ],
    graphicType: 'romanian_deadlift',
    standards: [
      'Columna neutra durante todo el recorrido.',
      'La barra se mantiene en contacto continuo con las piernas.',
      'Extensión de cadera completa en la posición superior.'
    ],
    tips: [
      'Concéntrate en la bisagra de cadera más que en bajar la barra al suelo.',
      'Mantén el cuello neutro alineado con la columna en todo momento.'
    ],
    commonErrors: [
      'Flexionar la espalda baja para que la barra llegue al suelo.',
      'Separar la barra del cuerpo aumentando la palanca lumbar.',
      'Doblar las rodillas en exceso.'
    ],
    prsRecord: '130 kg / 286 lbs'
  },
  {
    id: 'ex-piernas-4',
    name: 'Walking Lunges (Zancadas Caminando)',
    category: 'Accesorios',
    muscleGroup: 'Piernas',
    equipment: 'Mancuerna',
    difficulty: 'Principiante',
    level: 'Principiante',
    description: 'Movimiento unilateral dinámico en avance que desarrolla fuerza simétrica, estabilidad de cadera y potencia en cada pierna de forma independiente.',
    execution: '1. De pie con mancuernas a los lados o barra sobre la espalda, torso erguido.\n2. Da un paso amplio hacia adelante aterrizando con el talón y planta del pie.\n3. Desciende hasta que la rodilla trasera roce suavemente el suelo con ambas piernas formando ángulos de 90°.\n4. Empuja con el talón de la pierna delantera para erguirte y dar la siguiente zancada con la pierna contraria.',
    injuryPrevention: [
      'Evita que la rodilla delantera colapse hacia adentro; mantenla firme alineada con el segundo dedo del pie.',
      'No golpees la rodilla trasera con violencia contra el suelo; frena el movimiento con control muscular.',
      'Mantén el torso vertical; no te inclines hacia adelante sobre el muslo delantero.'
    ],
    primaryMuscles: ['Cuádriceps', 'Glúteo Mayor y Medio'],
    secondaryMuscles: ['Isquiosurales', 'Gemelos', 'Core Estabilizador', 'Aductores'],
    benefits: [
      'Corrección de desbalances de fuerza y tamaño entre ambas extremidades.',
      'Gran demanda cardiovascular y quema calórica en repeticiones continuas.',
      'Fortalecimiento de los estabilizadores de rodilla y cadera.'
    ],
    graphicType: 'walking_lunges',
    standards: [
      'La rodilla trasera debe tocar suavemente el suelo en cada zancada.',
      'Extensión completa de cadera y rodillas al ponerse de pie antes o durante el siguiente paso.',
      'Avance continuo en línea recta.'
    ],
    tips: [
      'Imagina caminar sobre dos rieles paralelos en lugar de una cuerda floja para mayor equilibrio.',
      'Activa el glúteo de la pierna delantera al iniciar la subida.'
    ],
    commonErrors: [
      'Pasos demasiado cortos sobrecargando el tendón rotuliano.',
      'Golpear la rótula trasera contra el suelo.',
      'Tambaleo lateral por falta de activación del glúteo medio.'
    ],
    prsRecord: 'Mancuernas 24 kg / 53 lbs c/u × 50 metros'
  },
  {
    id: 'ex-piernas-5',
    name: 'Box Jump Over (Saltos al Cajón)',
    category: 'Metcon',
    muscleGroup: 'Piernas',
    equipment: 'Cajón',
    difficulty: 'Principiante',
    level: 'Principiante',
    description: 'Salto pliométrico reactivo aterrizando en la parte superior del cajón y descendiendo por el lado opuesto para trabajo de potencia y resistencia.',
    execution: '1. Colócate frente al cajón a unos 30-40 cm de distancia.\n2. Carga caderas y rodillas en cuarto de sentadilla balanceando los brazos hacia atrás.\n3. Explota hacia arriba impulsándote con brazos y pies al unísono.\n4. Aterriza suavemente con ambos pies en el centro del cajón absorbiendo el impacto con rodillas flexionadas.\n5. Da un paso o salta al lado contrario para encadenar la repetición.',
    injuryPrevention: [
      'Aterriza con los pies planos y las rodillas suaves y flexionadas para disipar la fuerza en los músculos y no en los meniscos.',
      'Elige una altura segura (20/24 pulgadas) que domines con comodidad antes de buscar alturas límite.',
      'Al descender, prefiere bajar con un paso (step-down) para proteger el tendón de Aquiles bajo fatiga.'
    ],
    primaryMuscles: ['Cuádriceps', 'Glúteos', 'Gemelos y Sóleo'],
    secondaryMuscles: ['Isquiosurales', 'Core', 'Tibial Anterior'],
    benefits: [
      'Potencia pliométrica explosiva y reactividad neuromuscular.',
      'Acondicionamiento cardiovascular de alta intensidad (HIIT).',
      'Agilidad atlética y confianza mental en el salto.'
    ],
    graphicType: 'box_jump',
    standards: [
      'Despegue simultáneo con ambos pies del suelo.',
      'Ambos pies deben hacer contacto con la parte superior del cajón.',
      'Pasar al lado opuesto sin tocar el cajón con las manos.'
    ],
    tips: [
      'Aterriza lo más silencioso posible para garantizar una absorción elástica impecable.',
      'Usa los brazos como palancas sincronizadas con el despegue.'
    ],
    commonErrors: [
      'Despegar con un pie antes que el otro.',
      'Aterrizar con las piernas completamente estiradas.',
      'Aterrizar en el borde delantero corriendo riesgo de resbalón.'
    ],
    prsRecord: 'Altura máx: 30 pulgadas / Pace: 30 reps/min'
  },

  // ==========================================
  // HOMBROS (SHOULDERS)
  // ==========================================
  {
    id: 'ex-hombros-1',
    name: 'Strict Overhead Press (Press Militar)',
    category: 'Fuerza',
    muscleGroup: 'Hombros',
    equipment: 'Barra Olímpica',
    difficulty: 'Principiante',
    level: 'Principiante',
    description: 'Empuje vertical estricto desde los hombros hasta bloquear los brazos por encima de la cabeza, sin impulso de las piernas.',
    execution: '1. Barra apoyada en la parte alta del pecho con agarre justo por fuera de los hombros y antebrazos verticales.\n2. Aprieta glúteos, cuádriceps y abdomen para construir un tronco sólido como una columna de granito.\n3. Retira suavemente la barbilla hacia atrás y presiona la barra en línea recta vertical hacia el techo.\n4. Al superar la frente, pasa la cabeza hacia adelante y bloquea los codos con la barra sobre la coronilla.',
    injuryPrevention: [
      'No arquees excesivamente la espalda baja compensando una falta de movilidad torácica; mantén los glúteos tensos.',
      'Mantén las muñecas derechas bajo la barra; no dejes que el peso doble las muñecas hacia atrás.',
      'Bloquea la barra en el plano vertical de la nuca/orejas, nunca por delante de los ojos.'
    ],
    primaryMuscles: ['Deltoides Anterior', 'Deltoides Lateral'],
    secondaryMuscles: ['Tríceps Braquial', 'Trapecio Superior', 'Serrato Anterior', 'Pectoral Clavicular', 'Core'],
    benefits: [
      'La prueba reina de la fuerza pura de empuje vertical en el tren superior.',
      'Estabilidad y salud global para la articulación glenohumeral.',
      'Cintura escapular ancha y funcional.'
    ],
    graphicType: 'overhead_press',
    standards: [
      'La barra parte desde los hombros o clavículas.',
      'Piernas bloqueadas sin ninguna flexión de rodillas durante todo el levantamiento.',
      'Bloqueo completo de codos en la vertical con la cabeza asomando al frente.'
    ],
    tips: [
      'Empuja la cabeza a través de la "ventana" formada por los brazos en cuanto la barra pase la frente.',
      'Exhala de manera controlada al superar el punto de estancamiento.'
    ],
    commonErrors: [
      'Flexionar las rodillas (convirtiéndolo en Push Press involuntario).',
      'Hiperlordosis lumbar pronunciada.',
      'Separar la barra del rostro en una curva hacia adelante.'
    ],
    prsRecord: '80 kg / 176 lbs'
  },
  {
    id: 'ex-hombros-2',
    name: 'Push Press (Press de Empuje)',
    category: 'Halterofilia',
    muscleGroup: 'Hombros',
    equipment: 'Barra Olímpica',
    difficulty: 'Intermedio',
    level: 'Intermedio',
    description: 'Empuje vertical explosivo que combina un dip corto y potente de piernas para propulsar la barra sobre la cabeza con cargas elevadas.',
    execution: '1. Barra apoyada en posición de rack frontal sobre hombros, con codos ligeramente más bajos que en la sentadilla frontal.\n2. Realiza un "dip" vertical flexionando caderas y rodillas unos 10-15 cm, manteniendo el torso completamente erguido.\n3. Extiende con violencia cadera y rodillas transfiriendo la aceleración elástica a la barra.\n4. Continúa el empuje con los brazos y bloquea con firmeza sobre la cabeza.',
    injuryPrevention: [
      'Mantén el torso 100% vertical durante el dip; no te inclines hacia adelante sobre las puntas de los pies.',
      'Espera a que las piernas completen su extensión explosiva antes de presionar con los brazos.',
      'Amortigua la recepción de la barra en los hombros flexionando suavemente las rodillas al bajar la carga.'
    ],
    primaryMuscles: ['Deltoides Anterior y Lateral', 'Tríceps Braquial'],
    secondaryMuscles: ['Cuádriceps y Glúteos (Impulso motor)', 'Trapecio', 'Core'],
    benefits: [
      'Capacidad de mover entre 20% y 30% más carga que en el press estricto.',
      'Desarrollo de potencia neuromuscular y transferencia de fuerza corporal total.',
      'Acondicionamiento para WODs metabólicos con barras pesadas.'
    ],
    graphicType: 'push_press',
    standards: [
      'Dip y drive con piernas permitido; la barra inicia en los hombros.',
      'No se permite un segundo dip para recibir la barra (eso sería Push Jerk).',
      'Bloqueo final de codos, hombros, caderas y rodillas en una sola línea.'
    ],
    tips: [
      'Imagina que tu espalda baja se desliza pegada a una pared durante el dip.',
      'Sincroniza el bloqueo de brazos con el final de la extensión de piernas.'
    ],
    commonErrors: [
      'Hacer un segundo dip de piernas para recibir la barra.',
      'Inclinarse hacia el frente en el dip perdiendo el equilibrio.',
      'Empujar con los brazos antes de que las piernas transmitan la fuerza.'
    ],
    prsRecord: '100 kg / 220 lbs'
  },
  {
    id: 'ex-hombros-3',
    name: 'Handstand Push-Ups (HSPU Flexiones de Pino)',
    category: 'Gimnásticos',
    muscleGroup: 'Hombros',
    equipment: 'Pared / Peso Corporal',
    difficulty: 'Intermedio',
    level: 'Intermedio',
    description: 'Flexión vertical en posición de pino contra la pared que requiere fuerza, control propioceptivo y equilibrio gimnástico superior.',
    execution: '1. Da una patada controlada a la pared entrando en vertical de manos con brazos extendidos y cuerpo alineado.\n2. Desciende la cabeza hacia el suelo formando un trípode (la cabeza queda claramente más adelantada que las manos).\n3. Toca suavemente la colchoneta o suelo con la coronilla.\n4. Presiona el suelo con fuerza con las palmas hasta extender y bloquear los codos por completo con talones contra la pared.',
    injuryPrevention: [
      'Forma siempre un trípode (cabeza más adelantada que las manos); jamás pongas la cabeza en la misma línea que las manos o pellizcarás el manguito rotador.',
      'No te dejes caer de cabeza contra el suelo; controla la fase excéntrica con los deltoides.',
      'Ten una base mínima de fuerza en fondos y flexiones antes de intentar repeticiones con kipping dinámico.'
    ],
    primaryMuscles: ['Deltoides Anterior y Medio', 'Tríceps Braquial'],
    secondaryMuscles: ['Trapecio Superior', 'Pectoral Superior', 'Core Estabilizador'],
    benefits: [
      'Fuerza descomunal de hombros usando únicamente el propio peso corporal.',
      'Propiocepción y conciencia espacial en inversión.',
      'Desarrollo estético y funcional del tren superior.'
    ],
    graphicType: 'hspu',
    standards: [
      'Inicio con brazos bloqueados y talones en la pared.',
      'La cabeza debe tocar el suelo o superficie reglamentaria.',
      'Bloqueo completo de brazos con talones en la pared al terminar.'
    ],
    tips: [
      'Abre bien los dedos y agarra el suelo como si quisieras torcerlo hacia afuera.',
      'En kipping, baja la cadera a la pared y patea hacia el techo con energía explosiva.'
    ],
    commonErrors: [
      'Poner las manos en línea recta con la cabeza.',
      'Despegar los talones de la pared antes de bloquear los codos.',
      'Golpear el cuello o coronilla contra el suelo sin frenar.'
    ],
    prsRecord: 'Max Unbroken Kipping: 21 reps'
  },
  {
    id: 'ex-hombros-4',
    name: 'Dumbbell Lateral Raises (Elevaciones Laterales)',
    category: 'Accesorios',
    muscleGroup: 'Hombros',
    equipment: 'Mancuerna',
    difficulty: 'Principiante',
    level: 'Principiante',
    description: 'Ejercicio de aislamiento para el haz lateral del deltoides mediante elevación en arco lateral con mancuernas hasta la altura del hombro.',
    execution: '1. De pie con una mancuerna en cada mano a los costados, torso ligeramente inclinado hacia adelante (5°-10°).\n2. Codos con una flexión suave de 15° fija durante todo el ejercicio.\n3. Eleva los brazos hacia los costados liderando el movimiento con los codos hasta alcanzar la altura de los hombros.\n4. Pausa medio segundo en la cima y desciende en 2 segundos controlando el peso.',
    injuryPrevention: [
      'No uses pesos excesivos balanceando la espalda o usando impulso con las piernas.',
      'No rotes internamente los brazos (no apuntes los pulgares hacia abajo como si vaciaras una jarra); mantén pulgares neutros para no pinzar el supraespinoso.',
      'No superes la línea horizontal de los hombros en la cima.'
    ],
    primaryMuscles: ['Deltoides Lateral (Cabeza Media)'],
    secondaryMuscles: ['Deltoides Anterior y Posterior', 'Trapecio Superior', 'Serrato Anterior'],
    benefits: [
      'Hombros con apariencia 3D ancha y redondeada.',
      'Aislamiento muscular específico sin fatiga lumbar.',
      'Mejora de la estabilidad en levantamientos de press y gimnásticos.'
    ],
    graphicType: 'lateral_raises',
    standards: [
      'Elevación controlada hasta la horizontal de los hombros.',
      'Sin balanceo de torso o flexión excesiva de rodillas.',
      'Fase excéntrica frenada.'
    ],
    tips: [
      'Imagina empujar las mancuernas hacia las paredes laterales en lugar de subirlas hacia arriba.',
      'Mantén los hombros relajados hacia abajo, no encogidos hacia las orejas.'
    ],
    commonErrors: [
      'Impulsarse con la espalda baja para levantar mancuernas demasiado pesadas.',
      'Encoger los trapecios en cada repetición quitándole trabajo al deltoides lateral.',
      'Rotar las muñecas hacia adentro de forma perjudicial.'
    ],
    prsRecord: '16 kg / 35 lbs cada mano × 12 reps'
  },

  // ==========================================
  // BRAZOS (ARMS)
  // ==========================================
  {
    id: 'ex-brazos-1',
    name: 'Barbell Bicep Curl (Curl con Barra)',
    category: 'Accesorios',
    muscleGroup: 'Brazos',
    equipment: 'Barra Olímpica',
    difficulty: 'Principiante',
    level: 'Principiante',
    description: 'El ejercicio tradicional fundamental para construir masa, fuerza y grosor en el bíceps braquial mediante flexión del codo.',
    execution: '1. De pie con la espalda erguida, sujeta la barra con agarre supino (palmas hacia arriba) a la anchura de hombros.\n2. Pega los codos a los costados del torso y fija los omóplatos.\n3. Flexiona los codos contrayendo con fuerza los bíceps hasta la altura del pecho sin mover los codos hacia adelante.\n4. Aprieta en el punto más alto y desciende en 2-3 segundos hasta la extensión casi completa.',
    injuryPrevention: [
      'Evita balancear el torso o arquear la zona lumbar para subir el peso; si te balanceas, reduce la carga.',
      'Mantén los codos fijos a los costados; no los proyectes hacia adelante para descansar la barra en la cima.',
      'Mantén las muñecas neutras y firmes; no las flexiones hacia adentro en exceso para evitar sobrecarga en los tendones flexores.'
    ],
    primaryMuscles: ['Bíceps Braquial (Cabeza Larga y Cabeza Corta)'],
    secondaryMuscles: ['Braquial Anterior', 'Braquiorradial', 'Flexores del Antebrazo'],
    benefits: [
      'Máximo desarrollo de tamaño y pico en la cara anterior del brazo.',
      'Fortalecimiento de los tendones del codo para soportar dominadas y gimnásticos.',
      'Fuerza de agarre y estabilización del antebrazo.'
    ],
    graphicType: 'bicep_curl',
    standards: [
      'Codos estables pegados a los laterales del torso.',
      'Rango completo de flexión y descenso controlado.',
      'Cuerpo estático sin balanceo lumbar.'
    ],
    tips: [
      'Aprieta con fuerza la barra con las manos para generar irradiación neuromuscular en el bíceps.',
      'Mantén las rodillas ligeramente flexionadas para mayor estabilidad de base.'
    ],
    commonErrors: [
      'Balanceo excesivo de caderas ("cheat curl").',
      'Desplazar los codos hacia adelante perdiendo la tensión.',
      'No estirar los brazos completamente en el descenso.'
    ],
    prsRecord: '55 kg / 121 lbs × 8 reps'
  },
  {
    id: 'ex-brazos-2',
    name: 'Skull Crushers (Press Francés)',
    category: 'Accesorios',
    muscleGroup: 'Brazos',
    equipment: 'Barra Olímpica',
    difficulty: 'Principiante',
    level: 'Principiante',
    description: 'Extensión de tríceps acostado sobre banco plano que estira profundamente la cabeza larga del tríceps braquial bajo tensión constante.',
    execution: '1. Acuéstate sobre el banco sosteniendo la barra con agarre prono a la anchura de hombros y brazos casi verticales.\n2. Inclina los brazos ligeramente hacia atrás (unos 10°-15° respecto a la vertical).\n3. Flexiona únicamente los codos descendiendo la barra hacia la coronilla o justo detrás de la cabeza.\n4. Extiende los antebrazos contrayendo los tríceps con fuerza hasta bloquear arriba.',
    injuryPrevention: [
      'No permitas que los codos se abran hacia los lados; mantenlos cerrados y paralelos apuntando al techo.',
      'Desciende siempre a velocidad controlada para evitar cualquier golpe accidental en la cabeza.',
      'Calienta con series livianas para lubricar la articulación del codo y su tendón.'
    ],
    primaryMuscles: ['Tríceps Braquial (Cabeza Larga y Lateral)'],
    secondaryMuscles: ['Ancóneo', 'Deltoides Posterior', 'Estabilizadores de Muñeca'],
    benefits: [
      'Desarrollo del músculo que compone el 60% del volumen del brazo (el tríceps).',
      'Mejora del bloqueo final en Press de Banca, Push Jerk y Handstand Push-ups.',
      'Mayor potencia en extensiones gimnásticas.'
    ],
    graphicType: 'skull_crushers',
    standards: [
      'Los codos permanecen estables sin abrirse hacia los lados.',
      'Descenso profundo hasta la coronilla.',
      'Extensión completa de los antebrazos.'
    ],
    tips: [
      'Bajar la barra ligeramente detrás de la cabeza (en lugar de a la frente) mantiene mayor tensión en la cabeza larga.',
      'Usa una barra Z para reducir la torsión en las muñecas si sientes molestias.'
    ],
    commonErrors: [
      'Abrir los codos como alas de pollo.',
      'Mover los hombros convirtiéndolo en un pullover.',
      'Dejar caer la barra rápidamente.'
    ],
    prsRecord: '45 kg / 99 lbs × 10 reps'
  },
  {
    id: 'ex-brazos-3',
    name: 'Hammer Curls (Curl Martillo con Mancuernas)',
    category: 'Accesorios',
    muscleGroup: 'Brazos',
    equipment: 'Mancuerna',
    difficulty: 'Principiante',
    level: 'Principiante',
    description: 'Flexión de codo con agarre neutro (palmas enfrentadas) que trabaja intensamente el braquial anterior y el músculo braquiorradial del antebrazo.',
    execution: '1. De pie con mancuernas a los lados y las palmas mirándose entre sí (agarre neutro).\n2. Con los codos fijos al torso, flexiona los brazos elevando las mancuernas hacia los hombros.\n3. Contrae en la cima durante 1 segundo.\n4. Desciende con lentitud resistiendo la gravedad hasta la extensión completa.',
    injuryPrevention: [
      'Mantén las muñecas en posición neutra en todo el recorrido; no las dobles hacia ningún lado.',
      'No te balancees hacia los lados ni eleves los hombros hacia las orejas.',
      'Evita movimientos bruscos de torsión bajo carga.'
    ],
    primaryMuscles: ['Braquiorradial (Antebrazo)', 'Braquial Anterior'],
    secondaryMuscles: ['Bíceps Braquial', 'Flexores y Extensores de los Dedos'],
    benefits: [
      'Aumento del grosor lateral del brazo y la masa del antebrazo.',
      'Fuerza de agarre imbatible para sostener barras pesadas, kettlebells y anillas.',
      'Protección articular del codo ante tendinitis.'
    ],
    graphicType: 'hammer_curls',
    standards: [
      'Agarre neutro constante durante toda la repetición.',
      'Codos pegados al cuerpo.',
      'Sin balanceo de torso.'
    ],
    tips: [
      'Puedes realizarlo de forma alterna o simultánea para variar la demanda de estabilidad.',
      'Aprieta con fuerza las mancuernas en la cima para maximizar el reclutamiento.'
    ],
    commonErrors: [
      'Girar las muñecas hacia arriba convirtiéndolo en curl tradicional.',
      'Impulsar el peso con balanceo de cadera.',
      'Rango corto sin bajar hasta abajo.'
    ],
    prsRecord: '24 kg / 53 lbs c/u × 10 reps'
  },
  {
    id: 'ex-brazos-4',
    name: 'Triceps Rope Pushdown (Extensiones de Tríceps)',
    category: 'Accesorios',
    muscleGroup: 'Brazos',
    equipment: 'Gimnásticos',
    difficulty: 'Principiante',
    level: 'Principiante',
    description: 'Extensión descendente en polea alta o elástico con cuerda que permite separar los extremos para una contracción pico de tríceps.',
    execution: '1. Sujeta los extremos de la cuerda con los codos flexionados a 90° pegados a los costados.\n2. Inclina el torso muy levemente hacia adelante con pies firmes.\n3. Extiende los brazos hacia abajo separando activamente los extremos de la cuerda al final del recorrido.\n4. Siente la contracción máxima de los tríceps 1 segundo y regresa con control a 90°.',
    injuryPrevention: [
      'Fija los hombros y codos; no dejes que los codos viajen hacia adelante y atrás en cada repetición.',
      'No te encorves sobre la cuerda usando el peso de tu propio cuerpo para empujar.',
      'Controla la fase de retorno para evitar tirones en las articulaciones.'
    ],
    primaryMuscles: ['Tríceps Braquial (Cabeza Lateral y Medial)'],
    secondaryMuscles: ['Ancóneo', 'Muñecas y Antebrazos'],
    benefits: [
      'Gran bombeo y congestión muscular con bajo impacto articular.',
      'Aislamiento seguro para finalizar sesiones de empuje.',
      'Fortalecimiento de la inserción distal del tríceps.'
    ],
    graphicType: 'triceps_pushdown',
    standards: [
      'Codos pegados al torso sin desplazamiento hacia el frente.',
      'Separación completa de las cuerdas en la parte inferior.',
      'Extensión total de codos.'
    ],
    tips: [
      'Gira ligeramente los pulgares hacia afuera al final de la extensión para mayor congestión.',
      'Mantén las escápulas retraídas.'
    ],
    commonErrors: [
      'Mover los codos hacia adelante y atrás como si remaras.',
      'Cargar más peso del que puedes mover con técnica pura.',
      'No bloquear los codos abajo.'
    ],
    prsRecord: '35 kg / 77 lbs × 15 reps'
  },

  // ==========================================
  // CORE (ABDOMEN & TRONCO)
  // ==========================================
  {
    id: 'ex-core-1',
    name: 'Toes to Bar (T2B Puntas a la Barra)',
    category: 'Gimnásticos',
    muscleGroup: 'Core',
    equipment: 'Gimnásticos',
    difficulty: 'Intermedio',
    level: 'Intermedio',
    description: 'Movimiento gimnástico colgado de la barra donde ambos pies tocan simultáneamente el metal entre las manos en un ciclo fluido.',
    execution: '1. Salta a la barra con agarre prono firme y cuerpo en suspensión activa.\n2. Inicia un balanceo de kip fluido alternando entre posición de arco y posición hueca (hollow).\n3. Empuja la barra hacia abajo con los dorsales mientras flexionas las caderas elevando las piernas.\n4. Toca la barra con ambos pies al unísono entre las manos.\n5. Desciende las piernas con control activo pasando los talones por detrás del plano vertical de la barra para encadenar la siguiente repetición.',
    injuryPrevention: [
      'No dejes caer las piernas de golpe en el descenso; controla la fase excéntrica con el abdomen para no sobrecargar los flexores de cadera.',
      'Asegura un agarre sólido con el pulgar rodeando la barra para evitar resbalones bajo balanceo rápido.',
      'Si sientes molestia en la zona lumbar baja, escala a Rodillas a Codos (Knees-to-Elbows) o elevaciones en paralelas.'
    ],
    primaryMuscles: ['Recto Abdominal', 'Flexores de Cadera (Psoas Mayor, Ilíaco)'],
    secondaryMuscles: ['Dorsal Ancho', 'Oblicuos', 'Antebrazos y Agarre', 'Cuádriceps'],
    benefits: [
      'Fuerza extrema del core en flexión dinámica y suspensión.',
      'Coordinación rítmica y control gimnástico.',
      'Movimiento emblemático de las pruebas de CrossFit Open.'
    ],
    graphicType: 'toes_to_bar',
    standards: [
      'Comienzo con los talones pasando claramente por detrás del plano vertical de la barra.',
      'Ambos pies deben tocar la barra al mismo tiempo dentro del ancho de las manos.',
      'Despeje total de los brazos en la suspensión.'
    ],
    tips: [
      'Empujar la barra hacia el suelo con los dorsales eleva la cadera facilitando que los pies alcancen el metal.',
      'Mantén los pies juntos con puntas estiradas para mayor tensión corporal.'
    ],
    commonErrors: [
      'Tocar la barra con un solo pie.',
      'No llevar los talones hacia atrás al final de la bajada (no rep clásica).',
      'Balanceo descontrolado sin ritmo gimnástico.'
    ],
    prsRecord: 'Max Unbroken: 25 reps'
  },
  {
    id: 'ex-core-2',
    name: 'Hollow Body Hold & Rock',
    category: 'Gimnásticos',
    muscleGroup: 'Core',
    equipment: 'Peso Corporal',
    difficulty: 'Principiante',
    level: 'Principiante',
    description: 'La postura fundamental de la gimnasia olímpica. Acostado boca arriba, columna lumbar aplastada contra el suelo y extremidades suspendidas en forma de barco.',
    execution: '1. Acuéstate boca arriba en el suelo con piernas y brazos extendidos.\n2. Presiona activamente la zona lumbar contra el suelo eliminando cualquier espacio de aire bajo la espalda.\n3. Eleva los hombros, cabeza y piernas unos 15-20 cm del suelo formando un arco cóncavo (banana/barco).\n4. Mantén la tensión isométrica respirando rítmicamente o inicia un suave balanceo (rock) manteniendo la forma intacta.',
    injuryPrevention: [
      'Si tu zona lumbar se despega del suelo, detente de inmediato o flexiona las rodillas al pecho para reducir la palanca.',
      'Mantén el cuello relajado y la barbilla ligeramente separada del esternón, sin tirar con la cabeza.',
      'Respira de forma corta y controlada sin perder la contracción profunda del transverso abdominal.'
    ],
    primaryMuscles: ['Recto Abdominal', 'Transverso del Abdomen'],
    secondaryMuscles: ['Oblicuos Internos y Externos', 'Flexores de Cadera', 'Cuádriceps', 'Serrato Anterior'],
    benefits: [
      'Base técnica innegociable para dominadas, handstand, muscle-ups y gimnásticos.',
      'Blinda la columna vertebral contra lesiones en sentadillas y pesos muertos.',
      'Alineación postural impecable y tensión de cuerpo completo.'
    ],
    graphicType: 'hollow_body',
    standards: [
      'Espalda baja en contacto continuo con el suelo en todo momento.',
      'Brazos y piernas completamente estirados.',
      'Hombros y escápulas despegados de la colchoneta.'
    ],
    tips: [
      'Visualiza pegar el ombligo al suelo debajo de tu columna.',
      'Estira las puntas de los pies hacia el frente como un gimnasta profesional.'
    ],
    commonErrors: [
      'Permitir que la espalda baja se arquee dejando pasar una mano por debajo.',
      'Tirar del cuello con los brazos generando dolor cervical.',
      'Doblar las rodillas sin mantener la tensión en cuádriceps.'
    ],
    prsRecord: 'Hold estático: 2 min 15 seg'
  },
  {
    id: 'ex-core-3',
    name: 'GHD Sit-ups (Abdominales en GHD)',
    category: 'Gimnásticos',
    muscleGroup: 'Core',
    equipment: 'Gimnásticos',
    difficulty: 'Intermedio',
    level: 'Intermedio',
    description: 'Abdominales de rango ampliado en máquina Glute-Ham Developer, descendiendo en hiperextensión controlada y contrayendo explosivamente.',
    execution: '1. Siéntate en la almohadilla del GHD con rodillas semi-flexionadas y los tobillos bien anclados entre los rodillos.\n2. Desciende hacia atrás con control total hasta tocar el suelo o diana detrás de ti con las manos.\n3. Extiende con violencia las rodillas con los cuádriceps para propulsar el torso hacia arriba.\n4. Finaliza la repetición tocando las almohadillas de los pies con ambas manos.',
    injuryPrevention: [
      'No comiences con volumen alto sin una progresión previa; el estiramiento profundo puede provocar sobrecarga extrema en flexores de cadera si no hay adaptación.',
      'Extiende las rodillas con fuerza antes de flexionar el torso para proteger la columna lumbar mediante tensión en la cadena anterior.',
      'Comienza siempre con rango parcial (hasta la horizontal) antes de realizar repeticiones tocando el suelo.'
    ],
    primaryMuscles: ['Flexores de Cadera (Psoas Mayor, Recto Femoral)', 'Recto Abdominal'],
    secondaryMuscles: ['Oblicuos', 'Cuádriceps', 'Erectores Espinales'],
    benefits: [
      'Potencia explosiva de flexión de cadera y tronco como en ningún otro ejercicio.',
      'Rango completo de movimiento que fortalece la musculatura abdominal en estiramiento.',
      'Resistencia de élite para WODs avanzados.'
    ],
    graphicType: 'ghd_situps',
    standards: [
      'Contacto de ambas manos con el suelo o diana en la parte posterior.',
      'Retorno explosivo y contacto de ambas manos con las almohadillas de los pies en la cima.'
    ],
    tips: [
      'El motor secreto del GHD es la extensión violenta de las rodillas con los cuádriceps.',
      'Mantén la mirada al techo al descender para no perder la orientación espacial.'
    ],
    commonErrors: [
      'Subir tirando solo con el cuello y la espalda sin extender las piernas.',
      'No tocar el suelo en la parte baja o no tocar los pies arriba.',
      'Hacer demasiadas repeticiones el primer día causando dolor invalidante.'
    ],
    prsRecord: 'Max Unbroken: 40 reps'
  },
  {
    id: 'ex-core-4',
    name: 'Forearm Plank (Plancha Isométrica)',
    category: 'Accesorios',
    muscleGroup: 'Core',
    equipment: 'Peso Corporal',
    difficulty: 'Principiante',
    level: 'Principiante',
    description: 'Sostén estático horizontal sobre antebrazos y puntas de los pies resistiendo la extensión lumbar con máxima co-contracción del core.',
    execution: '1. Apoya los antebrazos en el suelo con codos directamente bajo los hombros y pies juntos.\n2. Aprieta fuertemente glúteos, cuádriceps y abdomen hacia adentro.\n3. Empuja activamente el suelo alejando los omóplatos entre sí (protracción escapular).\n4. Mantén una línea horizontal perfecta desde la coronilla hasta los talones respirando con control diafragmático.',
    injuryPrevention: [
      'No permitas que la cadera se hunda hacia el suelo (lordosis); si sientes la espalda baja, sube ligeramente la cadera y aprieta glúteos.',
      'No levantes los glúteos formando una V invertida; mantén la horizontal neutra.',
      'No contengas la respiración en apnea prolongada; inhala y exhala rítmicamente.'
    ],
    primaryMuscles: ['Transverso del Abdomen', 'Recto Abdominal'],
    secondaryMuscles: ['Oblicuos Internos y Externos', 'Deltoides Anterior', 'Serrato Anterior', 'Glúteos'],
    benefits: [
      'Entrenamiento de anti-extensión fundamental para la salud de la espalda.',
      'Protección de la columna ante cualquier levantamiento pesado.',
      'Resistencia estática sin impacto articular en rodillas o muñecas.'
    ],
    graphicType: 'plank',
    standards: [
      'Línea recta alineada entre hombros, cadera y tobillos.',
      'Antebrazos paralelos o ligeramente juntos.',
      'Tiempo cronometrado sin apoyar rodillas ni quebrar la cadera.'
    ],
    tips: [
      'Imagina arrastrar los codos hacia las puntas de los pies (tensión RKC) para multiplicar el estímulo.',
      'Mantén la mirada en el suelo entre tus manos para relajar las cervicales.'
    ],
    commonErrors: [
      'Dejar caer la cadera hacia el suelo.',
      'Elevar la cadera demasiado alta para descansar.',
      'Cruzar los dedos apretando el cuello con tensión parásita.'
    ],
    prsRecord: 'Plancha RKC máxima: 3 min 30 seg'
  }
];
