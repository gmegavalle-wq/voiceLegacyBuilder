import { MODEL_CONFIG } from '../constants';

export const canTrainVoice = (recordings) => recordings.length >= MODEL_CONFIG.minRecordings;

export const isTextReady = (text) => text.trim().length >= 3;

export const getRecordingGoalText = (count) => {
  const remaining = Math.max(0, MODEL_CONFIG.minRecordings - count);
  if (remaining === 0) return 'Ya tienes suficientes ejemplos para entrenar.';
  return `Faltan ${remaining} ejemplos para entrenar la voz.`;
};
