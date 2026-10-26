import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  Dumbbell,
  Check,
  Timer,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  Award,
  Search,
  X,
  Sparkles,
  TrendingUp,
  FileText,
  Layers,
  Bookmark,
  ChevronRight,
  Clock,
  Flame,
} from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { BottomTabParamList } from '../navigation/types';
import { EXERCISES_DATA } from '../data/exercisesData';
import { WORKOUT_TEMPLATES, WorkoutTemplate } from '../data/workoutTemplates';
import { LoggedExercise, LoggedSet, WorkoutHistoryItem } from '../types';
import { saveNewWorkout } from '../services/workoutStorage';
import {
  saveActiveWorkoutState,
  clearActiveWorkoutState,
} from '../services/activeWorkoutStorage';
import { recordRecentExercise } from '../services/recentExercisesStorage';

export const WorkoutScreen: React.FC = () => {
  const navigation = useNavigation<BottomTabNavigationProp<BottomTabParamList>>();

  // Workout Metadata
  const [workoutTitle, setWorkoutTitle] = useState('Entrenamiento del Día');
  const [isRx, setIsRx] = useState(true);
  const [format, setFormat] = useState<'FOR TIME' | 'AMRAP' | 'EMOM' | 'HEAVY SINGLE'>('FOR TIME');

  // Active Exercises
  const [exercises, setExercises] = useState<LoggedExercise[]>([]);

  // Session Stopwatch
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Modals
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState<string>('Todas');
  const [expandedTemplateId, setExpandedTemplateId] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [customExerciseName, setCustomExerciseName] = useState('');

  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [athleteNotes, setAthleteNotes] = useState('');

  // Live Timer Tick
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  // Synchronize Active Workout State with HomeScreen
  useEffect(() => {
    const completedSets = exercises.reduce(
      (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
      0
    );
    const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
    const totalVol = exercises.reduce((acc, ex) => {
      return (
        acc +
        ex.sets.reduce((sAcc, s) => {
          const reps = parseFloat(s.reps) || 0;
          const weight = parseFloat(s.weightKg) || 0;
          return sAcc + reps * weight;
        }, 0)
      );
    }, 0);

    saveActiveWorkoutState({
      isActive: exercises.length > 0,
      title: workoutTitle,
      format: format,
      exercisesCount: exercises.length,
      completedSetsCount: completedSets,
      totalSetsCount: totalSets,
      totalVolumeKg: Math.round(totalVol),
      elapsedSeconds: elapsedSeconds,
      exerciseNames: exercises.map((e) => e.name),
    });
  }, [exercises, workoutTitle, format, elapsedSeconds]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Add Exercise to Session
  const handleAddExercise = (name: string, category: string, exerciseId?: string) => {
    if (exerciseId) {
      recordRecentExercise(exerciseId);
    }
    const newExercise: LoggedExercise = {
      id: `logged-ex-${Date.now()}-${Math.random()}`,
      exerciseId,
      name,
      category,
      sets: [
        {
          id: `set-${Date.now()}-1`,
          setNumber: 1,
          reps: '10',
          weightKg: '50',
          completed: false,
        },
      ],
    };

    setExercises((prev) => [...prev, newExercise]);
    setIsAddModalOpen(false);
    setSearchQuery('');
    setCustomExerciseName('');
  };

  // Load Routine / Template into Session
  const handleLoadTemplate = (template: WorkoutTemplate, mode: 'replace' | 'append' = 'replace') => {
    // Record recent exercises for quick sync
    template.exercises.forEach((ex) => {
      if (ex.exerciseId) {
        recordRecentExercise(ex.exerciseId);
      }
    });

    const mappedExercises: LoggedExercise[] = template.exercises.map((ex, exIdx) => ({
      id: `logged-ex-${Date.now()}-${exIdx}-${Math.random().toString(36).substring(2, 6)}`,
      exerciseId: ex.exerciseId,
      name: ex.name,
      category: ex.category,
      sets: ex.sets.map((s, sIdx) => ({
        id: `set-${Date.now()}-${exIdx}-${sIdx + 1}`,
        setNumber: sIdx + 1,
        reps: s.reps,
        weightKg: s.weightKg,
        completed: false,
      })),
    }));

    if (mode === 'append' && exercises.length > 0) {
      setExercises((prev) => [...prev, ...mappedExercises]);
    } else {
      setWorkoutTitle(template.title);
      setExercises(mappedExercises);
      setElapsedSeconds(0);
      setIsTimerRunning(true);
    }
    setIsTemplatesModalOpen(false);
  };

  // Remove Exercise from Session
  const handleRemoveExercise = (exerciseId: string) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
  };

  // Add Set to Exercise
  const handleAddSet = (exerciseId: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        const lastSet = ex.sets[ex.sets.length - 1];
        const newSet: LoggedSet = {
          id: `set-${Date.now()}-${ex.sets.length + 1}`,
          setNumber: ex.sets.length + 1,
          reps: lastSet ? lastSet.reps : '10',
          weightKg: lastSet ? lastSet.weightKg : '50',
          completed: false,
        };
        return {
          ...ex,
          sets: [...ex.sets, newSet],
        };
      })
    );
  };

  // Remove Set from Exercise
  const handleRemoveSet = (exerciseId: string, setId: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        const filtered = ex.sets.filter((s) => s.id !== setId);
        // Renumber sets
        const renumbered = filtered.map((s, idx) => ({ ...s, setNumber: idx + 1 }));
        return {
          ...ex,
          sets: renumbered,
        };
      })
    );
  };

  // Update Reps
  const handleUpdateReps = (exerciseId: string, setId: string, value: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) => (s.id === setId ? { ...s, reps: value } : s)),
        };
      })
    );
  };

  // Update Weight (KG)
  const handleUpdateWeight = (exerciseId: string, setId: string, value: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) => (s.id === setId ? { ...s, weightKg: value } : s)),
        };
      })
    );
  };

  // Toggle Set Completed
  const handleToggleComplete = (exerciseId: string, setId: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) => (s.id === setId ? { ...s, completed: !s.completed } : s)),
        };
      })
    );
  };

  // Calculations
  const allSets = exercises.flatMap((ex) => ex.sets);
  const totalSetsCount = allSets.length;
  const completedSetsCount = allSets.filter((s) => s.completed).length;

  const totalVolumeKg = allSets
    .filter((s) => s.completed)
    .reduce((acc, s) => {
      const reps = parseFloat(s.reps) || 0;
      const weight = parseFloat(s.weightKg) || 0;
      return acc + reps * weight;
    }, 0);

  const progressPercent =
    totalSetsCount > 0 ? Math.round((completedSetsCount / totalSetsCount) * 100) : 0;

  // Finalize and Save to History
  const handleSaveWorkout = async () => {
    const formattedDuration = formatTimer(elapsedSeconds) + ' min';

    const exerciseSummaries = exercises.map((ex) => {
      const setsDetails = ex.sets
        .map((s) => `${s.reps}r × ${s.weightKg ? `${s.weightKg}k` : '0k'}`)
        .join(', ');
      return `${ex.name}: ${ex.sets.length} series (${setsDetails})`;
    });

    const newWorkoutItem: WorkoutHistoryItem = {
      id: `hist-user-${Date.now()}`,
      title: workoutTitle.trim() || 'Entrenamiento de Crossfit',
      format: format,
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      timeAgo: 'Recién terminado',
      duration: formattedDuration,
      score: `${formattedDuration} (${isRx ? 'RX' : 'Escalado'})`,
      isRx: isRx,
      caloriesBurned: Math.max(80, Math.round(elapsedSeconds * 0.15) + (completedSetsCount * 12)),
      avgHeartRate: 165,
      totalVolumeKg: Math.round(totalVolumeKg),
      summary: exerciseSummaries.length > 0 ? exerciseSummaries : ['Sesión libre de ejercicios'],
      athleteNotes: athleteNotes.trim() || 'Entrenamiento registrado con series y pesos reales.',
      tagColor: Colors.primary,
      loggedExercises: JSON.parse(JSON.stringify(exercises)),
    };

    try {
      await saveNewWorkout(newWorkoutItem);
      await clearActiveWorkoutState();
      setIsFinishModalOpen(false);
      // Reset workout state
      setExercises([]);
      setElapsedSeconds(0);
      setIsTimerRunning(false);
      // Navigate to History to see the newly logged workout
      navigation.navigate('Historial');
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar la sesión de entrenamiento.');
    }
  };

  // Filter Exercises for Add Modal
  const filteredModalExercises = EXERCISES_DATA.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'Todos' || ex.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Top Header Session Bar */}
      <View style={styles.topSessionBar}>
        <View style={styles.titleWrapper}>
          <TextInput
            style={styles.workoutHeaderTitleInput}
            value={workoutTitle}
            onChangeText={setWorkoutTitle}
            placeholder="Título del WOD / Sesión..."
            placeholderTextColor={Colors.textMuted}
          />
          <Text style={styles.sessionStatusSub}>Registro activo • Modo directo</Text>
        </View>

        <View style={styles.topRightControls}>
          {/* Rutinas / Plantillas button */}
          <TouchableOpacity
            style={styles.templateHeaderBtn}
            onPress={() => setIsTemplatesModalOpen(true)}
            activeOpacity={0.8}
          >
            <Layers size={13} color={Colors.primary} />
            <Text style={styles.templateHeaderBtnText}>Plantillas</Text>
          </TouchableOpacity>

          {/* Stopwatch badge */}
          <TouchableOpacity
            style={[styles.liveTimerBadge, isTimerRunning && styles.liveTimerBadgeRunning]}
            onPress={() => setIsTimerRunning(!isTimerRunning)}
          >
            {isTimerRunning ? (
              <Pause size={13} color={Colors.primary} />
            ) : (
              <Play size={13} color={Colors.orange} fill={Colors.orange} />
            )}
            <Text style={[styles.liveTimerText, !isTimerRunning && { color: Colors.orange }]}>
              {formatTimer(elapsedSeconds)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Controls: RX / Escalado & Quick Rest */}
      <View style={styles.controlRow}>
        <View style={styles.toggleRxContainer}>
          <TouchableOpacity
            style={[styles.toggleRxBtn, isRx && styles.toggleRxBtnActive]}
            onPress={() => setIsRx(true)}
          >
            <Text style={[styles.toggleRxText, isRx && styles.toggleRxTextActive]}>RX</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleRxBtn, !isRx && styles.toggleRxBtnActive]}
            onPress={() => setIsRx(false)}
          >
            <Text style={[styles.toggleRxText, !isRx && styles.toggleRxTextActive]}>Escalado</Text>
          </TouchableOpacity>
        </View>

        {/* Format Selector Pills */}
        <View style={styles.formatPillsRow}>
          {(['FOR TIME', 'AMRAP', 'EMOM', 'HEAVY SINGLE'] as const).map((fmt) => (
            <TouchableOpacity
              key={fmt}
              style={[styles.formatPill, format === fmt && styles.formatPillActive]}
              onPress={() => setFormat(fmt)}
            >
              <Text style={[styles.formatPillText, format === fmt && styles.formatPillTextActive]}>
                {fmt === 'HEAVY SINGLE' ? 'FUERZA' : fmt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.restJumpButton}
          onPress={() => navigation.navigate('Descanso', { initialSeconds: 90 })}
        >
          <Timer size={14} color={Colors.cyan} />
          <Text style={styles.restJumpText}>Descanso</Text>
        </TouchableOpacity>
      </View>

      {/* Real-time Session Metrics Strip */}
      <View style={styles.metricsStrip}>
        <View style={styles.metricStripItem}>
          <Text style={styles.metricStripLabel}>SERIES LISTAS</Text>
          <Text style={styles.metricStripVal}>
            {completedSetsCount}/{totalSetsCount}
          </Text>
        </View>
        <View style={styles.stripDivider} />
        <View style={styles.metricStripItem}>
          <Text style={styles.metricStripLabel}>VOLUMEN TOTAL</Text>
          <Text style={[styles.metricStripVal, { color: Colors.primary }]}>
            {totalVolumeKg.toLocaleString()} kg
          </Text>
        </View>
        <View style={styles.stripDivider} />
        <View style={styles.metricStripItem}>
          <Text style={styles.metricStripLabel}>EJERCICIOS</Text>
          <Text style={styles.metricStripVal}>{exercises.length}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarTrack}>
        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
      </View>

      {/* Main Exercises List Scroll Area */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {exercises.length === 0 ? (
          /* Empty State */
          <View style={styles.emptySessionCard}>
            <View style={styles.emptyIconCircle}>
              <Layers size={34} color={Colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>Registro de Entrenamiento</Text>
            <Text style={styles.emptySubtitle}>
              Carga una rutina típica lista para completar o inicia una sesión en blanco añadiendo tus propios movimientos.
            </Text>

            {/* Main Action: Plantillas */}
            <TouchableOpacity
              style={styles.emptyTemplatesBtn}
              onPress={() => setIsTemplatesModalOpen(true)}
              activeOpacity={0.8}
            >
              <Layers size={18} color={Colors.textInverse} />
              <Text style={styles.emptyTemplatesBtnText}>Cargar Rutina / Plantilla</Text>
            </TouchableOpacity>

            {/* Quick Template Category Chips */}
            <View style={styles.quickTemplatesSection}>
              <Text style={styles.quickTemplatesLabel}>O ELIGE UNA RUTINA RÁPIDA:</Text>
              <View style={styles.quickChipsGrid}>
                {WORKOUT_TEMPLATES.map((tpl) => (
                  <TouchableOpacity
                    key={tpl.id}
                    style={styles.quickChip}
                    onPress={() => handleLoadTemplate(tpl, 'replace')}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.quickChipDot, { backgroundColor: tpl.tagColor }]} />
                    <Text style={styles.quickChipText}>{tpl.category}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Secondary Action: Add custom exercise */}
            <TouchableOpacity
              style={styles.emptyAddBtn}
              onPress={() => setIsAddModalOpen(true)}
              activeOpacity={0.8}
            >
              <Plus size={16} color={Colors.textPrimary} />
              <Text style={styles.emptyAddBtnText}>Crear Sesión en Blanco</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Exercises Cards */
          exercises.map((exercise, exIndex) => (
            <View key={exercise.id} style={styles.exerciseCard}>
              {/* Exercise Header */}
              <View style={styles.exerciseCardHeader}>
                <View style={styles.exerciseCardTitleRow}>
                  <View style={styles.exerciseIndexBox}>
                    <Text style={styles.exerciseIndexText}>{exIndex + 1}</Text>
                  </View>
                  <View>
                    <Text style={styles.exerciseNameText}>{exercise.name}</Text>
                    <Text style={styles.exerciseCategorySub}>{exercise.category}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.deleteExerciseBtn}
                  onPress={() => handleRemoveExercise(exercise.id)}
                >
                  <Trash2 size={16} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>

              {/* Sets Table Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.thText, { width: 44, textAlign: 'center' }]}>SET</Text>
                <Text style={[styles.thText, { flex: 1.2, textAlign: 'center' }]}>REPS</Text>
                <Text style={[styles.thText, { flex: 1.4, textAlign: 'center' }]}>PESO (KG)</Text>
                <Text style={[styles.thText, { width: 50, textAlign: 'center' }]}>LISTA</Text>
                <Text style={[styles.thText, { width: 32, textAlign: 'center' }]}></Text>
              </View>

              {/* Set Rows */}
              {exercise.sets.map((set) => (
                <View
                  key={set.id}
                  style={[styles.setRow, set.completed && styles.setRowCompleted]}
                >
                  {/* Set number */}
                  <View style={styles.setNumberBadge}>
                    <Text style={styles.setNumberBadgeText}>{set.setNumber}</Text>
                  </View>

                  {/* Reps Input */}
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={[styles.tableInput, set.completed && styles.tableInputCompleted]}
                      value={set.reps}
                      onChangeText={(val) => handleUpdateReps(exercise.id, set.id, val)}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={Colors.textMuted}
                    />
                  </View>

                  {/* Weight Input */}
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={[styles.tableInput, set.completed && styles.tableInputCompleted]}
                      value={set.weightKg}
                      onChangeText={(val) => handleUpdateWeight(exercise.id, set.id, val)}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={Colors.textMuted}
                    />
                  </View>

                  {/* Complete Checkmark */}
                  <TouchableOpacity
                    style={[styles.checkBtn, set.completed && styles.checkBtnCompleted]}
                    onPress={() => handleToggleComplete(exercise.id, set.id)}
                  >
                    {set.completed ? (
                      <Check size={16} color={Colors.textInverse} strokeWidth={3} />
                    ) : (
                      <View style={styles.emptyCheckmarkDot} />
                    )}
                  </TouchableOpacity>

                  {/* Delete Set */}
                  <TouchableOpacity
                    style={styles.deleteSetBtn}
                    onPress={() => handleRemoveSet(exercise.id, set.id)}
                  >
                    <X size={14} color={Colors.textMuted} />
                  </TouchableOpacity>
                </View>
              ))}

              {/* Add Set Button */}
              <TouchableOpacity
                style={styles.addSetButton}
                onPress={() => handleAddSet(exercise.id)}
              >
                <Plus size={14} color={Colors.primary} />
                <Text style={styles.addSetButtonText}>Añadir Serie</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={styles.bottomActionBar}>
        <TouchableOpacity
          style={styles.bottomTemplatesBtn}
          onPress={() => setIsTemplatesModalOpen(true)}
          activeOpacity={0.8}
        >
          <Layers size={16} color={Colors.primary} />
          <Text style={styles.bottomTemplatesBtnText}>Plantillas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryAddBtn}
          onPress={() => setIsAddModalOpen(true)}
          activeOpacity={0.8}
        >
          <Plus size={16} color={Colors.textPrimary} />
          <Text style={styles.secondaryAddBtnText}>Ejercicio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.finishBtn, exercises.length === 0 && styles.finishBtnDisabled]}
          onPress={() => {
            if (exercises.length === 0) {
              Alert.alert('Sesión Vacía', 'Añade o carga al menos un ejercicio antes de guardar.');
              return;
            }
            setIsFinishModalOpen(true);
          }}
          activeOpacity={0.8}
        >
          <Award size={18} color={Colors.textInverse} />
          <Text style={styles.finishBtnText}>Finalizar Sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Modal: Select Workout Template / Rutinas */}
      <Modal
        visible={isTemplatesModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsTemplatesModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.templatesModalSheet}>
            <View style={styles.modalSheetHeader}>
              <View style={{ flex: 1 }}>
                <View style={styles.modalHeaderTagRow}>
                  <Layers size={18} color={Colors.primary} />
                  <Text style={styles.modalSheetTitle}>Rutinas & Plantillas</Text>
                </View>
                <Text style={styles.modalSheetSubtitle}>
                  Sesiones predefinidas listas para completar. Editables antes o durante.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setIsTemplatesModalOpen(false)}
              >
                <X size={20} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Filter Categories for Templates */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.templateCatScroll}
            >
              {['Todas', 'Torso', 'Pierna', 'Push', 'Pull', 'Full Body', 'Metcon'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.templateCatChip,
                    templateCategoryFilter === cat && styles.templateCatChipActive,
                  ]}
                  onPress={() => setTemplateCategoryFilter(cat)}
                >
                  <Text
                    style={[
                      styles.templateCatChipText,
                      templateCategoryFilter === cat && styles.templateCatChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Templates List */}
            <ScrollView style={styles.templatesListScroll} showsVerticalScrollIndicator={false}>
              {WORKOUT_TEMPLATES
                .filter(
                  (tpl) =>
                    templateCategoryFilter === 'Todas' || tpl.category === templateCategoryFilter
                )
                .map((tpl) => {
                  const isExpanded = expandedTemplateId === tpl.id;
                  const totalSets = tpl.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);

                  return (
                    <View key={tpl.id} style={styles.templateCard}>
                      {/* Header info */}
                      <View style={styles.templateCardTop}>
                        <View style={styles.templateBadgesRow}>
                          <View style={[styles.templateCatBadge, { borderColor: tpl.tagColor }]}>
                            <Text style={[styles.templateCatBadgeText, { color: tpl.tagColor }]}>
                              {tpl.category.toUpperCase()}
                            </Text>
                          </View>
                          <View style={styles.templateMetaBadge}>
                            <Clock size={11} color={Colors.textMuted} />
                            <Text style={styles.templateMetaBadgeText}>{tpl.durationEst}</Text>
                          </View>
                          <View style={styles.templateMetaBadge}>
                            <Flame size={11} color={Colors.orange} />
                            <Text style={styles.templateMetaBadgeText}>{tpl.difficulty}</Text>
                          </View>
                        </View>

                        <Text style={styles.templateCardTitle}>{tpl.title}</Text>
                        <Text style={styles.templateCardDesc}>{tpl.description}</Text>

                        {/* Summary Bar */}
                        <View style={styles.templateSummaryBar}>
                          <Text style={styles.templateSummaryText}>
                            <Text style={{ color: Colors.primary, fontWeight: '800' }}>
                              {tpl.exercises.length}
                            </Text>{' '}
                            ejercicios •{' '}
                            <Text style={{ color: Colors.cyan, fontWeight: '800' }}>
                              {totalSets}
                            </Text>{' '}
                            series
                          </Text>

                          <TouchableOpacity
                            onPress={() => setExpandedTemplateId(isExpanded ? null : tpl.id)}
                            style={styles.expandToggleBtn}
                          >
                            <Text style={styles.expandToggleText}>
                              {isExpanded ? 'Ocultar ejercicios' : 'Ver ejercicios'}
                            </Text>
                            <ChevronRight
                              size={14}
                              color={Colors.primary}
                              style={{
                                transform: [{ rotate: isExpanded ? '90deg' : '0deg' }],
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Exercises list preview */}
                      {(isExpanded || templateCategoryFilter !== 'Todas') && (
                        <View style={styles.templateExercisesPreview}>
                          <Text style={styles.exercisesPreviewHeader}>EJERCICIOS INCLUIDOS:</Text>
                          {tpl.exercises.map((ex, idx) => (
                            <View key={idx} style={styles.previewExerciseRow}>
                              <View style={styles.previewExBullet}>
                                <Text style={styles.previewExBulletText}>{idx + 1}</Text>
                              </View>
                              <View style={{ flex: 1 }}>
                                <Text style={styles.previewExName}>{ex.name}</Text>
                                <Text style={styles.previewExSets}>
                                  {ex.sets.length} series • {ex.sets.map((s) => `${s.reps}r × ${s.weightKg}kg`).join(', ')}
                                </Text>
                              </View>
                            </View>
                          ))}
                        </View>
                      )}

                      {/* Action Buttons */}
                      <View style={styles.templateActionsRow}>
                        {exercises.length > 0 ? (
                          <>
                            <TouchableOpacity
                              style={styles.templateAppendBtn}
                              onPress={() => handleLoadTemplate(tpl, 'append')}
                            >
                              <Plus size={14} color={Colors.cyan} />
                              <Text style={styles.templateAppendBtnText}>+ Añadir a Sesión</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={styles.templateLoadBtn}
                              onPress={() => handleLoadTemplate(tpl, 'replace')}
                            >
                              <Play size={14} color={Colors.textInverse} fill={Colors.textInverse} />
                              <Text style={styles.templateLoadBtnText}>Cargar de Cero</Text>
                            </TouchableOpacity>
                          </>
                        ) : (
                          <TouchableOpacity
                            style={styles.templateLoadBtnFull}
                            onPress={() => handleLoadTemplate(tpl, 'replace')}
                          >
                            <Play size={16} color={Colors.textInverse} fill={Colors.textInverse} />
                            <Text style={styles.templateLoadBtnFullText}>Cargar y Comenzar Rutina</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  );
                })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal: Select or Add Exercise */}
      <Modal
        visible={isAddModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAddModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalSheetHeader}>
              <View>
                <Text style={styles.modalSheetTitle}>Añadir Ejercicio</Text>
                <Text style={styles.modalSheetSubtitle}>Selecciona de la biblioteca o crea uno</Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setIsAddModalOpen(false)}
              >
                <X size={20} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Search input */}
            <View style={styles.modalSearchBox}>
              <Search size={16} color={Colors.textMuted} />
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Buscar Thruster, Snatch, Dominadas..."
                placeholderTextColor={Colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={14} color={Colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            {/* Category chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              {['Todos', 'Halterofilia', 'Gimnásticos', 'Metcon', 'Fuerza'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catChip, selectedCategory === cat && styles.catChipActive]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text
                    style={[
                      styles.catChipText,
                      selectedCategory === cat && styles.catChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Exercises List in Modal */}
            <ScrollView style={styles.modalExercisesScroll} showsVerticalScrollIndicator={false}>
              {filteredModalExercises.map((ex) => (
                <TouchableOpacity
                  key={ex.id}
                  style={styles.exerciseOptionRow}
                  onPress={() => handleAddExercise(ex.name, ex.category, ex.id)}
                >
                  <View style={styles.exerciseOptionIcon}>
                    <Dumbbell size={16} color={Colors.primary} />
                  </View>
                  <View style={styles.exerciseOptionTextGroup}>
                    <Text style={styles.exerciseOptionName}>{ex.name}</Text>
                    <Text style={styles.exerciseOptionSub}>
                      {ex.category} • {ex.muscleGroup} • {ex.equipment}
                    </Text>
                  </View>
                  <Plus size={16} color={Colors.primary} />
                </TouchableOpacity>
              ))}

              {/* Custom Exercise fallback option */}
              <View style={styles.customExerciseSection}>
                <Text style={styles.customSectionLabel}>O CREA UN MOVIMIENTO PERSONALIZADO</Text>
                <View style={styles.customInputRow}>
                  <TextInput
                    style={styles.customTextInput}
                    placeholder="Nombre del movimiento..."
                    placeholderTextColor={Colors.textMuted}
                    value={customExerciseName}
                    onChangeText={setCustomExerciseName}
                  />
                  <TouchableOpacity
                    style={[
                      styles.customAddButton,
                      !customExerciseName.trim() && styles.customAddButtonDisabled,
                    ]}
                    onPress={() => {
                      if (customExerciseName.trim()) {
                        handleAddExercise(customExerciseName.trim(), 'Personalizado');
                      }
                    }}
                    disabled={!customExerciseName.trim()}
                  >
                    <Text style={styles.customAddButtonText}>Añadir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal: Summary and Finish Workout */}
      <Modal
        visible={isFinishModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsFinishModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.finishModalCard}>
            <View style={styles.finishModalHeader}>
              <View style={styles.trophyIconCircle}>
                <Award size={36} color={Colors.primary} />
              </View>
              <Text style={styles.finishModalTitle}>¡WOD COMPLETADO!</Text>
              <Text style={styles.finishModalSub}>
                Revisa el resumen antes de guardar en tu historial real.
              </Text>
            </View>

            {/* Metrics Grid */}
            <View style={styles.finishGrid}>
              <View style={styles.finishGridItem}>
                <Text style={styles.finishGridLabel}>DURACIÓN</Text>
                <Text style={styles.finishGridVal}>{formatTimer(elapsedSeconds)}</Text>
              </View>
              <View style={styles.finishGridItem}>
                <Text style={styles.finishGridLabel}>VOLUMEN TOTAL</Text>
                <Text style={[styles.finishGridVal, { color: Colors.primary }]}>
                  {totalVolumeKg.toLocaleString()} kg
                </Text>
              </View>
              <View style={styles.finishGridItem}>
                <Text style={styles.finishGridLabel}>SERIES LISTAS</Text>
                <Text style={styles.finishGridVal}>
                  {completedSetsCount}/{totalSetsCount}
                </Text>
              </View>
              <View style={styles.finishGridItem}>
                <Text style={styles.finishGridLabel}>DIVISIÓN</Text>
                <Text style={[styles.finishGridVal, { color: Colors.orange }]}>
                  {isRx ? 'RX' : 'ESCALADO'}
                </Text>
              </View>
            </View>

            {/* Notes Input */}
            <View style={styles.notesInputContainer}>
              <Text style={styles.notesInputLabel}>NOTAS / SENSACIONES DEL WOD</Text>
              <TextInput
                style={styles.notesTextInput}
                placeholder="Sensaciones de ritmo, fatiga en hombros, peso fácil..."
                placeholderTextColor={Colors.textMuted}
                value={athleteNotes}
                onChangeText={setAthleteNotes}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Save Buttons */}
            <TouchableOpacity style={styles.saveHistoryBtn} onPress={handleSaveWorkout}>
              <Text style={styles.saveHistoryBtnText}>Guardar en Historial</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelFinishBtn}
              onPress={() => setIsFinishModalOpen(false)}
            >
              <Text style={styles.cancelFinishBtnText}>Volver a la sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  topSessionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  titleWrapper: {
    flex: 1,
    marginRight: 10,
  },
  workoutHeaderTitleInput: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '900',
    padding: 0,
  },
  sessionStatusSub: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  topRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  templateHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
    gap: 4,
  },
  templateHeaderBtnText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  liveTimerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  liveTimerBadgeRunning: {
    borderColor: Colors.primaryBorder,
    backgroundColor: Colors.primaryMuted,
  },
  liveTimerText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.surfaceLight,
    gap: 8,
  },
  toggleRxContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 8,
    padding: 2,
  },
  toggleRxBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  toggleRxBtnActive: {
    backgroundColor: Colors.primary,
  },
  toggleRxText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  toggleRxTextActive: {
    color: Colors.textInverse,
    fontWeight: '900',
  },
  formatPillsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  formatPill: {
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
  },
  formatPillActive: {
    backgroundColor: Colors.orangeMuted,
    borderWidth: 1,
    borderColor: Colors.orange,
  },
  formatPillText: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  formatPillTextActive: {
    color: Colors.orange,
    fontWeight: '800',
  },
  restJumpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cyanMuted,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.cyan,
    gap: 4,
  },
  restJumpText: {
    color: Colors.cyan,
    fontSize: 11,
    fontWeight: '800',
  },
  metricsStrip: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricStripItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricStripLabel: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metricStripVal: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '900',
  },
  stripDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.border,
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: Colors.surfaceElevated,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  emptySessionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 20,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
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
    marginBottom: 6,
  },
  emptySubtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  emptyTemplatesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    width: '100%',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyTemplatesBtnText: {
    color: Colors.textInverse,
    fontSize: 15,
    fontWeight: '900',
  },
  quickTemplatesSection: {
    width: '100%',
    marginTop: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  quickTemplatesLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  quickChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  quickChipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  quickChipText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
    width: '100%',
  },
  emptyAddBtnText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  exerciseCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
  },
  exerciseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  exerciseCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  exerciseIndexBox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: Colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseIndexText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  exerciseNameText: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  exerciseCategorySub: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  deleteExerciseBtn: {
    padding: 6,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 6,
  },
  thText: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 4,
  },
  setRowCompleted: {
    backgroundColor: 'rgba(204, 255, 0, 0.06)',
  },
  setNumberBadge: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setNumberBadgeText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
  },
  inputContainer: {
    flex: 1.2,
    paddingHorizontal: 4,
  },
  tableInput: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tableInputCompleted: {
    borderColor: Colors.primaryBorder,
    color: Colors.primary,
  },
  checkBtn: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBtnCompleted: {
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 8,
    alignSelf: 'center',
  },
  emptyCheckmarkDot: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.textMuted,
  },
  deleteSetBtn: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 8,
    marginTop: 8,
    gap: 6,
  },
  addSetButtonText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 40,
  },
  bottomActionBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 8,
  },
  bottomTemplatesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
    gap: 5,
  },
  bottomTemplatesBtnText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  secondaryAddBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceLight,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  secondaryAddBtnText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  finishBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  finishBtnDisabled: {
    opacity: 0.5,
  },
  finishBtnText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: '900',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 18,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalSheetTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
  },
  modalSheetSubtitle: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
    marginBottom: 10,
  },
  modalSearchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 13,
  },
  categoryScroll: {
    gap: 6,
    paddingBottom: 10,
  },
  catChip: {
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  catChipActive: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  catChipText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  catChipTextActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  modalExercisesScroll: {
    maxHeight: 320,
  },
  exerciseOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceLight,
    gap: 10,
  },
  exerciseOptionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseOptionTextGroup: {
    flex: 1,
  },
  exerciseOptionName: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  exerciseOptionSub: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  customExerciseSection: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  customSectionLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  customInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  customTextInput: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 13,
  },
  customAddButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customAddButtonDisabled: {
    opacity: 0.4,
  },
  customAddButtonText: {
    color: Colors.textInverse,
    fontWeight: '800',
    fontSize: 12,
  },
  finishModalCard: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  finishModalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  trophyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  finishModalTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '900',
  },
  finishModalSub: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  finishGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  finishGridItem: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 6,
  },
  finishGridLabel: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
  },
  finishGridVal: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },
  notesInputContainer: {
    marginBottom: 14,
  },
  notesInputLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 6,
  },
  notesTextInput: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 8,
    padding: 10,
    color: Colors.textPrimary,
    fontSize: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    textAlignVertical: 'top',
  },
  saveHistoryBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  saveHistoryBtnText: {
    color: Colors.textInverse,
    fontWeight: '900',
    fontSize: 14,
  },
  cancelFinishBtn: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  cancelFinishBtnText: {
    color: Colors.textSecondary,
    fontWeight: '700',
    fontSize: 12,
  },
  templatesModalSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 18,
    paddingBottom: 28,
    paddingHorizontal: 16,
    maxHeight: '90%',
    borderWidth: 1.5,
    borderColor: Colors.primaryBorder,
  },
  modalHeaderTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  templateCatScroll: {
    paddingVertical: 12,
    gap: 8,
  },
  templateCatChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  templateCatChipActive: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  templateCatChipText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  templateCatChipTextActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  templatesListScroll: {
    maxHeight: 520,
  },
  templateCard: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  templateCardTop: {
    marginBottom: 10,
  },
  templateBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  templateCatBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: Colors.surfaceElevated,
  },
  templateCatBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  templateMetaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  templateMetaBadgeText: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  templateCardTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 4,
  },
  templateCardDesc: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },
  templateSummaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  templateSummaryText: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  expandToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  expandToggleText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  templateExercisesPreview: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  exercisesPreviewHeader: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  previewExerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  previewExBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  previewExBulletText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '800',
  },
  previewExName: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  previewExSets: {
    color: Colors.textMuted,
    fontSize: 10,
    marginTop: 1,
  },
  templateActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  templateAppendBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cyanMuted,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.cyan,
    gap: 5,
  },
  templateAppendBtnText: {
    color: Colors.cyan,
    fontSize: 12,
    fontWeight: '800',
  },
  templateLoadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  templateLoadBtnText: {
    color: Colors.textInverse,
    fontSize: 12,
    fontWeight: '900',
  },
  templateLoadBtnFull: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 11,
    borderRadius: 8,
    gap: 8,
  },
  templateLoadBtnFullText: {
    color: Colors.textInverse,
    fontSize: 13,
    fontWeight: '900',
  },
});
