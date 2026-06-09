import { useEffect, useRef, useState } from 'react';
import { MODEL_CONFIG } from '../constants';
import { formatDuration } from '../utils/formatting';
import { requestRecordingPermission, startRecording, stopRecording } from '../services/audioService';

export default function useRecording() {
  const [recording, setRecording] = useState(null);
  const [duration, setDuration] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const begin = async () => {
    const granted = await requestRecordingPermission();
    if (!granted) return false;

    const nextRecording = await startRecording();
    if (!nextRecording) return false;

    setRecording(nextRecording);
    setDuration(0);
    timerRef.current = setInterval(() => {
      setDuration((value) => Math.min(value + 1, MODEL_CONFIG.maxRecordingSeconds));
    }, 1000);
    return true;
  };

  const finish = async () => {
    clearInterval(timerRef.current);
    const uri = await stopRecording(recording);
    setRecording(null);
    return { uri, duration, label: formatDuration(duration) };
  };

  return {
    isRecording: Boolean(recording),
    duration,
    durationLabel: formatDuration(duration),
    begin,
    finish,
  };
}
