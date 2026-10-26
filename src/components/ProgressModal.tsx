import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Image,
} from 'react-native';
import Svg, {
  Path,
  Rect,
  Circle,
  Line,
  Defs,
  LinearGradient,
  Stop,
  G,
  Text as SvgText,
} from 'react-native-svg';
import {
  X,
  Plus,
  Camera,
  TrendingDown,
  TrendingUp,
  Calendar,
  Scale,
  Activity,
  Trash2,
  Check,
  Sparkles,
  Image as ImageIcon,
  ChevronRight,
  Upload,
} from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { ProgressEntry } from '../types';
import {
  getProgressEntries,
  saveProgressEntry,
  deleteProgressEntry,
} from '../services/progressStorage';

interface ProgressModalProps {
  visible: boolean;
  onClose: () => void;
}

type TabType = 'GRAFICAS' | 'REGISTRAR' | 'FOTOS';
type MetricType = 'weight' | 'waist' | 'chest' | 'hips';

export const ProgressModal: React.FC<ProgressModalProps> = ({ visible, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('GRAFICAS');
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('weight');
  const [entries, setEntries] = useState<ProgressEntry[]>([]);

  // Form State
  const [formWeight, setFormWeight] = useState<string>('78.0');
  const [formWaist, setFormWaist] = useState<string>('81.5');
  const [formChest, setFormChest] = useState<string>('104.0');
  const [formHips, setFormHips] = useState<string>('97.5');
  const [formPose, setFormPose] = useState<'Frontal' | 'Lateral' | 'Espalda' | 'General'>('Frontal');
  const [formNotes, setFormNotes] = useState<string>('');
  const [formPhotoUri, setFormPhotoUri] = useState<string | null>(null);
  const [formDate, setFormDate] = useState<string>(
    new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
  );

  const fileInputRef = useRef<any>(null);

  // Load entries when modal opens
  useEffect(() => {
    if (visible) {
      loadEntries();
    }
  }, [visible]);

  const loadEntries = async () => {
    const data = await getProgressEntries();
    setEntries(data);
    if (data.length > 0) {
      const latest = data[data.length - 1];
      setFormWeight(latest.weightKg ? latest.weightKg.toString() : '78.0');
      setFormWaist(latest.waistCm ? latest.waistCm.toString() : '81.5');
      setFormChest(latest.chestCm ? latest.chestCm.toString() : '104.0');
      setFormHips(latest.hipsCm ? latest.hipsCm.toString() : '97.5');
    }
  };

  // Handle local image file picker on web
  const handlePickImageWeb = (e: any) => {
    const file = e.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        setFormPhotoUri(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    if (Platform.OS === 'web' && fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      // In mobile mock fallback pose demo
      setFormPhotoUri('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80');
    }
  };

  // Save new record
  const handleSaveEntry = async () => {
    const weightNum = parseFloat(formWeight.replace(',', '.')) || 75;
    const waistNum = parseFloat(formWaist.replace(',', '.')) || undefined;
    const chestNum = parseFloat(formChest.replace(',', '.')) || undefined;
    const hipsNum = parseFloat(formHips.replace(',', '.')) || undefined;

    await saveProgressEntry({
      date: formDate,
      weightKg: weightNum,
      waistCm: waistNum,
      chestCm: chestNum,
      hipsCm: hipsNum,
      photoUri: formPhotoUri || undefined,
      photoPose: formPose,
      notes: formNotes.trim() || 'Control de peso y medidas de entrenamiento.',
    });

    // Reset photo & notes
    setFormPhotoUri(null);
    setFormNotes('');
    await loadEntries();
    setActiveTab('GRAFICAS');
  };

  const handleDelete = async (id: string) => {
    await deleteProgressEntry(id);
    await loadEntries();
  };

  // Latest and delta calculation
  const latestEntry = entries.length > 0 ? entries[entries.length - 1] : null;
  const firstEntry = entries.length > 0 ? entries[0] : null;

  const weightDelta =
    latestEntry && firstEntry
      ? (latestEntry.weightKg - firstEntry.weightKg).toFixed(1)
      : '0.0';

  const waistDelta =
    latestEntry?.waistCm && firstEntry?.waistCm
      ? (latestEntry.waistCm - firstEntry.waistCm).toFixed(1)
      : '0.0';

  // Render SVG Chart based on selected metric
  const renderChart = () => {
    if (entries.length < 2) {
      return (
        <View style={styles.chartEmptyNotice}>
          <Text style={styles.chartEmptyText}>
            Registra al menos 2 entradas para visualizar la curva de evolución.
          </Text>
        </View>
      );
    }

    const svgWidth = 340;
    const svgHeight = 150;
    const paddingX = 35;
    const paddingTop = 25;
    const paddingBottom = 30;

    // Extract data values
    const values = entries.map((item) => {
      switch (selectedMetric) {
        case 'waist':
          return item.waistCm || 80;
        case 'chest':
          return item.chestCm || 100;
        case 'hips':
          return item.hipsCm || 95;
        case 'weight':
        default:
          return item.weightKg;
      }
    });

    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const valRange = maxVal - minVal === 0 ? 1 : maxVal - minVal;

    // Coordinate mapping
    const points = values.map((val, idx) => {
      const x = paddingX + (idx / (values.length - 1)) * (svgWidth - paddingX * 2);
      const y =
        paddingTop + (1 - (val - minVal) / valRange) * (svgHeight - paddingTop - paddingBottom);
      return { x, y, val, date: entries[idx].date };
    });

    // SVG Path Line
    const pathD = points.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');

    // Gradient fill path
    const fillD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingBottom} L ${
      points[0].x
    } ${svgHeight - paddingBottom} Z`;

    const getMetricColor = () => {
      switch (selectedMetric) {
        case 'waist':
          return Colors.cyan;
        case 'chest':
          return Colors.fire;
        case 'hips':
          return '#FFB800';
        case 'weight':
        default:
          return Colors.primary;
      }
    };

    const metricColor = getMetricColor();

    return (
      <View style={styles.chartContainer}>
        <Svg width={svgWidth} height={svgHeight}>
          <Defs>
            <LinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={metricColor} stopOpacity="0.35" />
              <Stop offset="1" stopColor={metricColor} stopOpacity="0.0" />
            </LinearGradient>
          </Defs>

          {/* Grid lines */}
          <Line
            x1={paddingX}
            y1={paddingTop}
            x2={svgWidth - paddingX}
            y2={paddingTop}
            stroke="#1F2633"
            strokeDasharray="4 4"
          />
          <Line
            x1={paddingX}
            y1={(paddingTop + (svgHeight - paddingBottom)) / 2}
            x2={svgWidth - paddingX}
            y2={(paddingTop + (svgHeight - paddingBottom)) / 2}
            stroke="#1F2633"
            strokeDasharray="4 4"
          />
          <Line
            x1={paddingX}
            y1={svgHeight - paddingBottom}
            x2={svgWidth - paddingX}
            y2={svgHeight - paddingBottom}
            stroke="#1F2633"
          />

          {/* Area Fill */}
          <Path d={fillD} fill="url(#chartGradient)" />

          {/* Line Path */}
          <Path d={pathD} fill="none" stroke={metricColor} strokeWidth={3} strokeLinecap="round" />

          {/* Data Points and Value Badges */}
          {points.map((pt, i) => (
            <G key={i}>
              <Circle cx={pt.x} cy={pt.y} r={6} fill={Colors.surface} stroke={metricColor} strokeWidth={3} />
              <SvgText
                x={pt.x}
                y={pt.y - 10}
                fill={Colors.textPrimary}
                fontSize={10}
                fontWeight="bold"
                textAnchor="middle"
              >
                {pt.val}
              </SvgText>
              {/* Date label at bottom */}
              <SvgText
                x={pt.x}
                y={svgHeight - 12}
                fill={Colors.textMuted}
                fontSize={9}
                textAnchor="middle"
              >
                {pt.date.split(' ').slice(0, 2).join(' ')}
              </SvgText>
            </G>
          ))}
        </Svg>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          {/* Top Bar */}
          <View style={styles.modalHeaderRow}>
            <View>
              <View style={styles.badgeRow}>
                <View style={styles.badgeProgress}>
                  <Scale size={11} color={Colors.primary} />
                  <Text style={styles.badgeProgressText}>EVOLUCIÓN CORPORAL</Text>
                </View>
              </View>
              <Text style={styles.modalTitle}>Progreso del Atleta</Text>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Sub Navigation Tabs */}
          <View style={styles.tabsRow}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'GRAFICAS' && styles.tabBtnActive]}
              onPress={() => setActiveTab('GRAFICAS')}
            >
              <Activity size={14} color={activeTab === 'GRAFICAS' ? Colors.primary : Colors.textMuted} />
              <Text style={[styles.tabText, activeTab === 'GRAFICAS' && styles.tabTextActive]}>
                Gráficas
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'REGISTRAR' && styles.tabBtnActive]}
              onPress={() => setActiveTab('REGISTRAR')}
            >
              <Plus size={14} color={activeTab === 'REGISTRAR' ? Colors.primary : Colors.textMuted} />
              <Text style={[styles.tabText, activeTab === 'REGISTRAR' && styles.tabTextActive]}>
                Nuevo Registro
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'FOTOS' && styles.tabBtnActive]}
              onPress={() => setActiveTab('FOTOS')}
            >
              <Camera size={14} color={activeTab === 'FOTOS' ? Colors.primary : Colors.textMuted} />
              <Text style={[styles.tabText, activeTab === 'FOTOS' && styles.tabTextActive]}>
                Fotos & Log ({entries.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Main Scroll Content */}
          <ScrollView
            style={styles.scrollArea}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* TAB 1: GRÁFICAS DE EVOLUCIÓN */}
            {activeTab === 'GRAFICAS' && (
              <View>
                {/* Metric Summary Cards */}
                <View style={styles.metricSummaryRow}>
                  <View style={styles.metricSummaryCard}>
                    <Text style={styles.metricCardLabel}>PESO ACTUAL</Text>
                    <Text style={styles.metricCardVal}>
                      {latestEntry ? `${latestEntry.weightKg} kg` : '-'}
                    </Text>
                    <View style={styles.deltaPill}>
                      {parseFloat(weightDelta) <= 0 ? (
                        <TrendingDown size={12} color={Colors.primary} />
                      ) : (
                        <TrendingUp size={12} color={Colors.orange} />
                      )}
                      <Text style={styles.deltaPillText}>{weightDelta} kg</Text>
                    </View>
                  </View>

                  <View style={styles.metricSummaryCard}>
                    <Text style={styles.metricCardLabel}>CINTURA</Text>
                    <Text style={[styles.metricCardVal, { color: Colors.cyan }]}>
                      {latestEntry?.waistCm ? `${latestEntry.waistCm} cm` : '-'}
                    </Text>
                    <View style={styles.deltaPill}>
                      <Text style={[styles.deltaPillText, { color: Colors.cyan }]}>
                        {waistDelta} cm
                      </Text>
                    </View>
                  </View>

                  <View style={styles.metricSummaryCard}>
                    <Text style={styles.metricCardLabel}>PECHO</Text>
                    <Text style={[styles.metricCardVal, { color: Colors.fire }]}>
                      {latestEntry?.chestCm ? `${latestEntry.chestCm} cm` : '-'}
                    </Text>
                    <View style={styles.deltaPill}>
                      <Text style={[styles.deltaPillText, { color: Colors.fire }]}>
                        {latestEntry?.chestCm && firstEntry?.chestCm
                          ? `${(latestEntry.chestCm - firstEntry.chestCm > 0 ? '+' : '')}${(
                              latestEntry.chestCm - firstEntry.chestCm
                            ).toFixed(1)} cm`
                          : '-'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Metric Selector Chips */}
                <View style={styles.metricChipsRow}>
                  {[
                    { id: 'weight', label: 'Peso Corporal (kg)', color: Colors.primary },
                    { id: 'waist', label: 'Cintura (cm)', color: Colors.cyan },
                    { id: 'chest', label: 'Pecho (cm)', color: Colors.fire },
                    { id: 'hips', label: 'Cadera (cm)', color: '#FFB800' },
                  ].map((m) => (
                    <TouchableOpacity
                      key={m.id}
                      style={[
                        styles.metricChip,
                        selectedMetric === m.id && styles.metricChipActive,
                        selectedMetric === m.id && { borderColor: m.color },
                      ]}
                      onPress={() => setSelectedMetric(m.id as MetricType)}
                    >
                      <Text
                        style={[
                          styles.metricChipText,
                          selectedMetric === m.id && { color: m.color, fontWeight: '800' },
                        ]}
                      >
                        {m.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* SVG Curve Chart */}
                {renderChart()}

                {/* Quick Registration Invitation Banner */}
                <TouchableOpacity
                  style={styles.addRecordBanner}
                  onPress={() => setActiveTab('REGISTRAR')}
                >
                  <View style={styles.addRecordBannerIcon}>
                    <Plus size={18} color={Colors.textInverse} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.addRecordBannerTitle}>Registrar Medición de Hoy</Text>
                    <Text style={styles.addRecordBannerSub}>
                      Actualiza tu peso, perímetros corporales y foto de progreso.
                    </Text>
                  </View>
                  <ChevronRight size={18} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            )}

            {/* TAB 2: REGISTRAR PESO, MEDIDAS Y FOTO */}
            {activeTab === 'REGISTRAR' && (
              <View style={styles.formContainer}>
                {/* Date Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>FECHA DEL REGISTRO</Text>
                  <View style={styles.inputWrapper}>
                    <Calendar size={16} color={Colors.primary} style={{ marginRight: 8 }} />
                    <TextInput
                      style={styles.textInput}
                      value={formDate}
                      onChangeText={setFormDate}
                      placeholder="Ej: 25 oct 2026"
                      placeholderTextColor={Colors.textMuted}
                    />
                  </View>
                </View>

                {/* Measurements Grid (Peso, Cintura, Pecho, Cadera) */}
                <View style={styles.measurementsGrid}>
                  <View style={styles.measureInputBox}>
                    <Text style={styles.measureLabel}>PESO (KG) *</Text>
                    <TextInput
                      style={styles.measureTextInput}
                      value={formWeight}
                      onChangeText={setFormWeight}
                      keyboardType="numeric"
                      placeholder="78.0"
                      placeholderTextColor={Colors.textMuted}
                    />
                  </View>

                  <View style={styles.measureInputBox}>
                    <Text style={styles.measureLabel}>CINTURA (CM)</Text>
                    <TextInput
                      style={styles.measureTextInput}
                      value={formWaist}
                      onChangeText={setFormWaist}
                      keyboardType="numeric"
                      placeholder="82.0"
                      placeholderTextColor={Colors.textMuted}
                    />
                  </View>

                  <View style={styles.measureInputBox}>
                    <Text style={styles.measureLabel}>PECHO (CM)</Text>
                    <TextInput
                      style={styles.measureTextInput}
                      value={formChest}
                      onChangeText={setFormChest}
                      keyboardType="numeric"
                      placeholder="104.0"
                      placeholderTextColor={Colors.textMuted}
                    />
                  </View>

                  <View style={styles.measureInputBox}>
                    <Text style={styles.measureLabel}>CADERA (CM)</Text>
                    <TextInput
                      style={styles.measureTextInput}
                      value={formHips}
                      onChangeText={setFormHips}
                      keyboardType="numeric"
                      placeholder="98.0"
                      placeholderTextColor={Colors.textMuted}
                    />
                  </View>
                </View>

                {/* Photo Pose Selector */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>POSE DE LA FOTO</Text>
                  <View style={styles.poseSelectorRow}>
                    {(['Frontal', 'Lateral', 'Espalda', 'General'] as const).map((pose) => (
                      <TouchableOpacity
                        key={pose}
                        style={[styles.poseChip, formPose === pose && styles.poseChipActive]}
                        onPress={() => setFormPose(pose)}
                      >
                        <Text
                          style={[
                            styles.poseChipText,
                            formPose === pose && styles.poseChipTextActive,
                          ]}
                        >
                          {pose}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Photo Upload Box */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>FOTO DE PROGRESO (LOCAL)</Text>

                  {/* Hidden web file input for real uploads */}
                  {Platform.OS === 'web' && (
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      accept="image/*"
                      onChange={handlePickImageWeb}
                    />
                  )}

                  {formPhotoUri ? (
                    <View style={styles.photoPreviewCard}>
                      <Image source={{ uri: formPhotoUri }} style={styles.photoPreviewImg} />
                      <View style={styles.photoPreviewOverlay}>
                        <TouchableOpacity
                          style={styles.removePhotoBtn}
                          onPress={() => setFormPhotoUri(null)}
                        >
                          <Trash2 size={16} color={Colors.fire} />
                          <Text style={styles.removePhotoText}>Eliminar foto</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.photoUploadTrigger}
                      onPress={triggerImageUpload}
                    >
                      <Camera size={26} color={Colors.primary} />
                      <Text style={styles.photoUploadTriggerText}>Subir Foto de Progreso</Text>
                      <Text style={styles.photoUploadTriggerSub}>
                        Se guarda en tu dispositivo de forma privada
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Notes Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>NOTAS / CONDICIONES</Text>
                  <TextInput
                    style={[styles.textInput, styles.textAreaInput]}
                    value={formNotes}
                    onChangeText={setFormNotes}
                    placeholder="Ej: En ayunas post-WOD, excelente definición abdominal..."
                    placeholderTextColor={Colors.textMuted}
                    multiline
                    numberOfLines={3}
                  />
                </View>

                {/* Save Button */}
                <TouchableOpacity style={styles.saveRecordBtn} onPress={handleSaveEntry}>
                  <Check size={18} color={Colors.textInverse} strokeWidth={3} />
                  <Text style={styles.saveRecordBtnText}>Guardar Registro de Progreso</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* TAB 3: GALERÍA DE FOTOS Y HISTORIAL DE REGISTROS */}
            {activeTab === 'FOTOS' && (
              <View>
                <Text style={styles.tabSectionTitle}>LÍNEA DE TIEMPO CORPORAL</Text>

                {entries.slice().reverse().map((item) => (
                  <View key={item.id} style={styles.historyLogCard}>
                    <View style={styles.logCardHeader}>
                      <View style={styles.logCardDateRow}>
                        <Calendar size={14} color={Colors.primary} />
                        <Text style={styles.logCardDate}>{item.date}</Text>
                        <View style={styles.poseBadge}>
                          <Text style={styles.poseBadgeText}>{item.photoPose || 'Frontal'}</Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={styles.deleteLogBtn}
                        onPress={() => handleDelete(item.id)}
                      >
                        <Trash2 size={14} color={Colors.textMuted} />
                      </TouchableOpacity>
                    </View>

                    {/* Measurements strip */}
                    <View style={styles.logMeasurementsStrip}>
                      <View style={styles.logMetricCol}>
                        <Text style={styles.logMetricLabel}>PESO</Text>
                        <Text style={styles.logMetricValue}>{item.weightKg} kg</Text>
                      </View>
                      <View style={styles.logMetricCol}>
                        <Text style={styles.logMetricLabel}>CINTURA</Text>
                        <Text style={[styles.logMetricValue, { color: Colors.cyan }]}>
                          {item.waistCm ? `${item.waistCm} cm` : '-'}
                        </Text>
                      </View>
                      <View style={styles.logMetricCol}>
                        <Text style={styles.logMetricLabel}>PECHO</Text>
                        <Text style={[styles.logMetricValue, { color: Colors.fire }]}>
                          {item.chestCm ? `${item.chestCm} cm` : '-'}
                        </Text>
                      </View>
                      <View style={styles.logMetricCol}>
                        <Text style={styles.logMetricLabel}>CADERA</Text>
                        <Text style={[styles.logMetricValue, { color: '#FFB800' }]}>
                          {item.hipsCm ? `${item.hipsCm} cm` : '-'}
                        </Text>
                      </View>
                    </View>

                    {/* Progress Photo or Silhouette placeholder */}
                    {item.photoUri ? (
                      <View style={styles.logPhotoBox}>
                        <Image source={{ uri: item.photoUri }} style={styles.logPhotoImg} />
                      </View>
                    ) : (
                      <View style={styles.logNoPhotoBox}>
                        <ImageIcon size={18} color={Colors.textMuted} />
                        <Text style={styles.logNoPhotoText}>
                          Sin foto registrada en este chequeo
                        </Text>
                      </View>
                    )}

                    {item.notes && (
                      <Text style={styles.logNotesText}>{item.notes}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            <View style={styles.bottomSpacer} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
    maxHeight: '92%',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  badgeProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
    gap: 4,
  },
  badgeProgressText: {
    color: Colors.primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  modalTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '900',
  },
  closeBtn: {
    backgroundColor: Colors.surfaceLight,
    padding: 6,
    borderRadius: 8,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 10,
    padding: 3,
    marginBottom: 14,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  tabBtnActive: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '900',
  },
  scrollArea: {
    marginBottom: 10,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  metricSummaryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  metricSummaryCard: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  metricCardLabel: {
    color: Colors.textMuted,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  metricCardVal: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 4,
  },
  deltaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  deltaPillText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '800',
  },
  metricChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  metricChip: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  metricChipActive: {
    backgroundColor: Colors.surfaceElevated,
  },
  metricChipText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  chartContainer: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    marginBottom: 14,
  },
  chartEmptyNotice: {
    backgroundColor: Colors.surfaceLight,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 14,
  },
  chartEmptyText: {
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },
  addRecordBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
    gap: 12,
  },
  addRecordBannerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addRecordBannerTitle: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  addRecordBannerSub: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  formContainer: {
    gap: 12,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 13,
  },
  textAreaInput: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 65,
    textAlignVertical: 'top',
  },
  measurementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  measureInputBox: {
    width: '48%',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  measureLabel: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
    marginBottom: 4,
  },
  measureTextInput: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  poseSelectorRow: {
    flexDirection: 'row',
    gap: 6,
  },
  poseChip: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  poseChipActive: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  poseChipText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  poseChipTextActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  photoUploadTrigger: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
    paddingVertical: 18,
    borderWidth: 1.5,
    borderColor: Colors.primaryBorder,
    borderStyle: 'dashed',
    alignItems: 'center',
    gap: 4,
  },
  photoUploadTriggerText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 4,
  },
  photoUploadTriggerSub: {
    color: Colors.textMuted,
    fontSize: 10,
  },
  photoPreviewCard: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceLight,
  },
  photoPreviewImg: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  photoPreviewOverlay: {
    padding: 8,
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
  },
  removePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  removePhotoText: {
    color: Colors.fire,
    fontSize: 12,
    fontWeight: '700',
  },
  saveRecordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginTop: 6,
  },
  saveRecordBtnText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: '900',
  },
  tabSectionTitle: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  historyLogCard: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  logCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logCardDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logCardDate: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
  poseBadge: {
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  poseBadgeText: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
  },
  deleteLogBtn: {
    padding: 4,
  },
  logMeasurementsStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  logMetricCol: {
    alignItems: 'center',
  },
  logMetricLabel: {
    color: Colors.textMuted,
    fontSize: 8,
    fontWeight: '700',
    marginBottom: 2,
  },
  logMetricValue: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
  logPhotoBox: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  logPhotoImg: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  logNoPhotoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    marginBottom: 4,
  },
  logNoPhotoText: {
    color: Colors.textMuted,
    fontSize: 10,
  },
  logNotesText: {
    color: Colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
  },
  bottomSpacer: {
    height: 20,
  },
});
