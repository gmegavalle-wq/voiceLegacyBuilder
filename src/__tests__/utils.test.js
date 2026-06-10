import { crearEmbeddingDeterministico, mezclarEmbeddings } from '../utils/audioProcessing';
import { formatDuration, shortDate } from '../utils/formatting';
import { canTrainVoice, getRecordingGoalText, isTextReady } from '../utils/validation';

describe('formatting utilities', () => {
  it('formats durations safely', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(65.9)).toBe('1:05');
    expect(formatDuration(-10)).toBe('0:00');
  });

  it('returns a fallback for empty dates', () => {
    expect(shortDate()).toBe('Sin fecha');
  });
});

describe('validation utilities', () => {
  it('checks whether a voice can be trained', () => {
    expect(canTrainVoice(['1', '2', '3', '4'])).toBe(false);
    expect(canTrainVoice(['1', '2', '3', '4', '5'])).toBe(true);
  });

  it('validates synthesis text and training goals', () => {
    expect(isTextReady('ok')).toBe(false);
    expect(isTextReady('hola')).toBe(true);
    expect(getRecordingGoalText(2)).toContain('Faltan 3');
    expect(getRecordingGoalText(5)).toContain('suficientes');
  });
});

describe('audio processing utilities', () => {
  it('creates deterministic embeddings with the configured size', () => {
    const first = crearEmbeddingDeterministico('voz');
    const second = crearEmbeddingDeterministico('voz');

    expect(first).toHaveLength(192);
    expect(first).toEqual(second);
  });

  it('mixes embeddings and handles empty input', () => {
    const mixed = mezclarEmbeddings([
      [1, 0.5, 0],
      [0, 0.25, 1],
    ]);

    expect(mixed).toHaveLength(192);
    expect(mixed.slice(0, 3)).toEqual([0.5, 0.375, 0.5]);
    expect(mezclarEmbeddings([])).toHaveLength(192);
  });
});
