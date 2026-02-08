'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@carbon/react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatSidebar } from './ChatSidebar';
import { welcomeByRole, getMockResponse, type MockResponse } from '@/lib/mock-responses';
import type { Role } from '@/lib/roles';

export interface ChatMessageEntry {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: MockResponse['sources'];
  trustBadges?: MockResponse['trustBadges'];
}

const TYPING_DELAY_MS = 1200;
const STREAM_DURATION_MS = 1500;

function generateId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface ChatShellProps {
  role: Role;
}

export function ChatShell({ role }: ChatShellProps) {
  const welcome = welcomeByRole[role];
  const [messages, setMessages] = useState<ChatMessageEntry[]>(() => [
    {
      id: generateId(),
      role: 'assistant',
      content: welcome.text,
      sources: [],
      trustBadges: [],
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingMeta, setStreamingMeta] = useState<{
    sources: MockResponse['sources'];
    trustBadges: MockResponse['trustBadges'];
  } | null>(null);
  const abortRef = useRef(false);

  const addAssistantMessage = useCallback(
    (content: string, sources: MockResponse['sources'], trustBadges: MockResponse['trustBadges']) => {
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: 'assistant',
          content,
          sources: sources ?? [],
          trustBadges: trustBadges ?? [],
        },
      ]);
      setStreamingContent('');
      setStreamingMeta(null);
      setIsTyping(false);
    },
    []
  );

  const streamIn = useCallback(
    (fullContent: string, sources: MockResponse['sources'], trustBadges: MockResponse['trustBadges']) => {
      const chars = fullContent.split('');
      const total = chars.length;
      const duration = STREAM_DURATION_MS;
      const interval = Math.max(20, duration / total);
      let index = 0;
      const timer = setInterval(() => {
        if (abortRef.current) {
          clearInterval(timer);
          return;
        }
        index += 1;
        setStreamingContent(chars.slice(0, index).join(''));
        if (index >= total) {
          clearInterval(timer);
          addAssistantMessage(fullContent, sources, trustBadges);
        }
      }, interval);
    },
    [addAssistantMessage]
  );

  const handleSubmit = useCallback(
    (userMessage: string) => {
      setMessages((prev) => [
        ...prev,
        { id: generateId(), role: 'user', content: userMessage },
      ]);
      setIsTyping(true);
      abortRef.current = false;

      setTimeout(() => {
        if (abortRef.current) return;
        const response = getMockResponse(userMessage, role);
        streamIn(response.content, response.sources, response.trustBadges ?? []);
      }, TYPING_DELAY_MS);
    },
    [role, streamIn]
  );

  const handleSuggestionClick = useCallback(
    (question: string) => {
      handleSubmit(question);
    },
    [handleSubmit]
  );

  return (
    <div className="chat-shell">
      <ChatSidebar role={role} />
      <div className="chat-main">
        <header className="chat-header">
          <h1 className="chat-header-title">
            AI powered design system assistant
          </h1>
          <p className="chat-header-subtitle">
            Get instant answers about Carbon components, tokens, and guidelines
          </p>
        </header>
        <div className="chat-messages-wrap">
          <div className="chat-messages">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                role={msg.role}
                content={msg.content}
                sources={msg.sources}
                trustBadges={msg.trustBadges}
              />
            ))}
            {isTyping && !streamingContent && (
              <div className="chat-message chat-message--assistant">
                <div className="chat-message-bubble chat-typing-indicator">
                  <span className="chat-typing-dot" />
                  <span className="chat-typing-dot" />
                  <span className="chat-typing-dot" />
                </div>
              </div>
            )}
            {streamingContent && (
              <div className="chat-message chat-message--assistant">
                <div className="chat-message-bubble">
                  <div className="chat-message-content chat-message-streaming">
                    <span style={{ whiteSpace: 'pre-wrap' }}>{streamingContent}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="chat-suggestions">
          {messages.length === 1 &&
            welcome.suggestedQuestions.map((q, i) => (
              <Button
                key={i}
                kind="tertiary"
                size="sm"
                onClick={() => handleSuggestionClick(q)}
                className="chat-suggestion-pill"
              >
                {q}
              </Button>
            ))}
        </div>
        <div className="chat-input-area">
          <ChatInput onSubmit={handleSubmit} disabled={isTyping} />
        </div>
      </div>
    </div>
  );
}
