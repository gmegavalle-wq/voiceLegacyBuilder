import { crearEmbeddingDeterministico, mezclarEmbeddings } from '../utils/audioProcessing';

export const extractVoiceEmbedding = async (audioUri) => {
  try {
    // Aquí se conecta el modelo SpeechBrain convertido a TFLite cuando exista el binario.
    return crearEmbeddingDeterministico(audioUri || String(Date.now()));
  } catch (error) {
    console.error('Error extrayendo embedding local:', error);
    return crearEmbeddingDeterministico('fallback-local');
  }
};

export const buildVoiceProfileEmbedding = async (audioFiles) => {
  try {
    const embeddings = await Promise.all(audioFiles.map((uri) => extractVoiceEmbedding(uri)));
    return mezclarEmbeddings(embeddings);
  } catch (error) {
    console.error('Error creando perfil biométrico local:', error);
    return mezclarEmbeddings([]);
  }
};
