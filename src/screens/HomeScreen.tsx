import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Flame,
  Dumbbell,
  History,
  Timer,
  BookOpen,
  ChevronRight,
  Zap,
  TrendingUp,
  TrendingDown,
  Award,
  Play,
  Heart,
  Calendar,
  Sparkles,
  CheckCircle2,
  Activity,
  Layers,
  Scale,
  Camera,
} from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { BottomTabParamList, RootStackParamList } from '../navigation/types';
import { EXERCISES_DATA } from '../data/exercisesData';
import { WorkoutHistoryItem, MuscleGroup, ProgressEntry } from '../types';
import {
  getWorkoutHistory,
  subscribeToWorkoutHistory,
} from '../services/workoutStorage';
import {
  getActiveWorkoutState,
  subscribeToActiveWorkout,
  ActiveWorkoutState,
} from '../services/activeWorkoutStorage';
import {
  getRestState,
  subscribeToRestState,
  RestState,
} from '../services/restStorage';
import {
  getRecentExerciseIds,
  subscribeToRecentExercises,
} from '../services/recentExercisesStorage';
import {
  getProgressEntries,
  subscribeToProgress,
} from '../services/progressStorage';
import { ProgressModal } from '../components/ProgressModal';

type NavigationProp = BottomTabNavigationProp<BottomTabParamList> &
  NativeStackNavigationProp<RootStackParamList>;

