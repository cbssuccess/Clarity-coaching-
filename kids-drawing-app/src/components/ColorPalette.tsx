import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export const COLORS = [
  '#FF0000', '#FF4500', '#FF6B35', '#FF9500',
  '#FFD700', '#90EE90', '#00C853', '#00BCD4',
  '#2196F3', '#3F51B5', '#9C27B0', '#E91E63',
  '#FF69B4', '#A0522D', '#808080', '#000000',
  '#FFFFFF', '#FFB6C1', '#87CEEB', '#98FB98',
];

type Props = {
  selectedColor: string;
  onSelectColor: (color: string) => void;
};

export default function ColorPalette({ selectedColor, onSelectColor }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {COLORS.map((color) => (
        <TouchableOpacity
          key={color}
          style={[
            styles.swatch,
            { backgroundColor: color },
            selectedColor === color && styles.selected,
            color === '#FFFFFF' && styles.whiteBorder,
          ]}
          onPress={() => onSelectColor(color)}
          activeOpacity={0.7}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    gap: 8,
  },
  swatch: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: '#333',
    borderWidth: 3,
    transform: [{ scale: 1.2 }],
  },
  whiteBorder: {
    borderColor: '#ddd',
    borderWidth: 2,
  },
});
