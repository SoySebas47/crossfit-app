import { WorkoutBlock } from '../types';

export const CURRENT_WORKOUT_TEMPLATE: {
  title: string;
  subtitle: string;
  type: string;
  timeCap: string;
  targetIntensity: string;
  blocks: WorkoutBlock[];
} = {
  title: 'METCON & STRENGTH: TITAN 24',
  subtitle: 'Fuerza pesada de Clean & Jerk + Metcon explosivo de alta densidad',
  type: 'HÍBRIDO: FUERZA + METCON',
  timeCap: '55 MIN',
  targetIntensity: '85-95% FC Máx',
  blocks: [
    {
      id: 'block-1',
      name: 'Calentamiento Específico',
      type: 'Warmup',
      timeCap: '10 MIN',
      description: 'Activación de movilidad torácica, muñecas, tobillos y cadera con barra vacía.',
      exercises: [
        {
          id: 'w-ex-1',
          name: 'Movilidad de Muñecas & Front Rack',
          category: 'Movilidad',
          notes: 'Usar banda elástica en rack para apertura dorsal',
          sets: [
            { id: 's1-1', setNumber: 1, targetReps: 10, weightKg: 0, completed: true },
            { id: 's1-2', setNumber: 2, targetReps: 10, weightKg: 0, completed: true }
          ]
        },
        {
          id: 'w-ex-2',
          name: 'Barbell Muscle Clean + Strict Press',
          category: 'Técnica',
          notes: 'Foco en codos rápidos y pies firmes',
          sets: [
            { id: 's2-1', setNumber: 1, targetReps: 5, weightKg: 20, completed: true },
            { id: 's2-2', setNumber: 2, targetReps: 5, weightKg: 30, completed: false }
          ]
        }
      ]
    },
    {
      id: 'block-2',
      name: 'Bloque A: Clean & Jerk (Dos Tiempos)',
      type: 'Strength',
      timeCap: '20 MIN',
      description: 'Construir gradualmente a un 1RM o peso pesado del día (Heavy Single).',
      exercises: [
        {
          id: 's-ex-1',
          name: 'Clean & Jerk (1 Clean + 1 Split Jerk)',
          category: 'Halterofilia',
          notes: 'Pausa de 1 segundo en el hoyo de la cargada.',
          sets: [
            { id: 'cj-1', setNumber: 1, prevWeight: 60, prevReps: 3, targetReps: 3, weightKg: 65, completed: true, rpe: 6 },
            { id: 'cj-2', setNumber: 2, prevWeight: 70, prevReps: 2, targetReps: 2, weightKg: 75, completed: true, rpe: 7.5 },
            { id: 'cj-3', setNumber: 3, prevWeight: 80, prevReps: 1, targetReps: 1, weightKg: 85, completed: false, rpe: 8.5 },
            { id: 'cj-4', setNumber: 4, prevWeight: 87.5, prevReps: 1, targetReps: 1, weightKg: 90, completed: false, rpe: 9 },
            { id: 'cj-5', setNumber: 5, prevWeight: 92.5, prevReps: 1, targetReps: 1, weightKg: 95, completed: false, rpe: 9.5 }
          ]
        }
      ]
    },
    {
      id: 'block-3',
      name: 'Bloque B: Metcon "GHOST PROTOCOL"',
      type: 'Metcon',
      timeCap: '16 MIN CAP',
      description: '4 Rondas por tiempo (4 Rounds For Time) - Intensidad RX',
      exercises: [
        {
          id: 'm-ex-1',
          name: 'Thrusters con Barra',
          category: 'Metcon',
          notes: 'Peso RX: 52 kg hombres / 38 kg mujeres',
          sets: [
            { id: 'th-1', setNumber: 1, targetReps: 15, weightKg: 52, completed: false },
            { id: 'th-2', setNumber: 2, targetReps: 15, weightKg: 52, completed: false },
            { id: 'th-3', setNumber: 3, targetReps: 15, weightKg: 52, completed: false },
            { id: 'th-4', setNumber: 4, targetReps: 15, weightKg: 52, completed: false }
          ]
        },
        {
          id: 'm-ex-2',
          name: 'Chest to Bar Pull-ups (Pecho a Barra)',
          category: 'Gimnásticos',
          notes: 'Mariposa o kipping fluido sin tocar el suelo',
          sets: [
            { id: 'cb-1', setNumber: 1, targetReps: 12, weightKg: 0, completed: false },
            { id: 'cb-2', setNumber: 2, targetReps: 12, weightKg: 0, completed: false },
            { id: 'cb-3', setNumber: 3, targetReps: 12, weightKg: 0, completed: false },
            { id: 'cb-4', setNumber: 4, targetReps: 12, weightKg: 0, completed: false }
          ]
        },
        {
          id: 'm-ex-3',
          name: 'Burpees Facing Bar',
          category: 'Metcon',
          notes: 'Salto con ambos pies a la vez por encima de la barra',
          sets: [
            { id: 'bp-1', setNumber: 1, targetReps: 9, weightKg: 0, completed: false },
            { id: 'bp-2', setNumber: 2, targetReps: 9, weightKg: 0, completed: false },
            { id: 'bp-3', setNumber: 3, targetReps: 9, weightKg: 0, completed: false },
            { id: 'bp-4', setNumber: 4, targetReps: 9, weightKg: 0, completed: false }
          ]
        }
      ]
    }
  ]
};
