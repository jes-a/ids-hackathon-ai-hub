'use client';

import { Tag } from '@carbon/react';

export type TrustBadgeVariant = 'official' | 'best-practice' | 'flexible';

interface TrustBadgeProps {
  variant: TrustBadgeVariant;
}

const labels: Record<TrustBadgeVariant, string> = {
  official: 'Official Rule',
  'best-practice': 'Best Practice',
  flexible: 'Flexible',
};

const tagTypes: Record<TrustBadgeVariant, 'red' | 'blue' | 'green'> = {
  official: 'red',
  'best-practice': 'blue',
  flexible: 'green',
};

export function TrustBadge({ variant }: TrustBadgeProps) {
  return (
    <Tag type={tagTypes[variant]} size="sm">
      {labels[variant]}
    </Tag>
  );
}
