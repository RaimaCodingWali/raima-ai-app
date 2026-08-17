import { useEffect, useRef } from 'react';
import { Bot, User } from 'lucide-react';

export default function ChatBox({ messages, inputValue, onInputChange, onSubmit, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-box">
      <div className="chat-box__messages">
        {messages.length === 0 && (
          <div className="chat-box__empty">
            <Bot size={32} strokeWidth={1.5} />
            <p>Say hello to RAIMA AI — type or use the microphone.</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-bubble chat-bubble--${msg.role}`}
          >
            <div className="chat-bubble__icon">
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <p className="chat-bubble__text">{msg.content}</p>
          </div>
        ))}

        {isLoading && (
          <div className="chat-bubble chat-bubble--assistant">
            <div className="chat-bubble__icon">
              <Bot size={16} />
            </div>
            <div className="typing-indicator">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form className="chat-box__input-row" onSubmit={onSubmit}>
        <input
          type="text"
          className="chat-box__input"
          placeholder="Type a message…"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" className="chat-box__send" disabled={isLoading || !inputValue.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
