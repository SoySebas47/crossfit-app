export type MuscleGroup = 
  | 'Todos' 
  | 'Pecho' 
  | 'Espalda' 
  | 'Piernas' 
  | 'Hombros' 
  | 'Brazos' 
  | 'Core' 
  | 'Cuerpo Completo';

export type Equipment = 
  | 'Todos'
  | 'Barra'
  | 'Mancuerna'
  | 'Kettlebell'
  | 'Gimnásticos'
  | 'Cajón'
  | 'Cuerda'
  | 'Cardio'
  | 'Peso Corporal'
  | 'Barra Olímpica'
  | 'Anillas';

export type Difficulty = 'Principiante' | 'Intermedio' | 'Avanzado RX';
export type ExerciseLevel = 'Principiante' | 'Intermedio';

export interface ExerciseItem {
  id: string;
  name: string;
  category: 'Halterofilia' | 'Gimnásticos' | 'Metcon' | 'Fuerza' | 'Accesorios';
  muscleGroup: MuscleGroup;
  equipment: Equipment | string;
  difficulty: Difficulty;
  level: ExerciseLevel;
  description: string;
  execution: string;
  injuryPrevention: string[];
  primaryMuscles: string[];
  secondaryMuscles: string[];
  benefits: string[];
  graphicType: string;
  standards?: string[];
  tips?: string[];
  commonErrors?: string[];
  prsRecord?: string;
}

export interface WorkoutSet {
  id: string;
  setNumber: number;
  prevReps?: number;
  prevWeight?: number;
  targetReps: number;
  weightKg: number;
  completed: boolean;
  rpe?: number;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  category: string;
  notes: string;
  sets: WorkoutSet[];
}

export interface WorkoutBlock {
  id: string;
  name: string;
  type: 'Warmup' | 'Strength' | 'Metcon' | 'Cooldown';
  description?: string;
  timeCap?: string;
  exercises: WorkoutExercise[];
}

export interface LoggedSet {
  id: string;
  setNumber: number;
  reps: string;
  weightKg: string;
  completed: boolean;
  rpe?: string;
}

export interface LoggedExercise {
  id: string;
  exerciseId?: string;
  name: string;
  category: string;
  sets: LoggedSet[];
}

export interface WorkoutHistoryItem {
  id: string;
  title: string;
  format: 'FOR TIME' | 'AMRAP' | 'EMOM' | 'TABATA' | 'HEAVY SINGLE';
  date: string;
  timeAgo: string;
  duration: string;
  score: string;
  isRx: boolean;
  caloriesBurned: number;
  avgHeartRate: number;
  totalVolumeKg?: number;
  summary: string[];
  athleteNotes: string;
  tagColor?: string;
  loggedExercises?: LoggedExercise[];
}

export interface ProgressEntry {
  id: string;
  date: string;
  timestamp: number;
  weightKg: number;
  waistCm?: number;
  chestCm?: number;
  hipsCm?: number;
  photoUri?: string;
  photoPose?: 'Frontal' | 'Lateral' | 'Espalda' | 'General';
  notes?: string;
}
