import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  Volume2,
  VolumeX,
  Timer,
  Sliders,
  X,
  Check,
  Sparkles,
  Flame,
  Award,
  Clock,
} from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { BottomTabParamList } from '../navigation/types';
import {
  saveRestState,
  getRestState,
  incrementRestsCompleted,
} from '../services/restStorage';

type RestRouteProp = RouteProp<BottomTabParamList, 'Descanso'>;

type TimerMode = 'REST' | 'EMOM' | 'TABATA' | 'FOR_TIME';

export const RestScreen: React.FC = () => {
  const route = useRoute<RestRouteProp>();
  const initialSecs = route.params?.initialSeconds || 90;

  // Timer Configuration State
  const [mode, setMode] = useState<TimerMode>('REST');
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSecs);
  const [initialDuration, setInitialDuration] = useState<number>(initialSecs);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Interval Tracking (EMOM / Tabata)
  const [currentRound, setCurrentRound] = useState<number>(1);
  const totalRounds = mode === 'TABATA' ? 8 : mode === 'EMOM' ? 10 : 1;

  // Custom Time Modal State
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [customMinutes, setCustomMinutes] = useState<string>('1');
  const [customSeconds, setCustomSeconds] = useState<string>('30');

  // Completed rest intervals counter in this session
  const [restsCompletedCount, setRestsCompletedCount] = useState<number>(0);

  // Timestamp-based accurate interval ref
  const targetEndTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sound generator using Web Audio API
  const triggerBeep = (freq = 880, duration = 0.3) => {
    if (!soundEnabled) return;
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0.25, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + duration);
        }
      } catch (e) {
        // AudioContext could be blocked if no user gesture yet
      }
    }
  };

  // Initial load from storage if no route param
  useEffect(() => {
    const initRest = async () => {
      const saved = await getRestState();
      setRestsCompletedCount(saved.restsCompletedToday || 0);
      if (!route.params?.initialSeconds && saved.initialDuration) {
        setSecondsLeft(saved.initialDuration);
        setInitialDuration(saved.initialDuration);
        setMode(saved.mode || 'REST');
      }
    };
    initRest();
  }, []);

  // Sync if route params change from external screens
  useEffect(() => {
    if (route.params?.initialSeconds) {
      const s = route.params.initialSeconds;
      setIsRunning(false);
      setSecondsLeft(s);
      setInitialDuration(s);
      saveRestState({ initialDuration: s });
    }
  }, [route.params?.initialSeconds]);

  // Main Timer Countdown Loop
  useEffect(() => {
    if (isRunning) {
      if (mode === 'FOR_TIME') {
        // Count Up
        timerIntervalRef.current = setInterval(() => {
          setSecondsLeft((prev) => prev + 1);
        }, 1000);
      } else {
        // Count Down with high-precision timestamp
        targetEndTimeRef.current = Date.now() + secondsLeft * 1000;

        timerIntervalRef.current = setInterval(() => {
          if (!targetEndTimeRef.current) return;
          const diffMs = targetEndTimeRef.current - Date.now();
          const remaining = Math.max(0, Math.ceil(diffMs / 1000));

          if (remaining <= 0) {
            // Reached zero!
            clearInterval(timerIntervalRef.current!);
            setIsRunning(false);
            setSecondsLeft(0);
            targetEndTimeRef.current = null;
            triggerBeep(1040, 0.6); // High finish beep
            incrementRestsCompleted().then((newCount) => {
              setRestsCompletedCount(newCount);
            });
          } else {
            // 3 seconds warning beeps
            if (remaining <= 3 && remaining !== secondsLeft) {
              triggerBeep(660, 0.15);
            }
            setSecondsLeft(remaining);
          }
        }, 200); // 200ms tick for responsive UI
      }
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      targetEndTimeRef.current = null;
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isRunning, mode]);

  // Play / Pause Toggle
  const togglePlay = () => {
    if (!isRunning && secondsLeft === 0) {
      // If at zero, restart from initialDuration
      const startSecs = initialDuration > 0 ? initialDuration : 90;
      setSecondsLeft(startSecs);
      setIsRunning(true);
      triggerBeep(880, 0.2);
      return;
    }
    triggerBeep(isRunning ? 540 : 780, 0.15);
    setIsRunning(!isRunning);
  };

  // Reset Timer
  const resetTimer = () => {
    setIsRunning(false);
    if (mode === 'FOR_TIME') {
      setSecondsLeft(0);
    } else {
      setSecondsLeft(initialDuration);
    }
    triggerBeep(440, 0.2);
  };

  // Add / Subtract seconds (+30s, +1min, etc.)
  const addSeconds = (delta: number) => {
    setSecondsLeft((prev) => {
      const next = Math.max(0, prev + delta);
      if (isRunning && targetEndTimeRef.current) {
        targetEndTimeRef.current += delta * 1000;
      }
      if (!isRunning) {
        setInitialDuration(next);
      }
      return next;
    });
    triggerBeep(800, 0.1);
  };

  // Select a preset duration
  const selectPreset = (secs: number, labelMode: TimerMode = 'REST') => {
    setIsRunning(false);
    setMode(labelMode);
    setSecondsLeft(secs);
    setInitialDuration(secs);
    saveRestState({ initialDuration: secs, mode: labelMode });
    triggerBeep(700, 0.15);
  };

  // Apply custom time from modal
  const handleApplyCustomTime = () => {
    const mins = parseInt(customMinutes, 10) || 0;
    const secs = parseInt(customSeconds, 10) || 0;
    const totalSecs = Math.max(5, mins * 60 + secs);

    setIsRunning(false);
    setMode('REST');
    setSecondsLeft(totalSecs);
    setInitialDuration(totalSecs);
    saveRestState({ initialDuration: totalSecs, mode: 'REST' });
    setIsCustomModalOpen(false);
    triggerBeep(880, 0.2);
  };

  // Format MM:SS
  const formatDisplayTime = (total: number) => {
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return {
      minutes: mins.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0'),
    };
  };

  const { minutes, seconds } = formatDisplayTime(secondsLeft);

  const progressRatio =
    mode === 'FOR_TIME'
      ? 1
      : initialDuration > 0
      ? Math.max(0, Math.min(1, secondsLeft / initialDuration))
      : 0;

  const presetsList = [
    { label: '30s', secs: 30, desc: 'Metcon & Accesorios' },
    { label: '60s', secs: 60, desc: 'Gimnásticos & Hipertrofia' },
    { label: '90s', secs: 90, desc: 'Fuerza estándar' },
    { label: '2 min', secs: 120, desc: 'Series pesadas' },
    { label: '3 min', secs: 180, desc: 'Halterofilia & 1RM' },
    { label: '5 min', secs: 300, desc: 'Transición de bloques' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.screenTitle}>Temporizador de Descanso</Text>
          <Text style={styles.screenSubtitle}>Control preciso de recuperación para tus series</Text>
        </View>

        <TouchableOpacity
          style={[styles.soundButton, soundEnabled && styles.soundButtonActive]}
          onPress={() => setSoundEnabled(!soundEnabled)}
        >
          {soundEnabled ? (
            <Volume2 size={18} color={Colors.primary} />
          ) : (
            <VolumeX size={18} color={Colors.textMuted} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Mode Selector Tabs */}
        <View style={styles.modeTabsRow}>
          <TouchableOpacity
            style={[styles.modeTab, mode === 'REST' && styles.modeTabActive]}
            onPress={() => selectPreset(90, 'REST')}
          >
            <Text style={[styles.modeTabText, mode === 'REST' && styles.modeTabTextActive]}>
              Descanso
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeTab, mode === 'EMOM' && styles.modeTabActive]}
            onPress={() => selectPreset(60, 'EMOM')}
          >
            <Text style={[styles.modeTabText, mode === 'EMOM' && styles.modeTabTextActive]}>
              EMOM
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeTab, mode === 'TABATA' && styles.modeTabActive]}
            onPress={() => selectPreset(20, 'TABATA')}
          >
            <Text style={[styles.modeTabText, mode === 'TABATA' && styles.modeTabTextActive]}>
              Tabata
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeTab, mode === 'FOR_TIME' && styles.modeTabActive]}
            onPress={() => selectPreset(0, 'FOR_TIME')}
          >
            <Text style={[styles.modeTabText, mode === 'FOR_TIME' && styles.modeTabTextActive]}>
              Cronómetro
            </Text>
          </TouchableOpacity>
        </View>

        {/* LED Digital Box Timer Display */}
        <View style={styles.timerScoreboardCard}>
          <View style={styles.timerTopStatusRow}>
            <View style={styles.timerStatusBadge}>
              <View
                style={[
                  styles.statusLight,
                  isRunning
                    ? styles.statusLightActive
                    : secondsLeft === 0
                    ? styles.statusLightFinished
                    : styles.statusLightPaused,
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  secondsLeft === 0 && { color: Colors.fire, fontWeight: '900' },
                ]}
              >
                {isRunning
                  ? 'RECUPERANDO'
                  : secondsLeft === 0
                  ? '¡TIEMPO! - LISTO'
                  : 'EN PAUSA'}
              </Text>
            </View>

            {/* Custom time launcher icon */}
            <TouchableOpacity
              style={styles.customTriggerBtn}
              onPress={() => setIsCustomModalOpen(true)}
            >
              <Sliders size={14} color={Colors.cyan} />
              <Text style={styles.customTriggerText}>Personalizar</Text>
            </TouchableOpacity>
          </View>

          {/* Big Digital Numbers */}
          <View style={styles.digitsWrapper}>
            <Text
              style={[
                styles.digitsText,
                secondsLeft === 0 && styles.digitsTextFinished,
                secondsLeft <= 5 && secondsLeft > 0 && styles.digitsTextWarning,
              ]}
            >
              {minutes}:{seconds}
            </Text>
          </View>

          {/* Dynamic Progress Bar */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressBar,
                { width: `${progressRatio * 100}%` },
                secondsLeft <= 10 && secondsLeft > 0 && { backgroundColor: Colors.fire },
                secondsLeft === 0 && { backgroundColor: Colors.fire },
              ]}
            />
          </View>

          {/* Real-time Quick Addition Buttons (+30s y +1min) */}
          {mode !== 'FOR_TIME' && (
            <View style={styles.timeAdjustmentRow}>
              <TouchableOpacity
                style={styles.adjustBtn}
                onPress={() => addSeconds(-15)}
                activeOpacity={0.7}
              >
                <Minus size={13} color={Colors.textSecondary} />
                <Text style={styles.adjustBtnText}>15s</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.adjustBtn, styles.adjustBtnHighlight]}
                onPress={() => addSeconds(30)}
                activeOpacity={0.7}
              >
                <Plus size={13} color={Colors.primary} />
                <Text style={[styles.adjustBtnText, { color: Colors.primary, fontWeight: '800' }]}>
                  +30s
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.adjustBtn, styles.adjustBtnHighlight]}
                onPress={() => addSeconds(60)}
                activeOpacity={0.7}
              >
                <Plus size={13} color={Colors.primary} />
                <Text style={[styles.adjustBtnText, { color: Colors.primary, fontWeight: '800' }]}>
                  +1 min
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.adjustBtn}
                onPress={() => addSeconds(120)}
                activeOpacity={0.7}
              >
                <Plus size={13} color={Colors.textSecondary} />
                <Text style={styles.adjustBtnText}>+2 min</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Main Controls: Reset / Play-Pause / Beep */}
          <View style={styles.mainControlsRow}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetTimer}
              activeOpacity={0.7}
            >
              <RotateCcw size={22} color={Colors.textSecondary} />
              <Text style={styles.controlSubLabel}>Reiniciar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.playPauseButton,
                isRunning && styles.playPauseButtonActive,
              ]}
              onPress={togglePlay}
              activeOpacity={0.8}
            >
              {isRunning ? (
                <Pause size={34} color={Colors.textInverse} strokeWidth={3} />
              ) : (
                <Play
                  size={34}
                  color={Colors.textInverse}
                  fill={Colors.textInverse}
                  style={{ marginLeft: 4 }}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bellButton}
              onPress={() => triggerBeep(880, 0.4)}
              activeOpacity={0.7}
            >
              <Volume2 size={22} color={soundEnabled ? Colors.cyan : Colors.textMuted} />
              <Text style={styles.controlSubLabel}>Probar Beep</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Real Presets Grid (30s, 60s, 90s, 2min, 3min, 5min) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeader}>PREAJUSTES DE DESCANSO</Text>
          <TouchableOpacity onPress={() => setIsCustomModalOpen(true)}>
            <Text style={styles.customLinkText}>Tiempo personalizado</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.presetsGrid}>
          {presetsList.map((preset, idx) => {
            const isSelected = secondsLeft === preset.secs && mode === 'REST';
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.presetCard, isSelected && styles.presetCardActive]}
                onPress={() => selectPreset(preset.secs, 'REST')}
                activeOpacity={0.75}
              >
                <View style={styles.presetTopRow}>
                  <Timer
                    size={15}
                    color={isSelected ? Colors.primary : Colors.textMuted}
                  />
                  <Text
                    style={[styles.presetLabel, isSelected && styles.presetLabelActive]}
                  >
                    {preset.label}
                  </Text>
                  {isSelected && (
                    <View style={styles.activeCheckDot}>
                      <Check size={10} color={Colors.textInverse} strokeWidth={3} />
                    </View>
                  )}
                </View>
                <Text style={styles.presetDesc}>{preset.desc}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Real Session Activity Summary Strip */}
        <View style={styles.sessionRestStatsCard}>
          <View style={styles.restStatsItem}>
            <Text style={styles.restStatsLabel}>INTERVALOS HOY</Text>
            <Text style={styles.restStatsValue}>{restsCompletedCount}</Text>
          </View>
          <View style={styles.restStatsDivider} />
          <View style={styles.restStatsItem}>
            <Text style={styles.restStatsLabel}>DURACIÓN BASE</Text>
            <Text style={[styles.restStatsValue, { color: Colors.primary }]}>
              {initialDuration}s
            </Text>
          </View>
          <View style={styles.restStatsDivider} />
          <View style={styles.restStatsItem}>
            <Text style={styles.restStatsLabel}>ESTADO</Text>
            <Text style={[styles.restStatsValue, { color: Colors.cyan }]}>
              {isRunning ? 'Activo' : 'Pausado'}
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Modal: Establecer Tiempo Personalizado */}
      <Modal
        visible={isCustomModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsCustomModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.customModalCard}>
            <View style={styles.modalTopBar}>
              <View>
                <Text style={styles.modalTitle}>Tiempo Personalizado</Text>
                <Text style={styles.modalSubtitle}>Indica los minutos y segundos exactos</Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setIsCustomModalOpen(false)}
              >
                <X size={20} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Inputs: Minutos y Segundos */}
            <View style={styles.customInputsRow}>
              <View style={styles.customInputBlock}>
                <Text style={styles.inputFieldLabel}>MINUTOS</Text>
                <TextInput
                  style={styles.customNumberInput}
                  value={customMinutes}
                  onChangeText={setCustomMinutes}
                  keyboardType="numeric"
                  maxLength={2}
                  placeholder="0"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>

              <Text style={styles.inputColon}>:</Text>

              <View style={styles.customInputBlock}>
                <Text style={styles.inputFieldLabel}>SEGUNDOS</Text>
                <TextInput
                  style={styles.customNumberInput}
                  value={customSeconds}
                  onChangeText={setCustomSeconds}
                  keyboardType="numeric"
                  maxLength={2}
                  placeholder="00"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            </View>

            {/* Quick Helper Buttons inside modal */}
            <View style={styles.modalQuickRow}>
              {[
                { label: '45s', m: '0', s: '45' },
                { label: '1:15', m: '1', s: '15' },
                { label: '1:45', m: '1', s: '45' },
                { label: '2:30', m: '2', s: '30' },
                { label: '4:00', m: '4', s: '00' },
              ].map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.modalQuickChip}
                  onPress={() => {
                    setCustomMinutes(item.m);
                    setCustomSeconds(item.s);
                  }}
                >
                  <Text style={styles.modalQuickChipText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Apply and Close Button */}
            <TouchableOpacity
              style={styles.applyCustomBtn}
              onPress={handleApplyCustomTime}
            >
              <Check size={18} color={Colors.textInverse} />
              <Text style={styles.applyCustomBtnText}>Fijar Tiempo de Descanso</Text>
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
  soundButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  soundButtonActive: {
    borderColor: Colors.primaryBorder,
    backgroundColor: Colors.primaryMuted,
  },
  modeTabsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  modeTabActive: {
    backgroundColor: Colors.surfaceElevated,
  },
  modeTabText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  modeTabTextActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  timerScoreboardCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    marginBottom: 20,
  },
  timerTopStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  timerStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
  },
  statusLight: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusLightActive: {
    backgroundColor: Colors.primary,
  },
  statusLightPaused: {
    backgroundColor: Colors.orange,
  },
  statusLightFinished: {
    backgroundColor: Colors.fire,
  },
  statusText: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  customTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cyanMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.cyan,
    gap: 4,
  },
  customTriggerText: {
    color: Colors.cyan,
    fontSize: 11,
    fontWeight: '700',
  },
  digitsWrapper: {
    paddingVertical: 10,
  },
  digitsText: {
    color: Colors.textPrimary,
    fontSize: 74,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
    letterSpacing: 2,
  },
  digitsTextWarning: {
    color: Colors.orange,
  },
  digitsTextFinished: {
    color: Colors.fire,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  timeAdjustmentRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  adjustBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  adjustBtnHighlight: {
    borderColor: Colors.primaryBorder,
    backgroundColor: Colors.primaryMuted,
  },
  adjustBtnText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  mainControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
  },
  resetButton: {
    alignItems: 'center',
    padding: 10,
  },
  bellButton: {
    alignItems: 'center',
    padding: 10,
  },
  controlSubLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  playPauseButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  playPauseButtonActive: {
    backgroundColor: Colors.orange,
    shadowColor: Colors.orange,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeader: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  customLinkText: {
    color: Colors.cyan,
    fontSize: 11,
    fontWeight: '700',
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  presetCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  presetCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceLight,
  },
  presetTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  presetLabel: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '900',
  },
  presetLabelActive: {
    color: Colors.primary,
  },
  activeCheckDot: {
    marginLeft: 'auto',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetDesc: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  sessionRestStatsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  restStatsItem: {
    alignItems: 'center',
    flex: 1,
  },
  restStatsLabel: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  restStatsValue: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '900',
  },
  restStatsDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
  bottomSpacer: {
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  customModalCard: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  modalTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
  },
  modalSubtitle: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
  },
  customInputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 12,
  },
  customInputBlock: {
    alignItems: 'center',
  },
  inputFieldLabel: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  customNumberInput: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    color: Colors.textPrimary,
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    width: 80,
    paddingVertical: 8,
  },
  inputColon: {
    color: Colors.primary,
    fontSize: 32,
    fontWeight: '900',
    marginTop: 16,
  },
  modalQuickRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  modalQuickChip: {
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalQuickChipText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  applyCustomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  applyCustomBtnText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: '900',
  },
});
