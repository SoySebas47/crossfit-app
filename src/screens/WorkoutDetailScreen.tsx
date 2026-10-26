import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import {
  ArrowLeft,
  Calendar,
  Timer,
  Flame,
  Heart,
  Award,
  Zap,
  Share2,
  Repeat,
  CheckCircle2,
  TrendingUp,
  Dumbbell,
  Check,
} from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/types';

type DetailRouteProp = RouteProp<RootStackParamList, 'WorkoutDetail'>;

export const WorkoutDetailScreen: React.FC = () => {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation();
  const { workout } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Top Navbar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color={Colors.textPrimary} />
          <Text style={styles.backButtonText}>Historial</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareIconButton}>
          <Share2 size={18} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Hero */}
        <View style={styles.heroSection}>
          <View style={styles.badgeRow}>
            <View style={styles.formatBadge}>
              <Text style={styles.formatBadgeText}>{workout.format}</Text>
            </View>

            {workout.isRx ? (
              <View style={styles.rxBadge}>
                <Zap size={11} color={Colors.primary} />
                <Text style={styles.rxBadgeText}>DIVISIÓN RX</Text>
              </View>
            ) : (
              <View style={styles.scaledBadge}>
                <Text style={styles.scaledBadgeText}>ESCALADO</Text>
              </View>
            )}

            <View style={styles.dateBadge}>
              <Calendar size={12} color={Colors.textMuted} />
              <Text style={styles.dateBadgeText}>{workout.date}</Text>
            </View>
          </View>

          <Text style={styles.detailTitle}>{workout.title}</Text>
          <Text style={styles.detailTimeAgo}>Sesión registrada • {workout.timeAgo}</Text>
        </View>

        {/* Big Score Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreRow}>
            <View>
              <Text style={styles.scoreCardLabel}>RESULTADO FINAL</Text>
              <Text style={styles.scoreCardValue}>{workout.score}</Text>
            </View>
            <View style={styles.trophyBadge}>
              <Award size={28} color={Colors.primary} />
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <View style={styles.statIconRow}>
                <Timer size={14} color={Colors.cyan} />
                <Text style={styles.statLabel}>TIEMPO TOTAL</Text>
              </View>
              <Text style={styles.statVal}>{workout.duration}</Text>
            </View>

            <View style={styles.statBox}>
              <View style={styles.statIconRow}>
                <TrendingUp size={14} color={Colors.primary} />
                <Text style={styles.statLabel}>VOLUMEN TOTAL</Text>
              </View>
              <Text style={[styles.statVal, { color: Colors.primary }]}>
                {workout.totalVolumeKg ? `${workout.totalVolumeKg.toLocaleString()} kg` : 'Corporal'}
              </Text>
            </View>

            <View style={styles.statBox}>
              <View style={styles.statIconRow}>
                <Flame size={14} color={Colors.fire} />
                <Text style={styles.statLabel}>CALORÍAS</Text>
              </View>
              <Text style={styles.statVal}>{workout.caloriesBurned} kcal</Text>
            </View>

            <View style={styles.statBox}>
              <View style={styles.statIconRow}>
                <Heart size={14} color={Colors.fire} />
                <Text style={styles.statLabel}>FC MEDIA</Text>
              </View>
              <Text style={styles.statVal}>{workout.avgHeartRate} ppm</Text>
            </View>
          </View>
        </View>

        {/* Exercises, Sets, Reps & Weight Detail */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>DETALLE DE EJERCICIOS Y SERIES</Text>

          {workout.loggedExercises && workout.loggedExercises.length > 0 ? (
            workout.loggedExercises.map((exercise, index) => (
              <View key={exercise.id || index} style={styles.exerciseDetailCard}>
                <View style={styles.exerciseHeaderRow}>
                  <View style={styles.exerciseNameGroup}>
                    <Dumbbell size={16} color={Colors.primary} />
                    <Text style={styles.exerciseNameText}>{exercise.name}</Text>
                  </View>
                  <Text style={styles.exerciseCategoryBadge}>{exercise.category}</Text>
                </View>

                {/* Table of Sets */}
                <View style={styles.tableHeader}>
                  <Text style={[styles.thCell, { width: 44, textAlign: 'center' }]}>SET</Text>
                  <Text style={[styles.thCell, { flex: 1, textAlign: 'center' }]}>REPS</Text>
                  <Text style={[styles.thCell, { flex: 1.2, textAlign: 'center' }]}>PESO</Text>
                  <Text style={[styles.thCell, { width: 50, textAlign: 'center' }]}>ESTADO</Text>
                </View>

                {exercise.sets.map((set) => (
                  <View
                    key={set.id}
                    style={[
                      styles.setRow,
                      set.completed && styles.setRowCompleted,
                    ]}
                  >
                    <View style={styles.setNumberBadge}>
                      <Text style={styles.setNumberBadgeText}>{set.setNumber}</Text>
                    </View>

                    <Text style={[styles.tdCell, { flex: 1, textAlign: 'center' }]}>
                      {set.reps} reps
                    </Text>

                    <Text style={[styles.tdCell, { flex: 1.2, textAlign: 'center', color: Colors.primary, fontWeight: '800' }]}>
                      {set.weightKg && parseFloat(set.weightKg) > 0 ? `${set.weightKg} kg` : 'Corporal'}
                    </Text>

                    <View style={styles.statusCell}>
                      {set.completed ? (
                        <View style={styles.completedPill}>
                          <Check size={12} color={Colors.textInverse} strokeWidth={3} />
                        </View>
                      ) : (
                        <Text style={styles.pendingText}>-</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            ))
          ) : (
            /* Fallback if legacy summary list */
            workout.summary.map((item, index) => (
              <View key={index} style={styles.movementItem}>
                <View style={styles.checkCircle}>
                  <CheckCircle2 size={16} color={Colors.primary} />
                </View>
                <Text style={styles.movementText}>{item}</Text>
              </View>
            ))
          )}
        </View>

        {/* Athlete Notes */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>NOTAS Y SENSACIONES DEL WOD</Text>
          <View style={styles.notesContainer}>
            <Text style={styles.notesText}>"{workout.athleteNotes}"</Text>
          </View>
        </View>

        {/* Repeat Action Button */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.repeatButton}
            onPress={() => {
              (navigation as any).navigate('MainTabs', { screen: 'Entrenar' });
            }}
          >
            <Repeat size={16} color={Colors.textInverse} />
            <Text style={styles.repeatButtonText}>Comenzar Nueva Sesión</Text>
          </TouchableOpacity>
        </View>

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
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButtonText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  shareIconButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  heroSection: {
    marginTop: 12,
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.orangeMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 4,
  },
  rxBadgeText: {
    color: Colors.orange,
    fontSize: 10,
    fontWeight: '900',
  },
  scaledBadge: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  scaledBadgeText: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
  },
  dateBadgeText: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  detailTitle: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  detailTimeAgo: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  scoreCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  scoreCardLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  scoreCardValue: {
    color: Colors.primary,
    fontSize: 24,
    fontWeight: '900',
  },
  trophyBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statBox: {
    width: '48%',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 10,
    padding: 10,
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
  },
  statVal: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
  },
  sectionTitle: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  exerciseDetailCard: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  exerciseHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  exerciseNameGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  exerciseNameText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  exerciseCategoryBadge: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    marginBottom: 4,
  },
  thCell: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 2,
  },
  setRowCompleted: {
    backgroundColor: 'rgba(204, 255, 0, 0.05)',
  },
  setNumberBadge: {
    width: 44,
    alignItems: 'center',
  },
  setNumberBadgeText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
  },
  tdCell: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  statusCell: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedPill: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingText: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  movementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  movementText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  notesContainer: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  notesText: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  actionsContainer: {
    marginTop: 8,
  },
  repeatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  repeatButtonText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: '900',
  },
  bottomSpacer: {
    height: 20,
  },
});
