import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, MODEL_CONFIG, SPACING, TRAINING_PROMPTS } from '../constants';
import PrimaryButton from '../components/PrimaryButton';
import RecordingWaveform from '../components/RecordingWaveform';
import ScreenHeader from '../components/ScreenHeader';
import useRecording from '../hooks/useRecording';
import useVoiceCloning from '../hooks/useVoiceCloning';
import { canTrainVoice, getRecordingGoalText } from '../utils/validation';

export default function EnrollmentScreen({ navigate }) {
  const { isRecording, duration, durationLabel, begin, finish } = useRecording();
  const { recordings, training, addRecording, train } = useVoiceCloning();
  const [lastUri, setLastUri] = useState(null);
  const prompt = TRAINING_PROMPTS[Math.min(recordings.length, TRAINING_PROMPTS.length - 1)];

  const handleRecord = async () => {
    if (!isRecording) {
      const started = await begin();
      if (!started) Alert.alert('Permiso necesario', 'Activa el micrófono para grabar tu voz.');
      return;
    }

    const result = await finish();
    if (result.uri && duration >= MODEL_CONFIG.minRecordingSeconds) setLastUri(result.uri);
    if (duration < MODEL_CONFIG.minRecordingSeconds)
      Alert.alert('Grabación corta', 'Graba al menos tres segundos.');
  };

  const acceptRecording = async () => {
    const saved = await addRecording(lastUri);
    if (saved) setLastUri(null);
  };

  const trainProfile = async () => {
    const profile = await train();
    if (profile)
      Alert.alert('Voz entrenada', 'Tu perfil de voz quedó guardado solo en este dispositivo.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ScreenHeader
        title="Entrenar tu voz"
        subtitle={`${recordings.length}/${MODEL_CONFIG.minRecordings} ejemplos mínimos. ${getRecordingGoalText(recordings.length)}`}
        onBack={() => navigate('home')}
      />

      <View style={styles.promptCard}>
        <Text style={styles.promptLabel}>Lee este texto</Text>
        <Text style={styles.promptText}>{prompt}</Text>
      </View>

      <TouchableOpacity
        onPress={handleRecord}
        accessible={true}
        accessibilityLabel={isRecording ? 'Detener grabación' : 'Iniciar grabación'}
        accessibilityHint="Usa este control para registrar un ejemplo de entrenamiento"
        accessibilityRole="button"
        style={[styles.recordButton, isRecording && styles.recording]}
      >
        <Text style={styles.recordText}>{isRecording ? 'DETENER' : 'GRABAR'}</Text>
        <Text style={styles.recordHint}>{durationLabel} / 0:30</Text>
      </TouchableOpacity>

      <RecordingWaveform active={isRecording} />

      {lastUri ? (
        <View style={styles.reviewCard}>
          <Text style={styles.successText}>Audio grabado y listo para usar.</Text>
          <View style={styles.row}>
            <PrimaryButton
              label="Guardar ejemplo"
              onPress={acceptRecording}
              accessibilityLabel="Guardar este ejemplo de voz"
            />
            <PrimaryButton
              label="Descartar"
              variant="secondary"
              onPress={() => setLastUri(null)}
              accessibilityLabel="Descartar este audio"
            />
          </View>
        </View>
      ) : null}

      <View style={styles.samples}>
        {recordings.map((item, index) => (
          <View key={item} style={styles.sampleItem}>
            <Text style={styles.sampleText}>Ejemplo {index + 1} guardado</Text>
          </View>
        ))}
      </View>

      <PrimaryButton
        label="Entrenar voz local"
        onPress={trainProfile}
        disabled={!canTrainVoice(recordings)}
        loading={training}
        accessibilityLabel="Entrenar perfil de voz local"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  promptCard: {
    padding: SPACING.lg,
    borderRadius: 18,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.borde,
  },
  promptLabel: {
    color: COLORS.acento,
    fontWeight: '800',
    marginBottom: SPACING.sm,
  },
  promptText: {
    color: COLORS.texto,
    fontSize: 23,
    lineHeight: 31,
    fontWeight: '700',
  },
  recordButton: {
    minHeight: 108,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.acentoSecundario,
    borderWidth: 1,
    borderColor: COLORS.borde,
  },
  recording: {
    backgroundColor: COLORS.error,
  },
  recordText: {
    color: COLORS.texto,
    fontSize: 22,
    fontWeight: '900',
  },
  recordHint: {
    color: COLORS.texto,
    marginTop: SPACING.xs,
    fontWeight: '600',
  },
  reviewCard: {
    gap: SPACING.md,
    padding: SPACING.md,
    borderRadius: 18,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.exito,
  },
  successText: {
    color: COLORS.texto,
    fontWeight: '700',
  },
  row: {
    gap: SPACING.sm,
  },
  samples: {
    gap: SPACING.sm,
  },
  sampleItem: {
    padding: SPACING.md,
    borderRadius: 16,
    backgroundColor: COLORS.panel,
  },
  sampleText: {
    color: COLORS.textoSecundario,
    fontWeight: '700',
  },
});
