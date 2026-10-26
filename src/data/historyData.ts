import { WorkoutHistoryItem } from '../types';

export const WORKOUT_HISTORY: WorkoutHistoryItem[] = [
  {
    id: 'hist-1',
    title: 'Benchmark WOD: Fran',
    format: 'FOR TIME',
    date: '24 Oct 2026',
    timeAgo: 'Ayer',
    duration: '03:48 min',
    score: '03:48 (PR 🔥)',
    isRx: true,
    caloriesBurned: 185,
    avgHeartRate: 178,
    totalVolumeKg: 1912,
    summary: [
      '21-15-9 Thrusters (43 kg / 95 lbs)',
      '21-15-9 Pull-ups (Dominadas de mariposa)'
    ],
    athleteNotes: '¡Nuevo Récord Personal! Series de 21 unbroken en los thrusters. La respiración se disparó en la ronda de 15 pero mantuve el agarre en barra sin soltar.',
    tagColor: '#CCFF00'
  },
  {
    id: 'hist-2',
    title: 'Hero WOD: Murph (con Chaleco 9kg)',
    format: 'FOR TIME',
    date: '21 Oct 2026',
    timeAgo: 'Hace 3 días',
    duration: '41:15 min',
    score: '41:15 RX',
    isRx: true,
    caloriesBurned: 740,
    avgHeartRate: 165,
    totalVolumeKg: 6800,
    summary: [
      '1 Milla de Carrera (1.6 km)',
      '100 Dominadas (Pull-ups)',
      '200 Flexiones (Push-ups)',
      '300 Sentadillas al aire (Air Squats)',
      '1 Milla de Carrera final'
    ],
    athleteNotes: 'Particionado en 20 rondas de Cindy (5-10-15). Los push-ups fueron el factor limitante a partir de la ronda 14. Excelente ritmo en la última milla.',
    tagColor: '#FF4757'
  },
  {
    id: 'hist-3',
    title: 'Fuerza: Snatch Complex & 1RM',
    format: 'HEAVY SINGLE',
    date: '19 Oct 2026',
    timeAgo: 'Hace 5 días',
    duration: '52:00 min',
    score: '92.5 kg (PR)',
    isRx: true,
    caloriesBurned: 380,
    avgHeartRate: 142,
    totalVolumeKg: 4250,
    summary: [
      '1 Hang Squat Snatch + 1 Overhead Squat x 5 sets',
      'Construir a un Heavy Single de Squat Snatch',
      '3x3 Snatch Pulls al 105%'
    ],
    athleteNotes: 'Recepción sólida en el hoyo con 92.5 kg. Mejor velocidad de pies que la semana pasada. Buena sensación en la movilidad de hombros.',
    tagColor: '#A855F7'
  },
  {
    id: 'hist-4',
    title: 'Cindy (Gymnastics Volume)',
    format: 'AMRAP',
    date: '17 Oct 2026',
    timeAgo: 'Hace 7 días',
    duration: '20:00 min',
    score: '23 Rondas + 8 reps',
    isRx: true,
    caloriesBurned: 390,
    avgHeartRate: 168,
    summary: [
      'AMRAP 20 minutos de:',
      '5 Pull-ups estrictos / kipping',
      '10 Push-ups (pecho al suelo)',
      '15 Air Squats (rompiendo paralelo)'
    ],
    athleteNotes: 'Ritmo sostenido de 50 segundos por ronda durante los primeros 12 minutos. Buen trabajo de resistencia muscular.',
    tagColor: '#FF7A00'
  },
  {
    id: 'hist-5',
    title: 'Hero WOD: DT',
    format: 'FOR TIME',
    date: '14 Oct 2026',
    timeAgo: 'Hace 10 días',
    duration: '08:24 min',
    score: '08:24 RX',
    isRx: true,
    caloriesBurned: 240,
    avgHeartRate: 175,
    totalVolumeKg: 5250,
    summary: [
      '5 Rondas por tiempo de:',
      '12 Deadlifts (70 kg / 155 lbs)',
      '9 Hang Power Cleans (70 kg)',
      '6 Push Jerks (70 kg)'
    ],
    athleteNotes: 'Estrategia de dejar la última repetición de deadlift para enlazar directamente con los hang cleans. Agarre de antebrazos al límite.',
    tagColor: '#00E5FF'
  },
  {
    id: 'hist-6',
    title: 'Engine & Erg: Row + Burpees Over Erg',
    format: 'EMOM',
    date: '11 Oct 2026',
    timeAgo: 'Hace 13 días',
    duration: '24:00 min',
    score: '24 Rondas Completadas',
    isRx: false,
    caloriesBurned: 410,
    avgHeartRate: 162,
    summary: [
      'Min 1: 16/13 Calorías en Remo Concept2',
      'Min 2: 12 Burpees over Erg',
      'Min 3: 50 Saltos Dobles (Double Unders)',
      'Min 4: Descanso total'
    ],
    athleteNotes: 'Manteniendo ritmo constante de 1:44/500m en el remo. Los dobles salieron unbroken en todas las rondas sin cortes.',
    tagColor: '#10B981'
  }
];
