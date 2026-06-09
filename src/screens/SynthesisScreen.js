import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import AudioPlayer from '../components/AudioPlayer';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import TextInput from '../components/TextInput';
import VoiceVisualizer from '../components/VoiceVisualizer';
import { COLORS, SPACING } from '../constants';
import useSynthesis from '../hooks/useSynthesis';
import { isTextReady } from '../utils/validation';

export default function SynthesisScreen({ navigate }) {
  const [text, setText] = useState('Hola, soy yo. Esta voz fue procesada localmente.');
  const { progress, processing, result, synthesize } = useSynthesis();

  const handleSynthesize = async () => {
    const trimmedText = text.trim();

    if (!trimmedText || trimmedText.length < 2) {
      Alert.alert('Texto muy corto', 'Escribe al menos 2 caracteres');
      return;
    }

    if (trimmedText.length > 500) {
      Alert.alert('Texto muy largo', 'Máximo 500 caracteres');
      return;
    }

    const response = await synthesize(trimmedText);
    if (response.error) Alert.alert('Entrenamiento requerido', response.error);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ScreenHeader
        title="Sintetizar voz"
        subtitle="Genera audio sin servidores ni APIs de pago."
        onBack={() => navigate('home')}
      />

      <TextInput
        label="Texto para sintetizar"
        value={text}
        onChangeText={setText}
        placeholder="Escribe lo que quieres decir..."
      />

      <PrimaryButton
        label="Sintetizar localmente"
        onPress={handleSynthesize}
        disabled={!isTextReady(text)}
        loading={processing}
        accessibilityLabel="Sintetizar el texto usando el perfil de voz local"
      />

      {processing ? <VoiceVisualizer progress={progress} label="Procesando modelos locales" /> : null}

      {result ? (
        <View style={styles.resultCard}>
          <Text style={styles.ready}>Listo</Text>
          <Text style={styles.note}>
            Archivo WAV generado localmente. Sustituye los modelos en `src/models` para activar Glow-TTS + HiFi-GAN reales.
          </Text>
          <AudioPlayer uri={result.uri} label="Resultado sintetizado" />
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  resultCard: {
    gap: SPACING.md,
    padding: SPACING.lg,
    borderRadius: 18,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.exito,
  },
  ready: {
    color: COLORS.exito,
    fontSize: 22,
    fontWeight: '900',
  },
  note: {
    color: COLORS.textoSecundario,
    lineHeight: 22,
  },
});
