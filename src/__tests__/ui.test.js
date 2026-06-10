import React from 'react';
import { Alert } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import AudioPlayer from '../components/AudioPlayer';
import PrimaryButton from '../components/PrimaryButton';
import RecordingWaveform from '../components/RecordingWaveform';
import ScreenHeader from '../components/ScreenHeader';
import TextInput from '../components/TextInput';
import VoiceVisualizer from '../components/VoiceVisualizer';
import EnrollmentScreen from '../screens/EnrollmentScreen';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SynthesisScreen from '../screens/SynthesisScreen';
import { clearVoiceData, getVoiceProfile } from '../services/storageService';

jest.mock('react-native', () => {
  const React = require('react');
  const ReactNative = jest.requireActual('react-native');

  return {
    ActivityIndicator: ReactNative.ActivityIndicator,
    Alert: ReactNative.Alert,
    Animated: {
      ...ReactNative.Animated,
      loop: jest.fn(() => ({ start: jest.fn(), stop: jest.fn() })),
      sequence: jest.fn((animations) => animations),
      timing: jest.fn(() => ({ start: jest.fn(), stop: jest.fn() })),
    },
    ScrollView: ReactNative.ScrollView,
    StyleSheet: ReactNative.StyleSheet,
    Text: ReactNative.Text,
    TextInput: ReactNative.TextInput,
    TouchableOpacity: ({ children, ...props }) => <ReactNative.View {...props}>{children}</ReactNative.View>,
    View: ReactNative.View,
  };
});

jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    LinearGradient: ({ children, ...props }) => <View {...props}>{children}</View>,
  };
});

jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(),
    },
  },
}));

jest.mock('../services/storageService', () => ({
  clearVoiceData: jest.fn(),
  getVoiceProfile: jest.fn(),
}));

const mockRecordingState = {
  begin: jest.fn(),
  duration: 0,
  durationLabel: '0:00',
  finish: jest.fn(),
  isRecording: false,
};

const mockCloningState = {
  addRecording: jest.fn(),
  recordings: [],
  train: jest.fn(),
  training: false,
};

const mockSynthesisState = {
  processing: false,
  progress: 0,
  result: null,
  synthesize: jest.fn(),
};

jest.mock('../hooks/useRecording', () => jest.fn(() => mockRecordingState));
jest.mock('../hooks/useVoiceCloning', () => jest.fn(() => mockCloningState));
jest.mock('../hooks/useSynthesis', () => jest.fn(() => mockSynthesisState));

const textContent = (tree) => JSON.stringify(tree.toJSON());
const pressByLabel = (tree, label) => {
  const node = tree.root
    .findAll((item) => item.props?.accessibilityLabel?.includes(label))
    .at(0);
  expect(node).toBeTruthy();
  return act(() => node.props.onPress());
};

describe('shared components', () => {
  it('renders buttons and handles presses', () => {
    const onPress = jest.fn();
    const tree = renderer.create(<PrimaryButton label="Continuar" onPress={onPress} />);

    pressByLabel(tree, 'Continuar');

    expect(textContent(tree)).toContain('Continuar');
    expect(onPress).toHaveBeenCalled();
  });

  it('renders text input, headers, visualizers and waveforms', () => {
    const onBack = jest.fn();
    const onChangeText = jest.fn();
    const tree = renderer.create(
      <>
        <ScreenHeader title="Titulo" subtitle="Subtitulo" onBack={onBack} />
        <TextInput label="Mensaje" value="hola" onChangeText={onChangeText} placeholder="Texto" />
        <VoiceVisualizer progress={140} label="Entrenando" />
        <RecordingWaveform active={false} />
      </>
    );

    pressByLabel(tree, 'Volver a la pantalla anterior');
    act(() => tree.root.findByProps({ accessibilityLabel: 'Mensaje' }).props.onChangeText('nuevo'));

    expect(textContent(tree)).toContain('Titulo');
    expect(textContent(tree)).toContain('100%');
    expect(onBack).toHaveBeenCalled();
    expect(onChangeText).toHaveBeenCalledWith('nuevo');
  });

  it('renders audio player disabled without a uri', () => {
    const tree = renderer.create(<AudioPlayer />);
    const button = tree.root.findByProps({ accessibilityLabel: 'Reproducir audio' });

    expect(button.props.disabled).toBe(true);
  });
});

describe('screens', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(mockRecordingState, {
      begin: jest.fn(),
      duration: 0,
      durationLabel: '0:00',
      finish: jest.fn(),
      isRecording: false,
    });
    Object.assign(mockCloningState, {
      addRecording: jest.fn(),
      recordings: [],
      train: jest.fn(),
      training: false,
    });
    Object.assign(mockSynthesisState, {
      processing: false,
      progress: 0,
      result: null,
      synthesize: jest.fn(),
    });
    getVoiceProfile.mockResolvedValue(null);
    clearVoiceData.mockResolvedValue(true);
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  it('renders home and navigates from menu actions', async () => {
    const navigate = jest.fn();
    let tree;
    await act(async () => {
      tree = renderer.create(<HomeScreen navigate={navigate} />);
    });

    expect(textContent(tree)).toContain('Voice Cloner Local');
    pressByLabel(tree, 'Entrenar mi voz');
    pressByLabel(tree, 'Sintetizar texto');
    pressByLabel(tree, 'Abrir configuraci');

    expect(navigate).toHaveBeenCalledWith('enrollment');
    expect(navigate).toHaveBeenCalledWith('synthesis');
    expect(navigate).toHaveBeenCalledWith('settings');
  });

  it('handles enrollment recording and training actions', async () => {
    mockRecordingState.begin.mockResolvedValue(false);
    mockCloningState.recordings = ['a', 'b', 'c', 'd', 'e'];
    mockCloningState.train.mockResolvedValue({ id: 1 });

    let tree;
    await act(async () => {
      tree = renderer.create(<EnrollmentScreen navigate={jest.fn()} />);
    });

    await pressByLabel(tree, 'Iniciar grabaci');
    expect(Alert.alert).toHaveBeenCalledWith('Permiso necesario', expect.any(String));

    await pressByLabel(tree, 'Entrenar perfil de voz local');
    expect(mockCloningState.train).toHaveBeenCalled();
  });

  it('handles synthesis validation and submit action', async () => {
    mockSynthesisState.synthesize.mockResolvedValue({ error: 'sin perfil' });

    let tree;
    await act(async () => {
      tree = renderer.create(<SynthesisScreen navigate={jest.fn()} />);
    });

    expect(textContent(tree)).toContain('Sintetizar voz');
    act(() => tree.root.findByProps({ accessibilityLabel: 'Texto para sintetizar' }).props.onChangeText('a'));
    await pressByLabel(tree, 'Sintetizar el texto usando el perfil de voz local');
    expect(Alert.alert).toHaveBeenCalledWith('Texto muy corto', expect.any(String));

    act(() => tree.root.findByProps({ accessibilityLabel: 'Texto para sintetizar' }).props.onChangeText('hola'));
    await pressByLabel(tree, 'Sintetizar el texto usando el perfil de voz local');
    expect(mockSynthesisState.synthesize).toHaveBeenCalledWith('hola');
  });

  it('clears local data from settings', async () => {
    let tree;
    await act(async () => {
      tree = renderer.create(<SettingsScreen navigate={jest.fn()} />);
    });

    expect(textContent(tree)).toContain('Privacidad');
    await pressByLabel(tree, 'Borrar todos los datos locales de voz');

    expect(clearVoiceData).toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledWith('Datos eliminados', expect.any(String));
  });
});
