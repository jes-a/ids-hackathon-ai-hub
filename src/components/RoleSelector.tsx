'use client';

import { useRouter } from 'next/navigation';
import { ClickableTile } from '@carbon/react';
import { PaintBrush, Code, Security } from '@carbon/icons-react';
import { roles } from '@/lib/roles';

const iconMap = {
  designer: PaintBrush,
  developer: Code,
  guardian: Security,
};

const cardOrder: ('guardian' | 'developer' | 'designer')[] = [
  'guardian',
  'developer',
  'designer',
];

export function RoleSelector() {
  const router = useRouter();

  return (
    <div className="role-cards-grid">
      {cardOrder.map((id) => {
        const role = roles[id];
        const Icon = iconMap[id];
        return (
          <ClickableTile
            key={id}
            href={`/chat?role=${id}`}
            onClick={(e) => {
              e.preventDefault();
              router.push(`/chat?role=${id}`);
            }}
            className="role-tile"
          >
            <div className="role-tile-content">
              <div className="role-tile-icon-wrap">
                <Icon size={24} className="role-tile-icon" />
              </div>
              <h3 className="role-tile-title">{role.label}</h3>
              <p className="role-tile-description">{role.description}</p>
              <span className="role-tile-tag">{role.tagLabel}</span>
            </div>
          </ClickableTile>
        );
      })}
    </div>
  );
}
