import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  Search,
  X,
  Dumbbell,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Award,
  Sparkles,
  Layers,
  Activity,
  ArrowRight,
  Info,
} from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { EXERCISES_DATA } from '../data/exercisesData';
import { ExerciseItem, MuscleGroup, ExerciseLevel } from '../types';
import { ExerciseVisualGraphic } from '../components/ExerciseVisualGraphic';
import { BottomTabParamList } from '../navigation/types';
import { recordRecentExercise } from '../services/recentExercisesStorage';

type ExercisesRouteProp = RouteProp<BottomTabParamList, 'Ejercicios'>;

export const ExercisesScreen: React.FC = () => {
  const navigation = useNavigation<BottomTabNavigationProp<BottomTabParamList>>();
  const route = useRoute<ExercisesRouteProp>();

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup>('Todos');
  const [selectedLevel, setSelectedLevel] = useState<string>('Todos');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('Todos');

  // Detail Modal State
  const [activeExercise, setActiveExercise] = useState<ExerciseItem | null>(null);

  // Sync route params if navigated with a specific filter
  useEffect(() => {
    if (route.params?.filterGroup) {
      setSelectedMuscle(route.params.filterGroup as MuscleGroup);
    }
  }, [route.params?.filterGroup]);

  // Muscle groups specified in user prompt
  const muscleGroups: { label: MuscleGroup; count: number }[] = [
    { label: 'Todos', count: EXERCISES_DATA.length },
    { label: 'Pecho', count: EXERCISES_DATA.filter((e) => e.muscleGroup === 'Pecho').length },
    { label: 'Espalda', count: EXERCISES_DATA.filter((e) => e.muscleGroup === 'Espalda').length },
    { label: 'Piernas', count: EXERCISES_DATA.filter((e) => e.muscleGroup === 'Piernas').length },
    { label: 'Hombros', count: EXERCISES_DATA.filter((e) => e.muscleGroup === 'Hombros').length },
    { label: 'Brazos', count: EXERCISES_DATA.filter((e) => e.muscleGroup === 'Brazos').length },
    { label: 'Core', count: EXERCISES_DATA.filter((e) => e.muscleGroup === 'Core').length },
  ];

  // Equipment filters
  const equipmentOptions = [
    'Todos',
    'Barra Olímpica',
    'Mancuerna',
    'Gimnásticos',
    'Peso Corporal',
    'Anillas',
    'Cajón',
  ];

  // Filtering Logic
  const filteredExercises = EXERCISES_DATA.filter((exercise) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      exercise.name.toLowerCase().includes(q) ||
      exercise.muscleGroup.toLowerCase().includes(q) ||
      exercise.category.toLowerCase().includes(q) ||
      exercise.primaryMuscles.some((m) => m.toLowerCase().includes(q)) ||
      exercise.secondaryMuscles.some((m) => m.toLowerCase().includes(q)) ||
      exercise.benefits.some((b) => b.toLowerCase().includes(q));

    const matchesMuscle =
      selectedMuscle === 'Todos' || exercise.muscleGroup === selectedMuscle;

    const matchesLevel =
      selectedLevel === 'Todos' || exercise.level === selectedLevel;

    const matchesEquipment =
      selectedEquipment === 'Todos' ||
      exercise.equipment.toLowerCase().includes(selectedEquipment.toLowerCase());

    return matchesSearch && matchesMuscle && matchesLevel && matchesEquipment;
  });

  const getMuscleBadgeColor = (group: MuscleGroup) => {
    switch (group) {
      case 'Pecho':
        return Colors.fire;
      case 'Espalda':
        return Colors.cyan;
      case 'Piernas':
        return Colors.primary;
      case 'Hombros':
        return '#FFB800';
      case 'Brazos':
        return '#9D4EDD';
      case 'Core':
        return '#00F5D4';
      default:
        return Colors.primary;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.screenTitle}>Biblioteca de Ejercicios</Text>
          <Text style={styles.screenSubtitle}>
            Biomecánica, prevención de lesiones y estándares RX
          </Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{filteredExercises.length} Movimientos</Text>
        </View>
      </View>

      {/* Real-time Search Box */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBox}>
          <Search size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar ejercicio, músculo (pectoral, dorsal...)"
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Primary Muscle Group Filter Strip (Pecho, Espalda, Piernas, Hombros, Brazos, Core) */}
      <View style={styles.filterSection}>
        <View style={styles.filterHeaderRow}>
          <Text style={styles.filterSectionLabel}>GRUPO MUSCULAR</Text>
          {selectedMuscle !== 'Todos' && (
            <TouchableOpacity onPress={() => setSelectedMuscle('Todos')}>
              <Text style={styles.resetFilterText}>Ver Todos</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {muscleGroups.map((group) => {
            const isSelected = selectedMuscle === group.label;
            const badgeColor = getMuscleBadgeColor(group.label);
            return (
              <TouchableOpacity
                key={group.label}
                style={[
                  styles.muscleChip,
                  isSelected && styles.muscleChipActive,
                  isSelected && { borderColor: badgeColor },
                ]}
                onPress={() => setSelectedMuscle(group.label)}
                activeOpacity={0.75}
              >
                {group.label !== 'Todos' && (
                  <View
                    style={[
                      styles.muscleDot,
                      { backgroundColor: isSelected ? badgeColor : Colors.textMuted },
                    ]}
                  />
                )}
                <Text
                  style={[
                    styles.muscleChipText,
                    isSelected && { color: Colors.textPrimary, fontWeight: '900' },
                  ]}
                >
                  {group.label}
                </Text>
                <View
                  style={[
                    styles.chipCountPill,
                    isSelected && { backgroundColor: badgeColor },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipCountPillText,
                      isSelected && { color: Colors.textInverse },
                    ]}
                  >
                    {group.count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Secondary Level / Equipment Filters Row */}
      <View style={styles.subFilterRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subFilterScroll}
        >
          {/* Level Filter Chips */}
          <Text style={styles.subFilterLabel}>NIVEL:</Text>
          {['Todos', 'Principiante', 'Intermedio'].map((lvl) => (
            <TouchableOpacity
              key={lvl}
              style={[
                styles.subFilterChip,
                selectedLevel === lvl && styles.subFilterChipActive,
              ]}
              onPress={() => setSelectedLevel(lvl)}
            >
              <Text
                style={[
                  styles.subFilterChipText,
                  selectedLevel === lvl && styles.subFilterChipTextActive,
                ]}
              >
                {lvl}
              </Text>
            </TouchableOpacity>
          ))}

          <View style={styles.subFilterDivider} />

          {/* Equipment Filter Chips */}
          <Text style={styles.subFilterLabel}>MATERIAL:</Text>
          {equipmentOptions.map((equip) => (
            <TouchableOpacity
              key={equip}
              style={[
                styles.subFilterChip,
                selectedEquipment === equip && styles.subFilterChipActiveEquip,
              ]}
              onPress={() => setSelectedEquipment(equip)}
            >
              <Text
                style={[
                  styles.subFilterChipText,
                  selectedEquipment === equip && styles.subFilterChipTextActiveEquip,
                ]}
              >
                {equip}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Exercise Cards Main Scroll Area */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredExercises.length === 0 ? (
          <View style={styles.emptyState}>
            <Dumbbell size={40} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No se encontraron ejercicios</Text>
            <Text style={styles.emptySubtitle}>
              Prueba cambiando el grupo muscular o los términos de búsqueda
            </Text>
            <TouchableOpacity
              style={styles.emptyResetBtn}
              onPress={() => {
                setSearchQuery('');
                setSelectedMuscle('Todos');
                setSelectedLevel('Todos');
                setSelectedEquipment('Todos');
              }}
            >
              <Text style={styles.emptyResetBtnText}>Restablecer Filtros</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredExercises.map((exercise) => {
            const muscleColor = getMuscleBadgeColor(exercise.muscleGroup);
            return (
              <TouchableOpacity
                key={exercise.id}
                activeOpacity={0.82}
                style={styles.exerciseCard}
                onPress={() => {
                  setActiveExercise(exercise);
                  recordRecentExercise(exercise.id);
                }}
              >
                {/* Left: Graphic Vector Demonstration */}
                <ExerciseVisualGraphic
                  graphicType={exercise.graphicType}
                  muscleGroup={exercise.muscleGroup}
                  size="compact"
                />

                {/* Right: Info and Tags */}
                <View style={styles.cardRightContent}>
                  <View style={styles.cardTopTitleRow}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {exercise.name}
                    </Text>
                    <ChevronRight size={18} color={Colors.textMuted} />
                  </View>

                  <Text style={styles.cardEquipmentSub}>
                    {exercise.category} • {exercise.equipment}
                  </Text>

                  {/* Muscle Tags Strip */}
                  <View style={styles.cardTagsRow}>
                    <View
                      style={[
                        styles.groupTag,
                        { backgroundColor: `${muscleColor}20`, borderColor: muscleColor },
                      ]}
                    >
                      <View style={[styles.dotSmall, { backgroundColor: muscleColor }]} />
                      <Text style={[styles.groupTagText, { color: muscleColor }]}>
                        {exercise.muscleGroup}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.levelTag,
                        exercise.level === 'Principiante'
                          ? styles.levelTagBeginner
                          : styles.levelTagIntermediate,
                      ]}
                    >
                      <Text
                        style={[
                          styles.levelTagText,
                          exercise.level === 'Principiante'
                            ? styles.levelTextBeginner
                            : styles.levelTextIntermediate,
                        ]}
                      >
                        {exercise.level}
                      </Text>
                    </View>
                  </View>

                  {/* Primary Target Muscles Preview */}
                  <Text style={styles.cardMusclesLine} numberOfLines={1}>
                    <Text style={{ color: Colors.textMuted, fontWeight: '700' }}>Objetivo: </Text>
                    {exercise.primaryMuscles.join(', ')}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Comprehensive Movement Detail Modal */}
      <Modal
        visible={!!activeExercise}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveExercise(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            {activeExercise && (
              <>
                {/* Modal Top Bar */}
                <View style={styles.modalTopBar}>
                  <View style={styles.modalHeaderInfo}>
                    <View style={styles.modalTagsRow}>
                      <View
                        style={[
                          styles.groupTag,
                          {
                            backgroundColor: `${getMuscleBadgeColor(activeExercise.muscleGroup)}25`,
                            borderColor: getMuscleBadgeColor(activeExercise.muscleGroup),
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.groupTagText,
                            { color: getMuscleBadgeColor(activeExercise.muscleGroup) },
                          ]}
                        >
                          {activeExercise.muscleGroup.toUpperCase()}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.levelTag,
                          activeExercise.level === 'Principiante'
                            ? styles.levelTagBeginner
                            : styles.levelTagIntermediate,
                        ]}
                      >
                        <Text
                          style={[
                            styles.levelTagText,
                            activeExercise.level === 'Principiante'
                              ? styles.levelTextBeginner
                              : styles.levelTextIntermediate,
                          ]}
                        >
                          {activeExercise.level.toUpperCase()}
                        </Text>
                      </View>

                      <View style={styles.categoryPill}>
                        <Text style={styles.categoryPillText}>{activeExercise.category}</Text>
                      </View>
                    </View>

                    <Text style={styles.modalMainTitle}>{activeExercise.name}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={() => setActiveExercise(null)}
                  >
                    <X size={20} color={Colors.textPrimary} />
                  </TouchableOpacity>
                </View>

                {/* Modal Scroll Content */}
                <ScrollView
                  style={styles.modalScroll}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.modalScrollContent}
                >
                  {/* Full Vector Graphic Biomechanical Banner */}
                  <ExerciseVisualGraphic
                    graphicType={activeExercise.graphicType}
                    muscleGroup={activeExercise.muscleGroup}
                    size="full"
                    exerciseName={activeExercise.name}
                  />

                  {/* Summary / Description */}
                  <Text style={styles.modalDescription}>
                    {activeExercise.description}
                  </Text>

                  {/* Quick Specs Strip */}
                  <View style={styles.specsCard}>
                    <View style={styles.specItem}>
                      <Text style={styles.specLabel}>EQUIPAMIENTO</Text>
                      <Text style={styles.specValue}>{activeExercise.equipment}</Text>
                    </View>
                    <View style={styles.specDivider} />
                    <View style={styles.specItem}>
                      <Text style={styles.specLabel}>DIFICULTAD</Text>
                      <Text style={[styles.specValue, { color: Colors.primary }]}>
                        {activeExercise.level}
                      </Text>
                    </View>
                    {activeExercise.prsRecord && (
                      <>
                        <View style={styles.specDivider} />
                        <View style={styles.specItem}>
                          <Text style={styles.specLabel}>BENCHMARK / PR</Text>
                          <Text style={[styles.specValue, { color: Colors.cyan }]}>
                            {activeExercise.prsRecord}
                          </Text>
                        </View>
                      </>
                    )}
                  </View>

                  {/* 1. Descripción Breve de Ejecución Paso a Paso */}
                  <View style={styles.modalBlock}>
                    <View style={styles.blockTitleRow}>
                      <Activity size={17} color={Colors.primary} />
                      <Text style={styles.blockTitle}>EJECUCIÓN TÉCNICA PASO A PASO</Text>
                    </View>
                    <Text style={styles.executionText}>{activeExercise.execution}</Text>
                  </View>

                  {/* 2. Mejores Recomendaciones para Evitar Lesiones */}
                  <View style={[styles.modalBlock, styles.injuryBlock]}>
                    <View style={styles.blockTitleRow}>
                      <ShieldAlert size={17} color={Colors.fire} />
                      <Text style={[styles.blockTitle, { color: Colors.fire }]}>
                        PREVENCIÓN DE LESIONES & SEGURIDAD
                      </Text>
                    </View>

                    {activeExercise.injuryPrevention.map((rec, i) => (
                      <View key={i} style={styles.injuryPointRow}>
                        <View style={styles.warningDot} />
                        <Text style={styles.injuryPointText}>{rec}</Text>
                      </View>
                    ))}
                  </View>

                  {/* 3. Músculos Principales y Secundarios */}
                  <View style={styles.modalBlock}>
                    <View style={styles.blockTitleRow}>
                      <Layers size={17} color={Colors.cyan} />
                      <Text style={[styles.blockTitle, { color: Colors.cyan }]}>
                        MÚSCULOS INVOLUCRADOS
                      </Text>
                    </View>

                    <Text style={styles.musclesSubtitle}>Músculos Principales (Agonistas):</Text>
                    <View style={styles.muscleChipsWrap}>
                      {activeExercise.primaryMuscles.map((m, i) => (
                        <View key={i} style={styles.primaryMuscleChip}>
                          <Text style={styles.primaryMuscleChipText}>{m}</Text>
                        </View>
                      ))}
                    </View>

                    <Text style={[styles.musclesSubtitle, { marginTop: 10 }]}>
                      Músculos Secundarios (Sinergistas y Estabilizadores):
                    </Text>
                    <View style={styles.muscleChipsWrap}>
                      {activeExercise.secondaryMuscles.map((m, i) => (
                        <View key={i} style={styles.secondaryMuscleChip}>
                          <Text style={styles.secondaryMuscleChipText}>{m}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* 4. Beneficios Atléticos */}
                  <View style={styles.modalBlock}>
                    <View style={styles.blockTitleRow}>
                      <Sparkles size={17} color={Colors.primary} />
                      <Text style={styles.blockTitle}>BENEFICIOS CLAVE</Text>
                    </View>
                    {activeExercise.benefits.map((benefit, i) => (
                      <View key={i} style={styles.benefitRow}>
                        <ShieldCheck size={14} color={Colors.primary} style={{ marginTop: 2 }} />
                        <Text style={styles.benefitText}>{benefit}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.modalSpacer} />
                </ScrollView>

                {/* Modal Footer Buttons */}
                <View style={styles.modalFooterRow}>
                  <TouchableOpacity
                    style={styles.closeModalBtn}
                    onPress={() => setActiveExercise(null)}
                  >
                    <Text style={styles.closeModalBtnText}>Cerrar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.trainActionBtn}
                    onPress={() => {
                      setActiveExercise(null);
                      navigation.navigate('Entrenar');
                    }}
                  >
                    <Text style={styles.trainActionBtnText}>Entrenar Ejercicio</Text>
                    <ArrowRight size={16} color={Colors.textInverse} />
                  </TouchableOpacity>
                </View>
              </>
            )}
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
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 28,
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
  countBadge: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  countBadgeText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 14,
  },
  filterSection: {
    marginBottom: 8,
  },
  filterHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  filterSectionLabel: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  resetFilterText: {
    color: Colors.cyan,
    fontSize: 10,
    fontWeight: '700',
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  muscleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  muscleChipActive: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1.5,
  },
  muscleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  muscleChipText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  chipCountPill: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    marginLeft: 2,
  },
  chipCountPillText: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
  },
  subFilterRow: {
    paddingVertical: 6,
    marginBottom: 6,
  },
  subFilterScroll: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 6,
  },
  subFilterLabel: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
    marginRight: 2,
  },
  subFilterChip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  subFilterChipActive: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  subFilterChipActiveEquip: {
    backgroundColor: Colors.cyanMuted,
    borderColor: Colors.cyan,
  },
  subFilterChipText: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  subFilterChipTextActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  subFilterChipTextActiveEquip: {
    color: Colors.cyan,
    fontWeight: '800',
  },
  subFilterDivider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.border,
    marginHorizontal: 4,
  },
  exerciseCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
    gap: 12,
    alignItems: 'center',
  },
  cardRightContent: {
    flex: 1,
  },
  cardTopTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    flex: 1,
    marginRight: 6,
  },
  cardEquipmentSub: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 6,
  },
  cardTagsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
    alignItems: 'center',
  },
  groupTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    gap: 4,
  },
  dotSmall: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  groupTagText: {
    fontSize: 9,
    fontWeight: '800',
  },
  levelTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  levelTagBeginner: {
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.4)',
  },
  levelTagIntermediate: {
    backgroundColor: Colors.primaryMuted,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  levelTagText: {
    fontSize: 9,
    fontWeight: '800',
  },
  levelTextBeginner: {
    color: Colors.cyan,
  },
  levelTextIntermediate: {
    color: Colors.primary,
  },
  cardMusclesLine: {
    color: Colors.textSecondary,
    fontSize: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 10,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  emptySubtitle: {
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 260,
  },
  emptyResetBtn: {
    marginTop: 8,
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyResetBtnText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  bottomSpacer: {
    height: 24,
  },

  // Modal Sheet Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingHorizontal: 18,
    paddingBottom: 24,
    maxHeight: '90%',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  modalTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  modalHeaderInfo: {
    flex: 1,
    marginRight: 10,
  },
  modalTagsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
    alignItems: 'center',
  },
  categoryPill: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryPillText: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
  },
  modalMainTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
  },
  modalCloseBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: Colors.surfaceLight,
  },
  modalScroll: {
    marginBottom: 12,
  },
  modalScrollContent: {
    paddingBottom: 16,
  },
  modalDescription: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  specsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 14,
  },
  specItem: {
    alignItems: 'center',
    flex: 1,
  },
  specLabel: {
    color: Colors.textMuted,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  specValue: {
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
  },
  specDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.border,
  },
  modalBlock: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  injuryBlock: {
    borderColor: 'rgba(255, 71, 87, 0.4)',
    backgroundColor: 'rgba(255, 71, 87, 0.05)',
  },
  blockTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  blockTitle: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  executionText: {
    color: Colors.textPrimary,
    fontSize: 12,
    lineHeight: 18,
  },
  injuryPointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  warningDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.fire,
    marginTop: 5,
  },
  injuryPointText: {
    color: Colors.textPrimary,
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
  },
  musclesSubtitle: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 6,
  },
  muscleChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  primaryMuscleChip: {
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  primaryMuscleChipText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  secondaryMuscleChip: {
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryMuscleChipText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  benefitText: {
    color: Colors.textPrimary,
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
  modalSpacer: {
    height: 10,
  },
  modalFooterRow: {
    flexDirection: 'row',
    gap: 10,
  },
  closeModalBtn: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  closeModalBtnText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '800',
  },
  trainActionBtn: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  trainActionBtnText: {
    color: Colors.textInverse,
    fontSize: 13,
    fontWeight: '900',
  },
});
