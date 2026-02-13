'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, ThumbsUp, ThumbsDown, Calendar, Github, Figma, FileCode, Video, CheckCircle } from '@/components/icons';
import { ArrowRight, ColorPalette, Code } from '@carbon/icons-react';
import { useRole, type OfficeHoursGuardian } from '@/contexts/RoleContext';
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
  const [feedbackGivenForMessageIds, setFeedbackGivenForMessageIds] = useState<Map<string, 'helpful' | 'unhelpful'>>(new Map());
  const [showRecordModal, setShowRecordModal] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastAssistantRef = useRef<HTMLDivElement>(null);

  const handleFeedback = (messageId: string, type: 'helpful' | 'unhelpful') => {
    setFeedbackGivenForMessageIds((prev) => new Map(prev).set(messageId, type));
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

  /* When a new assistant reply appears, scroll it to the top of the viewport so the user sees the beginning */
  useEffect(() => {
    if (!hasMessages || isTyping) return;
    const last = chatHistory[chatHistory.length - 1];
    if (last?.role === 'assistant') {
      const t = setTimeout(() => {
        lastAssistantRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
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
    addMessage({
      role: 'assistant',
      content: 'Sorry to hear that wasn\'t helpful. Here are some ways I can assist you further:',
      suggestedQuestions: [
        'Book office hours with a guardian',
        'Rephrase my question',
        'Show me the Carbon documentation',
        'What components are available?',
      ],
    });
  };

  /* ── Office hours booking flow ─────────────────────────── */

  const designerGuardians: OfficeHoursGuardian[] = [
    { name: 'Sarah Chen', specialty: 'Component patterns & layout', nextSlot: 'Tomorrow at 10:00 AM', avatar: 'SC' },
    { name: 'Marcus Rivera', specialty: 'Color, typography & theming', nextSlot: 'Tomorrow at 2:00 PM', avatar: 'MR' },
    { name: 'Aisha Patel', specialty: 'Accessibility & inclusive design', nextSlot: 'Wed at 11:00 AM', avatar: 'AP' },
  ];

  const developerGuardians: OfficeHoursGuardian[] = [
    { name: 'James O\'Brien', specialty: 'React components & hooks', nextSlot: 'Tomorrow at 11:30 AM', avatar: 'JO' },
    { name: 'Lin Wei', specialty: 'Theming, tokens & SCSS', nextSlot: 'Tomorrow at 3:00 PM', avatar: 'LW' },
    { name: 'Priya Sharma', specialty: 'Testing & accessibility APIs', nextSlot: 'Thu at 9:00 AM', avatar: 'PS' },
  ];

  const handleBookOfficeHours = () => {
    addMessage({
      role: 'assistant',
      content: 'I can help you book a session with a design system guardian. What type of guardian would you like to speak with?',
      officeHours: { step: 'select-role' },
    });
  };

  const handleSelectGuardianRole = (role: 'designer' | 'developer') => {
    const label = role === 'designer' ? 'Designer' : 'Developer';
    addMessage({
      role: 'user',
      content: `I'd like to speak with a ${label} guardian`,
    });

    setIsTyping(true);
    setTimeout(() => {
      const guardians = role === 'designer' ? designerGuardians : developerGuardians;
      addMessage({
        role: 'assistant',
        content: `Here are the available ${label} guardians and their next open slots:`,
        officeHours: { step: 'select-guardian', role, guardians },
      });
      setIsTyping(false);
    }, 800);
  };

  const handleBookGuardian = (guardian: OfficeHoursGuardian) => {
    addMessage({
      role: 'user',
      content: `Book with ${guardian.name} — ${guardian.nextSlot}`,
    });

    setIsTyping(true);
    setTimeout(() => {
      addMessage({
        role: 'assistant',
        content: `Your office hours session has been booked.`,
        officeHours: {
          step: 'confirmed',
          booking: {
            guardian: guardian.name,
            time: guardian.nextSlot,
            specialty: guardian.specialty,
          },
        },
      });

      /* Follow-up message asking if the user needs more help */
      setTimeout(() => {
        addMessage({
          role: 'assistant',
          content: 'Is there anything else I can help you with?',
          suggestedQuestions: [
            'What are the specs for a DataTable?',
            'Show me the Button component props',
            'What\'s the spacing token for medium gaps?',
            'How do I implement accessible modals?',
          ],
        });
        setIsTyping(false);
      }, 600);
    }, 1000);
  };

  const renderOfficeHours = (officeHours: NonNullable<(typeof chatHistory)[number]['officeHours']>) => {
    if (officeHours.step === 'select-role') {
      return (
        <div className="chat-oh-grid">
          <button type="button" className="chat-oh-card" onClick={() => handleSelectGuardianRole('designer')}>
            <div className="chat-oh-card-accent" />
            <div className="chat-oh-card-body">
              <div className="chat-oh-card-icon">
                <ColorPalette size={24} fill="var(--carbon-interactive)" />
              </div>
              <div>
                <h4 className="chat-oh-card-title">Designer guardian</h4>
                <p className="chat-oh-card-desc">Visual specs, tokens, patterns & Figma guidance</p>
              </div>
              <ArrowRight size={16} className="chat-oh-card-arrow" />
            </div>
          </button>
          <button type="button" className="chat-oh-card" onClick={() => handleSelectGuardianRole('developer')}>
            <div className="chat-oh-card-accent" />
            <div className="chat-oh-card-body">
              <div className="chat-oh-card-icon">
                <Code size={24} fill="var(--carbon-interactive)" />
              </div>
              <div>
                <h4 className="chat-oh-card-title">Developer guardian</h4>
                <p className="chat-oh-card-desc">React components, props, theming & code</p>
              </div>
              <ArrowRight size={16} className="chat-oh-card-arrow" />
            </div>
          </button>
        </div>
      );
    }

    if (officeHours.step === 'select-guardian' && officeHours.guardians) {
      return (
        <div className="chat-oh-guardian-grid">
          {officeHours.guardians.map((g) => (
            <button key={g.name} type="button" className="chat-oh-guardian-card" onClick={() => handleBookGuardian(g)}>
              <div className="chat-oh-avatar">{g.avatar}</div>
              <div className="chat-oh-guardian-info">
                <span className="chat-oh-guardian-name">{g.name}</span>
                <span className="chat-oh-guardian-specialty">{g.specialty}</span>
                <span className="chat-oh-guardian-slot">
                  <Calendar width={12} height={12} />
                  {g.nextSlot}
                </span>
              </div>
              <ArrowRight size={16} className="chat-oh-card-arrow" />
            </button>
          ))}
        </div>
      );
    }

    if (officeHours.step === 'confirmed' && officeHours.booking) {
      return (
        <div className="chat-oh-confirmed">
          <div className="chat-oh-confirmed-header">
            <CheckCircle width={24} height={24} style={{ color: 'var(--carbon-support-success)' }} />
            <span className="chat-oh-confirmed-title">Meeting booked</span>
          </div>
          <div className="chat-oh-confirmed-details">
            <div className="chat-oh-confirmed-row">
              <span className="chat-oh-confirmed-label">Guardian</span>
              <span className="chat-oh-confirmed-value">{officeHours.booking.guardian}</span>
            </div>
            <div className="chat-oh-confirmed-row">
              <span className="chat-oh-confirmed-label">Specialty</span>
              <span className="chat-oh-confirmed-value">{officeHours.booking.specialty}</span>
            </div>
            <div className="chat-oh-confirmed-row">
              <span className="chat-oh-confirmed-label">When</span>
              <span className="chat-oh-confirmed-value">{officeHours.booking.time}</span>
            </div>
          </div>
          <p className="chat-oh-confirmed-note">
            <Calendar width={14} height={14} />
            Added to your calendar
          </p>
        </div>
      );
    }

    return null;
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
        className="hub-view-header hub-dark-header"
        style={{
          backgroundColor: '#161616',
          borderColor: '#262626',
        }}
      >
        <h1>AI-powered design system assistant</h1>
        <p>Ask questions about Carbon components, patterns, and guidelines</p>
      </header>

      {!hasMessages && chatInputBlock}

      <div
        ref={chatContainerRef}
        className="hub-view-scroll"
        style={{ backgroundColor: 'var(--carbon-bg-primary)' }}
      >
        {chatHistory.length === 0 ? (
          <div className="chat-empty">
            <p className="chat-empty-label">Suggested questions</p>
            <div className="chat-empty-grid">
              {guidedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionClick(question)}
                  className="chat-empty-card"
                >
                  <span>{question}</span>
                  <ArrowRight size={16} className="chat-empty-card-arrow" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="chat-thread">
            {(() => {
              let lastAssistantIndex = -1;
              for (let i = chatHistory.length - 1; i >= 0; i--) {
                if (chatHistory[i].role === 'assistant') {
                  lastAssistantIndex = i;
                  break;
                }
              }
              return chatHistory.map((message, index) => {
                const isLastAssistantMessage = message.role === 'assistant' && index === lastAssistantIndex;
                return (
              <div
                key={message.id}
                className={`chat-thread-item ${message.role === 'user' ? 'chat-thread-item-user' : ''}`}
                ref={isLastAssistantMessage ? lastAssistantRef : undefined}
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

                {message.role === 'assistant' && message.officeHours && renderOfficeHours(message.officeHours)}

                {message.role === 'assistant' && message.suggestedQuestions && message.suggestedQuestions.length > 0 && (
                  <div className="chat-suggestions">
                    {message.suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="chat-suggestion-btn"
                        onClick={() => {
                          if (q === 'Book office hours with a guardian') {
                            handleBookOfficeHours();
                          } else {
                            handleQuestionClick(q);
                          }
                        }}
                      >
                        <span>{q}</span>
                        <ArrowRight size={16} className="chat-suggestion-arrow" />
                      </button>
                    ))}
                  </div>
                )}

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

                {message.role === 'assistant' && !message.officeHours && (
                  <div className="chat-actions">
                    <button
                      onClick={handleBookOfficeHours}
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
                    {!feedbackGivenForMessageIds.has(message.id) ? (
                      <div className="chat-actions-row">
                        <button
                          onClick={() => handleFeedback(message.id, 'helpful')}
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
                            handleFeedback(message.id, 'unhelpful');
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
                    ) : (
                      <span className="chat-feedback-confirmation">
                        {feedbackGivenForMessageIds.get(message.id) === 'helpful' ? (
                          <>
                            <CheckCircle width={14} height={14} style={{ color: 'var(--carbon-support-success)' }} />
                            Thanks for the feedback!
                          </>
                        ) : (
                          <>
                            <ThumbsDown width={14} height={14} />
                            Feedback recorded
                          </>
                        )}
                      </span>
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
