import React, { useRef, useCallback } from 'react';
import { View, PanResponder, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SvgXml } from 'react-native-svg';

export type Stroke = {
  path: string;
  color: string;
  width: number;
};

type Props = {
  strokes: Stroke[];
  onAddStroke: (stroke: Stroke) => void;
  color: string;
  brushSize: number;
  coloringPageSvg: string | null;
  canvasWidth: number;
  canvasHeight: number;
};

export default function DrawingCanvas({
  strokes,
  onAddStroke,
  color,
  brushSize,
  coloringPageSvg,
  canvasWidth,
  canvasHeight,
}: Props) {
  const currentPoints = useRef<{ x: number; y: number }[]>([]);
  const currentPathRef = useRef<string>('');

  const buildPath = (points: { x: number; y: number }[]): string => {
    if (points.length === 0) return '';
    if (points.length === 1) {
      const { x, y } = points[0];
      return `M ${x} ${y} L ${x + 0.1} ${y + 0.1}`;
    }
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const mx = (prev.x + curr.x) / 2;
      const my = (prev.y + curr.y) / 2;
      d += ` Q ${prev.x} ${prev.y} ${mx} ${my}`;
    }
    const last = points[points.length - 1];
    d += ` L ${last.x} ${last.y}`;
    return d;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        currentPoints.current = [{ x: locationX, y: locationY }];
        currentPathRef.current = buildPath(currentPoints.current);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        currentPoints.current.push({ x: locationX, y: locationY });
        currentPathRef.current = buildPath(currentPoints.current);
      },
      onPanResponderRelease: () => {
        if (currentPoints.current.length > 0 && currentPathRef.current) {
          onAddStroke({
            path: currentPathRef.current,
            color: currentColor.current,
            width: currentBrush.current,
          });
        }
        currentPoints.current = [];
        currentPathRef.current = '';
      },
    })
  ).current;

  // Refs to capture latest prop values inside PanResponder callbacks
  const currentColor = useRef(color);
  currentColor.current = color;
  const currentBrush = useRef(brushSize);
  currentBrush.current = brushSize;

  const coloringXml = coloringPageSvg
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="${canvasWidth}" height="${canvasWidth}">${coloringPageSvg}</svg>`
    : null;

  return (
    <View
      style={[styles.canvas, { width: canvasWidth, height: canvasHeight, backgroundColor: '#fff' }]}
      {...panResponder.panHandlers}
    >
      {/* Coloring page outline layer (on top so black lines always show) */}
      {coloringXml && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <SvgXml xml={coloringXml} width={canvasWidth} height={canvasHeight} />
        </View>
      )}

      {/* User drawing layer */}
      <Svg
        style={StyleSheet.absoluteFill}
        width={canvasWidth}
        height={canvasHeight}
        pointerEvents="none"
      >
        {strokes.map((stroke, i) => (
          <Path
            key={i}
            d={stroke.path}
            stroke={stroke.color}
            strokeWidth={stroke.width}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
});
