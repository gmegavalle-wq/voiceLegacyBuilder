import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SPACING } from '../constants';

export default function ScreenHeader({ title, subtitle, onBack }) {
  return (
    <View style={styles.container}>
      {onBack ? (
        <TouchableOpacity
          onPress={onBack}
          accessible={true}
          accessibilityLabel="Volver a la pantalla anterior"
          accessibilityRole="button"
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
      ) : null}
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.borde,
  },
  backText: {
    color: COLORS.texto,
    fontSize: 34,
    lineHeight: 38,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    color: COLORS.texto,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: COLORS.textoSecundario,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 4,
  },
});
