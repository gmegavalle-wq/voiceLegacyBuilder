import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import { COLORS, SPACING } from '../constants';
import { clearVoiceData, getVoiceProfile } from '../services/storageService';
import { shortDate } from '../utils/formatting';

export default function SettingsScreen({ navigate }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getVoiceProfile().then(setProfile);
  }, []);

  const borrarDatos = async () => {
    const ok = await clearVoiceData();
    if (ok) {
      setProfile(null);
      Alert.alert('Datos eliminados', 'Se borraron audios, embeddings e historial local.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ScreenHeader
        title="Privacidad"
        subtitle="Control total de los datos guardados en el dispositivo."
        onBack={() => navigate('home')}
      />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Estado local</Text>
        <Text style={styles.item}>Internet: nunca requerido</Text>
        <Text style={styles.item}>Telemetría: desactivada</Text>
        <Text style={styles.item}>Perfil entrenado: {profile ? 'sí' : 'no'}</Text>
        <Text style={styles.item}>
          Fecha: {profile ? shortDate(profile.fechaEntrenamiento) : 'sin entrenamiento'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Modelos IA</Text>
        <Text style={styles.item}>SpeechBrain embeddings: adaptador TFLite local</Text>
        <Text style={styles.item}>Glow-TTS: carpeta `src/models/glowTTS.tflite`</Text>
        <Text style={styles.item}>HiFi-GAN: carpeta `src/models/hifiGAN.tflite`</Text>
      </View>

      <PrimaryButton
        label="Borrar datos locales"
        variant="secondary"
        onPress={borrarDatos}
        accessibilityLabel="Borrar todos los datos locales de voz"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  card: {
    gap: SPACING.sm,
    padding: SPACING.lg,
    borderRadius: 18,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.borde,
  },
  cardTitle: {
    color: COLORS.texto,
    fontSize: 19,
    fontWeight: '900',
    marginBottom: SPACING.xs,
  },
  item: {
    color: COLORS.textoSecundario,
    fontSize: 15,
    lineHeight: 23,
  },
});
