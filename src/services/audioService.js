import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

export const requestRecordingPermission = async () => {
  try {
    const permission = await Audio.requestPermissionsAsync();
    return permission.granted;
  } catch (error) {
    console.error('Error pidiendo permiso de micrófono:', error);
    return false;
  }
};

export const configureAudioMode = async () => {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
    shouldDuckAndroid: true,
  });
};

export const startRecording = async () => {
  try {
    await configureAudioMode();
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    await recording.startAsync();
    return recording;
  } catch (error) {
    console.error('Error iniciando grabación:', error);
    return null;
  }
};

export const stopRecording = async (recording) => {
  try {
    if (!recording) return null;
    await recording.stopAndUnloadAsync();
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    return recording.getURI();
  } catch (error) {
    console.error('Error deteniendo grabación:', error);
    return null;
  }
};
