import * as FileSystem from 'expo-file-system';

const crearWavBase64 = (embedding = []) => {
  const sampleRate = 22050;
  const durationSeconds = 1.2;
  const samples = Math.floor(sampleRate * durationSeconds);
  const dataSize = samples * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  const writeText = (offset, text) => {
    for (let index = 0; index < text.length; index += 1) view.setUint8(offset + index, text.charCodeAt(index));
  };

  writeText(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeText(8, 'WAVEfmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeText(36, 'data');
  view.setUint32(40, dataSize, true);

  for (let index = 0; index < samples; index += 1) {
    const fingerprint = embedding[index % Math.max(1, embedding.length)] || 0.2;
    const frequency = 180 + Math.abs(fingerprint) * 260;
    const sample = Math.sin((2 * Math.PI * frequency * index) / sampleRate) * 0.18;
    view.setInt16(44 + index * 2, sample * 32767, true);
  }

  let binary = '';
  const bytes = new Uint8Array(buffer);
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
};

export const synthesizeWithLocalModels = async ({ text, profile, onProgress }) => {
  try {
    const steps = [15, 35, 58, 76, 92, 100];
    for (const progress of steps) {
      onProgress?.(progress);
      await new Promise((resolve) => setTimeout(resolve, 260));
    }

    // Este WAV local valida el flujo offline hasta conectar Glow-TTS + HiFi-GAN reales.
    const uri = `${FileSystem.cacheDirectory}synthesis_preview_${Date.now()}.wav`;
    const wavBase64 = crearWavBase64(profile?.embeddings);
    await FileSystem.writeAsStringAsync(uri, wavBase64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return { uri, ready: true };
  } catch (error) {
    console.error('Error sintetizando voz local:', error);
    return { uri: null, ready: false };
  }
};
