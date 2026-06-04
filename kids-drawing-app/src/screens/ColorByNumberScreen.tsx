import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Rect, Path, Polygon, Ellipse, Text as SvgText } from 'react-native-svg';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import { CBNPage, CBNRegion } from '../../App';

const { width: W } = Dimensions.get('window');
const CANVAS_SIZE = W - 32;
const SCALE = CANVAS_SIZE / 300;

type Props = { onBack: () => void; page: CBNPage };

function renderRegion(
  region: CBNRegion,
  fill: string,
  onPress: () => void
) {
  const { shape, props, labelX, labelY, colorNumber } = region;
  const label = String(colorNumber);
  const labelFontSize = Math.max(10, Math.min(14, 12));
  const labelColor = fill === '#FFFFFF' || fill === 'white' ? '#555' : '#fff';

  const sharedPress = { onPress };

  switch (shape) {
    case 'circle':
      return (
        <React.Fragment key={region.id}>
          <Circle {...props} fill={fill} stroke="#333" strokeWidth={1.5} {...sharedPress} />
          <SvgText
            x={labelX}
            y={labelY + 4}
            textAnchor="middle"
            fontSize={labelFontSize}
            fontWeight="bold"
            fill={labelColor}
            pointerEvents="none"
          >
            {label}
          </SvgText>
        </React.Fragment>
      );
    case 'rect':
      return (
        <React.Fragment key={region.id}>
          <Rect {...props} fill={fill} stroke="#333" strokeWidth={1.5} {...sharedPress} />
          <SvgText
            x={labelX}
            y={labelY + 4}
            textAnchor="middle"
            fontSize={labelFontSize}
            fontWeight="bold"
            fill={labelColor}
            pointerEvents="none"
          >
            {label}
          </SvgText>
        </React.Fragment>
      );
    case 'polygon':
      return (
        <React.Fragment key={region.id}>
          <Polygon {...props} fill={fill} stroke="#333" strokeWidth={1.5} {...sharedPress} />
          <SvgText
            x={labelX}
            y={labelY + 4}
            textAnchor="middle"
            fontSize={labelFontSize}
            fontWeight="bold"
            fill={labelColor}
            pointerEvents="none"
          >
            {label}
          </SvgText>
        </React.Fragment>
      );
    case 'ellipse':
      return (
        <React.Fragment key={region.id}>
          <Ellipse {...props} fill={fill} stroke="#333" strokeWidth={1.5} {...sharedPress} />
          <SvgText
            x={labelX}
            y={labelY + 4}
            textAnchor="middle"
            fontSize={labelFontSize}
            fontWeight="bold"
            fill={labelColor}
            pointerEvents="none"
          >
            {label}
          </SvgText>
        </React.Fragment>
      );
    case 'path':
    default:
      return (
        <React.Fragment key={region.id}>
          <Path {...props} fill={fill} stroke="#333" strokeWidth={1.5} {...sharedPress} />
          <SvgText
            x={labelX}
            y={labelY + 4}
            textAnchor="middle"
            fontSize={labelFontSize}
            fontWeight="bold"
            fill={labelColor}
            pointerEvents="none"
          >
            {label}
          </SvgText>
        </React.Fragment>
      );
  }
}

