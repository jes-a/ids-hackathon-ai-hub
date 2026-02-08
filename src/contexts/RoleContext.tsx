'use client';

import React, { createContext, useContext, useState } from 'react';

export type UserRole =
  | 'developer'
  | 'designer'
  | 'guardian'
  | 'product-manager'
  | 'project-owner'
  | null;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: {
    title: string;
    type: 'figma' | 'storybook' | 'github' | 'chromatic';
    url: string;
  }[];
  trustBadge?: 'official' | 'best-practice';
  timestamp: Date;
}

interface RoleContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  chatHistory: ChatMessage[];
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    setChatHistory((prev) => [...prev, newMessage]);
  };

  const clearHistory = () => {
    setChatHistory([]);
  };

  return (
    <RoleContext.Provider value={{ userRole, setUserRole, chatHistory, addMessage, clearHistory }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within RoleProvider');
  }
  return context;
}
