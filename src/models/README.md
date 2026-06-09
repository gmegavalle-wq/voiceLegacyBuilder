# Modelos locales

Coloca aquí los binarios gratuitos convertidos a TensorFlow Lite:

- `speechEmbedding.tflite`: extractor de embeddings de voz compatible con SpeechBrain.
- `glowTTS.tflite`: modelo de texto a espectrograma.
- `hifiGAN.tflite`: vocoder para convertir espectrograma en audio.

La app no llama a servidores. Mientras estos archivos no existan, usa un adaptador local determinístico para probar el flujo de entrenamiento, privacidad y guardado.
