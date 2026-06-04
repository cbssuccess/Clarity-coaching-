import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import MiniGame from '../components/MiniGame';
import { Screen } from '../../App';

const { width: W, height: H } = Dimensions.get('window');

// Candy-Land-style winding board spaces
const BOARD_SPACES = [
  { cx: 40,  cy: H * 0.52, r: 18, color: '#FFB3C6' },
  { cx: 80,  cy: H * 0.48, r: 16, color: '#FFC8A0' },
  { cx: 120, cy: H * 0.47, r: 18, color: '#FFE999' },
  { cx: 160, cy: H * 0.48, r: 16, color: '#AFEEA0' },
  { cx: 200, cy: H * 0.47, r: 18, color: '#A0D8FF' },
  { cx: 240, cy: H * 0.48, r: 16, color: '#C9AAFF' },
  { cx: 268, cy: H * 0.52, r: 18, color: '#FFB3DE' },
  { cx: 255, cy: H * 0.58, r: 16, color: '#FFC8A0' },
  { cx: 235, cy: H * 0.63, r: 18, color: '#FFE999' },
  { cx: 210, cy: H * 0.66, r: 16, color: '#AFEEA0' },
  { cx: 185, cy: H * 0.65, r: 18, color: '#A0D8FF' },
  { cx: 160, cy: H * 0.63, r: 16, color: '#C9AAFF' },
  { cx: 135, cy: H * 0.65, r: 18, color: '#FFB3C6' },
  { cx: 110, cy: H * 0.66, r: 16, color: '#FFC8A0' },
  { cx: 85,  cy: H * 0.63, r: 18, color: '#FFE999' },
  { cx: 60,  cy: H * 0.58, r: 16, color: '#AFEEA0' },
  { cx: 44,  cy: H * 0.52, r: 14, color: '#A0D8FF' },
];

// Small floating decorations
const FLOATIES = [
  { emoji: '⭐', x: W * 0.08, y: H * 0.12, size: 22, delay: 0 },
  { emoji: '💜', x: W * 0.85, y: H * 0.14, size: 18, delay: 300 },
  { emoji: '✨', x: W * 0.15, y: H * 0.38, size: 16, delay: 500 },
  { emoji: '🌸', x: W * 0.78, y: H * 0.36, size: 20, delay: 200 },
  { emoji: '💙', x: W * 0.05, y: H * 0.68, size: 16, delay: 700 },
  { emoji: '🌟', x: W * 0.88, y: H * 0.70, size: 20, delay: 100 },
  { emoji: '🩷', x: W * 0.50, y: H * 0.44, size: 14, delay: 400 },
];

function FloatingDeco({
  emoji,
  x,
  y,
  size,
  delay,
}: {
  emoji: string;
  x: number;
  y: number;
  size: number;
  delay: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [anim, delay]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <Animated.Text
      style={{
        position: 'absolute',
        left: x,
        top: y,
        fontSize: size,
        transform: [{ translateY }],
        opacity: 0.85,
      }}
    >
      {emoji}
    </Animated.Text>
  );
}

type Props = { onNavigate: (screen: Screen) => void };

const BUTTONS = [
  {
    screen: 'draw' as Screen,
    emoji: '✏️',
    label: 'Free Draw',
    sub: 'Draw anything!',
    colors: ['#FF8DC7', '#FF5BA3'] as const,
  },
  {
    screen: 'coloring-pages' as Screen,
    emoji: '🖍️',
    label: 'Coloring Pages',
    sub: 'Color a fun picture!',
    colors: ['#7EC8E3', '#3FA9D0'] as const,
  },
  {
    screen: 'cbn-pages' as Screen,
    emoji: '🔢',
    label: 'Color by Number',
    sub: 'Follow the numbers!',
    colors: ['#C39BD3', '#9B59B6'] as const,
  },
];

export default function HomeScreen({ onNavigate }: Props) {
  return (
    <LinearGradient
      colors={['#EDD5FF', '#FFD6EC', '#D6EEFF', '#E0FFD6']}
      locations={[0, 0.35, 0.7, 1]}
      style={styles.fill}
    >
      <SafeAreaView style={styles.fill}>
        {/* Background gameboard SVG */}
        <Svg style={StyleSheet.absoluteFill} width={W} height={H} pointerEvents="none">
          {/* Winding path connecting spaces */}
          <Path
            d={`M 40 ${H * 0.52} Q 150 ${H * 0.42} 268 ${H * 0.52} Q 300 ${H * 0.62} 185 ${H * 0.65} Q 110 ${H * 0.68} 44 ${H * 0.63}`}
            stroke="rgba(200,160,230,0.35)"
            strokeWidth={28}
            strokeLinecap="round"
            fill="none"
          />
          {BOARD_SPACES.map((s, i) => (
            <Circle
              key={i}
              cx={s.cx}
              cy={s.cy}
              r={s.r}
              fill={s.color}
              opacity={0.75}
            />
          ))}
        </Svg>

        {/* Floating decorations */}
        {FLOATIES.map((f) => (
          <FloatingDeco key={f.emoji + f.x} {...f} />
        ))}

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <View style={styles.titleRow}>
            <Text style={styles.titleEmoji}>🎨</Text>
            <Text style={styles.title}>Doodle Kids</Text>
          </View>
          <Text style={styles.subtitle}>What do you want to make today?</Text>

          {/* Mini game */}
          <View style={styles.gameBox}>
            <Text style={styles.gameLabel}>⭐ Jump Game</Text>
            <MiniGame />
          </View>

          {/* Mode buttons */}
          <View style={styles.buttonsArea}>
            {BUTTONS.map((btn) => (
              <TouchableOpacity
                key={btn.screen}
                onPress={() => onNavigate(btn.screen)}
                activeOpacity={0.82}
                style={styles.btnOuter}
              >
                <LinearGradient
                  colors={btn.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.btn}
                >
                  {/* Game-board-style space circle on the left */}
                  <View style={styles.btnCircle}>
                    <Text style={styles.btnEmoji}>{btn.emoji}</Text>
                  </View>
                  <View style={styles.btnText}>
                    <Text style={styles.btnLabel}>{btn.label}</Text>
                    <Text style={styles.btnSub}>{btn.sub}</Text>
                  </View>
                  <Text style={styles.btnArrow}>›</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scroll: {
    paddingBottom: 32,
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 2,
  },
  titleEmoji: { fontSize: 40, marginRight: 8 },
  title: {
    fontSize: 38,
    fontWeight: '900',
    color: '#7B3FA0',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
    color: '#B06FC4',
    marginBottom: 14,
    fontWeight: '600',
  },
  gameBox: {
    width: W - 32,
    marginBottom: 18,
  },
  gameLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#9B59B6',
    marginBottom: 6,
    paddingLeft: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  buttonsArea: {
    width: W - 32,
    gap: 14,
  },
  btnOuter: {
    borderRadius: 22,
    shadowColor: '#7B3FA0',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 7,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  btnCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  btnEmoji: { fontSize: 30 },
  btnText: { flex: 1 },
  btnLabel: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 2,
  },
  btnSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.88)',
    fontWeight: '500',
  },
  btnArrow: {
    fontSize: 28,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '300',
    marginLeft: 8,
  },
});
