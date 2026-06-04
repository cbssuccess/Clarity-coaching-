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
    <LinearGradient colors={['#D6EEFF', '#FFD6EC', '#EDD5FF']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.back}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🖍️ Coloring Pages</Text>
          <View style={{ width: 72 }} />
        </View>

        <Text style={styles.hint}>Pick a picture and color it your way!</Text>

        <FlatList
          data={COLORING_PAGES}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                onSelect({ id: item.id, name: item.name, svgData: item.svgData })
              }
              activeOpacity={0.8}
            >
              <Text style={styles.cardEmoji}>{item.emoji}</Text>
              <Text style={styles.cardName}>{item.name}</Text>
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
    borderBottomColor: 'rgba(163,200,230,0.4)',
  },
  back: { width: 72 },
  backText: { fontSize: 16, color: '#3FA9D0', fontWeight: '700' },
  title: { fontSize: 20, fontWeight: '800', color: '#3FA9D0' },
  hint: {
    textAlign: 'center',
    fontSize: 13,
    color: '#3FA9D0',
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 4,
    paddingHorizontal: 24,
  },
  grid: { padding: 16 },
  row: { justifyContent: 'space-between', marginBottom: 16 },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3FA9D0',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'rgba(163,200,230,0.5)',
  },
  cardEmoji: { fontSize: 64, marginBottom: 8 },
  cardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2A7090',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});
