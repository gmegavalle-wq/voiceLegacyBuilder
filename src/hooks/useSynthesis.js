import { useState } from 'react';
import { getVoiceProfile, saveSynthesisResult } from '../services/storageService';
import { synthesizeWithLocalModels } from '../services/synthesisService';

export default function useSynthesis() {
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const synthesize = async (text) => {
    setProcessing(true);
    setProgress(0);
    const profile = await getVoiceProfile();
    if (!profile) {
      setProcessing(false);
      return { error: 'Primero entrena tu voz con al menos cinco ejemplos.' };
    }

    const output = await synthesizeWithLocalModels({ text, profile, onProgress: setProgress });
    const saved = output.ready ? await saveSynthesisResult({ text, uri: output.uri }) : null;
    setResult(saved);
    setProcessing(false);
    return { result: saved };
  };

  return { progress, processing, result, synthesize };
}
