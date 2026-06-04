import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import DrawingCanvas, { Stroke } from '../components/DrawingCanvas';
import ColorPalette from '../components/ColorPalette';
import { ColoringPage } from '../../App';

const { width, height } = Dimensions.get('window');
const TOOLBAR_H = 52;
const PALETTE_H = 64;
const HEADER_H = 56;
const CANVAS_W = width - 16;
const CANVAS_H = height - HEADER_H - TOOLBAR_H - PALETTE_H - 80;

const BRUSH_SIZES = [
  { label: '·', size: 4 },
  { label: '—', size: 10 },
  { label: '▬', size: 22 },
];

type Props = {
  onBack: () => void;
  coloringPage: ColoringPage | null;
};

export default function DrawingScreen({ onBack, coloringPage }: Props) {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [color, setColor] = useState('#FF0000');
  const [brushSize, setBrushSize] = useState(10);
  const [isEraser, setIsEraser] = useState(false);
  const canvasRef = useRef<View>(null);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const addStroke = useCallback((stroke: Stroke) => {
    setStrokes((prev) => [...prev, stroke]);
  }, []);

  const undo = () => setStrokes((prev) => prev.slice(0, -1));
  const clear = () => {
    Alert.alert('Clear drawing?', 'This will erase everything!', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => setStrokes([]) },
    ]);
  };

  const save = async () => {
    if (!permissionResponse?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert('Permission needed', 'Please allow access to save your drawing.');
        return;
      }
    }
    try {
      const uri = await captureRef(canvasRef, { format: 'png', quality: 1 });
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('🎉 Saved!', 'Your drawing was saved to your photos!');
    } catch {
      Alert.alert('Oops!', 'Could not save the drawing. Please try again.');
    }
  };

  const activeColor = isEraser ? '#FFFFFF' : color;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {coloringPage ? coloringPage.name : 'Free Draw'}
        </Text>
        <TouchableOpacity onPress={save} style={styles.saveBtn}>
          <Text style={styles.saveText}>💾 Save</Text>
        </TouchableOpacity>
      </View>

      {/* Canvas */}
      <View style={styles.canvasWrapper}>
        <View ref={canvasRef} collapsable={false}>
          <DrawingCanvas
            strokes={strokes}
            onAddStroke={addStroke}
            color={activeColor}
            brushSize={brushSize}
            coloringPageSvg={coloringPage?.svgData ?? null}
            canvasWidth={CANVAS_W}
            canvasHeight={CANVAS_H}
          />
        </View>
      </View>

      {/* Color Palette */}
      <View style={styles.paletteRow}>
        <ColorPalette
          selectedColor={isEraser ? '' : color}
          onSelectColor={(c) => { setColor(c); setIsEraser(false); }}
        />
      </View>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        {/* Brush sizes */}
        <View style={styles.brushRow}>
          {BRUSH_SIZES.map((b) => (
            <TouchableOpacity
              key={b.size}
              style={[styles.brushBtn, brushSize === b.size && !isEraser && styles.brushActive]}
              onPress={() => { setBrushSize(b.size); setIsEraser(false); }}
            >
              <Text style={[styles.brushLabel, { fontSize: b.size === 4 ? 18 : b.size === 10 ? 22 : 26 }]}>
                {b.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.toolDivider} />

        {/* Eraser */}
        <TouchableOpacity
          style={[styles.toolBtn, isEraser && styles.toolActive]}
          onPress={() => setIsEraser((e) => !e)}
        >
          <Text style={styles.toolEmoji}>🧽</Text>
        </TouchableOpacity>

        {/* Undo */}
        <TouchableOpacity
          style={[styles.toolBtn, strokes.length === 0 && styles.toolDisabled]}
          onPress={undo}
          disabled={strokes.length === 0}
        >
          <Text style={styles.toolEmoji}>↩️</Text>
        </TouchableOpacity>

        {/* Clear */}
        <TouchableOpacity style={styles.toolBtn} onPress={clear}>
          <Text style={styles.toolEmoji}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  header: {
    height: HEADER_H,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: '#FFF9E6',
    borderBottomWidth: 2,
    borderBottomColor: '#FFE0A0',
  },
  backBtn: {
    width: 72,
    paddingVertical: 6,
  },
  backText: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  saveBtn: {
    width: 72,
    alignItems: 'flex-end',
  },
  saveText: {
    fontSize: 15,
    color: '#4ECDC4',
    fontWeight: '700',
  },
  canvasWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#E8E8E8',
  },
  paletteRow: {
    height: PALETTE_H,
    backgroundColor: '#FFF9E6',
    borderTopWidth: 1,
    borderTopColor: '#FFE0A0',
    justifyContent: 'center',
  },
  toolbar: {
    height: TOOLBAR_H,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderTopWidth: 2,
    borderTopColor: '#EEE',
    paddingHorizontal: 8,
  },
  brushRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  brushBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  brushActive: {
    backgroundColor: '#FFE0A0',
  },
  brushLabel: {
    color: '#333',
    fontWeight: '900',
  },
  toolDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#EEE',
    marginHorizontal: 8,
  },
  toolBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  toolActive: {
    backgroundColor: '#FFE0A0',
  },
  toolDisabled: {
    opacity: 0.3,
  },
  toolEmoji: {
    fontSize: 22,
  },
});
