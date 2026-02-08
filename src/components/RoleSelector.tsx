'use client';

import { Code2, Palette, Shield } from '@/components/icons';
import { useRole, type UserRole } from '@/contexts/RoleContext';
import { useRouter } from 'next/navigation';

interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  focus: string;
}

const roles: RoleOption[] = [
  {
    id: 'guardian',
    title: 'Design System Guardian',
    description: 'Monitor designer uncertainty, detect patterns, and guide system evolution',
    icon: Shield,
    focus: 'System governance',
  },
  {
    id: 'developer',
    title: 'Developer',
    description: 'Access code snippets, prop tables, and React implementation details',
    icon: Code2,
    focus: 'Technical implementation',
  },
  {
    id: 'designer',
    title: 'Designer',
    description: 'Explore spacing tokens, color values, and Figma-ready specs',
    icon: Palette,
    focus: 'Visual specifications',
  },
];

export function RoleSelector() {
  const { setUserRole } = useRole();
  const router = useRouter();

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
    router.push('/hub');
  };

  return (
    <div
      className="role-selector"
      style={{
        backgroundColor: 'var(--carbon-bg-primary)',
        fontFamily: 'var(--carbon-font-family)',
      }}
    >
      <div className="role-selector-inner">
        <div className="role-selector-header">
          <div className="role-selector-title-row">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" fill="var(--carbon-interactive)" />
              <path d="M8 8h16v4H8V8zm0 6h16v4H8v-4zm0 6h10v4H8v-4z" fill="white" />
            </svg>
            <h1 className="role-selector-title" style={{ color: 'var(--carbon-text-primary)' }}>
              Carbon Design System
            </h1>
          </div>
          <h2 className="role-selector-subtitle" style={{ color: 'var(--carbon-text-primary)' }}>
            AI Hub
          </h2>
          <p className="role-selector-desc" style={{ color: 'var(--carbon-text-secondary)' }}>
            Select your role to personalize your experience
          </p>
        </div>

        <div className="role-selector-grid">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className="role-card"
                style={{
                  backgroundColor: 'var(--carbon-layer-01)',
                  borderColor: 'var(--carbon-border-subtle)',
                  borderRadius: 'var(--carbon-radius)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--carbon-bg-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--carbon-layer-01)';
                }}
              >
                <div className="role-card-content">
                  <div
                    className="role-card-icon"
                    style={{
                      backgroundColor: 'var(--carbon-interactive)',
                      borderColor: 'var(--carbon-interactive)',
                      borderRadius: 'var(--carbon-radius)',
                    }}
                  >
                    <Icon width={24} height={24} style={{ color: 'var(--carbon-text-on-color)' }} />
                  </div>
                  <div>
                    <h3 className="role-card-title" style={{ color: 'var(--carbon-text-primary)' }}>
                      {role.title}
                    </h3>
                    <p className="role-card-desc" style={{ color: 'var(--carbon-text-secondary)' }}>
                      {role.description}
                    </p>
                    <span
                      className="role-card-tag"
                      style={{
                        color: 'var(--carbon-text-secondary)',
                        borderColor: 'var(--carbon-border-subtle)',
                        borderRadius: 'var(--carbon-radius)',
                      }}
                    >
                      {role.focus}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="role-selector-footer">
          <p className="role-selector-footer-text" style={{ color: 'var(--carbon-text-placeholder)' }}>
            Powered by RAG architecture • Indexes carbondesignsystem.com, Figma APIs, and @carbon/react
          </p>
        </div>
      </div>
    </div>
  );
}
