import AsyncStorage from '@react-native-async-storage/async-storage';

const ACTIVE_WORKOUT_KEY = '@crossfit_app_active_workout_v1';

export interface ActiveWorkoutState {
  isActive: boolean;
  title: string;
  format: 'FOR TIME' | 'AMRAP' | 'EMOM' | 'HEAVY SINGLE';
  exercisesCount: number;
  completedSetsCount: number;
  totalSetsCount: number;
  totalVolumeKg: number;
  elapsedSeconds: number;
  exerciseNames: string[];
  lastUpdated: number;
}

const DEFAULT_ACTIVE_WORKOUT: ActiveWorkoutState = {
  isActive: false,
  title: 'Entrenamiento del Día',
  format: 'FOR TIME',
  exercisesCount: 0,
  completedSetsCount: 0,
  totalSetsCount: 0,
  totalVolumeKg: 0,
  elapsedSeconds: 0,
  exerciseNames: [],
  lastUpdated: Date.now(),
};

type Listener = () => void;
const listeners: Listener[] = [];

export const subscribeToActiveWorkout = (listener: Listener) => {
  listeners.push(listener);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx > -1) listeners.splice(idx, 1);
  };
};

const notifyListeners = () => {
  listeners.forEach((l) => {
    try {
      l();
    } catch (e) {
      console.warn('Error in active workout listener:', e);
    }
  });
};

export const getActiveWorkoutState = async (): Promise<ActiveWorkoutState> => {
  try {
    const json = await AsyncStorage.getItem(ACTIVE_WORKOUT_KEY);
    if (json) {
      return JSON.parse(json);
    }
    return DEFAULT_ACTIVE_WORKOUT;
  } catch (e) {
    console.warn('Error reading active workout state:', e);
    return DEFAULT_ACTIVE_WORKOUT;
  }
};

export const saveActiveWorkoutState = async (
  state: Partial<ActiveWorkoutState>
): Promise<ActiveWorkoutState> => {
  try {
    const current = await getActiveWorkoutState();
    const updated: ActiveWorkoutState = {
      ...current,
      ...state,
      lastUpdated: Date.now(),
    };
    await AsyncStorage.setItem(ACTIVE_WORKOUT_KEY, JSON.stringify(updated));
    notifyListeners();
    return updated;
  } catch (e) {
    console.error('Error saving active workout state:', e);
    throw e;
  }
};

export const clearActiveWorkoutState = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      ACTIVE_WORKOUT_KEY,
      JSON.stringify(DEFAULT_ACTIVE_WORKOUT)
    );
    notifyListeners();
  } catch (e) {
    console.error('Error clearing active workout state:', e);
  }
};
