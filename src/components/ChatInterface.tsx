'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, ThumbsDown, Calendar } from '@/components/icons';
import { useRole } from '@/contexts/RoleContext';
import { generateAIResponse } from '@/utils/aiResponses';

const guidedQuestions = [
  'What are the specs for a DataTable?',
  'Show me the Button component props',
  "What's the spacing token for medium gaps?",
  'How do I implement accessible modals?',
  "What's the component maturity status?",
];

export function ChatInterface() {
  const { userRole, chatHistory, addMessage } = useRole();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  const handleSend = () => {
    if (!input.trim() || !userRole) return;

    const userMessage = input.trim();
    setInput('');

    addMessage({
      role: 'user',
      content: userMessage,
    });

    setIsTyping(true);
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage, userRole);
      addMessage(aiResponse);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuestionClick = (question: string) => {
    if (!userRole) return;

    addMessage({
      role: 'user',
      content: question,
    });

    setIsTyping(true);
    setTimeout(() => {
      const aiResponse = generateAIResponse(question, userRole);
      addMessage(aiResponse);
      setIsTyping(false);
    }, 1000);
  };

  const handleUnhelpful = () => {
    alert(
      'Escalation options:\n\n• Contact Design System Guardian\n• Book Office Hours\n• Submit Feedback\n\nThese features would connect you with the Carbon team.'
    );
  };

  return (
    <div className="hub-view">
      <header
        className="hub-view-header"
        style={{
          backgroundColor: 'var(--carbon-bg-secondary)',
          borderColor: 'var(--carbon-border-subtle)',
        }}
      >
        <div className="hub-view-header-title">
          <Sparkles width={24} height={24} style={{ color: 'var(--carbon-interactive)' }} />
          <h1 className="text-2xl" style={{ color: 'var(--carbon-text-primary)' }}>
            AI-powered design system assistant
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--carbon-text-secondary)' }}>
          Ask questions about Carbon components, patterns, and guidelines
        </p>
      </header>

      <div
        ref={chatContainerRef}
        className="hub-view-scroll"
        style={{ backgroundColor: 'var(--carbon-bg-primary)' }}
      >
        {chatHistory.length === 0 ? (
          <div className="chat-empty">
            <div className="chat-empty-header">
              <h2 className="text-xl mb-4" style={{ color: 'var(--carbon-text-primary)' }}>
                Guided question framing
              </h2>
              <p className="text-sm mb-6" style={{ color: 'var(--carbon-text-secondary)' }}>
                Try these example questions to get started
              </p>
            </div>

            <div className="chat-empty-grid">
              {guidedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionClick(question)}
                  className="chat-empty-card"
                  style={{
                    backgroundColor: 'var(--carbon-layer-01)',
                    borderColor: 'var(--carbon-border-subtle)',
                    color: 'var(--carbon-text-primary)',
                    borderRadius: 'var(--carbon-radius)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--carbon-bg-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--carbon-layer-01)';
                  }}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="chat-thread">
            {chatHistory.map((message) => (
              <div key={message.id} className="chat-thread-item">
                <div
                  className={`chat-bubble ${message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}
                  style={{
                    backgroundColor:
                      message.role === 'user' ? 'var(--carbon-interactive)' : 'var(--carbon-layer-01)',
                    borderColor:
                      message.role === 'user' ? 'var(--carbon-interactive)' : 'var(--carbon-border-subtle)',
                    color:
                      message.role === 'user' ? 'var(--carbon-text-on-color)' : 'var(--carbon-text-primary)',
                    borderRadius: 'var(--carbon-radius)',
                  }}
                >
                  {message.role === 'assistant' && message.trustBadge && (
                    <div className="chat-bubble-badge">
                      <span
                        className="chat-bubble-badge-pill"
                        style={{
                          backgroundColor:
                            message.trustBadge === 'official'
                              ? 'var(--carbon-interactive)'
                              : 'var(--carbon-bg-secondary)',
                          color:
                            message.trustBadge === 'official'
                              ? 'var(--carbon-text-on-color)'
                              : 'var(--carbon-text-secondary)',
                          borderColor:
                            message.trustBadge === 'official'
                              ? 'var(--carbon-interactive)'
                              : 'var(--carbon-border-subtle)',
                          borderRadius: 'var(--carbon-radius)',
                        }}
                      >
                        {message.trustBadge === 'official' ? '✓ Official Rule' : 'Best Practice'}
                      </span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>

                {message.role === 'assistant' && message.sources && message.sources.length > 0 && (
                  <div className="chat-sources">
                    <p className="text-xs px-2" style={{ color: 'var(--carbon-text-placeholder)' }}>
                      Sources & Actions
                    </p>
                    <div className="chat-sources-grid">
                      {message.sources.map((source, idx) => (
                        <a
                          key={idx}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="chat-source-card"
                          style={{
                            backgroundColor: 'var(--carbon-layer-01)',
                            borderColor: 'var(--carbon-border-subtle)',
                            borderRadius: 'var(--carbon-radius)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--carbon-interactive)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--carbon-border-subtle)';
                          }}
                        >
                          <div
                            className="chat-source-card-icon"
                            style={{
                              borderColor: 'var(--carbon-border-subtle)',
                              color: 'var(--carbon-text-secondary)',
                              borderRadius: 'var(--carbon-radius)',
                            }}
                          >
                            {source.type === 'figma' && 'F'}
                            {source.type === 'storybook' && 'S'}
                            {source.type === 'github' && 'G'}
                            {source.type === 'chromatic' && 'C'}
                          </div>
                          <span className="text-sm" style={{ color: 'var(--carbon-text-primary)' }}>
                            {source.title}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {message.role === 'assistant' && (
                  <div className="chat-actions">
                    <button
                      onClick={handleUnhelpful}
                      className="chat-action-button"
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: 'var(--carbon-border-subtle)',
                        color: 'var(--carbon-text-secondary)',
                        borderRadius: 'var(--carbon-radius)',
                      }}
                    >
                      <ThumbsDown width={16} height={16} />
                      <span>Unhelpful?</span>
                    </button>
                    <button
                      onClick={() => alert('Office hours booking would open here')}
                      className="chat-action-button"
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: 'var(--carbon-border-subtle)',
                        color: 'var(--carbon-text-secondary)',
                        borderRadius: 'var(--carbon-radius)',
                      }}
                    >
                      <Calendar width={16} height={16} />
                      <span>Book office hours</span>
                    </button>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div
                className="chat-bubble chat-bubble-assistant"
                style={{
                  backgroundColor: 'var(--carbon-layer-01)',
                  borderColor: 'var(--carbon-border-subtle)',
                  borderRadius: 'var(--carbon-radius)',
                }}
              >
                <div className="chat-typing">
                  <div
                    className="chat-typing-dot"
                    style={{ backgroundColor: 'var(--carbon-text-placeholder)', animationDelay: '0ms' }}
                  />
                  <div
                    className="chat-typing-dot"
                    style={{ backgroundColor: 'var(--carbon-text-placeholder)', animationDelay: '150ms' }}
                  />
                  <div
                    className="chat-typing-dot"
                    style={{ backgroundColor: 'var(--carbon-text-placeholder)', animationDelay: '300ms' }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div
        className="chat-input-wrap"
        style={{
          backgroundColor: 'var(--carbon-bg-secondary)',
          borderColor: 'var(--carbon-interactive)',
        }}
      >
        <div className="chat-input-inner">
          <div className="chat-input-row">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about Carbon components, patterns, or guidelines..."
              className="chat-input"
              style={{
                backgroundColor: 'var(--carbon-field)',
                color: 'var(--carbon-text-primary)',
                borderColor: 'var(--carbon-border-subtle)',
                borderRadius: 'var(--carbon-radius)',
                fontFamily: 'var(--carbon-font-family)',
                fontSize: '16px',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--carbon-interactive)';
                e.currentTarget.style.boxShadow = '0 0 0 2px var(--carbon-interactive-transparent)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--carbon-border-subtle)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="chat-send"
              style={{
                backgroundColor: input.trim() ? 'var(--carbon-interactive)' : 'var(--carbon-bg-hover)',
                borderColor: input.trim() ? 'var(--carbon-interactive)' : 'var(--carbon-border-subtle)',
                color: 'var(--carbon-text-on-color)',
                borderRadius: 'var(--carbon-radius)',
                opacity: input.trim() ? 1 : 0.5,
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                fontSize: '16px',
                fontWeight: '500',
              }}
            >
              <Send width={20} height={20} />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
