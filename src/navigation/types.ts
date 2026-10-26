import { NavigatorScreenParams } from '@react-navigation/native';
import { ExerciseItem, WorkoutHistoryItem } from '../types';

export type BottomTabParamList = {
  Inicio: undefined;
  Entrenar: undefined;
  Historial: undefined;
  Descanso: { initialSeconds?: number } | undefined;
  Ejercicios: { filterGroup?: string } | undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<BottomTabParamList>;
  WorkoutDetail: { workout: WorkoutHistoryItem };
  ExerciseDetail: { exercise: ExerciseItem };
};
