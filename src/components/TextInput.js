import React from 'react';
import { StyleSheet, Text, TextInput as NativeTextInput, View } from 'react-native';
import { COLORS, SPACING } from '../constants';

export default function TextInput({ label, value, onChangeText, placeholder }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <NativeTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textoMuted}
        multiline={true}
        textAlignVertical="top"
        accessible={true}
        accessibilityLabel={label}
        accessibilityHint="Escribe el texto que será sintetizado localmente"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },
  label: {
    color: COLORS.texto,
    fontSize: 16,
    fontWeight: '700',
  },
  input: {
    minHeight: 150,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.borde,
    backgroundColor: COLORS.panel,
    color: COLORS.texto,
    padding: SPACING.md,
    fontSize: 17,
    lineHeight: 24,
  },
});
