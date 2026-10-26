import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Rect,
  Circle,
  Line,
  Defs,
  LinearGradient,
  Stop,
  G,
  Polyline,
} from 'react-native-svg';
import { Colors } from '../theme/colors';
import { MuscleGroup } from '../types';

interface ExerciseVisualGraphicProps {
  graphicType: string;
  muscleGroup: MuscleGroup;
  size?: 'compact' | 'full';
  exerciseName?: string;
}

export const ExerciseVisualGraphic: React.FC<ExerciseVisualGraphicProps> = ({
  graphicType,
  muscleGroup,
  size = 'compact',
  exerciseName,
}) => {
  const isFull = size === 'full';
  const width = isFull ? 360 : 72;
  const height = isFull ? 140 : 72;

  // Primary accent colors based on muscle groups
  const getGroupColor = (group: MuscleGroup) => {
    switch (group) {
      case 'Pecho':
        return Colors.fire; // Hot energetic red/orange for Chest
      case 'Espalda':
        return Colors.cyan; // Cyan for Back / V-Taper
      case 'Piernas':
        return Colors.primary; // Volt green for Power Legs
      case 'Hombros':
        return '#FFB800'; // Amber/Gold for Shoulders
      case 'Brazos':
        return '#9D4EDD'; // Purple / Violet for Arms
      case 'Core':
        return '#00F5D4'; // Bright mint for Core
      default:
        return Colors.primary;
    }
  };

  const accentColor = getGroupColor(muscleGroup);

  // Render graphic illustration based on graphicType
  const renderVisualContent = () => {
    switch (graphicType) {
      case 'bench_press':
      case 'incline_press':
        return (
          <G>
            {/* Flat / Incline Bench */}
            <Rect x={isFull ? 60 : 12} y={isFull ? 90 : 46} width={isFull ? 180 : 36} height={isFull ? 12 : 5} rx={3} fill="#242B35" />
            <Rect x={isFull ? 90 : 18} y={isFull ? 102 : 51} width={isFull ? 12 : 4} height={isFull ? 25 : 12} rx={2} fill="#181D24" />
            <Rect x={isFull ? 200 : 40} y={isFull ? 102 : 51} width={isFull ? 12 : 4} height={isFull ? 25 : 12} rx={2} fill="#181D24" />
            {/* Athlete Torso Silhouette */}
            <Path
              d={isFull ? 'M 90 88 Q 150 80 210 88' : 'M 18 45 Q 30 40 42 45'}
              stroke={accentColor}
              strokeWidth={isFull ? 5 : 3}
              strokeLinecap="round"
              fill="none"
            />
            {/* Barbell Path / Arrow */}
            <Line
              x1={isFull ? 150 : 30}
              y1={isFull ? 25 : 12}
              x2={isFull ? 150 : 30}
              y2={isFull ? 75 : 36}
              stroke={Colors.primary}
              strokeWidth={isFull ? 3 : 2}
              strokeDasharray={isFull ? '4 3' : '2 2'}
            />
            {/* Olympic Barbell */}
            <Line
              x1={isFull ? 70 : 14}
              y1={isFull ? 45 : 22}
              x2={isFull ? 230 : 46}
              y2={isFull ? 45 : 22}
              stroke="#E1E7EC"
              strokeWidth={isFull ? 4 : 2}
            />
            {/* Plates */}
            <Rect x={isFull ? 75 : 15} y={isFull ? 25 : 12} width={isFull ? 10 : 3} height={isFull ? 40 : 20} rx={2} fill={Colors.primary} />
            <Rect x={isFull ? 215 : 42} y={isFull ? 25 : 12} width={isFull ? 10 : 3} height={isFull ? 40 : 20} rx={2} fill={Colors.primary} />
            {/* Motion Arrow Tip */}
            <Polyline
              points={isFull ? '144,32 150,22 156,32' : '28,16 30,11 32,16'}
              fill="none"
              stroke={Colors.primary}
              strokeWidth={2}
            />
          </G>
        );

      case 'push_ups':
      case 'dips':
        return (
          <G>
            {/* Floor line */}
            <Line
              x1={isFull ? 50 : 10}
              y1={isFull ? 110 : 54}
              x2={isFull ? 250 : 50}
              y2={isFull ? 110 : 54}
              stroke="#2E3744"
              strokeWidth={isFull ? 4 : 2}
              strokeDasharray="6 4"
            />
            {/* Athlete Plank Line (Rigid Torso) */}
            <Line
              x1={isFull ? 80 : 16}
              y1={isFull ? 70 : 34}
              x2={isFull ? 220 : 44}
              y2={isFull ? 104 : 52}
              stroke={accentColor}
              strokeWidth={isFull ? 6 : 3}
              strokeLinecap="round"
            />
            {/* Head circle */}
            <Circle cx={isFull ? 70 : 14} cy={isFull ? 65 : 31} r={isFull ? 10 : 4} fill={accentColor} />
            {/* Push Direction Arrow (Vertical Push from Hands) */}
            <Line
              x1={isFull ? 100 : 20}
              y1={isFull ? 104 : 52}
              x2={isFull ? 100 : 20}
              y2={isFull ? 65 : 32}
              stroke={Colors.primary}
              strokeWidth={isFull ? 3 : 2}
            />
            <Polyline
              points={isFull ? '94,74 100,64 106,74' : '18,36 20,31 22,36'}
              fill="none"
              stroke={Colors.primary}
              strokeWidth={2}
            />
            {/* Chest Heat Glow Indicator */}
            <Circle cx={isFull ? 110 : 22} cy={isFull ? 76 : 38} r={isFull ? 12 : 5} fill={accentColor} opacity={0.35} />
          </G>
        );

      case 'deadlift':
      case 'romanian_deadlift':
        return (
          <G>
            {/* Ground line */}
            <Line x1={isFull ? 40 : 8} y1={isFull ? 115 : 56} x2={isFull ? 260 : 52} y2={isFull ? 115 : 56} stroke="#242B35" strokeWidth={isFull ? 4 : 2} />
            {/* Olympic Bumper Plate on Floor */}
            <Circle cx={isFull ? 80 : 16} cy={isFull ? 85 : 42} r={isFull ? 28 : 14} fill="#1E232B" stroke="#3A4452" strokeWidth={isFull ? 3 : 1.5} />
            <Circle cx={isFull ? 80 : 16} cy={isFull ? 85 : 42} r={isFull ? 8 : 4} fill={accentColor} />
            <Circle cx={isFull ? 220 : 44} cy={isFull ? 85 : 42} r={isFull ? 28 : 14} fill="#1E232B" stroke="#3A4452" strokeWidth={isFull ? 3 : 1.5} />
            <Circle cx={isFull ? 220 : 44} cy={isFull ? 85 : 42} r={isFull ? 8 : 4} fill={accentColor} />
            {/* Barbell Bar */}
            <Line x1={isFull ? 60 : 12} y1={isFull ? 85 : 42} x2={isFull ? 240 : 48} y2={isFull ? 85 : 42} stroke="#E1E7EC" strokeWidth={isFull ? 4 : 2} />
            {/* Vertical Kinetic Trajectory Vector */}
            <Line
              x1={isFull ? 150 : 30}
              y1={isFull ? 90 : 45}
              x2={isFull ? 150 : 30}
              y2={isFull ? 30 : 15}
              stroke={Colors.primary}
              strokeWidth={isFull ? 3 : 2}
              strokeDasharray={isFull ? '4 3' : '2 2'}
            />
            <Polyline
              points={isFull ? '143,38 150,28 157,38' : '27,19 30,14 33,19'}
              fill="none"
              stroke={Colors.primary}
              strokeWidth={2}
            />
            {/* Posterior Chain / Spine Arc */}
            <Path
              d={isFull ? 'M 130 95 Q 150 50 160 25' : 'M 26 47 Q 30 25 32 12'}
              stroke={accentColor}
              strokeWidth={isFull ? 4 : 2}
              strokeDasharray="4 2"
              fill="none"
            />
          </G>
        );

      case 'pull_ups':
      case 'chest_to_bar':
        return (
          <G>
            {/* Pull Up Rig / Horizontal Bar */}
            <Line x1={isFull ? 40 : 8} y1={isFull ? 25 : 12} x2={isFull ? 260 : 52} y2={isFull ? 25 : 12} stroke="#E1E7EC" strokeWidth={isFull ? 5 : 2.5} />
            {/* Rig Uprights */}
            <Line x1={isFull ? 50 : 10} y1={isFull ? 25 : 12} x2={isFull ? 50 : 10} y2={isFull ? 130 : 64} stroke="#242B35" strokeWidth={isFull ? 4 : 2} />
            <Line x1={isFull ? 250 : 50} y1={isFull ? 25 : 12} x2={isFull ? 250 : 50} y2={isFull ? 130 : 64} stroke="#242B35" strokeWidth={isFull ? 4 : 2} />
            {/* Athlete Hanging V-Shape Lat Silhouette */}
            <Path
              d={isFull ? 'M 110 30 L 150 70 L 190 30' : 'M 22 15 L 30 35 L 38 15'}
              stroke={accentColor}
              strokeWidth={isFull ? 5 : 2.5}
              strokeLinecap="round"
              fill="none"
            />
            {/* Pull Direction Kinetic Arrows */}
            <Line
              x1={isFull ? 150 : 30}
              y1={isFull ? 90 : 45}
              x2={isFull ? 150 : 30}
              y2={isFull ? 45 : 22}
              stroke={Colors.primary}
              strokeWidth={isFull ? 3 : 2}
            />
            <Polyline
              points={isFull ? '143,55 150,45 157,55' : '27,27 30,22 33,27'}
              fill="none"
              stroke={Colors.primary}
              strokeWidth={2}
            />
            <Circle cx={isFull ? 150 : 30} cy={isFull ? 40 : 20} r={isFull ? 8 : 4} fill={accentColor} />
          </G>
        );

      case 'back_squat':
      case 'front_squat':
        return (
          <G>
            {/* Floor line */}
            <Line x1={isFull ? 40 : 8} y1={isFull ? 120 : 60} x2={isFull ? 260 : 52} y2={isFull ? 120 : 60} stroke="#242B35" strokeWidth={isFull ? 4 : 2} />
            {/* Squat Depth Parallel Indicator (< 90°) */}
            <Line
              x1={isFull ? 100 : 20}
              y1={isFull ? 90 : 45}
              x2={isFull ? 200 : 40}
              y2={isFull ? 90 : 45}
              stroke={Colors.primary}
              strokeWidth={isFull ? 2 : 1}
              strokeDasharray="4 3"
            />
            {/* Biomechanical Leg Z-Angle (Femur & Tibia) */}
            <Polyline
              points={isFull ? '120,65 170,92 140,120' : '24,32 34,46 28,60'}
              fill="none"
              stroke={accentColor}
              strokeWidth={isFull ? 6 : 3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Barbell on Shoulders */}
            <Line x1={isFull ? 70 : 14} y1={isFull ? 55 : 27} x2={isFull ? 230 : 46} y2={isFull ? 55 : 27} stroke="#E1E7EC" strokeWidth={isFull ? 4 : 2} />
            <Rect x={isFull ? 75 : 15} y={isFull ? 35 : 17} width={isFull ? 10 : 3} height={isFull ? 40 : 20} rx={2} fill={Colors.primary} />
            <Rect x={isFull ? 215 : 42} y={isFull ? 35 : 17} width={isFull ? 10 : 3} height={isFull ? 40 : 20} rx={2} fill={Colors.primary} />
            {/* Explosive Leg Drive Upward Vector */}
            <Line
              x1={isFull ? 200 : 40}
              y1={isFull ? 95 : 47}
              x2={isFull ? 200 : 40}
              y2={isFull ? 55 : 27}
              stroke={Colors.primary}
              strokeWidth={isFull ? 3 : 1.5}
            />
            <Polyline
              points={isFull ? '195,65 200,55 205,65' : '38,32 40,27 42,32'}
              fill="none"
              stroke={Colors.primary}
              strokeWidth={2}
            />
          </G>
        );

      case 'overhead_press':
      case 'push_press':
      case 'hspu':
        return (
          <G>
            {/* Athlete Torso */}
            <Line x1={isFull ? 150 : 30} y1={isFull ? 70 : 35} x2={isFull ? 150 : 30} y2={isFull ? 120 : 60} stroke="#2E3744" strokeWidth={isFull ? 6 : 3} strokeLinecap="round" />
            {/* Shoulders Delta Wings */}
            <Line x1={isFull ? 115 : 23} y1={isFull ? 70 : 35} x2={isFull ? 185 : 37} y2={isFull ? 70 : 35} stroke={accentColor} strokeWidth={isFull ? 6 : 3} strokeLinecap="round" />
            <Circle cx={isFull ? 150 : 30} cy={isFull ? 55 : 27} r={isFull ? 9 : 4} fill={accentColor} />
            {/* Overhead Lockout Barbell */}
            <Line x1={isFull ? 70 : 14} y1={isFull ? 25 : 12} x2={isFull ? 230 : 46} y2={isFull ? 25 : 12} stroke="#E1E7EC" strokeWidth={isFull ? 4 : 2} />
            <Rect x={isFull ? 75 : 15} y={isFull ? 12 : 6} width={isFull ? 10 : 3} height={isFull ? 26 : 12} rx={2} fill={Colors.primary} />
            <Rect x={isFull ? 215 : 42} y={isFull ? 12 : 6} width={isFull ? 10 : 3} height={isFull ? 26 : 12} rx={2} fill={Colors.primary} />
            {/* Vertical Kinetic Thrust Vectors */}
            <Line x1={isFull ? 120 : 24} y1={isFull ? 65 : 32} x2={isFull ? 120 : 24} y2={isFull ? 30 : 15} stroke={Colors.primary} strokeWidth={isFull ? 2.5 : 1.5} />
            <Line x1={isFull ? 180 : 36} y1={isFull ? 65 : 32} x2={isFull ? 180 : 36} y2={isFull ? 30 : 15} stroke={Colors.primary} strokeWidth={isFull ? 2.5 : 1.5} />
            <Polyline points={isFull ? '115,38 120,28 125,38' : '22,19 24,14 26,19'} fill="none" stroke={Colors.primary} strokeWidth={2} />
            <Polyline points={isFull ? '175,38 180,28 185,38' : '34,19 36,14 38,19'} fill="none" stroke={Colors.primary} strokeWidth={2} />
          </G>
        );

      case 'bicep_curl':
      case 'skull_crushers':
      case 'hammer_curls':
      case 'triceps_pushdown':
        return (
          <G>
            {/* Upper Arm Bone Axis */}
            <Line x1={isFull ? 120 : 24} y1={isFull ? 40 : 20} x2={isFull ? 120 : 24} y2={isFull ? 90 : 45} stroke="#343E4D" strokeWidth={isFull ? 6 : 3} strokeLinecap="round" />
            {/* Forearm Curling Arc */}
            <Path
              d={isFull ? 'M 120 90 L 175 60' : 'M 24 45 L 35 30'}
              stroke={accentColor}
              strokeWidth={isFull ? 6 : 3}
              strokeLinecap="round"
            />
            {/* Bicep Muscle Peak Bulge */}
            <Circle cx={isFull ? 130 : 26} cy={isFull ? 65 : 32} r={isFull ? 14 : 7} fill={accentColor} opacity={0.65} />
            {/* Dumbbell / Weight Load in Hand */}
            <Circle cx={isFull ? 175 : 35} cy={isFull ? 60 : 30} r={isFull ? 10 : 5} fill="#E1E7EC" />
            {/* Flexion Kinetic Arc Arrow */}
            <Path
              d={isFull ? 'M 160 100 Q 185 85 178 50' : 'M 32 50 Q 37 42 35 25'}
              stroke={Colors.primary}
              strokeWidth={isFull ? 2.5 : 1.5}
              strokeDasharray="3 2"
              fill="none"
            />
          </G>
        );

      case 'toes_to_bar':
      case 'hollow_body':
      case 'ghd_situps':
      case 'plank':
      default:
        return (
          <G>
            {/* Core Center Axis & Lumbar Stabilization Curve */}
            <Path
              d={isFull ? 'M 80 100 Q 150 40 220 100' : 'M 16 50 Q 30 20 44 50'}
              stroke={accentColor}
              strokeWidth={isFull ? 6 : 3}
              strokeLinecap="round"
              fill="none"
            />
            {/* Anti-Extension Pillar Force Line */}
            <Line
              x1={isFull ? 70 : 14}
              y1={isFull ? 105 : 52}
              x2={isFull ? 230 : 46}
              y2={isFull ? 105 : 52}
              stroke="#2A3442"
              strokeWidth={isFull ? 3 : 1.5}
              strokeDasharray="4 3"
            />
            {/* Rectus Abdominis / Core Matrix Nodes */}
            <Circle cx={isFull ? 130 : 26} cy={isFull ? 65 : 32} r={isFull ? 8 : 4} fill={accentColor} />
            <Circle cx={isFull ? 150 : 30} cy={isFull ? 60 : 30} r={isFull ? 9 : 4.5} fill={Colors.primary} />
            <Circle cx={isFull ? 170 : 34} cy={isFull ? 65 : 32} r={isFull ? 8 : 4} fill={accentColor} />
            {/* Kinetic Tension Arrow */}
            <Line
              x1={isFull ? 150 : 30}
              y1={isFull ? 85 : 42}
              x2={isFull ? 150 : 30}
              y2={isFull ? 45 : 22}
              stroke={Colors.primary}
              strokeWidth={isFull ? 3 : 1.5}
            />
            <Polyline
              points={isFull ? '144,55 150,45 156,55' : '28,27 30,22 32,27'}
              fill="none"
              stroke={Colors.primary}
              strokeWidth={2}
            />
          </G>
        );
    }
  };

  return (
    <View style={[styles.container, isFull ? styles.containerFull : styles.containerCompact]}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <LinearGradient id={`bgGrad-${graphicType}-${size}`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#141922" stopOpacity="1" />
            <Stop offset="1" stopColor="#0B0D11" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Backdrop Card Box */}
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          rx={isFull ? 14 : 10}
          fill={`url(#bgGrad-${graphicType}-${size})`}
        />

        {/* Subtle Biomechanical Grid Lines (Full version) */}
        {isFull && (
          <G opacity={0.15}>
            <Line x1={0} y1={35} x2={width} y2={35} stroke="#E1E7EC" strokeWidth={1} strokeDasharray="3 3" />
            <Line x1={0} y1={70} x2={width} y2={70} stroke="#E1E7EC" strokeWidth={1} strokeDasharray="3 3" />
            <Line x1={0} y1={105} x2={width} y2={105} stroke="#E1E7EC" strokeWidth={1} strokeDasharray="3 3" />
            <Line x1={90} y1={0} x2={90} y2={height} stroke="#E1E7EC" strokeWidth={1} strokeDasharray="3 3" />
            <Line x1={180} y1={0} x2={180} y2={height} stroke="#E1E7EC" strokeWidth={1} strokeDasharray="3 3" />
            <Line x1={270} y1={0} x2={270} y2={height} stroke="#E1E7EC" strokeWidth={1} strokeDasharray="3 3" />
          </G>
        )}

        {/* Movement Graphic Content */}
        {renderVisualContent()}
      </Svg>

      {/* Full version HUD Badges Overlay */}
      {isFull && (
        <View style={styles.hudOverlay}>
          <View style={[styles.hudBadge, { borderColor: accentColor }]}>
            <View style={[styles.hudDot, { backgroundColor: accentColor }]} />
            <Text style={[styles.hudText, { color: accentColor }]}>
              {muscleGroup.toUpperCase()} • BIOMECÁNICA
            </Text>
          </View>
          <Text style={styles.hudKineticTag}>VECTOR CINÉTICO RX</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#222936',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  containerCompact: {
    width: 72,
    height: 72,
    backgroundColor: '#0F131A',
  },
  containerFull: {
    width: '100%',
    height: 140,
    backgroundColor: '#0F131A',
    marginBottom: 16,
  },
  hudOverlay: {
    position: 'absolute',
    top: 10,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  hudBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 13, 18, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    gap: 5,
  },
  hudDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  hudText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  hudKineticTag: {
    color: '#657385',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
