import { useState, useCallback, useEffect, useRef } from 'react';
import { getChatCompletion } from '../services/ai';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useSpeechSynthesis } from './useSpeechSynthesis';

/**
 * Orchestrates chat state, API calls, and browser-native voice I/O
 * (webkitSpeechRecognition + window.speechSynthesis).
 */
export function useVoiceAssistant() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const { isSpeaking, speak, stopSpeaking } = useSpeechSynthesis();

  const pendingVoiceSend = useRef(false);
  const sendRef = useRef(null);

  const sendMessage = useCallback(
    async (text) => {
      const userText = (text ?? inputValue).trim();
      if (!userText || isLoading) return;

      setError(null);
      setInputValue('');
      setIsLoading(true);

      const userMessage = { role: 'user', content: userText };
      const nextMessages = [...messages, userMessage];
      setMessages(nextMessages);

      try {
        const reply = await getChatCompletion(nextMessages);
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
        speak(reply);
      } catch (err) {
        setError(err.message);
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setIsLoading(false);
      }
    },
    [inputValue, isLoading, messages, speak]
  );

  useEffect(() => {
    sendRef.current = sendMessage;
  }, [sendMessage]);

  // Mirror live speech-to-text into the input field.
  useEffect(() => {
    if (isListening && transcript) {
      setInputValue(transcript);
    }
  }, [isListening, transcript]);

  // Auto-send when the user finishes speaking via the mic.
  useEffect(() => {
    if (!isListening && transcript.trim() && pendingVoiceSend.current) {
      pendingVoiceSend.current = false;
      sendRef.current?.(transcript.trim());
      resetTranscript();
    }
  }, [isListening, transcript, resetTranscript]);

  const toggleMic = useCallback(() => {
    if (isListening) {
      pendingVoiceSend.current = true;
      stopListening();
      return;
    }

    stopSpeaking();
    pendingVoiceSend.current = true;
    startListening();
  }, [isListening, startListening, stopListening, stopSpeaking]);

  const submitText = useCallback(
    (event) => {
      event.preventDefault();
      sendMessage();
    },
    [sendMessage]
  );

  return {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    error,
    isListening,
    isSpeaking,
    isSpeechSupported: isSupported,
    toggleMic,
    submitText,
  };
}
