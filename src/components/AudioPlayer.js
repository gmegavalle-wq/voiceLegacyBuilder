import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Audio } from 'expo-av';
import { COLORS, SPACING } from '../constants';

export default function AudioPlayer({ uri, label = 'Audio guardado' }) {
  const [playing, setPlaying] = useState(false);

  const reproducir = async () => {
    if (!uri || playing) return;

    try {
      setPlaying(true);
      const { sound } = await Audio.Sound.createAsync({ uri });
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
          setPlaying(false);
        }
      });
      await sound.playAsync();
    } catch (error) {
      console.error('Error reproduciendo audio local:', error);
      setPlaying(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        onPress={reproducir}
        disabled={!uri || playing}
        accessible={true}
        accessibilityLabel={playing ? 'Reproduciendo audio' : 'Reproducir audio'}
        accessibilityRole="button"
        accessibilityState={{ disabled: !uri || playing }}
        style={[styles.button, (!uri || playing) && styles.disabled]}
      >
        <Text style={styles.buttonText}>{playing ? 'Reproduciendo' : 'Reproducir'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },
  label: {
    color: COLORS.textoSecundario,
    fontSize: 14,
  },
  button: {
    minHeight: 48,
    minWidth: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.borde,
  },
  buttonText: {
    color: COLORS.texto,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.55,
  },
});