export default function ColorByNumberScreen({ onBack, page }: Props) {
  const [filled, setFilled] = useState<Record<number, string>>({});
  const [selectedNum, setSelectedNum] = useState<number | null>(null);
  const canvasRef = useRef<View>(null);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const allFilled = page.regions.every((r) => filled[r.id]);

  const handleRegionPress = useCallback(
    (region: CBNRegion) => {
      if (selectedNum === null) {
        Alert.alert('Pick a color!', 'Tap a number from the color key below first.');
        return;
      }
      setFilled((prev) => ({
        ...prev,
        [region.id]: page.colorMap[selectedNum],
      }));
    },
    [selectedNum, page.colorMap]
  );

  const save = async () => {
    if (!permissionResponse?.granted) {
      const { granted } = await requestPermission();
      if (!granted) return;
    }
    try {
      const uri = await captureRef(canvasRef, { format: 'png', quality: 1 });
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('🎉 Saved!', 'Your masterpiece was saved to your photos!');
    } catch {
      Alert.alert('Oops!', 'Could not save. Please try again.');
    }
  };

  const reset = () => {
    Alert.alert('Start over?', 'This will clear all your colors.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => setFilled({}) },
    ]);
  };

  return (
    <LinearGradient colors={['#EDD5FF', '#FFD6EC', '#D6EEFF']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.back}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1}>
            {page.name}
          </Text>
          <TouchableOpacity onPress={save}>
            <Text style={styles.saveText}>💾 Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Canvas */}
          <View ref={canvasRef} collapsable={false} style={styles.canvasWrap}>
            <Svg
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              viewBox="0 0 300 300"
            >
              {/* White background */}
              <Rect x={0} y={0} width={300} height={300} fill="white" />
              {page.regions.map((region) =>
                renderRegion(
                  region,
                  filled[region.id] ?? 'white',
                  () => handleRegionPress(region)
                )
              )}
            </Svg>
            {allFilled && (
              <View style={styles.celebrationBanner}>
                <Text style={styles.celebrationText}>🎉 Amazing! You did it! 🎉</Text>
              </View>
            )}
          </View>

          {/* Selected color indicator */}
          <View style={styles.selectedRow}>
            {selectedNum !== null ? (
              <>
                <View
                  style={[
                    styles.selectedSwatch,
                    { backgroundColor: page.colorMap[selectedNum] },
                  ]}
                />
                <Text style={styles.selectedLabel}>
                  Color {selectedNum} selected — tap a region!
                </Text>
              </>
            ) : (
              <Text style={styles.selectedLabel}>
                👇 Tap a number below to pick a color
              </Text>
            )}
          </View>

          {/* Color key palette */}
          <View style={styles.paletteWrap}>
            <Text style={styles.paletteTitle}>Color Key</Text>
            <View style={styles.palette}>
              {Object.entries(page.colorMap).map(([numStr, color]) => {
                const num = Number(numStr);
                const active = selectedNum === num;
                return (
                  <TouchableOpacity
                    key={num}
                    onPress={() => setSelectedNum(num)}
                    style={[styles.keyItem, active && styles.keyItemActive]}
                    activeOpacity={0.75}
                  >
                    <View
                      style={[
                        styles.keySwatch,
                        { backgroundColor: color },
                        color === '#FFFFFF' && { borderColor: '#999' },
                      ]}
                    />
                    <Text style={[styles.keyNum, active && { color: '#7B3FA0' }]}>
                      {num}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Reset button */}
          <TouchableOpacity onPress={reset} style={styles.resetBtn}>
            <Text style={styles.resetText}>🗑️ Start Over</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(200,160,230,0.3)',
  },
  back: { width: 72 },
  backText: { fontSize: 16, color: '#7B3FA0', fontWeight: '700' },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    color: '#5A3070',
  },
  saveText: { fontSize: 15, color: '#9B59B6', fontWeight: '700', width: 72, textAlign: 'right' },
  scroll: { alignItems: 'center', paddingBottom: 32 },
  canvasWrap: {
    marginTop: 12,
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#9B59B6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },
  celebrationBanner: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,240,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  celebrationText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#7B3FA0',
    textAlign: 'center',
  },
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 16,
    height: 36,
  },
  selectedSwatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#7B3FA0',
  },
  selectedLabel: {
    fontSize: 14,
    color: '#7B3FA0',
    fontWeight: '600',
  },
  paletteWrap: {
    width: W - 32,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
  },
  paletteTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#9B59B6',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  palette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  keyItem: {
    alignItems: 'center',
    padding: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    width: 50,
  },
  keyItemActive: {
    borderColor: '#9B59B6',
    backgroundColor: 'rgba(155,89,182,0.1)',
  },
  keySwatch: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: '#ddd',
    marginBottom: 4,
  },
  keyNum: {
    fontSize: 13,
    fontWeight: '800',
    color: '#555',
  },
  resetBtn: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(155,89,182,0.3)',
  },
  resetText: {
    fontSize: 15,
    color: '#9B59B6',
    fontWeight: '700',
  },
});
