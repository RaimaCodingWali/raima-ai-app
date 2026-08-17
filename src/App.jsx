import { Sparkles } from 'lucide-react';
import AvatarRing from './components/AvatarRing';
import ChatBox from './components/ChatBox';
import { useVoiceAssistant } from './hooks/useVoiceAssistant';
import './App.css';

function App() {
  const {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    error,
    isListening,
    isSpeaking,
    isSpeechSupported,
    toggleMic,
    submitText,
  } = useVoiceAssistant();

  return (
    <div className="app">
      <div className="app__bg" aria-hidden="true">
        <div className="app__orb app__orb--1" />
        <div className="app__orb app__orb--2" />
        <div className="app__orb app__orb--3" />
      </div>

      <header className="app__header">
        <Sparkles size={20} className="app__logo-icon" />
        <h1 className="app__title">RAIMA AI</h1>
        <span className="app__badge">Voice AI</span>
      </header>

      <main className="app__main">
        <AvatarRing
          isListening={isListening}
          isSpeaking={isSpeaking}
          isLoading={isLoading}
          isSupported={isSpeechSupported}
          onMicClick={toggleMic}
        />

        {error && (
          <div className="app__error" role="alert">
            {error}
          </div>
        )}

        <ChatBox
          messages={messages}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSubmit={submitText}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}

export default App;
