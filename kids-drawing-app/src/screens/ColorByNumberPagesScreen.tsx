import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CBNPage } from '../../App';
import { CBN_PAGES } from '../data/colorByNumberPages';

const { width } = Dimensions.get('window');
const CARD = (width - 48) / 2;

type Props = {
  onBack: () => void;
  onSelect: (page: CBNPage) => void;
};

export default function ColorByNumberPagesScreen({ onBack, onSelect }: Props) {
  return (
    <LinearGradient colors={['#EDD5FF', '#FFD6EC', '#D6EEFF']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.back}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🔢 Color by Number</Text>
          <View style={{ width: 72 }} />
        </View>

        <Text style={styles.hint}>
          Pick a picture, then follow the number key!
        </Text>

        <FlatList
          data={CBN_PAGES}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => onSelect(item)}
              activeOpacity={0.8}
            >
              <Text style={styles.cardEmoji}>{item.emoji}</Text>
              <Text style={styles.cardName}>{item.name}</Text>
              <View style={styles.numbersRow}>
                {Object.entries(item.colorMap)
                  .slice(0, 6)
                  .map(([num, color]) => (
                    <View
                      key={num}
                      style={[styles.dot, { backgroundColor: color, borderColor: '#aaa' }]}
                    />
                  ))}
              </View>
            </TouchableOpacity>
          )}
        />
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
  title: { fontSize: 20, fontWeight: '800', color: '#7B3FA0' },
  hint: {
    textAlign: 'center',
    fontSize: 13,
    color: '#9B59B6',
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 4,
    paddingHorizontal: 24,
  },
  grid: { padding: 16 },
  row: { justifyContent: 'space-between', marginBottom: 16 },
  card: {
    width: CARD,
    height: CARD + 20,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#9B59B6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'rgba(200,160,230,0.5)',
    paddingVertical: 12,
  },
  cardEmoji: { fontSize: 60, marginBottom: 8 },
  cardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5A3070',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 6,
  },
  numbersRow: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
  },
});
