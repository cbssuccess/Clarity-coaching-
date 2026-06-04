import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import DrawingScreen from './src/screens/DrawingScreen';
import ColoringPagesScreen from './src/screens/ColoringPagesScreen';

export type Screen = 'home' | 'draw' | 'coloring-pages' | 'coloring-draw';
export type ColoringPage = { id: string; name: string; svgData: string };

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedPage, setSelectedPage] = useState<ColoringPage | null>(null);

  const navigate = (s: Screen, page?: ColoringPage) => {
    setScreen(s);
    if (page) setSelectedPage(page);
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
          onSelect={(page) => navigate('coloring-draw', page)}
        />
      )}
      {screen === 'coloring-draw' && selectedPage && (
        <DrawingScreen
          onBack={() => navigate('coloring-pages')}
          coloringPage={selectedPage}
        />
      )}
    </>
  );
}
