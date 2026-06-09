import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING } from '../constants';

export default function VoiceVisualizer({ progress = 0, label }) {
  const normalized = Math.max(0, Math.min(100, progress));

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel={`${label}. Progreso ${Math.round(normalized)} por ciento`}
    >
      <View style={styles.ring}>
        <Text style={styles.percent}>{Math.round(normalized)}%</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${normalized}%` }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    borderRadius: 18,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.borde,
  },
  ring: {
    width: 66,
    height: 66,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.fondo,
    borderWidth: 1,
    borderColor: COLORS.acento,
  },
  percent: {
    color: COLORS.texto,
    fontWeight: '800',
    fontSize: 18,
  },
  info: {
    flex: 1,
  },
  label: {
    color: COLORS.texto,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  track: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: COLORS.fondo,
  },
  fill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: COLORS.exito,
  },
});
