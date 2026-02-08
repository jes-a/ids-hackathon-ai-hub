'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Sparkles, ThumbsUp, ThumbsDown, Calendar, Github, Figma, FileCode, Video } from '@/components/icons';
import { useRole } from '@/contexts/RoleContext';
import { generateAIResponse } from '@/utils/aiResponses';
import { GuardianRecordModal } from '@/components/GuardianRecordModal';

const guidedQuestions = [
  'What are the specs for a DataTable?',
  'Show me the Button component props',
  "What's the spacing token for medium gaps?",
  'How do I implement accessible modals?',
  "What's the component maturity status?",
];

const PLACEHOLDER_PREFIX = 'Ask about ';
const placeholderSuggestions = [
  'carbon components, patterns, or guidelines...',
  'button component props',
  'accessible modals',
  'dataTable specs',
  'spacing tokens',
  'component maturity',
];

export function ChatInterface() {
  const { userRole, chatHistory, addMessage } = useRole();
  const isGuardian = userRole === 'guardian';
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [feedbackGivenForMessageIds, setFeedbackGivenForMessageIds] = useState<Set<string>>(new Set());
  const [showRecordModal, setShowRecordModal] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastQuestionRef = useRef<HTMLDivElement>(null);

  const handleFeedback = (messageId: string) => {
    setFeedbackGivenForMessageIds((prev) => new Set(prev).add(messageId));
  };

  const hasMessages = chatHistory.length > 0;

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.setSelectionRange(0, 0);
  }, []);

  /* Stop placeholder cycling when user has already asked (chat mode) */
  useEffect(() => {
    if (hasMessages) return;
    const interval = setInterval(() => {
      setSuggestionIndex((i) => (i + 1) % placeholderSuggestions.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [hasMessages]);

  /* Keep input focused after AI reply and when entering chat mode */
  useEffect(() => {
    if (!hasMessages) return;
    if (isTyping) return;
    const t = setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    return () => clearTimeout(t);
  }, [hasMessages, isTyping]);

  /* When answer is shown, scroll so the question is at the top; user scrolls down to read long answers */
  useEffect(() => {
    if (!hasMessages || isTyping) return;
    const last = chatHistory[chatHistory.length - 1];
    if (last?.role === 'assistant') {
      const t = setTimeout(() => {
        lastQuestionRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(t);
    }
  }, [chatHistory, isTyping, hasMessages]);

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
    }, 1500);
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
    }, 1500);
  };

  const handleUnhelpful = () => {
    alert(
      'Escalation options:\n\n• Contact Design System Guardian\n• Book Office Hours\n• Submit Feedback\n\nThese features would connect you with the Carbon team.'
    );
  };

  const renderComponentPreview = (preview: (typeof chatHistory)[number]['componentPreview']) => {
    if (!preview) return null;

    if (preview === 'datatable') {
      return (
        <div
          className="chat-component-preview"
          style={{
            backgroundColor: 'var(--carbon-layer-01)',
            borderColor: 'var(--carbon-border-subtle)',
            borderRadius: 'var(--carbon-radius)',
          }}
        >
          <p className="chat-component-preview-title" style={{ color: 'var(--carbon-text-secondary)' }}>
            Interactive example:
          </p>
          <div className="chat-component-table-wrap" style={{ borderColor: 'var(--carbon-border-subtle)' }}>
            <table className="chat-component-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Role</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Alex Chen', status: 'Active', role: 'Developer', location: 'San Francisco' },
                  { name: 'Jordan Smith', status: 'Active', role: 'Designer', location: 'New York' },
                  { name: 'Morgan Lee', status: 'Inactive', role: 'PM', location: 'Austin' },
                  { name: 'Casey Rivera', status: 'Active', role: 'Developer', location: 'Seattle' },
                ].map((row) => (
                  <tr key={row.name}>
                    <td>{row.name}</td>
                    <td>{row.status}</td>
                    <td>{row.role}</td>
                    <td>{row.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (preview === 'button') {
      return (
        <div
          className="chat-component-preview"
          style={{
            backgroundColor: 'var(--carbon-layer-01)',
            borderColor: 'var(--carbon-border-subtle)',
            borderRadius: 'var(--carbon-radius)',
          }}
        >
          <p className="chat-component-preview-title" style={{ color: 'var(--carbon-text-secondary)' }}>
            Interactive example:
          </p>
          <div className="chat-component-button-row">
            <button
              type="button"
              className="chat-component-button"
              style={{
                backgroundColor: 'var(--carbon-interactive)',
                borderColor: 'var(--carbon-interactive)',
                color: 'var(--carbon-text-on-color)',
              }}
            >
              Primary Button
            </button>
            <button
              type="button"
              className="chat-component-button"
              style={{
                backgroundColor: 'transparent',
                borderColor: 'var(--carbon-interactive)',
                color: 'var(--carbon-interactive)',
              }}
            >
              Secondary
            </button>
            <button
              type="button"
              className="chat-component-button ghost"
              style={{
                backgroundColor: 'transparent',
                borderColor: 'transparent',
                color: 'var(--carbon-interactive)',
              }}
            >
              Ghost
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  const chatInputBlock = (
    <div className="chat-input-wrap">
      <div className="chat-input-inner">
        <div className="chat-input-row">
          <div className="chat-input-prefix-wrap">
            {!input && (
              <div className="chat-input-placeholder-overlay" aria-hidden>
                <span className="chat-input-placeholder-prefix">{PLACEHOLDER_PREFIX}</span>
                <span
                  key={suggestionIndex}
                  className="chat-input-placeholder-suggestion"
                  style={{ color: 'var(--carbon-text-placeholder)' }}
                >
                  {placeholderSuggestions[suggestionIndex]}
                </span>
              </div>
            )}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder=""
              className="chat-input chat-input-with-prefix"
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
                e.currentTarget.setSelectionRange(0, 0);
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--carbon-border-subtle)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
          {input.trim() && (
            <button
              type="button"
              onClick={handleSend}
              className="chat-send"
              style={{
                backgroundColor: 'var(--carbon-interactive)',
                borderColor: 'var(--carbon-interactive)',
                color: 'var(--carbon-text-on-color)',
                borderRadius: 'var(--carbon-radius)',
                fontSize: '16px',
                fontWeight: '500',
              }}
            >
              <Send width={20} height={20} />
              <span>Send</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`hub-view${hasMessages ? ' hub-view--chat-mode' : ''}`}>
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

      {!hasMessages && chatInputBlock}

      <div
        ref={chatContainerRef}
        className="hub-view-scroll"
        style={{ backgroundColor: 'var(--carbon-bg-primary)' }}
      >
        {chatHistory.length === 0 ? (
          <div className="chat-empty">
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
            {(() => {
              let lastUserIndex = -1;
              for (let i = chatHistory.length - 1; i >= 0; i--) {
                if (chatHistory[i].role === 'user') {
                  lastUserIndex = i;
                  break;
                }
              }
              return chatHistory.map((message, index) => {
                const isLastUserMessage = message.role === 'user' && index === lastUserIndex;
                return (
              <div
                key={message.id}
                className={`chat-thread-item ${message.role === 'user' ? 'chat-thread-item-user' : ''}`}
                ref={isLastUserMessage ? lastQuestionRef : undefined}
              >
                <div
                  className={`chat-bubble ${message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}
                  style={{
                    backgroundColor:
                      message.role === 'user' ? 'transparent' : 'var(--carbon-layer-01)',
                    borderColor:
                      message.role === 'user' ? 'transparent' : 'var(--carbon-border-subtle)',
                    borderWidth: message.role === 'user' ? 0 : undefined,
                    color:
                      message.role === 'user' ? 'var(--carbon-text-primary)' : 'var(--carbon-text-primary)',
                    borderRadius: 'var(--carbon-radius)',
                    ...(message.role === 'user' && {
                      fontWeight: 'bold',
                      textAlign: 'left',
                    }),
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
                  {message.role === 'user' && (
                    <div
                      className="chat-user-question-label"
                      style={{
                        fontSize: '1rem',
                        fontWeight: 400,
                        color: 'var(--carbon-text-secondary)',
                        marginBottom: '0.25rem',
                      }}
                    >
                      You are asking:
                    </div>
                  )}
                  {message.role === 'assistant' ? (
                    <div className="chat-markdown">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  )}
                </div>

                {message.role === 'assistant' && message.componentPreview && renderComponentPreview(message.componentPreview)}

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
                            {source.type === 'figma' && <Figma width={20} height={20} />}
                            {source.type === 'storybook' && <FileCode width={20} height={20} />}
                            {source.type === 'github' && <Github width={20} height={20} />}
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

                {message.role === 'assistant' && isGuardian && message.suggestVideoAnswer && (
                  <div
                    className="chat-record-answer"
                    style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      backgroundColor: 'var(--carbon-layer-01)',
                      border: '1px solid var(--carbon-border-subtle)',
                      borderRadius: 'var(--carbon-radius)',
                    }}
                  >
                    <p className="text-sm mb-2" style={{ color: 'var(--carbon-text-secondary)' }}>
                      Optional: A recorded answer can be shared with the requester and added to the knowledge base.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowRecordModal(true)}
                      className="chat-action-button"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        backgroundColor: 'var(--carbon-interactive)',
                        borderColor: 'var(--carbon-interactive)',
                        color: 'var(--carbon-text-on-color)',
                        borderRadius: 'var(--carbon-radius)',
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    >
                      <Video width={18} height={18} />
                      <span>Record an answer</span>
                    </button>
                  </div>
                )}

                {message.role === 'assistant' && (
                  <div className="chat-actions">
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
                    {!feedbackGivenForMessageIds.has(message.id) && (
                      <div className="chat-actions-row">
                        <button
                          onClick={() => handleFeedback(message.id)}
                          className="chat-action-button chat-action-button-small"
                          style={{
                            backgroundColor: 'transparent',
                            borderColor: 'var(--carbon-border-subtle)',
                            color: 'var(--carbon-text-secondary)',
                            borderRadius: 'var(--carbon-radius)',
                          }}
                        >
                          <ThumbsUp width={14} height={14} />
                          <span>Helpful</span>
                        </button>
                        <button
                          onClick={() => {
                            handleFeedback(message.id);
                            handleUnhelpful();
                          }}
                          className="chat-action-button chat-action-button-small"
                          style={{
                            backgroundColor: 'transparent',
                            borderColor: 'var(--carbon-border-subtle)',
                            color: 'var(--carbon-text-secondary)',
                            borderRadius: 'var(--carbon-radius)',
                          }}
                        >
                          <ThumbsDown width={14} height={14} />
                          <span>Unhelpful?</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
                );
              });
            })()}

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

      {hasMessages && chatInputBlock}

      <GuardianRecordModal
        open={showRecordModal}
        onClose={() => setShowRecordModal(false)}
      />
    </div>
  );
}
