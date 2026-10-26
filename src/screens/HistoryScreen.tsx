import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  History,
  Flame,
  Award,
  Timer,
  Calendar,
  ChevronRight,
  TrendingUp,
  Dumbbell,
  Plus,
  Trash2,
  CheckCircle2,
} from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/types';
import { WorkoutHistoryItem } from '../types';
import {
  getWorkoutHistory,
  subscribeToWorkoutHistory,
  deleteWorkoutFromHistory,
} from '../services/workoutStorage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HistoryScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [historyList, setHistoryList] = useState<WorkoutHistoryItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'TODOS' | 'FOR TIME' | 'AMRAP' | 'HEAVY SINGLE' | 'EMOM'>('TODOS');

  // Load real history from storage & subscribe to live updates
  useEffect(() => {
    const fetchHistory = async () => {
      const data = await getWorkoutHistory();
      setHistoryList(data);
    };

    fetchHistory();
    const unsubscribe = subscribeToWorkoutHistory(fetchHistory);
    return () => unsubscribe();
  }, []);

  const handleDelete = (workoutId: string, title: string) => {
    Alert.alert(
      'Eliminar Entrenamiento',
      `¿Deseas eliminar "${title}" del historial?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const updated = await deleteWorkoutFromHistory(workoutId);
            setHistoryList(updated);
          },
        },
      ]
    );
  };

  const filteredHistory = historyList.filter((item) => {
    if (selectedFilter === 'TODOS') return true;
    return item.format === selectedFilter;
  });

  const totalSessions = historyList.length;
  const totalVolumeKg = historyList.reduce((acc, curr) => acc + (curr.totalVolumeKg || 0), 0);
  const totalCalories = historyList.reduce((acc, curr) => acc + (curr.caloriesBurned || 0), 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.screenTitle}>Historial Real de WODs</Text>
          <Text style={styles.screenSubtitle}>Registro de tus sesiones reales finalizadas</Text>
        </View>
        <View style={styles.headerIconBox}>
          <History size={20} color={Colors.primary} />
        </View>
      </View>

      {/* Real Athlete Stats Strip */}
      <View style={styles.statsStrip}>
        <View style={styles.statsStripItem}>
          <Text style={[styles.statsStripNumber, { color: Colors.primary }]}>
            {totalSessions}
          </Text>
          <Text style={styles.statsStripLabel}>SESIONES</Text>
        </View>
        <View style={styles.statsDivider} />
        <View style={styles.statsStripItem}>
          <Text style={styles.statsStripNumber}>
            {totalVolumeKg > 0 ? `${(totalVolumeKg / 1000).toFixed(1)}k` : '0'} kg
          </Text>
          <Text style={styles.statsStripLabel}>VOLUMEN TOTAL</Text>
        </View>
        <View style={styles.statsDivider} />
        <View style={styles.statsStripItem}>
          <Text style={[styles.statsStripNumber, { color: Colors.fire }]}>
            {totalCalories}
          </Text>
          <Text style={styles.statsStripLabel}>KCAL QUEMADAS</Text>
        </View>
        <View style={styles.statsDivider} />
        <View style={styles.statsStripItem}>
          <Text style={[styles.statsStripNumber, { color: Colors.orange }]}>
            {totalSessions > 0 ? '100%' : '0%'}
          </Text>
          <Text style={styles.statsStripLabel}>CONSTANCIA</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      {historyList.length > 0 && (
        <View style={styles.filterScrollViewContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {(['TODOS', 'FOR TIME', 'AMRAP', 'HEAVY SINGLE', 'EMOM'] as const).map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  selectedFilter === filter && styles.filterChipActive,
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedFilter === filter && styles.filterChipTextActive,
                  ]}
                >
                  {filter === 'HEAVY SINGLE' ? 'FUERZA' : filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Workouts History List / Empty State */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {historyList.length === 0 ? (
          /* Clean Empty State */
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <History size={40} color={Colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>Sin Entrenamientos Aún</Text>
            <Text style={styles.emptyDesc}>
              Aquí se guardarán automáticamente todas las sesiones reales que finalices en la
              sección Entrenar, con su fecha, duración, ejercicios, series y pesos.
            </Text>
            <TouchableOpacity
              style={styles.goToTrainBtn}
              onPress={() => (navigation as any).navigate('Entrenar')}
            >
              <Plus size={18} color={Colors.textInverse} />
              <Text style={styles.goToTrainBtnText}>Comenzar a Entrenar</Text>
            </TouchableOpacity>
          </View>
        ) : filteredHistory.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No hay WODs con este formato</Text>
            <Text style={styles.emptyDesc}>
              Prueba cambiando el filtro superior a "TODOS".
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionHeader}>
              SESIONES COMPLETADAS ({filteredHistory.length})
            </Text>

            {filteredHistory.map((workout) => (
              <TouchableOpacity
                key={workout.id}
                activeOpacity={0.85}
                style={styles.workoutCard}
                onPress={() => navigation.navigate('WorkoutDetail', { workout })}
              >
                {/* Top row: Format badge, RX badge, Date, and Delete button */}
                <View style={styles.cardTopRow}>
                  <View style={styles.badgeGroup}>
                    <View style={styles.formatBadge}>
                      <Text style={styles.formatBadgeText}>{workout.format}</Text>
                    </View>

                    {workout.isRx ? (
                      <View style={styles.rxBadge}>
                        <Text style={styles.rxBadgeText}>RX</Text>
                      </View>
                    ) : (
                      <View style={styles.scaledBadge}>
                        <Text style={styles.scaledBadgeText}>ESCALADO</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.rightTopGroup}>
                    <View style={styles.dateRow}>
                      <Calendar size={12} color={Colors.textMuted} />
                      <Text style={styles.dateText}>{workout.date}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.cardDeleteBtn}
                      onPress={() => handleDelete(workout.id, workout.title)}
                    >
                      <Trash2 size={14} color={Colors.textMuted} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Title */}
                <Text style={styles.workoutTitle}>{workout.title}</Text>

                {/* Key Metrics Row */}
                <View style={styles.metricsBox}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>DURACIÓN</Text>
                    <View style={styles.metricValueWithIcon}>
                      <Timer size={13} color={Colors.cyan} />
                      <Text style={styles.metricValue}>{workout.duration}</Text>
                    </View>
                  </View>

                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>VOLUMEN TOTAL</Text>
                    <Text style={styles.metricScore}>
                      {workout.totalVolumeKg ? `${workout.totalVolumeKg.toLocaleString()} kg` : 'Corporal'}
                    </Text>
                  </View>

                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>CALORÍAS</Text>
                    <View style={styles.metricValueWithIcon}>
                      <Flame size={13} color={Colors.fire} />
                      <Text style={styles.metricValue}>{workout.caloriesBurned} kcal</Text>
                    </View>
                  </View>
                </View>

                {/* Exercise and Sets Detailed Breakdown */}
                <View style={styles.exercisesDetailedList}>
                  <Text style={styles.exerciseListHeading}>EJERCICIOS & SERIES REGISTRADAS:</Text>

                  {workout.loggedExercises && workout.loggedExercises.length > 0 ? (
                    workout.loggedExercises.map((ex, exIdx) => (
                      <View key={ex.id || exIdx} style={styles.loggedExerciseItem}>
                        <View style={styles.exerciseNameRow}>
                          <Dumbbell size={13} color={Colors.primary} />
                          <Text style={styles.loggedExerciseName}>{ex.name}</Text>
                          <Text style={styles.loggedExerciseSetsCount}>
                            ({ex.sets.length} {ex.sets.length === 1 ? 'serie' : 'series'})
                          </Text>
                        </View>

                        {/* Series Pills with Reps & Weight */}
                        <View style={styles.setsPillsWrap}>
                          {ex.sets.map((s) => (
                            <View
                              key={s.id}
                              style={[
                                styles.setPill,
                                s.completed && styles.setPillCompleted,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.setPillText,
                                  s.completed && styles.setPillTextCompleted,
                                ]}
                              >
                                S{s.setNumber}: {s.reps}r × {s.weightKg ? `${s.weightKg}k` : '0k'}
                              </Text>
                              {s.completed && (
                                <CheckCircle2 size={10} color={Colors.primary} style={{ marginLeft: 3 }} />
                              )}
                            </View>
                          ))}
                        </View>
                      </View>
                    ))
                  ) : (
                    /* Fallback to summary lines if legacy */
                    workout.summary.map((line, idx) => (
                      <Text key={idx} style={styles.summaryLineText} numberOfLines={2}>
                        • {line}
                      </Text>
                    ))
                  )}
                </View>

                {/* Tap to view detail link */}
                <View style={styles.cardFooter}>
                  <Text style={styles.cardFooterLink}>Abrir detalle visual completo</Text>
                  <ChevronRight size={14} color={Colors.primary} />
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
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
    paddingTop: 8,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  screenTitle: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: '900',
  },
  screenSubtitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  headerIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsStripItem: {
    alignItems: 'center',
    flex: 1,
  },
  statsStripNumber: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '900',
  },
  statsStripLabel: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  statsDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
  filterScrollViewContainer: {
    paddingBottom: 8,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  filterChipText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  filterChipTextActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  sectionHeader: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: 8,
    marginBottom: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 20,
  },
  emptyIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
  },
  emptyDesc: {
    color: Colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  goToTrainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  goToTrainBtnText: {
    color: Colors.textInverse,
    fontWeight: '900',
    fontSize: 14,
  },
  workoutCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  formatBadge: {
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  formatBadgeText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  rxBadge: {
    backgroundColor: Colors.orangeMuted,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rxBadgeText: {
    color: Colors.orange,
    fontSize: 9,
    fontWeight: '900',
  },
  scaledBadge: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  scaledBadgeText: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
  },
  rightTopGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  cardDeleteBtn: {
    padding: 4,
  },
  workoutTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  metricsBox: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 10,
    padding: 10,
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 4,
  },
  metricValueWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricValue: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  metricScore: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '900',
  },
  exercisesDetailedList: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    gap: 8,
  },
  exerciseListHeading: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  loggedExerciseItem: {
    gap: 4,
  },
  exerciseNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  loggedExerciseName: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  loggedExerciseSetsCount: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  setsPillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  setPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  setPillCompleted: {
    borderColor: Colors.primaryBorder,
    backgroundColor: 'rgba(204, 255, 0, 0.08)',
  },
  setPillText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  setPillTextCompleted: {
    color: Colors.primary,
    fontWeight: '700',
  },
  summaryLineText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cardFooterLink: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 20,
  },
});
