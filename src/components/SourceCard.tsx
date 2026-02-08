'use client';

import { Book, Code, LogoGithub, Pen } from '@carbon/icons-react';
import type { SourceType } from '@/lib/knowledge-sources';

interface SourceCardProps {
  type: SourceType;
  title: string;
  url: string;
}

const iconMap = {
  documentation: Book,
  storybook: Code,
  github: LogoGithub,
  figma: Pen,
};

function truncateUrl(url: string, maxLen = 45): string {
  if (url.length <= maxLen) return url;
  return url.slice(0, maxLen - 3) + '...';
}

export function SourceCard({ type, title, url }: SourceCardProps) {
  const Icon = iconMap[type];

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="source-card"
    >
      <div className="source-card-inner">
        <Icon size={20} className="source-card-icon" />
        <div className="source-card-text">
          <span className="source-card-title">{title}</span>
          <span className="source-card-url">{truncateUrl(url)}</span>
        </div>
      </div>
    </a>
  );
}
