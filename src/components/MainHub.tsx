'use client';

import { useEffect, useState } from 'react';
import {
  MessageSquare,
  Upload,
  BookOpen,
  BarChart3,
  Activity,
  TrendingUp,
  Sun,
  Moon,
  Github,
  Figma,
  FileCode,
} from '@/components/icons';
import { Security, Code, ColorPalette } from '@carbon/icons-react';
import { CarbonLogo } from '@/components/Logo';
import { useRole } from '@/contexts/RoleContext';
import { useTheme } from '@/contexts/ThemeContext';
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
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [standardView, setStandardView] = useState<StandardView>('chat');
  const [guardianView, setGuardianView] = useState<GuardianView>('dashboard');
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

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

  const handleRoleChange = (role: 'guardian' | 'developer' | 'designer') => {
    setUserRole(role);
    clearHistory();
    setRoleMenuOpen(false);
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

  const carbonIconProps = { size: 16, fill: 'var(--carbon-interactive)' };
  const fallbackIconProps = { width: 16, height: 16, style: { color: 'var(--carbon-interactive)' } as React.CSSProperties };
  const renderRoleIcon = () => {
    switch (userRole) {
      case 'guardian':
        return <Security {...carbonIconProps} />;
      case 'developer':
        return <Code {...carbonIconProps} />;
      case 'designer':
        return <ColorPalette {...carbonIconProps} />;
      default:
        return <MessageSquare {...fallbackIconProps} />;
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
          <div className="hub-sidebar-title-row">
            <CarbonLogo size={24} color="var(--carbon-interactive)" />
            <span className="hub-sidebar-title" style={{ color: 'var(--carbon-text-primary)' }}>
              Carbon AI Hub
            </span>
          </div>
          <div
            className="hub-sidebar-role"
            style={{
              backgroundColor: 'var(--carbon-bg-primary)',
              borderColor: 'var(--carbon-border-subtle)',
              borderRadius: 'var(--carbon-radius)',
              position: 'relative',
              padding: 0,
            }}
          >
            <button
              type="button"
              className="hub-sidebar-role-main"
              onClick={() => setRoleMenuOpen((open) => !open)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                width: '100%',
                padding: '0.5rem 0.75rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              aria-label="Toggle role menu"
            >
              {renderRoleIcon()}
              <span className="hub-sidebar-role-label" style={{ color: 'var(--carbon-text-secondary)' }}>
                {getRoleLabel()}
              </span>
              <span
                className="hub-sidebar-role-toggle"
                style={{
                  marginLeft: 'auto',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--carbon-text-secondary)',
                  borderRadius: 'var(--carbon-radius)',
                  width: '1.5rem',
                  height: '1.5rem',
                  lineHeight: 1,
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ▾
              </span>
            </button>
            {roleMenuOpen && (
              <div
                className="hub-sidebar-role-menu"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 0.5rem)',
                  right: 0,
                  zIndex: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  padding: '0.5rem',
                  minWidth: '12rem',
                  backgroundColor: 'var(--carbon-bg-primary)',
                  border: '1px solid var(--carbon-border-subtle)',
                  borderRadius: 'var(--carbon-radius)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                }}
              >
                <button
                  className="hub-sidebar-role-menu-item"
                  onClick={() => handleRoleChange('guardian')}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    padding: '0.4rem 0.5rem',
                    color: 'var(--carbon-text-primary)',
                  }}
                >
                  Guardian
                </button>
                <button
                  className="hub-sidebar-role-menu-item"
                  onClick={() => handleRoleChange('developer')}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    padding: '0.4rem 0.5rem',
                    color: 'var(--carbon-text-primary)',
                  }}
                >
                  Developer
                </button>
                <button
                  className="hub-sidebar-role-menu-item"
                  onClick={() => handleRoleChange('designer')}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    padding: '0.4rem 0.5rem',
                    color: 'var(--carbon-text-primary)',
                  }}
                >
                  Designer
                </button>
                <div style={{ height: 1, backgroundColor: 'var(--carbon-border-subtle)', margin: '0.25rem 0' }} />
                <button
                  className="hub-sidebar-role-menu-item"
                  onClick={handleLogout}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    padding: '0.4rem 0.5rem',
                    color: 'var(--carbon-text-secondary)',
                  }}
                >
                  Sign out
                </button>
              </div>
            )}
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
            onClick={toggleTheme}
            className="hub-nav-button"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'var(--carbon-border-subtle)',
              color: 'var(--carbon-text-primary)',
              borderRadius: 'var(--carbon-radius)',
            }}
          >
            {theme === 'light' ? <Moon width={20} height={20} /> : <Sun width={20} height={20} />}
            <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
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
