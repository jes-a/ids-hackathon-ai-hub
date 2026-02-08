'use client';

import { useState, useCallback } from 'react';
import { TextArea, Button } from '@carbon/react';
import { Send } from '@carbon/icons-react';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSubmit, disabled }: ChatInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue('');
  }, [value, disabled, onSubmit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className="chat-input-wrap">
      <TextArea
        labelText=""
        placeholder="Ask about Carbon tokens, components, or guidelines..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={2}
        className="chat-input-textarea"
      />
      <Button
        kind="primary"
        renderIcon={Send}
        iconDescription="Send"
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        className="chat-input-button"
      >
        Send
      </Button>
    </div>
  );
}