interface WeekDayItem {
  day: string;
  done: boolean;
  isToday: boolean;
  duration: string;
  dateStr: string;
}

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // Synchronized States from Services
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistoryItem[]>([]);
  const [lastWorkout, setLastWorkout] = useState<WorkoutHistoryItem | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkoutState | null>(null);
  const [restState, setRestState] = useState<RestState>({
    initialDuration: 90,
    mode: 'REST',
    restsCompletedToday: 0,
    soundEnabled: true,
    lastUpdated: Date.now(),
  });
  const [recentExerciseIds, setRecentExerciseIds] = useState<string[]>([]);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [latestProgress, setLatestProgress] = useState<ProgressEntry | null>(null);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState<boolean>(false);
  const [weekDays, setWeekDays] = useState<WeekDayItem[]>([]);
  const [weeklyVolumeKg, setWeeklyVolumeKg] = useState<number>(0);
  const [weeklyWorkoutsCount, setWeeklyWorkoutsCount] = useState<number>(0);

  // Helper to format MM:SS
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper to calculate current week days (L, M, X, J, V, S, D) and match real workouts
  const calculateWeekSchedule = (history: WorkoutHistoryItem[]) => {
    const now = new Date();
    // Monday is index 0 in our CrossFit week
    const currentDayOfWeek = (now.getDay() + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - currentDayOfWeek);
    monday.setHours(0, 0, 0, 0);

    const labels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    let weekVolume = 0;
    let weekCount = 0;

    const days: WeekDayItem[] = labels.map((label, idx) => {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + idx);

      const dayDateString = dayDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      const isToday = dayDate.toDateString() === now.toDateString();

      // Find workouts logged on this date
      const matchingWorkouts = history.filter((w) => {
        if (!w.date) return false;
        // Compare date strings or timestamps
        return (
          w.date.toLowerCase().includes(dayDateString.toLowerCase()) ||
          (w.id.startsWith('hist-user-') &&
            new Date(parseInt(w.id.replace('hist-user-', ''), 10)).toDateString() ===
              dayDate.toDateString())
        );
      });

      const done = matchingWorkouts.length > 0;
      if (done) {
        weekCount += matchingWorkouts.length;
        matchingWorkouts.forEach((w) => {
          weekVolume += w.totalVolumeKg || 0;
        });
      }

      return {
        day: label,
        done,
        isToday,
        duration: done ? matchingWorkouts[0].duration.split(' ')[0] : isToday ? 'Hoy' : '-',
        dateStr: dayDateString,
      };
    });

    setWeekDays(days);
    setWeeklyVolumeKg(weekVolume);
    setWeeklyWorkoutsCount(weekCount);
  };

  // Refresh all sections data
  const refreshAllData = useCallback(async () => {
    try {
      // 1. History
      const history = await getWorkoutHistory();
      setWorkoutHistory(history);
      if (history.length > 0) {
        setLastWorkout(history[0]);
      } else {
        setLastWorkout(null);
      }
      calculateWeekSchedule(history);

      // 2. Active Workout
      const active = await getActiveWorkoutState();
      setActiveWorkout(active);

      // 3. Rest Timer State
      const rest = await getRestState();
      setRestState(rest);

      // 4. Recent Exercises
      const recents = await getRecentExerciseIds();
      setRecentExerciseIds(recents);

      // 5. Athlete Progress Entries
      const progress = await getProgressEntries();
      setProgressEntries(progress);
      if (progress.length > 0) {
        setLatestProgress(progress[progress.length - 1]);
      } else {
        setLatestProgress(null);
      }
    } catch (e) {
      console.warn('Error refreshing home data:', e);
    }
  }, []);

  // Initial load and auto-sync subscriptions
  useEffect(() => {
    refreshAllData();

    const unsubHistory = subscribeToWorkoutHistory(refreshAllData);
    const unsubActive = subscribeToActiveWorkout(refreshAllData);
    const unsubRest = subscribeToRestState(refreshAllData);
    const unsubRecent = subscribeToRecentExercises(refreshAllData);
    const unsubProgress = subscribeToProgress(refreshAllData);

    return () => {
      unsubHistory();
      unsubActive();
      unsubRest();
      unsubRecent();
      unsubProgress();
    };
  }, [refreshAllData]);

  // Focus effect: Refresh automatically whenever athlete returns to Home tab
  useFocusEffect(
    useCallback(() => {
      refreshAllData();
    }, [refreshAllData])
  );

  // Muscle Groups overview with real counts
  const muscleGroupsSummary: { label: MuscleGroup; count: number; color: string }[] = [
    { label: 'Pecho', count: EXERCISES_DATA.filter((e) => e.muscleGroup === 'Pecho').length, color: Colors.fire },
    { label: 'Espalda', count: EXERCISES_DATA.filter((e) => e.muscleGroup === 'Espalda').length, color: Colors.cyan },
    { label: 'Piernas', count: EXERCISES_DATA.filter((e) => e.muscleGroup === 'Piernas').length, color: Colors.primary },
    { label: 'Hombros', count: EXERCISES_DATA.filter((e) => e.muscleGroup === 'Hombros').length, color: '#FFB800' },
    { label: 'Brazos', count: EXERCISES_DATA.filter((e) => e.muscleGroup === 'Brazos').length, color: '#9D4EDD' },
    { label: 'Core', count: EXERCISES_DATA.filter((e) => e.muscleGroup === 'Core').length, color: '#00F5D4' },
  ];

  // Pick recent exercises from storage or fallback to staples
  const recentExercisesList = recentExerciseIds
    .map((id) => EXERCISES_DATA.find((e) => e.id === id))
    .filter(Boolean) as typeof EXERCISES_DATA;

  const displayedRecentExercises =
    recentExercisesList.length > 0 ? recentExercisesList.slice(0, 4) : EXERCISES_DATA.slice(0, 4);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.badgeRow}>
              <View style={styles.rxBadge}>
                <Zap size={12} color={Colors.primary} />
                <Text style={styles.rxBadgeText}>NIVEL: RX ATLETA</Text>
              </View>
              <View style={styles.streakBadge}>
                <Flame size={12} color={Colors.orange} />
                <Text style={styles.streakText}>
                  {weeklyWorkoutsCount > 0
                    ? `${weeklyWorkoutsCount} SESIONES ESTA SEMANA`
                    : 'LISTO PARA ENTRENAR'}
                </Text>
              </View>
            </View>
            <Text style={styles.welcomeTitle}>¡A romperla hoy!</Text>
            <Text style={styles.welcomeSubtitle}>Box: CrossFit Thunder • Sesiones y marcas en vivo</Text>
          </View>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>CF</Text>
          </View>
        </View>

        {/* Section Heading */}
        <Text style={styles.sectionHeading}>RESUMEN DE TU ACTIVIDAD REAL</Text>

        {/* ======================================================== */}
        {/* 1. TARJETA ENTRENAR: Resumen Real + Enlace a Entrenar    */}
        {/* ======================================================== */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            styles.card,
            activeWorkout?.isActive && styles.activeWorkoutCardHighlight,
          ]}
          onPress={() => navigation.navigate('Entrenar')}
        >
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.cardIconBoxPrimary,
                activeWorkout?.isActive && { backgroundColor: Colors.primary },
              ]}
            >
              <Dumbbell
                size={18}
                color={activeWorkout?.isActive ? Colors.textInverse : Colors.primary}
              />
            </View>
            <View style={styles.cardHeaderTextGroup}>
              <Text
                style={[
                  styles.cardSuperTitle,
                  activeWorkout?.isActive && { color: Colors.primary, fontWeight: '900' },
                ]}
              >
                {activeWorkout?.isActive
                  ? `🔴 ENTRENAR • EN CURSO (${formatTimer(activeWorkout.elapsedSeconds)})`
                  : 'ENTRENAR • REGISTRO EN VIVO'}
              </Text>
              <Text style={styles.cardTitle}>
                {activeWorkout?.isActive
                  ? activeWorkout.title
                  : 'Sesión de Entrenamiento Libre'}
              </Text>
            </View>
            <ChevronRight
              size={18}
              color={activeWorkout?.isActive ? Colors.primary : Colors.textMuted}
            />
          </View>

          {/* Subtitle / Excerpt */}
          <Text style={styles.cardExcerptText}>
            {activeWorkout?.isActive
              ? `${activeWorkout.exercisesCount} movimientos añadidos (${activeWorkout.exerciseNames.slice(0, 3).join(', ')})`
              : 'Diseña tu sesión con 25 movimientos disponibles, añade series, repeticiones y pesos en kg con cronómetro activo.'}
          </Text>

          {/* Live Metric Strip */}
          <View style={styles.cardStatsGrid}>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>
                {activeWorkout?.isActive ? 'SERIES LISTAS' : 'BIBLIOTECA'}
              </Text>
              <Text
                style={[
                  styles.statValue,
                  activeWorkout?.isActive && styles.statValueHighlight,
                ]}
              >
                {activeWorkout?.isActive
                  ? `${activeWorkout.completedSetsCount}/${activeWorkout.totalSetsCount}`
                  : '25 Ejercicios'}
              </Text>
            </View>

            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>VOLUMEN ACTUAL</Text>
              <Text style={styles.statValue}>
                {activeWorkout?.isActive
                  ? `${activeWorkout.totalVolumeKg.toLocaleString()} kg`
                  : '0 kg'}
              </Text>
            </View>

            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>MODALIDAD</Text>
              <Text style={[styles.statValue, { color: Colors.cyan }]}>
                {activeWorkout?.isActive ? activeWorkout.format : 'Fuerza / WOD'}
              </Text>
            </View>
          </View>

          {/* Footer Action Link */}
          <View style={styles.cardActionFooter}>
            <Text style={styles.cardActionLink}>
              {activeWorkout?.isActive
                ? 'Continuar sesión en Entrenar'
                : 'Iniciar nuevo entrenamiento'}
            </Text>
            <ChevronRight size={14} color={Colors.primary} />
          </View>
        </TouchableOpacity>

        {/* ======================================================== */}
        {/* 2. TARJETA HISTORIAL: Resumen Real + Enlace a Historial  */}
        {/* ======================================================== */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.card}
          onPress={() => navigation.navigate('Historial')}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconBoxPrimary, { backgroundColor: Colors.orangeMuted }]}>
              <History size={18} color={Colors.orange} />
            </View>
            <View style={styles.cardHeaderTextGroup}>
              <Text style={styles.cardSuperTitle}>
                {workoutHistory.length > 0
                  ? `HISTORIAL • ${workoutHistory.length} SESIONES GUARDADAS`
                  : 'HISTORIAL • SIN REGISTROS AÚN'}
              </Text>
              <Text style={styles.cardTitle}>
                {lastWorkout
                  ? `Último: ${lastWorkout.title}`
                  : 'Constancia Semanal & Récords'}
              </Text>
            </View>
            <ChevronRight size={18} color={Colors.textMuted} />
          </View>

          {/* Real Bar Calendar Widget */}
          <View style={styles.weekWidget}>
            {weekDays.map((item, index) => (
              <View key={index} style={styles.weekDayCol}>
                <View
                  style={[
                    styles.weekBar,
                    item.done && styles.weekBarDone,
                    item.isToday && styles.weekBarToday,
                  ]}
                >
                  {item.done ? (
                    <Zap size={11} color={Colors.textInverse} />
                  ) : item.isToday ? (
                    <Text style={styles.todayDot}>•</Text>
                  ) : null}
                </View>
                <Text
                  style={[
                    styles.weekDayLabel,
                    item.isToday && styles.weekDayLabelActive,
                    item.done && styles.weekDayLabelDone,
                  ]}
                >
                  {item.day}
                </Text>
              </View>
            ))}
          </View>

          {/* Real Metrics of Last Workout or Weekly Aggregate */}
          {lastWorkout ? (
            <View style={styles.cardStatsGrid}>
              <View style={styles.statBlock}>
                <Text style={styles.statLabel}>TIEMPO / SCORE</Text>
                <Text style={styles.statValueHighlight}>{lastWorkout.score}</Text>
              </View>
              <View style={styles.statBlock}>
                <Text style={styles.statLabel}>VOLUMEN TOTAL</Text>
                <Text style={styles.statValue}>
                  {lastWorkout.totalVolumeKg ? `${lastWorkout.totalVolumeKg.toLocaleString()} kg` : '0 kg'}
                </Text>
              </View>
              <View style={styles.statBlock}>
                <Text style={styles.statLabel}>CALORÍAS</Text>
                <View style={styles.heartRow}>
                  <Flame size={12} color={Colors.fire} />
                  <Text style={styles.statValue}>{lastWorkout.caloriesBurned} kcal</Text>
                </View>
              </View>
            </View>
          ) : (
            <Text style={styles.cardExcerptText}>
              Completa un entrenamiento en la sección Entrenar para registrar aquí tus marcas,
              calendario semanal y desglose de series.
            </Text>
          )}

          {/* Weekly Aggregate Tag */}
          <View style={styles.weeklySummaryRow}>
            <View style={styles.summaryMetricItem}>
              <TrendingUp size={13} color={Colors.primary} />
              <Text style={styles.summaryMetricText}>
                {weeklyVolumeKg.toLocaleString()} kg esta semana
              </Text>
            </View>
            <Text style={styles.dotSeparator}>•</Text>
            <View style={styles.summaryMetricItem}>
              <Calendar size={13} color={Colors.orange} />
              <Text style={styles.summaryMetricText}>
                {weeklyWorkoutsCount} de 7 días completados
              </Text>
            </View>
          </View>

          {/* Footer Action Link */}
          <View style={styles.cardActionFooter}>
            <Text style={[styles.cardActionLink, { color: Colors.orange }]}>
              {lastWorkout ? 'Ver historial completo y series' : 'Ir a Historial'}
            </Text>
            <ChevronRight size={14} color={Colors.orange} />
          </View>
        </TouchableOpacity>

        {/* ======================================================== */}
        {/* 3. TARJETA DESCANSO: Resumen Real + Enlace a Descanso    */}
        {/* ======================================================== */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.card}
          onPress={() =>
            navigation.navigate('Descanso', { initialSeconds: restState.initialDuration })
          }
        >
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconBoxPrimary, { backgroundColor: Colors.cyanMuted }]}>
              <Timer size={18} color={Colors.cyan} />
            </View>
            <View style={styles.cardHeaderTextGroup}>
              <Text style={styles.cardSuperTitle}>CONTROL DE DESCANSO • RECUPERACIÓN REAL</Text>
              <Text style={styles.cardTitle}>
                Temporizador a {formatTimer(restState.initialDuration)} ({restState.initialDuration}s)
              </Text>
            </View>
            <ChevronRight size={18} color={Colors.textMuted} />
          </View>

          {/* Rest LED Digital Preview and Presets */}
          <View style={styles.restBanner}>
            <View style={styles.timerLedPreview}>
              <Text style={styles.timerLedText}>
                {formatTimer(restState.initialDuration)}
              </Text>
              <Text style={styles.timerLedSub}>
                {restState.restsCompletedToday > 0
                  ? `${restState.restsCompletedToday} descansos hoy`
                  : 'Rest recomendado'}
              </Text>
            </View>

            {/* Quick Interactive Preset Buttons */}
            <View style={styles.restPresetList}>
              {[30, 60, 90, 120].map((secs) => {
                const label = secs >= 60 ? `${secs / 60}m` : `${secs}s`;
                const isActive = restState.initialDuration === secs;
                return (
                  <TouchableOpacity
                    key={secs}
                    style={[styles.restChip, isActive && styles.restChipActive]}
                    onPress={(e) => {
                      e.stopPropagation();
                      navigation.navigate('Descanso', { initialSeconds: secs });
                    }}
                  >
                    <Text
                      style={[
                        styles.restChipText,
                        isActive && styles.restChipTextActive,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Footer Action Link */}
          <View style={styles.cardActionFooter}>
            <Text style={[styles.cardActionLink, { color: Colors.cyan }]}>
              Abrir cronómetro y temporizadores
            </Text>
            <ChevronRight size={14} color={Colors.cyan} />
          </View>
        </TouchableOpacity>

        {/* ======================================================== */}
        {/* 4. TARJETA EJERCICIOS: Resumen Real + Enlace a Biblioteca*/}
        {/* ======================================================== */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.card}
          onPress={() => navigation.navigate('Ejercicios', undefined)}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconBoxPrimary, { backgroundColor: Colors.purpleMuted }]}>
              <BookOpen size={18} color={Colors.purple} />
            </View>
            <View style={styles.cardHeaderTextGroup}>
              <Text style={styles.cardSuperTitle}>BIBLIOTECA • 25 MOVIMIENTOS TÉCNICOS</Text>
              <Text style={styles.cardTitle}>6 Grupos Musculares Organizados</Text>
            </View>
            <ChevronRight size={18} color={Colors.textMuted} />
          </View>

          {/* Muscle Groups Strip with Direct Navigation */}
          <View style={styles.muscleSummaryRow}>
            {muscleGroupsSummary.map((grp) => (
              <TouchableOpacity
                key={grp.label}
                style={styles.muscleSummaryPill}
                onPress={(e) => {
                  e.stopPropagation();
                  navigation.navigate('Ejercicios', { filterGroup: grp.label });
                }}
              >
                <View style={[styles.dotTiny, { backgroundColor: grp.color }]} />
                <Text style={styles.muscleSummaryText}>
                  {grp.label} <Text style={{ color: grp.color, fontWeight: '800' }}>({grp.count})</Text>
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recent/Staple Exercises Chips */}
          <View style={styles.exerciseChipsRow}>
            {displayedRecentExercises.map((ex) => (
              <View key={ex.id} style={styles.exerciseChip}>
                <Dumbbell size={11} color={Colors.primary} style={{ marginRight: 4 }} />
                <Text style={styles.exerciseChipName} numberOfLines={1}>
                  {ex.name}
                </Text>
              </View>
            ))}
          </View>

          {/* Footer Action Link */}
          <View style={styles.cardActionFooter}>
            <Text style={[styles.cardActionLink, { color: Colors.purple }]}>
              Explorar técnica, prevención y biomecánica
            </Text>
            <ChevronRight size={14} color={Colors.purple} />
          </View>
        </TouchableOpacity>

        {/* ======================================================== */}
        {/* 5. TARJETA PROGRESO: Peso, Medidas, Fotos y Gráficas     */}
        {/* ======================================================== */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.card}
          onPress={() => setIsProgressModalOpen(true)}
        >
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.cardIconBoxPrimary,
                { backgroundColor: 'rgba(204, 255, 0, 0.15)' },
              ]}
            >
              <Scale size={18} color={Colors.primary} />
            </View>
            <View style={styles.cardHeaderTextGroup}>
              <Text style={styles.cardSuperTitle}>PROGRESO CORPORAL • EVOLUCIÓN REAL</Text>
              <Text style={styles.cardTitle}>
                {latestProgress
                  ? `Peso actual: ${latestProgress.weightKg} kg`
                  : 'Registra tu evolución física'}
              </Text>
            </View>
            <ChevronRight size={18} color={Colors.textMuted} />
          </View>

          {/* Measurements grid preview */}
          <View style={styles.cardStatsGrid}>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>PESO</Text>
              <Text style={styles.statValueHighlight}>
                {latestProgress ? `${latestProgress.weightKg} kg` : '-'}
              </Text>
            </View>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>CINTURA</Text>
              <Text style={[styles.statValue, { color: Colors.cyan }]}>
                {latestProgress?.waistCm ? `${latestProgress.waistCm} cm` : '-'}
              </Text>
            </View>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>PECHO</Text>
              <Text style={[styles.statValue, { color: Colors.fire }]}>
                {latestProgress?.chestCm ? `${latestProgress.chestCm} cm` : '-'}
              </Text>
            </View>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>CADERA</Text>
              <Text style={[styles.statValue, { color: '#FFB800' }]}>
                {latestProgress?.hipsCm ? `${latestProgress.hipsCm} cm` : '-'}
              </Text>
            </View>
          </View>

          {/* Summary Row with Records and Photo Indicator */}
          <View style={styles.weeklySummaryRow}>
            <View style={styles.summaryMetricItem}>
              <TrendingDown size={13} color={Colors.primary} />
              <Text style={styles.summaryMetricText}>
                {progressEntries.length} mediciones • Última: {latestProgress?.date || 'Hoy'}
              </Text>
            </View>
            <Text style={styles.dotSeparator}>•</Text>
            <View style={styles.summaryMetricItem}>
              <Camera size={13} color={Colors.cyan} />
              <Text style={styles.summaryMetricText}>
                Fotos & curvas temporales
              </Text>
            </View>
          </View>

          {/* Footer Action Link */}
          <View style={styles.cardActionFooter}>
            <Text style={styles.cardActionLink}>
              Ver gráficas de evolución, medidas y fotos
            </Text>
            <ChevronRight size={14} color={Colors.primary} />
          </View>
        </TouchableOpacity>

        {/* Bottom Fast Nav Grid */}
        <View style={styles.quickGrid}>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => navigation.navigate('Entrenar')}
          >
            <Dumbbell size={20} color={Colors.primary} />
            <Text style={styles.quickButtonText}>WOD</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => navigation.navigate('Historial')}
          >
            <History size={20} color={Colors.orange} />
            <Text style={styles.quickButtonText}>Historial</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickButton}
            onPress={() =>
              navigation.navigate('Descanso', { initialSeconds: restState.initialDuration })
            }
          >
            <Timer size={20} color={Colors.cyan} />
            <Text style={styles.quickButtonText}>Descanso</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => navigation.navigate('Ejercicios', undefined)}
          >
            <BookOpen size={20} color={Colors.purple} />
            <Text style={styles.quickButtonText}>Biblioteca</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Athlete Progress Modal */}
      <ProgressModal
        visible={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  rxBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
    gap: 4,
  },
  rxBadgeText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.orangeMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  streakText: {
    color: Colors.orange,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  welcomeTitle: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.primary,
    fontWeight: '900',
    fontSize: 15,
  },
  sectionHeading: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
  },
  activeWorkoutCardHighlight: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardIconBoxPrimary: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardHeaderTextGroup: {
    flex: 1,
  },
  cardSuperTitle: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  cardExcerptText: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12,
  },
  cardStatsGrid: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 10,
    padding: 12,
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  statBlock: {
    alignItems: 'center',
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  statValueHighlight: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '900',
  },
  heartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardActionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cardActionLink: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  weekWidget: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  weekDayCol: {
    alignItems: 'center',
    gap: 6,
  },
  weekBar: {
    width: 28,
    height: 38,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekBarDone: {
    backgroundColor: Colors.primary,
  },
  weekBarToday: {
    borderWidth: 1.5,
    borderColor: Colors.orange,
  },
  todayDot: {
    color: Colors.orange,
    fontSize: 16,
    fontWeight: '900',
  },
  weekDayLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  weekDayLabelActive: {
    color: Colors.orange,
    fontWeight: '900',
  },
  weekDayLabelDone: {
    color: Colors.textPrimary,
  },
  weeklySummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 6,
  },
  summaryMetricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  summaryMetricText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  dotSeparator: {
    color: Colors.border,
  },
  restBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  timerLedPreview: {
    alignItems: 'flex-start',
  },
  timerLedText: {
    color: Colors.cyan,
    fontSize: 26,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
    letterSpacing: 1,
  },
  timerLedSub: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  restPresetList: {
    flexDirection: 'row',
    gap: 6,
  },
  restChip: {
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  restChipActive: {
    backgroundColor: Colors.cyanMuted,
    borderColor: Colors.cyan,
  },
  restChipText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  restChipTextActive: {
    color: Colors.cyan,
    fontSize: 11,
    fontWeight: '800',
  },
  muscleSummaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  muscleSummaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dotTiny: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  muscleSummaryText: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
  },
  exerciseChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  exerciseChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  exerciseChipName: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  quickGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  quickButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  quickButtonText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 20,
  },
});
