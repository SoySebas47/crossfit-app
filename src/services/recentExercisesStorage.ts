import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_EXERCISES_KEY = '@crossfit_app_recent_exercises_v1';

type Listener = () => void;
const listeners: Listener[] = [];

export const subscribeToRecentExercises = (listener: Listener) => {
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
      console.warn('Error in recent exercises listener:', e);
    }
  });
};

export const getRecentExerciseIds = async (): Promise<string[]> => {
  try {
    const json = await AsyncStorage.getItem(RECENT_EXERCISES_KEY);
    if (json) {
      const arr = JSON.parse(json);
      if (Array.isArray(arr)) return arr;
    }
    return ['ex-pecho-1', 'ex-espalda-1', 'ex-piernas-1', 'ex-hombros-1'];
  } catch (e) {
    console.warn('Error reading recent exercises:', e);
    return ['ex-pecho-1', 'ex-espalda-1', 'ex-piernas-1', 'ex-hombros-1'];
  }
};

export const recordRecentExercise = async (exerciseId: string): Promise<string[]> => {
  try {
    const current = await getRecentExerciseIds();
    const filtered = current.filter((id) => id !== exerciseId);
    const updated = [exerciseId, ...filtered].slice(0, 8); // Keep up to 8
    await AsyncStorage.setItem(RECENT_EXERCISES_KEY, JSON.stringify(updated));
    notifyListeners();
    return updated;
  } catch (e) {
    console.error('Error recording recent exercise:', e);
    return [];
  }
};
