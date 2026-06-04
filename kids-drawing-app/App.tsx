import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import DrawingScreen from './src/screens/DrawingScreen';
import ColoringPagesScreen from './src/screens/ColoringPagesScreen';
import ColorByNumberPagesScreen from './src/screens/ColorByNumberPagesScreen';
import ColorByNumberScreen from './src/screens/ColorByNumberScreen';

export type Screen =
  | 'home'
  | 'draw'
  | 'coloring-pages'
  | 'coloring-draw'
  | 'cbn-pages'
  | 'cbn-draw';

export type ColoringPage = { id: string; name: string; svgData: string };
export type CBNPage = {
  id: string;
  name: string;
  emoji: string;
  colorMap: Record<number, string>;
  regions: CBNRegion[];
};
export type CBNRegion = {
  id: number;
  colorNumber: number;
  shape: 'path' | 'circle' | 'rect' | 'polygon' | 'ellipse';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>;
  labelX: number;
  labelY: number;
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [coloringPage, setColoringPage] = useState<ColoringPage | null>(null);
  const [cbnPage, setCbnPage] = useState<CBNPage | null>(null);

  const navigate = (s: Screen, page?: ColoringPage | CBNPage) => {
    setScreen(s);
    if (s === 'coloring-draw') setColoringPage(page as ColoringPage);
    if (s === 'cbn-draw') setCbnPage(page as CBNPage);
  };

  return (
    <>
      <StatusBar style="dark" />
      {screen === 'home' && <HomeScreen onNavigate={navigate} />}
      {screen === 'draw' && (
        <DrawingScreen onBack={() => navigate('home')} coloringPage={null} />
      )}
      {screen === 'coloring-pages' && (
        <ColoringPagesScreen
          onBack={() => navigate('home')}
          onSelect={(p) => navigate('coloring-draw', p)}
        />
      )}
      {screen === 'coloring-draw' && coloringPage && (
        <DrawingScreen
          onBack={() => navigate('coloring-pages')}
          coloringPage={coloringPage}
        />
      )}
      {screen === 'cbn-pages' && (
        <ColorByNumberPagesScreen
          onBack={() => navigate('home')}
          onSelect={(p) => navigate('cbn-draw', p)}
        />
      )}
      {screen === 'cbn-draw' && cbnPage && (
        <ColorByNumberScreen
          onBack={() => navigate('cbn-pages')}
          page={cbnPage}
        />
      )}
    </>
  );
}
