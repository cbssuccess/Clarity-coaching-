import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width: SCREEN_W } = Dimensions.get('window');
const GAME_W = SCREEN_W - 32;
const GAME_H = 110;
const GROUND = 14;          // px above bottom = ground level
const CHAR_SIZE = 34;
const OBS_SIZE = 30;
const CHAR_X = 52;
const GRAVITY = 2.8;
const JUMP_VEL = -20;
const OBS_SPEED = 5;
const TICK_MS = 32;

type GameState = {
  charY: number;
  velY: number;
  alive: boolean;
  obstacles: { id: number; x: number }[];
  score: number;
  frameCount: number;
  nextSpawn: number;
  started: boolean;
};

const freshState = (): GameState => ({
  charY: 0,
  velY: 0,
  alive: true,
  obstacles: [],
  score: 0,
  frameCount: 0,
  nextSpawn: 90,
  started: false,
});

export default function MiniGame() {
  const gs = useRef<GameState>(freshState());
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      const g = gs.current;
      if (!g.alive || !g.started) return;

      // gravity
      g.velY += GRAVITY;
      g.charY = Math.max(0, g.charY - g.velY);

      // move obstacles
      g.obstacles = g.obstacles
        .map((o) => ({ ...o, x: o.x - OBS_SPEED }))
        .filter((o) => o.x > -OBS_SIZE - 10);

      // spawn
      g.nextSpawn--;
      if (g.nextSpawn <= 0) {
        g.obstacles.push({ id: Date.now(), x: GAME_W + 10 });
        g.nextSpawn = 80 + Math.floor(Math.random() * 60);
        g.score++;
      }
      g.frameCount++;

      // collision
      for (const obs of g.obstacles) {
        const hitX =
          obs.x < CHAR_X + CHAR_SIZE - 8 && obs.x + OBS_SIZE > CHAR_X + 8;
        const hitY = g.charY < OBS_SIZE - 6;
        if (hitX && hitY) {
          g.alive = false;
          break;
        }
      }

      setTick((t) => t + 1);
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  const handleTap = useCallback(() => {
    const g = gs.current;
    if (!g.alive) {
      gs.current = freshState();
      gs.current.started = true;
    } else if (!g.started) {
      g.started = true;
    } else if (g.charY === 0) {
      g.velY = JUMP_VEL;
    }
    setTick((t) => t + 1);
  }, []);

  const g = gs.current;
  const charBottom = GROUND + g.charY;

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <View style={styles.container}>
        {/* Ground strip */}
        <View style={styles.ground} />

        {/* Clouds decoration */}
        <Text style={[styles.deco, { top: 8, left: '20%' }]}>☁️</Text>
        <Text style={[styles.deco, { top: 2, left: '60%' }]}>☁️</Text>

        {/* Character */}
        <Text
          style={[
            styles.char,
            { bottom: charBottom, left: CHAR_X },
            !g.alive && styles.dead,
          ]}
        >
          ⭐
        </Text>

        {/* Obstacles */}
        {g.obstacles.map((obs) => (
          <Text
            key={obs.id}
            style={[styles.obstacle, { left: obs.x, bottom: GROUND }]}
          >
            🍄
          </Text>
        ))}

        {/* Score */}
        <Text style={styles.score}>⭐ {g.score}</Text>

        {/* Prompts */}
        {!g.started && g.alive && (
          <View style={styles.overlay}>
            <Text style={styles.promptText}>Tap to play! 🎮</Text>
          </View>
        )}
        {!g.alive && (
          <View style={styles.overlay}>
            <Text style={styles.promptText}>
              Game over! Score: {g.score} · Tap to restart 🔄
            </Text>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    width: GAME_W,
    height: GAME_H,
    marginHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  ground: {
    position: 'absolute',
    bottom: GROUND,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#C8A8E9',
    borderRadius: 2,
  },
  deco: {
    position: 'absolute',
    fontSize: 22,
    opacity: 0.6,
  },
  char: {
    position: 'absolute',
    fontSize: CHAR_SIZE,
    lineHeight: CHAR_SIZE + 4,
  },
  dead: {
    opacity: 0.4,
    transform: [{ rotate: '90deg' }],
  },
  obstacle: {
    position: 'absolute',
    fontSize: OBS_SIZE,
    lineHeight: OBS_SIZE + 4,
  },
  score: {
    position: 'absolute',
    top: 6,
    right: 10,
    fontSize: 13,
    fontWeight: '800',
    color: '#9B59B6',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  promptText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7B3FA0',
    textAlign: 'center',
    paddingHorizontal: 12,
  },
});
