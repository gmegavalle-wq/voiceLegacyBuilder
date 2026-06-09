import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { COLORS } from '../constants';

const BARS = Array.from({ length: 18 }, (_, index) => index);

export default function RecordingWaveform({ active = false }) {
  const values = useRef(BARS.map(() => new Animated.Value(0.35))).current;

  useEffect(() => {
    const loops = values.map((value, index) => (
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: active ? 1 : 0.35,
            duration: 240 + index * 18,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0.35,
            duration: 260 + index * 12,
            useNativeDriver: true,
          }),
        ])
      )
    ));

    if (active) {
      loops.forEach((loop) => loop.start());
    }

    return () => loops.forEach((loop) => loop.stop());
  }, [active, values]);

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel={active ? 'Onda de audio animada mientras se graba' : 'Onda de audio en reposo'}
    >
      {values.map((value, index) => (
        <Animated.View
          key={index}
          style={[styles.bar, { transform: [{ scaleY: value }] }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 78,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  bar: {
    width: 7,
    height: 52,
    borderRadius: 4,
    backgroundColor: COLORS.acento,
    shadowColor: COLORS.acento,
    shadowOpacity: 0.4,
    shadowRadius: 7,
  },
});
