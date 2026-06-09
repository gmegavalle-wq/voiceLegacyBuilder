import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from './src/constants/colors';
import HomeScreen from './src/screens/HomeScreen';
import EnrollmentScreen from './src/screens/EnrollmentScreen';
import SynthesisScreen from './src/screens/SynthesisScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const SCREENS = {
  home: HomeScreen,
  enrollment: EnrollmentScreen,
  synthesis: SynthesisScreen,
  settings: SettingsScreen,
};

export default function App() {
  const [screen, setScreen] = useState('home');
  const ActiveScreen = SCREENS[screen];

  return (
    <LinearGradient colors={[COLORS.fondo, COLORS.fondo2]} style={styles.root}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <ActiveScreen navigate={setScreen} />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
