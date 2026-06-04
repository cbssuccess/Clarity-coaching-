import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Screen } from '../../App';

const { width } = Dimensions.get('window');

type Props = {
  onNavigate: (screen: Screen) => void;
};

export default function HomeScreen({ onNavigate }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.emoji}>🎨</Text>
        <Text style={styles.title}>Doodle Kids</Text>
        <Text style={styles.subtitle}>Let's make something beautiful!</Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FF6B9D' }]}
          onPress={() => onNavigate('draw')}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonEmoji}>✏️</Text>
          <Text style={styles.buttonText}>Free Draw</Text>
          <Text style={styles.buttonSub}>Draw anything you want!</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#4ECDC4' }]}
          onPress={() => onNavigate('coloring-pages')}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonEmoji}>🖍️</Text>
          <Text style={styles.buttonText}>Coloring Pages</Text>
          <Text style={styles.buttonSub}>Color a fun picture!</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFF9E6',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 8,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FF6B35',
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 48,
    textAlign: 'center',
  },
  button: {
    width: width - 48,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  buttonSub: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
});
