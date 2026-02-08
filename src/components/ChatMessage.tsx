'use client';

import { TrustBadge } from './TrustBadge';
import { SourceCard } from './SourceCard';
import type { MockSource } from '@/lib/mock-responses';
import type { TrustBadgeVariant } from './TrustBadge';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  sources?: MockSource[];
  trustBadges?: TrustBadgeVariant[];
}

function formatContent(text: string): React.ReactNode {
  // Remove inline badge placeholders; badges are rendered separately
  let remaining = text
    .replace(/\s*\[Official Rule\]\s*/g, ' ')
    .replace(/\s*\[Best Practice\]\s*/g, ' ')
    .replace(/\s*\[Flexible\]\s*/g, ' ')
    .trim();
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  const boldRegex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match;

  // Process code blocks first
  const segments: { type: 'text' | 'code'; content: string; lang?: string }[] = [];
  let lastEnd = 0;
  const codeMatches = Array.from(remaining.matchAll(codeBlockRegex));
  for (const m of codeMatches) {
    if (m.index! > lastEnd) {
      segments.push({ type: 'text', content: remaining.slice(lastEnd, m.index) });
    }
    segments.push({ type: 'code', content: m[2], lang: m[1] || 'text' });
    lastEnd = m.index! + m[0].length;
  }
  if (lastEnd < remaining.length) {
    segments.push({ type: 'text', content: remaining.slice(lastEnd) });
  }

  if (segments.length === 0) segments.push({ type: 'text', content: remaining });

  return (
    <div className="chat-message-content">
      {segments.map((seg, i) => {
        if (seg.type === 'code') {
          return (
            <pre key={i} className="chat-message-code">
              <code>{seg.content.trim()}</code>
            </pre>
          );
        }
        const lines = seg.content.split('\n');
        return (
          <span key={i}>
            {lines.map((line, j) => {
              if (line.startsWith('**') && line.endsWith('**')) {
                return <strong key={j}>{line.slice(2, -2)}</strong>;
              }
              const boldParts: React.ReactNode[] = [];
              let pos = 0;
              let bMatch;
              const re = /\*\*(.+?)\*\*/g;
              while ((bMatch = re.exec(line)) !== null) {
                boldParts.push(line.slice(pos, bMatch.index));
                boldParts.push(<strong key={`b-${bMatch.index}`}>{bMatch[1]}</strong>);
                pos = bMatch.index + bMatch[0].length;
              }
              boldParts.push(line.slice(pos));
              return (
                <span key={j}>
                  {boldParts}
                  {j < lines.length - 1 ? <br /> : null}
                </span>
              );
            })}
          </span>
        );
      })}
    </div>
  );
}

export function ChatMessage({
  role,
  content,
  sources = [],
  trustBadges = [],
}: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`chat-message chat-message--${role}`}>
      <div className="chat-message-bubble">
        {isUser ? (
          <p className="chat-message-text">{content}</p>
        ) : (
          <>
            {formatContent(content)}
            {trustBadges.length > 0 && (
              <div className="chat-message-badges">
                {trustBadges.map((v, i) => (
                  <TrustBadge key={i} variant={v} />
                ))}
              </div>
            )}
            {sources.length > 0 && (
              <div className="chat-message-sources">
                {sources.map((s, i) => (
                  <SourceCard
                    key={i}
                    type={s.type}
                    title={s.title}
                    url={s.url}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
