import AsyncStorage from '@react-native-async-storage/async-storage';

const REST_STORAGE_KEY = '@crossfit_app_rest_state_v1';

export interface RestState {
  initialDuration: number;
  mode: 'REST' | 'EMOM' | 'TABATA' | 'FOR_TIME';
  restsCompletedToday: number;
  soundEnabled: boolean;
  lastUpdated: number;
}

const DEFAULT_REST_STATE: RestState = {
  initialDuration: 90,
  mode: 'REST',
  restsCompletedToday: 0,
  soundEnabled: true,
  lastUpdated: Date.now(),
};

type Listener = () => void;
const listeners: Listener[] = [];

export const subscribeToRestState = (listener: Listener) => {
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
      console.warn('Error in rest state listener:', e);
    }
  });
};

export const getRestState = async (): Promise<RestState> => {
  try {
    const json = await AsyncStorage.getItem(REST_STORAGE_KEY);
    if (json) {
      return JSON.parse(json);
    }
    return DEFAULT_REST_STATE;
  } catch (e) {
    console.warn('Error reading rest state:', e);
    return DEFAULT_REST_STATE;
  }
};

export const saveRestState = async (
  partial: Partial<RestState>
): Promise<RestState> => {
  try {
    const current = await getRestState();
    const updated: RestState = {
      ...current,
      ...partial,
      lastUpdated: Date.now(),
    };
    await AsyncStorage.setItem(REST_STORAGE_KEY, JSON.stringify(updated));
    notifyListeners();
    return updated;
  } catch (e) {
    console.error('Error saving rest state:', e);
    throw e;
  }
};

export const incrementRestsCompleted = async (): Promise<number> => {
  try {
    const current = await getRestState();
    const nextCount = current.restsCompletedToday + 1;
    await saveRestState({ restsCompletedToday: nextCount });
    return nextCount;
  } catch (e) {
    console.error('Error incrementing rests count:', e);
    return 1;
  }
};
