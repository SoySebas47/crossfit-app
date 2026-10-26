import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressEntry } from '../types';

const PROGRESS_STORAGE_KEY = '@crossfit_app_athlete_progress_v1';

// Initial realistic baseline data so the graphs and progress timeline have immediate athletic context
const INITIAL_PROGRESS_DATA: ProgressEntry[] = [
  {
    id: 'prog-1',
    date: '28 sep 2026',
    timestamp: new Date('2026-09-28').getTime(),
    weightKg: 80.5,
    waistCm: 85,
    chestCm: 102,
    hipsCm: 100,
    photoPose: 'Frontal',
    notes: 'Inicio de bloque de fuerza + metcon. Medición en ayunas.',
  },
  {
    id: 'prog-2',
    date: '07 oct 2026',
    timestamp: new Date('2026-10-07').getTime(),
    weightKg: 79.8,
    waistCm: 84,
    chestCm: 102.5,
    hipsCm: 99.5,
    photoPose: 'Lateral',
    notes: 'Sensación de ligereza en gimnásticos y dominadas.',
  },
  {
    id: 'prog-3',
    date: '16 oct 2026',
    timestamp: new Date('2026-10-16').getTime(),
    weightKg: 79.1,
    waistCm: 83,
    chestCm: 103.2,
    hipsCm: 99,
    photoPose: 'Espalda',
    notes: 'Mayor densidad en dorsales y trapecios tras semanas pesadas.',
  },
  {
    id: 'prog-4',
    date: '25 oct 2026',
    timestamp: new Date('2026-10-25').getTime(),
    weightKg: 78.4,
    waistCm: 82,
    chestCm: 104,
    hipsCm: 98,
    photoPose: 'Frontal',
    notes: 'Récord de definición personal. Fuerza intacta en sentadillas.',
  },
];

type Listener = () => void;
const listeners: Listener[] = [];

export const subscribeToProgress = (listener: Listener) => {
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
      console.warn('Error in progress listener:', e);
    }
  });
};

export const getProgressEntries = async (): Promise<ProgressEntry[]> => {
  try {
    const json = await AsyncStorage.getItem(PROGRESS_STORAGE_KEY);
    if (json) {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Sort chronologically (oldest to newest for graphs, reverse for list)
        return parsed.sort((a, b) => a.timestamp - b.timestamp);
      }
    }
    // Seed initial data if first time
    await AsyncStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify(INITIAL_PROGRESS_DATA)
    );
    return INITIAL_PROGRESS_DATA;
  } catch (e) {
    console.warn('Error reading progress entries:', e);
    return INITIAL_PROGRESS_DATA;
  }
};

export const saveProgressEntry = async (
  newEntry: Omit<ProgressEntry, 'id' | 'timestamp'> & { id?: string; timestamp?: number }
): Promise<ProgressEntry[]> => {
  try {
    const current = await getProgressEntries();
    const entry: ProgressEntry = {
      ...newEntry,
      id: newEntry.id || `prog-${Date.now()}`,
      timestamp: newEntry.timestamp || Date.now(),
    };

    const updated = [...current, entry].sort((a, b) => a.timestamp - b.timestamp);
    await AsyncStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(updated));
    notifyListeners();
    return updated;
  } catch (e) {
    console.error('Error saving progress entry:', e);
    throw e;
  }
};

export const deleteProgressEntry = async (id: string): Promise<ProgressEntry[]> => {
  try {
    const current = await getProgressEntries();
    const filtered = current.filter((item) => item.id !== id);
    await AsyncStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(filtered));
    notifyListeners();
    return filtered;
  } catch (e) {
    console.error('Error deleting progress entry:', e);
    throw e;
  }
};
