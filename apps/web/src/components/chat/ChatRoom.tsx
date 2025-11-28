'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  userId: string;
  username: string;
  content: string;
  type: 'TEXT' | 'SYSTEM' | 'CRYPTO_RAIN' | 'ANNOUNCEMENT';
  rank?: string;
  createdAt: Date;
}

interface CryptoRain {
  id: string;
  senderId: string;
  senderName: string;
  totalAmount: string;
  amountPerClaim: string;
  maxClaims: number;
  claimedCount: number;
  expiresAt: Date;
}

interface ChatRoomProps {
  roomId: string;
  roomName?: string;
  messages: Message[];
  activeRains: CryptoRain[];
  userCount: number;
  onSendMessage: (content: string) => void;
  onClaimRain: (rainId: string) => void;
  onStartRain?: (amount: string, maxClaims: number) => void;
}

export function ChatRoom({
  roomId,
  roomName = 'The Agora',
  messages,
  activeRains,
  userCount,
  onSendMessage,
  onClaimRain,
  onStartRain,
}: ChatRoomProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="card-marble border border-gold-600/20 h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gold-600/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💬</span>
          <h3 className="font-display text-gold-500">{roomName}</h3>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-marble-400">
            👥 {userCount} online
          </span>
          {onStartRain && (
            <button
              onClick={() => onStartRain('1000', 10)}
              className="px-3 py-1 rounded-lg bg-gold-600/20 text-gold-500 text-sm hover:bg-gold-600/30 transition-colors"
            >
              🌧️ Start Rain
            </button>
          )}
        </div>
      </div>

      {/* Active Rains */}
      {activeRains.length > 0 && (
        <div className="p-3 bg-gold-600/10 border-b border-gold-600/20">
          {activeRains.map((rain) => (
            <CryptoRainAlert
              key={rain.id}
              rain={rain}
              onClaim={() => onClaimRain(rain.id)}
            />
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gold-600/20">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-marble-800 border border-marble-700 rounded-lg px-4 py-2 text-marble-100 placeholder-marble-500 focus:outline-none focus:border-gold-600"
          />
          <button
            type="submit"
            className="btn-gold px-4 py-2"
            disabled={!inputValue.trim()}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

function ChatMessage({ message }: { message: Message }) {
  if (message.type === 'SYSTEM') {
    return (
      <div className="text-center text-sm text-marble-500 py-2">
        {message.content}
      </div>
    );
  }

  if (message.type === 'CRYPTO_RAIN') {
    return (
      <div className="chat-message chat-message-rain text-center">
        <span className="text-2xl">🌧️</span>
        <p className="text-gold-500 font-semibold">{message.content}</p>
      </div>
    );
  }

  return (
    <div className="chat-message">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-semibold text-gold-500">{message.username}</span>
        {message.rank && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-marble-700">
            {message.rank}
          </span>
        )}
        <span className="text-xs text-marble-500">
          {new Date(message.createdAt).toLocaleTimeString()}
        </span>
      </div>
      <p className="text-marble-200">{message.content}</p>
    </div>
  );
}

function CryptoRainAlert({ rain, onClaim }: { rain: CryptoRain; onClaim: () => void }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const expires = new Date(rain.expiresAt);
      const diff = expires.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft('Expired');
      } else {
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        setTimeLeft(`${minutes}:${(seconds % 60).toString().padStart(2, '0')}`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [rain.expiresAt]);

  return (
    <div className="flex items-center justify-between bg-gold-600/20 rounded-lg p-3 animate-pulse">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🌧️</span>
        <div>
          <p className="font-semibold text-gold-500">
            Crypto Rain from {rain.senderName}!
          </p>
          <p className="text-sm text-marble-400">
            Ξ {rain.amountPerClaim} each • {rain.claimedCount}/{rain.maxClaims} claimed • {timeLeft}
          </p>
        </div>
      </div>
      <button
        onClick={onClaim}
        className="btn-gold px-4 py-2 text-sm"
        disabled={rain.claimedCount >= rain.maxClaims}
      >
        Claim!
      </button>
    </div>
  );
}
