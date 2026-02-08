'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavLinkText,
  SideNavDivider,
  Dropdown,
  Toggle,
} from '@carbon/react';
import {
  Chat,
  ArrowUp,
  Book,
  LogoGithub,
  LogoFigma,
  Moon,
} from '@carbon/icons-react';
import { roles, type Role } from '@/lib/roles';
import { knowledgeSources } from '@/lib/knowledge-sources';

const ROLE_ITEMS: { id: Role; label: string }[] = [
  { id: 'designer', label: 'Designer' },
  { id: 'developer', label: 'Developer' },
  { id: 'guardian', label: 'Guardian' },
];

const quickLinkSources = ['carbon-github', 'carbon-figma', 'carbon-storybook'] as const;
const quickLinkIcons = {
  'carbon-github': LogoGithub,
  'carbon-figma': LogoFigma,
  'carbon-storybook': Book,
};
const quickLinkLabels: Record<string, string> = {
  'carbon-github': 'GitHub',
  'carbon-figma': 'Figma',
  'carbon-storybook': 'Storybook',
};

function CarbonLogoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="32" height="32" rx="0" fill="#0f62fe" />
      <line x1="8" y1="11" x2="24" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="square" />
      <line x1="8" y1="16" x2="24" y2="16" stroke="white" strokeWidth="1.5" strokeLinecap="square" />
      <line x1="8" y1="21" x2="24" y2="21" stroke="white" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

interface ChatSidebarProps {
  role: Role;
}

export function ChatSidebar({ role }: ChatSidebarProps) {
  const router = useRouter();
  const roleConfig = roles[role];
  const selectedRoleItem = ROLE_ITEMS.find((r) => r.id === role) ?? ROLE_ITEMS[0];

  const handleRoleChange = ({ selectedItem }: { selectedItem: { id: Role; label: string } | null }) => {
    if (selectedItem) router.push(`/chat?role=${selectedItem.id}`);
  };

  return (
    <aside className="chat-sidebar chat-sidebar--light">
      <SideNav aria-label="Carbon AI Hub navigation" isFixedNav defaultExpanded>
        <div className="chat-sidebar-header">
          <div className="chat-sidebar-title-row">
            <CarbonLogoIcon />
            <span className="chat-sidebar-title">Carbon AI Hub</span>
          </div>
          <Dropdown
            id="chat-sidebar-role-dropdown"
            titleText="Select role"
            label=""
            hideLabel
            items={ROLE_ITEMS}
            itemToString={(item) => (item ? item.label : '')}
            selectedItem={selectedRoleItem}
            onChange={handleRoleChange}
            size="md"
            className="chat-sidebar-role-dropdown"
          />
        </div>
        <SideNavItems>
          <SideNavLink href="#" isActive renderIcon={Chat}>
            <SideNavLinkText>AI Chat</SideNavLinkText>
          </SideNavLink>
          <SideNavLink href="#" renderIcon={ArrowUp} className="cds--side-nav__link--disabled">
            <SideNavLinkText>UI Audit</SideNavLinkText>
          </SideNavLink>
          <SideNavLink href="#" renderIcon={Book} className="cds--side-nav__link--disabled">
            <SideNavLinkText>Documentation</SideNavLinkText>
          </SideNavLink>
        </SideNavItems>
        <SideNavDivider />
        <div className="chat-sidebar-quicklinks">
          <span className="chat-sidebar-quicklinks-label">Quick links</span>
          <SideNavItems>
            {quickLinkSources.map((sourceId) => {
              const source = knowledgeSources.find((s) => s.id === sourceId);
              if (!source) return null;
              const Icon = quickLinkIcons[sourceId];
              const label = quickLinkLabels[sourceId] ?? source.label;
              return (
                <SideNavLink
                  key={sourceId}
                  href={source.baseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  renderIcon={Icon}
                >
                  <SideNavLinkText>{label}</SideNavLinkText>
                </SideNavLink>
              );
            })}
          </SideNavItems>
        </div>
        <div className="chat-sidebar-footer">
          <Toggle
            id="dark-mode"
            labelText="Dark mode"
            toggled={false}
            disabled
            className="chat-sidebar-dark-toggle"
          />
        </div>
      </SideNav>
    </aside>
  );
}
