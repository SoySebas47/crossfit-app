export interface WorkoutTemplateSet {
  setNumber: number;
  reps: string;
  weightKg: string;
}

export interface WorkoutTemplateExercise {
  name: string;
  category: string;
  exerciseId?: string;
  sets: WorkoutTemplateSet[];
}

export interface WorkoutTemplate {
  id: string;
  title: string;
  category: 'Torso' | 'Pierna' | 'Push' | 'Pull' | 'Full Body' | 'Metcon';
  description: string;
  durationEst: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado RX';
  tagColor: string;
  exercises: WorkoutTemplateExercise[];
}

export const WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  // 1. TORSO (UPPER BODY)
  {
    id: 'tpl-torso-1',
    title: 'Rutina Torso: Fuerza & Potencia',
    category: 'Torso',
    description: 'Enfocada en empujes y tracciones pesadas horizontales y verticales para fuerza y densidad torácica.',
    durationEst: '45-55 min',
    difficulty: 'Intermedio',
    tagColor: '#CCFF00', // Volt
    exercises: [
      {
        name: 'Bench Press (Press de Banca)',
        category: 'Fuerza',
        exerciseId: 'ex-pecho-1',
        sets: [
          { setNumber: 1, reps: '10', weightKg: '60' },
          { setNumber: 2, reps: '8', weightKg: '70' },
          { setNumber: 3, reps: '8', weightKg: '75' },
          { setNumber: 4, reps: '6', weightKg: '80' },
        ],
      },
      {
        name: 'Pendlay Barbell Row (Remo con Barra)',
        category: 'Fuerza',
        exerciseId: 'ex-espalda-3',
        sets: [
          { setNumber: 1, reps: '10', weightKg: '50' },
          { setNumber: 2, reps: '8', weightKg: '60' },
          { setNumber: 3, reps: '8', weightKg: '65' },
          { setNumber: 4, reps: '6', weightKg: '70' },
        ],
      },
      {
        name: 'Dumbbell Incline Press (Press Inclinado)',
        category: 'Fuerza',
        exerciseId: 'ex-pecho-4',
        sets: [
          { setNumber: 1, reps: '10', weightKg: '22' },
          { setNumber: 2, reps: '10', weightKg: '24' },
          { setNumber: 3, reps: '8', weightKg: '26' },
        ],
      },
      {
        name: 'Strict Pull-Ups (Dominadas Estrictas)',
        category: 'Gimnásticos',
        exerciseId: 'ex-espalda-2',
        sets: [
          { setNumber: 1, reps: '8', weightKg: '0' },
          { setNumber: 2, reps: '8', weightKg: '0' },
          { setNumber: 3, reps: '6', weightKg: '0' },
        ],
      },
    ],
  },

  // 2. PIERNA (LOWER BODY)
  {
    id: 'tpl-pierna-1',
    title: 'Rutina Pierna: Cuádriceps & Cadena Posterior',
    category: 'Pierna',
    description: 'Sobrecarga progresiva del tren inferior con sentadillas pesadas, bisagra de cadera y accesorios unilaterales.',
    durationEst: '50-60 min',
    difficulty: 'Intermedio',
    tagColor: '#00E5FF', // Cyan
    exercises: [
      {
        name: 'Back Squat (Sentadilla Trasera)',
        category: 'Fuerza',
        exerciseId: 'ex-piernas-1',
        sets: [
          { setNumber: 1, reps: '10', weightKg: '80' },
          { setNumber: 2, reps: '8', weightKg: '95' },
          { setNumber: 3, reps: '8', weightKg: '105' },
          { setNumber: 4, reps: '6', weightKg: '115' },
        ],
      },
      {
        name: 'Romanian Deadlift (Peso Muerto Rumano)',
        category: 'Fuerza',
        exerciseId: 'ex-piernas-3',
        sets: [
          { setNumber: 1, reps: '10', weightKg: '70' },
          { setNumber: 2, reps: '10', weightKg: '80' },
          { setNumber: 3, reps: '8', weightKg: '90' },
        ],
      },
      {
        name: 'Walking Lunges (Zancadas Caminando)',
        category: 'Accesorios',
        exerciseId: 'ex-piernas-4',
        sets: [
          { setNumber: 1, reps: '12', weightKg: '16' },
          { setNumber: 2, reps: '12', weightKg: '16' },
          { setNumber: 3, reps: '12', weightKg: '20' },
        ],
      },
      {
        name: 'Box Jump Over (Saltos al Cajón)',
        category: 'Metcon',
        exerciseId: 'ex-piernas-5',
        sets: [
          { setNumber: 1, reps: '15', weightKg: '0' },
          { setNumber: 2, reps: '15', weightKg: '0' },
          { setNumber: 3, reps: '15', weightKg: '0' },
        ],
      },
    ],
  },

  // 3. PUSH (EMPUJE)
  {
    id: 'tpl-push-1',
    title: 'Rutina Push: Pecho, Hombros & Tríceps',
    category: 'Push',
    description: 'Patrones de empuje horizontal y vertical sinérgicos para máxima hipertrofia y potencia de bloqueo.',
    durationEst: '45-50 min',
    difficulty: 'Intermedio',
    tagColor: '#FF4757', // Fire
    exercises: [
      {
        name: 'Strict Overhead Press (Press Militar)',
        category: 'Fuerza',
        exerciseId: 'ex-hombros-1',
        sets: [
          { setNumber: 1, reps: '8', weightKg: '40' },
          { setNumber: 2, reps: '8', weightKg: '45' },
          { setNumber: 3, reps: '6', weightKg: '50' },
          { setNumber: 4, reps: '6', weightKg: '55' },
        ],
      },
      {
        name: 'Bench Press (Press de Banca)',
        category: 'Fuerza',
        exerciseId: 'ex-pecho-1',
        sets: [
          { setNumber: 1, reps: '10', weightKg: '65' },
          { setNumber: 2, reps: '8', weightKg: '75' },
          { setNumber: 3, reps: '8', weightKg: '80' },
        ],
      },
      {
        name: 'Ring Dips (Fondos en Anillas)',
        category: 'Gimnásticos',
        exerciseId: 'ex-pecho-3',
        sets: [
          { setNumber: 1, reps: '10', weightKg: '0' },
          { setNumber: 2, reps: '8', weightKg: '0' },
          { setNumber: 3, reps: '8', weightKg: '0' },
        ],
      },
      {
        name: 'Dumbbell Lateral Raises (Elevaciones Laterales)',
        category: 'Accesorios',
        exerciseId: 'ex-hombros-4',
        sets: [
          { setNumber: 1, reps: '12', weightKg: '10' },
          { setNumber: 2, reps: '12', weightKg: '12' },
          { setNumber: 3, reps: '12', weightKg: '12' },
        ],
      },
      {
        name: 'Skull Crushers (Press Francés)',
        category: 'Accesorios',
        exerciseId: 'ex-brazos-2',
        sets: [
          { setNumber: 1, reps: '10', weightKg: '25' },
          { setNumber: 2, reps: '10', weightKg: '30' },
          { setNumber: 3, reps: '8', weightKg: '35' },
        ],
      },
    ],
  },

  // 4. PULL (TRACCIÓN)
  {
    id: 'tpl-pull-1',
    title: 'Rutina Pull: Espalda, Bíceps & Core',
    category: 'Pull',
    description: 'Enfocada en tracciones pesadas de suelo, barra y flexión de brazos para blindar la espalda y el agarre.',
    durationEst: '45-55 min',
    difficulty: 'Intermedio',
    tagColor: '#9D4EDD', // Purple
    exercises: [
      {
        name: 'Deadlift (Peso Muerto)',
        category: 'Fuerza',
        exerciseId: 'ex-espalda-1',
        sets: [
          { setNumber: 1, reps: '8', weightKg: '100' },
          { setNumber: 2, reps: '6', weightKg: '120' },
          { setNumber: 3, reps: '5', weightKg: '135' },
          { setNumber: 4, reps: '4', weightKg: '150' },
        ],
      },
      {
        name: 'Strict Pull-Ups (Dominadas Estrictas)',
        category: 'Gimnásticos',
        exerciseId: 'ex-espalda-2',
        sets: [
          { setNumber: 1, reps: '8', weightKg: '0' },
          { setNumber: 2, reps: '8', weightKg: '0' },
          { setNumber: 3, reps: '6', weightKg: '0' },
          { setNumber: 4, reps: '6', weightKg: '0' },
        ],
      },
      {
        name: 'Barbell Bicep Curl (Curl con Barra)',
        category: 'Accesorios',
        exerciseId: 'ex-brazos-1',
        sets: [
          { setNumber: 1, reps: '10', weightKg: '30' },
          { setNumber: 2, reps: '10', weightKg: '35' },
          { setNumber: 3, reps: '8', weightKg: '40' },
        ],
      },
      {
        name: 'Toes to Bar (T2B Puntas a la Barra)',
        category: 'Gimnásticos',
        exerciseId: 'ex-core-1',
        sets: [
          { setNumber: 1, reps: '12', weightKg: '0' },
          { setNumber: 2, reps: '10', weightKg: '0' },
          { setNumber: 3, reps: '10', weightKg: '0' },
        ],
      },
    ],
  },

  // 5. FULL BODY (CUERPO COMPLETO / CROSSFIT RX)
  {
    id: 'tpl-fullbody-1',
    title: 'Rutina Full Body: Fuerza Total & Gimnásticos',
    category: 'Full Body',
    description: 'Entrenamiento global multiarticular de alta intensidad que activa todos los grandes grupos musculares.',
    durationEst: '55-65 min',
    difficulty: 'Avanzado RX',
    tagColor: '#FFB800', // Amber
    exercises: [
      {
        name: 'Back Squat (Sentadilla Trasera)',
        category: 'Fuerza',
        exerciseId: 'ex-piernas-1',
        sets: [
          { setNumber: 1, reps: '8', weightKg: '85' },
          { setNumber: 2, reps: '8', weightKg: '95' },
          { setNumber: 3, reps: '6', weightKg: '105' },
        ],
      },
      {
        name: 'Bench Press (Press de Banca)',
        category: 'Fuerza',
        exerciseId: 'ex-pecho-1',
        sets: [
          { setNumber: 1, reps: '8', weightKg: '70' },
          { setNumber: 2, reps: '8', weightKg: '75' },
          { setNumber: 3, reps: '6', weightKg: '80' },
        ],
      },
      {
        name: 'Deadlift (Peso Muerto)',
        category: 'Fuerza',
        exerciseId: 'ex-espalda-1',
        sets: [
          { setNumber: 1, reps: '6', weightKg: '110' },
          { setNumber: 2, reps: '5', weightKg: '130' },
          { setNumber: 3, reps: '4', weightKg: '145' },
        ],
      },
      {
        name: 'Push Press (Press de Empuje)',
        category: 'Halterofilia',
        exerciseId: 'ex-hombros-2',
        sets: [
          { setNumber: 1, reps: '8', weightKg: '50' },
          { setNumber: 2, reps: '6', weightKg: '60' },
          { setNumber: 3, reps: '5', weightKg: '65' },
        ],
      },
      {
        name: 'Hollow Body Hold & Rock',
        category: 'Gimnásticos',
        exerciseId: 'ex-core-2',
        sets: [
          { setNumber: 1, reps: '20', weightKg: '0' },
          { setNumber: 2, reps: '20', weightKg: '0' },
          { setNumber: 3, reps: '20', weightKg: '0' },
        ],
      },
    ],
  },
];
