import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const PROFILE_KEY = 'VOICE_PROFILE';
const SYNTHESIS_KEY = 'SYNTHESIS_HISTORY';
const TRAINING_DIR = `${FileSystem.documentDirectory}voice_training/`;
const SYNTHESIS_DIR = `${FileSystem.documentDirectory}voice_synthesis/`;

const sanitizeIndex = (index) => Math.max(0, Math.min(999, Math.floor(index)));

const ensureDir = async (directory) => {
  try {
    const info = await FileSystem.getInfoAsync(directory);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
    }
  } catch (error) {
    console.error('Error creating directory:', directory, error);
    throw error;
  }
};

export const saveTrainingAudio = async (uri, index) => {
  try {
    await ensureDir(TRAINING_DIR);
    const safeIndex = sanitizeIndex(index);
    const destination = `${TRAINING_DIR}training_${Date.now()}_${safeIndex}.m4a`;
    await FileSystem.copyAsync({ from: uri, to: destination });
    return destination;
  } catch (error) {
    console.error('Error guardando audio de entrenamiento:', error);
    throw error;
  }
};

export const saveVoiceProfile = async ({ audioFiles, embeddings }) => {
  try {
    if (!Array.isArray(audioFiles) || !Array.isArray(embeddings)) {
      throw new Error('Invalid profile data: audioFiles and embeddings must be arrays');
    }

    const metadata = {
      id: Date.now(),
      fechaEntrenamiento: new Date().toISOString(),
      cantidadAudios: audioFiles.length,
      audioFiles,
      embeddings,
      localOnly: true,
      version: 1,
    };

    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(metadata));
    return metadata;
  } catch (error) {
    console.error('Error guardando perfil de voz:', error);
    throw error;
  }
};

export const getVoiceProfile = async () => {
  try {
    const rawProfile = await AsyncStorage.getItem(PROFILE_KEY);
    if (!rawProfile) return null;

    const profile = JSON.parse(rawProfile);
    if (!profile.version || profile.version !== 1) {
      console.warn('Profile version mismatch');
    }

    return profile;
  } catch (error) {
    console.error('Error leyendo perfil de voz:', error);
    return null;
  }
};

export const clearVoiceData = async () => {
  try {
    await AsyncStorage.multiRemove([PROFILE_KEY, SYNTHESIS_KEY]);
    await FileSystem.deleteAsync(TRAINING_DIR, { idempotent: true });
    await FileSystem.deleteAsync(SYNTHESIS_DIR, { idempotent: true });
    return true;
  } catch (error) {
    console.error('Error eliminando datos locales:', error);
    throw error;
  }
};

export const saveSynthesisResult = async ({ text, uri }) => {
  try {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      throw new Error('Invalid text for synthesis');
    }

    await ensureDir(SYNTHESIS_DIR);
    let savedUri = uri;

    if (uri && typeof uri === 'string') {
      savedUri = `${SYNTHESIS_DIR}synthesis_${Date.now()}.m4a`;
      await FileSystem.copyAsync({ from: uri, to: savedUri });
    }

    const item = {
      id: Date.now(),
      text: text.trim(),
      uri: savedUri,
      fecha: new Date().toISOString(),
    };

    const rawHistory = await AsyncStorage.getItem(SYNTHESIS_KEY);
    let history = [];

    try {
      history = JSON.parse(rawHistory || '[]');
    } catch {
      history = [];
    }

    const updated = [item, ...history].slice(0, 20);
    await AsyncStorage.setItem(SYNTHESIS_KEY, JSON.stringify(updated));
    return item;
  } catch (error) {
    console.error('Error guardando síntesis local:', error);
    throw error;
  }
};
