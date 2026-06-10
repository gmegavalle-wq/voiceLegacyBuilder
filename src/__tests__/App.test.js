import React from 'react';
import renderer from 'react-test-renderer';

import App from '../../App';

jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    LinearGradient: ({ children, ...props }) => <View {...props}>{children}</View>,
  };
});

jest.mock('../services/storageService', () => ({
  getVoiceProfile: jest.fn(() => Promise.resolve(null)),
}));

jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(),
    },
  },
}));

jest.mock('../hooks/useRecording', () =>
  jest.fn(() => ({
    begin: jest.fn(),
    duration: 0,
    durationLabel: '0:00',
    finish: jest.fn(),
    isRecording: false,
  }))
);

jest.mock('../hooks/useVoiceCloning', () =>
  jest.fn(() => ({
    addRecording: jest.fn(),
    recordings: [],
    train: jest.fn(),
    training: false,
  }))
);

jest.mock('../hooks/useSynthesis', () =>
  jest.fn(() => ({
    processing: false,
    progress: 0,
    result: null,
    synthesize: jest.fn(),
  }))
);

describe('App', () => {
  it('renders the home screen', () => {
    const tree = renderer.create(<App />).toJSON();

    expect(JSON.stringify(tree)).toContain('Voice Cloner Local');
  });
});
