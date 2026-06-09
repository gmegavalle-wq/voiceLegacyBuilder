import { useEffect, useState } from 'react';
import { getVoiceProfile, saveTrainingAudio } from '../services/storageService';
import { trainVoiceLocally } from '../services/voiceCloningService';

export default function useVoiceCloning() {
  const [recordings, setRecordings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [training, setTraining] = useState(false);

  useEffect(() => {
    getVoiceProfile().then(setProfile);
  }, []);

  const addRecording = async (uri) => {
    const savedUri = await saveTrainingAudio(uri, recordings.length + 1);
    if (!savedUri) return false;
    setRecordings((items) => [...items, savedUri]);
    return true;
  };

  const train = async () => {
    setTraining(true);
    const nextProfile = await trainVoiceLocally(recordings);
    setProfile(nextProfile);
    setTraining(false);
    return nextProfile;
  };

  return { recordings, profile, training, addRecording, train, refreshProfile: () => getVoiceProfile().then(setProfile) };
}
