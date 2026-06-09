import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SPACING } from '../constants';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import VoiceVisualizer from '../components/VoiceVisualizer';
import { getVoiceProfile } from '../services/storageService';

export default function HomeScreen({ navigate }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getVoiceProfile()
      .then(setProfile)
      .catch((error) => {
        console.error('Failed to load voice profile:', error);
        setProfile(null);
      });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ScreenHeader
        title="Voice Cloner Local"
        subtitle="Entrena, guarda y sintetiza una voz privada dentro de este dispositivo."
      />

      <View style={styles.hero}>
        <Text style={styles.heroIcon}>🎤</Text>
        <Text style={styles.heroTitle}>
          {profile ? 'Voz lista para clonar' : 'Tu voz, tus datos'}
        </Text>
        <Text style={styles.heroText}>
          {profile
            ? `${profile.cantidadAudios} ejemplos protegidos localmente.`
            : 'Graba cinco ejemplos cortos para crear un perfil biométrico local.'}
        </Text>
      </View>

      <VoiceVisualizer
        progress={profile ? 100 : 0}
        label={profile ? 'Perfil local entrenado' : 'Entrenamiento pendiente'}
      />

      <View style={styles.actions}>
        <MenuCard
          title="Entrenar mi voz"
          description="Graba de 5 a 10 ejemplos cortos."
          onPress={() => navigate('enrollment')}
        />
        <MenuCard
          title="Sintetizar texto"
          description="Escribe una frase y genera audio local."
          onPress={() => navigate('synthesis')}
        />
        <PrimaryButton
          label="Configuración"
          variant="secondary"
          onPress={() => navigate('settings')}
          accessibilityLabel="Abrir configuración y privacidad"
        />
      </View>
    </ScrollView>
  );
}

function MenuCard({ title, description, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessible={true}
      accessibilityLabel={title}
      accessibilityHint={description}
      accessibilityRole="button"
      style={styles.menuCard}
    >
      <View>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuDescription}>{description}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  hero: {
    padding: SPACING.lg,
    borderRadius: 20,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.borde,
  },
  heroIcon: {
    fontSize: 42,
    marginBottom: SPACING.sm,
  },
  heroTitle: {
    color: COLORS.texto,
    fontSize: 25,
    fontWeight: '800',
  },
  heroText: {
    color: COLORS.textoSecundario,
    fontSize: 16,
    lineHeight: 23,
    marginTop: SPACING.sm,
  },
  actions: {
    gap: SPACING.md,
  },
  menuCard: {
    minHeight: 88,
    borderRadius: 18,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.borde,
  },
  menuTitle: {
    color: COLORS.texto,
    fontSize: 18,
    fontWeight: '800',
  },
  menuDescription: {
    color: COLORS.textoSecundario,
    marginTop: 4,
    fontSize: 14,
  },
  arrow: {
    color: COLORS.acento,
    fontSize: 32,
    fontWeight: '700',
  },
});
