export type SourceType = 'documentation' | 'storybook' | 'github' | 'figma';

export interface KnowledgeSource {
  id: string;
  label: string;
  type: SourceType;
  baseUrl: string;
  description: string;
  icon: string; // Carbon icon name
}

export const knowledgeSources: KnowledgeSource[] = [
  {
    id: 'carbon-docs',
    label: 'Carbon Design System',
    type: 'documentation',
    baseUrl: 'https://carbondesignsystem.com',
    description:
      'Official documentation for components, guidelines, tokens, and patterns',
    icon: 'Book',
  },
  {
    id: 'carbon-storybook',
    label: 'Carbon React Storybook',
    type: 'storybook',
    baseUrl: 'https://react.carbondesignsystem.com',
    description:
      'Interactive component demos, props documentation, and code examples',
    icon: 'Code',
  },
  {
    id: 'carbon-github',
    label: 'Carbon GitHub',
    type: 'github',
    baseUrl: 'https://github.com/carbon-design-system/carbon',
    description: 'Source code, issues, changelogs, and implementation details',
    icon: 'LogoGithub',
  },
  {
    id: 'carbon-figma',
    label: 'Carbon Figma Kit',
    type: 'figma',
    baseUrl: 'https://www.figma.com/community/file/874592104192380079',
    description:
      'Official Figma design kit with components, tokens, and templates',
    icon: 'Pen',
  },
];

// Helper to build a full URL for a specific resource
export function buildSourceUrl(sourceId: string, path?: string): string {
  const source = knowledgeSources.find((s) => s.id === sourceId);
  if (!source) return '#';
  return path ? `${source.baseUrl}${path}` : source.baseUrl;
}

// Which sources are most relevant per role
export const roleSourcePriority: Record<string, string[]> = {
  designer: ['carbon-docs', 'carbon-figma', 'carbon-storybook'],
  developer: ['carbon-storybook', 'carbon-github', 'carbon-docs'],
  guardian: ['carbon-docs', 'carbon-github', 'carbon-storybook'],
};
