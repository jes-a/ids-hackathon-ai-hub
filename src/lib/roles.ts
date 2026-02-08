export type Role = 'designer' | 'developer' | 'guardian';

export const roles = {
  guardian: {
    id: 'guardian',
    label: 'Design System Guardian',
    icon: 'Security',
    description:
      'Monitor designer uncertainty, detect patterns, and guide system evolution',
    tagLabel: 'System governance',
    tagColor: 'blue',
  },
  developer: {
    id: 'developer',
    label: 'Developer',
    icon: 'Code',
    description:
      'Access code snippets, prop tables, and React implementation details',
    tagLabel: 'Technical implementation',
    tagColor: 'blue',
  },
  designer: {
    id: 'designer',
    label: 'Designer',
    icon: 'PaintBrush',
    description:
      'Explore spacing tokens, color values, and Figma-ready specs',
    tagLabel: 'Visual specifications',
    tagColor: 'blue',
  },
} as const;
