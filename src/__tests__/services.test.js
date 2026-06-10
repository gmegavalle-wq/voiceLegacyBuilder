jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  multiRemove: jest.fn(),
}));

jest.mock('expo-file-system', () => ({
  cacheDirectory: 'cache://',
  documentDirectory: 'doc://',
  EncodingType: { Base64: 'base64' },
  copyAsync: jest.fn(),
  deleteAsync: jest.fn(),
  getInfoAsync: jest.fn(),
  makeDirectoryAsync: jest.fn(),
  writeAsStringAsync: jest.fn(),
}));

jest.mock('expo-av', () => ({
  Audio: {
    requestPermissionsAsync: jest.fn(),
    setAudioModeAsync: jest.fn(),
    Recording: jest.fn(),
    RecordingOptionsPresets: { HIGH_QUALITY: {} },
  },
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Medium: 'medium' },
  NotificationFeedbackType: { Success: 'success' },
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Haptics from 'expo-haptics';

import {
  clearVoiceData,
  getVoiceProfile,
  saveSynthesisResult,
  saveTrainingAudio,
  saveVoiceProfile,
} from '../services/storageService';
import {
  configureAudioMode,
  requestRecordingPermission,
  startRecording,
  stopRecording,
} from '../services/audioService';
import { synthesizeWithLocalModels } from '../services/synthesisService';
import { buildVoiceProfileEmbedding, extractVoiceEmbedding } from '../services/tfLiteService';
import { trainVoiceLocally } from '../services/voiceCloningService';

let consoleErrorSpy;
let consoleWarnSpy;

beforeEach(() => {
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  consoleErrorSpy.mockRestore();
  consoleWarnSpy.mockRestore();
});

describe('storage service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    FileSystem.getInfoAsync.mockResolvedValue({ exists: true });
    AsyncStorage.getItem.mockResolvedValue(null);
  });

  it('saves training audio into the local training directory', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(123);

    await expect(saveTrainingAudio('file://input.m4a', 4)).resolves.toBe(
      'doc://voice_training/training_123_4.m4a'
    );
    expect(FileSystem.copyAsync).toHaveBeenCalledWith({
      from: 'file://input.m4a',
      to: 'doc://voice_training/training_123_4.m4a',
    });

    Date.now.mockRestore();
  });

  it('persists and reads voice profiles', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(456);

    const profile = await saveVoiceProfile({ audioFiles: ['a'], embeddings: [0.1] });
    expect(profile).toMatchObject({ id: 456, cantidadAudios: 1, localOnly: true });
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('VOICE_PROFILE', expect.any(String));

    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(profile));
    await expect(getVoiceProfile()).resolves.toEqual(profile);

    Date.now.mockRestore();
  });

  it('returns null for missing or invalid profiles', async () => {
    await expect(getVoiceProfile()).resolves.toBeNull();

    AsyncStorage.getItem.mockResolvedValue('{bad json');
    await expect(getVoiceProfile()).resolves.toBeNull();
  });

  it('clears voice data and stores synthesis history', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(789);
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([{ id: 1, text: 'anterior' }]));

    await expect(clearVoiceData()).resolves.toBe(true);
    await expect(saveSynthesisResult({ text: ' nuevo ', uri: 'file://tmp.wav' })).resolves.toMatchObject({
      id: 789,
      text: 'nuevo',
      uri: 'doc://voice_synthesis/synthesis_789.m4a',
    });
    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(['VOICE_PROFILE', 'SYNTHESIS_HISTORY']);

    Date.now.mockRestore();
  });

  it('rejects invalid data before writing it', async () => {
    await expect(saveVoiceProfile({ audioFiles: null, embeddings: [] })).rejects.toThrow(
      'Invalid profile data'
    );
    await expect(saveSynthesisResult({ text: '   ', uri: null })).rejects.toThrow(
      'Invalid text'
    );
  });
});

describe('audio service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('requests permissions and configures recording mode', async () => {
    Audio.requestPermissionsAsync.mockResolvedValue({ granted: true });

    await expect(requestRecordingPermission()).resolves.toBe(true);
    await configureAudioMode();

    expect(Audio.setAudioModeAsync).toHaveBeenCalledWith(
      expect.objectContaining({ allowsRecordingIOS: true, shouldDuckAndroid: true })
    );
  });

  it('starts and stops a recording', async () => {
    const recording = {
      getURI: jest.fn(() => 'file://recording.m4a'),
      prepareToRecordAsync: jest.fn(),
      startAsync: jest.fn(),
      stopAndUnloadAsync: jest.fn(),
    };
    Audio.Recording.mockImplementation(() => recording);

    await expect(startRecording()).resolves.toBe(recording);
    await expect(stopRecording(recording)).resolves.toBe('file://recording.m4a');

    expect(Haptics.impactAsync).toHaveBeenCalledWith('medium');
    expect(Haptics.notificationAsync).toHaveBeenCalledWith('success');
  });

  it('handles missing permissions and recording failures', async () => {
    Audio.requestPermissionsAsync.mockRejectedValue(new Error('denied'));
    Audio.Recording.mockImplementation(() => {
      throw new Error('boom');
    });

    await expect(requestRecordingPermission()).resolves.toBe(false);
    await expect(startRecording()).resolves.toBeNull();
    await expect(stopRecording(null)).resolves.toBeNull();
  });
});

describe('local model services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('extracts and builds local embeddings', async () => {
    await expect(extractVoiceEmbedding('audio-a')).resolves.toHaveLength(192);
    await expect(buildVoiceProfileEmbedding(['a', 'b'])).resolves.toHaveLength(192);
  });

  it('synthesizes a local preview file', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(111);
    const progress = jest.fn();
    const promise = synthesizeWithLocalModels({
      text: 'hola',
      profile: { embeddings: [0.1, 0.2] },
      onProgress: progress,
    });

    await jest.runAllTimersAsync();

    await expect(promise).resolves.toEqual({ uri: 'cache://synthesis_preview_111.wav', ready: true });
    expect(progress).toHaveBeenLastCalledWith(100);
    expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
      'cache://synthesis_preview_111.wav',
      expect.any(String),
      { encoding: 'base64' }
    );

    Date.now.mockRestore();
  });

  it('trains a profile from local files', async () => {
    jest.useRealTimers();
    jest.spyOn(Date, 'now').mockReturnValue(222);
    AsyncStorage.setItem.mockResolvedValue();

    await expect(trainVoiceLocally(['a', 'b'])).resolves.toMatchObject({
      id: 222,
      audioFiles: ['a', 'b'],
      cantidadAudios: 2,
    });

    Date.now.mockRestore();
  });
});
