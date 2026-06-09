import { MODEL_CONFIG } from '../constants';

export const crearEmbeddingDeterministico = (seedText) => {
  let seed = 0;
  for (let index = 0; index < seedText.length; index += 1) {
    seed = (seed * 31 + seedText.charCodeAt(index)) % 2147483647;
  }

  return Array.from({ length: MODEL_CONFIG.embeddingSize }, (_, index) => {
    const value = Math.sin(seed + index * 13.37);
    return Number(value.toFixed(6));
  });
};

export const mezclarEmbeddings = (embeddings) => {
  if (!embeddings.length) return crearEmbeddingDeterministico('perfil-vacio');

  return Array.from({ length: MODEL_CONFIG.embeddingSize }, (_, index) => {
    const total = embeddings.reduce((sum, item) => sum + (item[index] || 0), 0);
    return Number((total / embeddings.length).toFixed(6));
  });
};
