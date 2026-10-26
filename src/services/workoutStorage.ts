import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutHistoryItem } from '../types';

// Key for purely real, user-logged workouts (no sample data)
const REAL_WORKOUTS_KEY = '@crossfit_app_real_workouts_v1';

type Listener = () => void;
const listeners: Listener[] = [];

export const subscribeToWorkoutHistory = (listener: Listener) => {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
};

const notifyListeners = () => {
  listeners.forEach((l) => {
    try {
      l();
    } catch (e) {
      console.warn('Error in workout history listener:', e);
    }
  });
};

/**
 * Returns only real workouts logged by the user.
 * Returns an empty array if no workouts have been logged yet.
 */
export const getWorkoutHistory = async (): Promise<WorkoutHistoryItem[]> => {
  try {
    const json = await AsyncStorage.getItem(REAL_WORKOUTS_KEY);
    if (json) {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    return [];
  } catch (error) {
    console.warn('Error reading real workout history:', error);
    return [];
  }
};

/**
 * Saves a new completed workout to the real history.
 */
export const saveNewWorkout = async (newWorkout: WorkoutHistoryItem): Promise<WorkoutHistoryItem[]> => {
  try {
    const current = await getWorkoutHistory();
    const updated = [newWorkout, ...current];
    await AsyncStorage.setItem(REAL_WORKOUTS_KEY, JSON.stringify(updated));
    notifyListeners();
    return updated;
  } catch (error) {
    console.error('Error saving real workout:', error);
    throw error;
  }
};

/**
 * Deletes a workout from real history.
 */
export const deleteWorkoutFromHistory = async (workoutId: string): Promise<WorkoutHistoryItem[]> => {
  try {
    const current = await getWorkoutHistory();
    const updated = current.filter((w) => w.id !== workoutId);
    await AsyncStorage.setItem(REAL_WORKOUTS_KEY, JSON.stringify(updated));
    notifyListeners();
    return updated;
  } catch (error) {
    console.error('Error deleting workout:', error);
    throw error;
  }
};

/**
 * Clears all real workout logs.
 */
export const clearAllWorkouts = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(REAL_WORKOUTS_KEY);
    notifyListeners();
  } catch (error) {
    console.error('Error clearing workouts:', error);
  }
};
