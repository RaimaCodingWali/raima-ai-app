import { useState, useCallback, useEffect } from 'react';

function pickVoice() {
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(
    (voice) =>
      voice.name.includes('Samantha') ||
      voice.name.includes('Google UK English Female') ||
      voice.name.includes('Microsoft Zira') ||
      (voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female'))
  );
  return preferred ?? voices.find((voice) => voice.lang.startsWith('en')) ?? null;
}

/**
 * Browser-native text-to-speech via window.speechSynthesis.
 */
export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    window.speechSynthesis.getVoices();
    const loadVoices = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () =>
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, []);

  const speak = useCallback((text) => {
    if (!text?.trim() || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    const voice = pickVoice();
    if (voice) utterance.voice = voice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { isSpeaking, speak, stopSpeaking };
}
