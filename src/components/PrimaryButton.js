import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING } from '../constants';

export default function PrimaryButton({
  label,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  variant = 'primary',
  disabled = false,
  loading = false,
}) {
  const [pressed, setPressed] = useState(false);
  const gradient = variant === 'secondary'
    ? [COLORS.panel, COLORS.fondo2]
    : [COLORS.acentoOscuro, COLORS.acentoSecundario];

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={disabled || loading}
      accessible={true}
      accessibilityLabel={accessibilityLabel || label}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      style={[styles.touchTarget, pressed && styles.pressed, disabled && styles.disabled]}
    >
      <LinearGradient colors={gradient} style={styles.gradient}>
        {loading ? <ActivityIndicator color={COLORS.texto} /> : <Text style={styles.text}>{label}</Text>}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchTarget: {
    minHeight: 52,
    minWidth: 44,
    borderRadius: 18,
    shadowColor: COLORS.acento,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  gradient: {
    minHeight: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borde,
  },
  text: {
    color: COLORS.texto,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
});
