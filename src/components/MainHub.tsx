'use client';

import { useEffect, useState } from 'react';
import {
  MessageSquare,
  Upload,
  BookOpen,
  Code2,
  Palette,
  BarChart3,
  Shield,
  Activity,
  TrendingUp,
  Github,
  Figma,
  FileCode,
  LogOut,
} from '@/components/icons';
import { useRole } from '@/contexts/RoleContext';
import { useRouter } from 'next/navigation';
import { ChatInterface } from '@/components/ChatInterface';
import { UIAuditUpload } from '@/components/UIAuditUpload';
import { GuardianDashboard } from '@/components/GuardianDashboard';
import { ComponentHealth } from '@/components/ComponentHealth';
import { TrendInsights } from '@/components/TrendInsights';

type StandardView = 'chat' | 'audit' | 'docs';
type GuardianView = 'dashboard' | 'health' | 'insights';

export function MainHub() {
  const { userRole, setUserRole, clearHistory } = useRole();
  const router = useRouter();
  const [standardView, setStandardView] = useState<StandardView>('chat');
  const [guardianView, setGuardianView] = useState<GuardianView>('dashboard');

  useEffect(() => {
    if (!userRole) {
      router.push('/');
    }
  }, [userRole, router]);

  const handleLogout = () => {
    setUserRole(null);
    clearHistory();
    router.push('/');
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case 'guardian':
        return 'Guardian';
      case 'developer':
        return 'Developer';
      case 'designer':
        return 'Designer';
      default:
        return 'User';
    }
  };

  const isGuardian = userRole === 'guardian';

  const roleIconProps = { width: 16, height: 16, style: { color: 'var(--carbon-interactive)' } as React.CSSProperties };
  const renderRoleIcon = () => {
    switch (userRole) {
      case 'guardian':
        return <Shield {...roleIconProps} />;
      case 'developer':
        return <Code2 {...roleIconProps} />;
      case 'designer':
        return <Palette {...roleIconProps} />;
      default:
        return <MessageSquare {...roleIconProps} />;
    }
  };

  return (
    <div className="hub-root" style={{ backgroundColor: 'var(--carbon-bg-primary)' }}>
      <aside
        className="hub-sidebar"
        style={{
          backgroundColor: 'var(--carbon-bg-secondary)',
          borderColor: 'var(--carbon-border-subtle)',
        }}
      >
        <div className="hub-sidebar-header" style={{ borderColor: 'var(--carbon-border-subtle)' }}>
          <button
            type="button"
            className="hub-sidebar-title-row"
            onClick={() => router.push('/')}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
            aria-label="Go to home"
          >
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" fill="var(--carbon-interactive)" />
              <path d="M8 8h16v4H8V8zm0 6h16v4H8v-4zm0 6h10v4H8v-4z" fill="white" />
            </svg>
            <span className="hub-sidebar-title" style={{ color: 'var(--carbon-text-primary)' }}>
              Carbon AI Hub
            </span>
          </button>
          <div
            className="hub-sidebar-role"
            style={{
              backgroundColor: 'var(--carbon-bg-primary)',
              borderColor: 'var(--carbon-border-subtle)',
              borderRadius: 'var(--carbon-radius)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.75rem',
            }}
            aria-label={`Signed in as ${getRoleLabel()}`}
          >
            {renderRoleIcon()}
            <span className="hub-sidebar-role-label" style={{ color: 'var(--carbon-text-secondary)' }}>
              {getRoleLabel()}
            </span>
          </div>
        </div>

        {isGuardian && (
          <nav className="hub-sidebar-nav">
            <div className="hub-sidebar-nav-group">
              <button
                onClick={() => setGuardianView('dashboard')}
                className="hub-nav-button"
                style={{
                  backgroundColor: guardianView === 'dashboard' ? 'var(--carbon-bg-hover)' : 'transparent',
                  borderColor: guardianView === 'dashboard' ? 'var(--carbon-border-subtle)' : 'transparent',
                  color: 'var(--carbon-text-primary)',
                  borderRadius: 'var(--carbon-radius)',
                }}
              >
                <BarChart3 width={20} height={20} />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setGuardianView('health')}
                className="hub-nav-button"
                style={{
                  backgroundColor: guardianView === 'health' ? 'var(--carbon-bg-hover)' : 'transparent',
                  borderColor: guardianView === 'health' ? 'var(--carbon-border-subtle)' : 'transparent',
                  color: 'var(--carbon-text-primary)',
                  borderRadius: 'var(--carbon-radius)',
                }}
              >
                <Activity width={20} height={20} />
                <span>Component Health</span>
              </button>
              <button
                onClick={() => setGuardianView('insights')}
                className="hub-nav-button"
                style={{
                  backgroundColor: guardianView === 'insights' ? 'var(--carbon-bg-hover)' : 'transparent',
                  borderColor: guardianView === 'insights' ? 'var(--carbon-border-subtle)' : 'transparent',
                  color: 'var(--carbon-text-primary)',
                  borderRadius: 'var(--carbon-radius)',
                }}
              >
                <TrendingUp width={20} height={20} />
                <span>Insights</span>
              </button>
            </div>

            <div
              className="hub-sidebar-links"
              style={{ borderColor: 'var(--carbon-border-subtle)' }}
            >
              <div className="hub-sidebar-links-label" style={{ color: 'var(--carbon-text-placeholder)' }}>
                Quick links
              </div>
              <a
                href="https://github.com/carbon-design-system/carbon"
                target="_blank"
                rel="noopener noreferrer"
                className="hub-sidebar-link"
                style={{ color: 'var(--carbon-text-secondary)' }}
              >
                <Github width={16} height={16} />
                <span className="text-sm">GitHub</span>
              </a>
              <a
                href="https://www.figma.com/@carbon"
                target="_blank"
                rel="noopener noreferrer"
                className="hub-sidebar-link"
                style={{ color: 'var(--carbon-text-secondary)' }}
              >
                <Figma width={16} height={16} />
                <span className="text-sm">Figma</span>
              </a>
              <a
                href="https://carbondesignsystem.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hub-sidebar-link"
                style={{ color: 'var(--carbon-text-secondary)' }}
              >
                <FileCode width={16} height={16} />
                <span className="text-sm">Storybook</span>
              </a>
            </div>
          </nav>
        )}

        {!isGuardian && (
          <nav className="hub-sidebar-nav">
            <div className="hub-sidebar-nav-group">
              <button
                onClick={() => setStandardView('chat')}
                className="hub-nav-button"
                style={{
                  backgroundColor: standardView === 'chat' ? 'var(--carbon-bg-hover)' : 'transparent',
                  borderColor: standardView === 'chat' ? 'var(--carbon-border-subtle)' : 'transparent',
                  color: 'var(--carbon-text-primary)',
                  borderRadius: 'var(--carbon-radius)',
                }}
              >
                <MessageSquare width={20} height={20} />
                <span>AI Chat</span>
              </button>
              <button
                onClick={() => setStandardView('audit')}
                className="hub-nav-button"
                style={{
                  backgroundColor: standardView === 'audit' ? 'var(--carbon-bg-hover)' : 'transparent',
                  borderColor: standardView === 'audit' ? 'var(--carbon-border-subtle)' : 'transparent',
                  color: 'var(--carbon-text-primary)',
                  borderRadius: 'var(--carbon-radius)',
                }}
              >
                <Upload width={20} height={20} />
                <span>UI Audit</span>
              </button>
              <button
                onClick={() => setStandardView('docs')}
                className="hub-nav-button"
                style={{
                  backgroundColor: standardView === 'docs' ? 'var(--carbon-bg-hover)' : 'transparent',
                  borderColor: standardView === 'docs' ? 'var(--carbon-border-subtle)' : 'transparent',
                  color: 'var(--carbon-text-primary)',
                  borderRadius: 'var(--carbon-radius)',
                }}
              >
                <BookOpen width={20} height={20} />
                <span>Documentation</span>
              </button>
            </div>

            <div
              className="hub-sidebar-links"
              style={{ borderColor: 'var(--carbon-border-subtle)' }}
            >
              <div className="hub-sidebar-links-label" style={{ color: 'var(--carbon-text-placeholder)' }}>
                Quick links
              </div>
              <a
                href="https://github.com/carbon-design-system/carbon"
                target="_blank"
                rel="noopener noreferrer"
                className="hub-sidebar-link"
                style={{ color: 'var(--carbon-text-secondary)' }}
              >
                <Github width={16} height={16} />
                <span className="text-sm">GitHub</span>
              </a>
              <a
                href="https://www.figma.com/@carbon"
                target="_blank"
                rel="noopener noreferrer"
                className="hub-sidebar-link"
                style={{ color: 'var(--carbon-text-secondary)' }}
              >
                <Figma width={16} height={16} />
                <span className="text-sm">Figma</span>
              </a>
              <a
                href="https://carbondesignsystem.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hub-sidebar-link"
                style={{ color: 'var(--carbon-text-secondary)' }}
              >
                <FileCode width={16} height={16} />
                <span className="text-sm">Storybook</span>
              </a>
            </div>
          </nav>
        )}

        <div className="hub-sidebar-footer" style={{ borderColor: 'var(--carbon-border-subtle)' }}>
          <button
            onClick={handleLogout}
            className="hub-nav-button"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'var(--carbon-border-subtle)',
              color: 'var(--carbon-text-primary)',
              borderRadius: 'var(--carbon-radius)',
            }}
          >
            <LogOut width={20} height={20} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <main className="hub-main">
        {isGuardian && (
          <>
            {guardianView === 'dashboard' && <GuardianDashboard />}
            {guardianView === 'health' && <ComponentHealth />}
            {guardianView === 'insights' && <TrendInsights />}
          </>
        )}

        {!isGuardian && (
          <>
            {standardView === 'chat' && <ChatInterface />}
            {standardView === 'audit' && <UIAuditUpload />}
            {standardView === 'docs' && (
              <div className="hub-placeholder">
                <div className="hub-placeholder-inner">
                  <BookOpen width={64} height={64} className="mx-auto mb-4" style={{ color: 'var(--carbon-text-placeholder)' }} />
                  <h2 className="text-2xl mb-2" style={{ color: 'var(--carbon-text-primary)' }}>
                    Documentation
                  </h2>
                  <p style={{ color: 'var(--carbon-text-secondary)' }}>
                    Documentation view coming soon
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
