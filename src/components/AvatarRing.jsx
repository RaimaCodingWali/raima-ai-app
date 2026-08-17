import { Mic, MicOff, Volume2 } from 'lucide-react';

export default function AvatarRing({
  isListening,
  isSpeaking,
  isLoading,
  isSupported,
  onMicClick,
}) {
  const ringState = isListening
    ? 'listening'
    : isSpeaking
      ? 'speaking'
      : isLoading
        ? 'loading'
        : 'idle';

  return (
    <div className="avatar-ring-container">
      <div className={`avatar-ring avatar-ring--${ringState}`}>
        <div className="avatar-ring__pulse avatar-ring__pulse--1" />
        <div className="avatar-ring__pulse avatar-ring__pulse--2" />
        <div className="avatar-ring__pulse avatar-ring__pulse--3" />

        <div className="avatar-ring__core">
          <div className="avatar-ring__face">
            <span className="avatar-ring__initial">R</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={`mic-button ${isListening ? 'mic-button--active' : ''}`}
        onClick={onMicClick}
        disabled={!isSupported || isLoading}
        aria-label={isListening ? 'Stop listening' : 'Start listening'}
      >
        {isListening ? (
          <MicOff size={28} />
        ) : isSpeaking ? (
          <Volume2 size={28} />
        ) : (
          <Mic size={28} />
        )}
      </button>

      <p className="avatar-ring__status">
        {isLoading
          ? 'RAIMA AI is thinking…'
          : isListening
            ? 'Listening…'
            : isSpeaking
              ? 'RAIMA AI is speaking…'
              : isSupported
                ? 'Tap the mic to talk'
                : 'Speech recognition not supported in this browser'}
      </p>
    </div>
  );
}
