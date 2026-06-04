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
import { ColoringPage } from '../../App';
import { COLORING_PAGES } from '../data/coloringPages';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 48) / 2;

type Props = {
  onBack: () => void;
  onSelect: (page: ColoringPage) => void;
};

export default function ColoringPagesScreen({ onBack, onSelect }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Pick a Picture!</Text>
        <View style={{ width: 80 }} />
      </View>

      <FlatList
        data={COLORING_PAGES}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => onSelect({ id: item.id, name: item.name, svgData: item.svgData })}
            activeOpacity={0.8}
          >
            <Text style={styles.cardEmoji}>{item.emoji}</Text>
            <Text style={styles.cardName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFF9E6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#FFE0A0',
  },
  backBtn: {
    width: 80,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 17,
    color: '#FF6B35',
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FF6B35',
  },
  grid: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#FFE0A0',
  },
  cardEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});
