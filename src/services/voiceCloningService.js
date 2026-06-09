import { buildVoiceProfileEmbedding } from './tfLiteService';
import { saveVoiceProfile } from './storageService';

export const trainVoiceLocally = async (audioFiles) => {
  try {
    const embeddings = await buildVoiceProfileEmbedding(audioFiles);
    return await saveVoiceProfile({ audioFiles, embeddings });
  } catch (error) {
    console.error('Error entrenando voz local:', error);
    return null;
  }
};
