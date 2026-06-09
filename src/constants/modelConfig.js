export const MODEL_CONFIG = {
  minRecordings: 5,
  maxRecordings: 10,
  minRecordingSeconds: 3,
  maxRecordingSeconds: 30,
  embeddingSize: 192,
  sampleRate: 22050,
  models: {
    embedding: 'speechEmbedding.tflite',
    glowTTS: 'glowTTS.tflite',
    hifiGAN: 'hifiGAN.tflite',
  },
};

export const TRAINING_PROMPTS = [
  'El futuro es brillante cuando mi voz se conserva conmigo.',
  'Hoy grabo estas palabras con calma, claridad y confianza.',
  'Mi familia puede escucharme siempre que necesite mi compañía.',
  'La tecnología local protege mis recuerdos y mi privacidad.',
  'Cada mensaje guarda una parte única de mi forma de hablar.',
  'Puedo leer despacio, respirar y pronunciar cada palabra.',
  'Este entrenamiento ayuda a reconocer mi tono y mi ritmo.',
  'Mi voz es mía y se queda guardada solamente en este dispositivo.',
  'La memoria también vive en los sonidos cotidianos.',
  'Termino esta grabación con una frase serena y natural.',
];
