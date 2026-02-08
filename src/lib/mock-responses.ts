import type { Role } from './roles';

export interface MockSource {
  type: 'documentation' | 'storybook' | 'github' | 'figma';
  title: string;
  url: string;
}

export type TrustBadgeVariant = 'official' | 'best-practice' | 'flexible';

export interface MockResponse {
  content: string;
  sources: MockSource[];
  trustBadges?: TrustBadgeVariant[];
}

export interface WelcomeMessage {
  text: string;
  suggestedQuestions: string[];
}

export const welcomeByRole: Record<Role, WelcomeMessage> = {
  designer: {
    text: "Welcome! I'm your Carbon Design System assistant, tailored for designers. I can help you with spacing tokens, color palettes, typography scales, component usage guidelines, and Figma-specific resources. What are you working on today?",
    suggestedQuestions: [
      'What spacing token should I use for card padding?',
      'When should I use a modal vs. a side panel?',
      'Show me the color tokens for notifications',
    ],
  },
  developer: {
    text: "Welcome! I'm your Carbon Design System assistant, tailored for developers. I can help you with component APIs, code snippets, props documentation, and implementation patterns. What are you building?",
    suggestedQuestions: [
      'How do I implement the DataTable with sorting?',
      'What are the props for the Modal component?',
      'Show me the Button component variants',
    ],
  },
  guardian: {
    text: "Welcome! I'm your Carbon Design System assistant for governance and compliance. I can help you audit component usage, review design system health, and ensure standards compliance. What would you like to review?",
    suggestedQuestions: [
      'Which components have the most compliance issues?',
      "Show me the latest design token changes",
      "What's the adoption rate across teams?",
    ],
  },
};

// Keyword-to-response mapping per role (first match wins)
const designerResponses: { keywords: string[]; response: MockResponse }[] = [
  {
    keywords: ['spacing', 'padding', 'token', 'margin', 'gap'],
    response: {
      content: `Carbon uses a geometric spacing scale based on multiples of 2px.

**Common spacing tokens:** [Official Rule]
| Token | Value | Common use |
|-------|-------|-----------|
| $spacing-03 | 8px | Inline padding, icon gaps |
| $spacing-05 | 16px | Card padding, form gaps |
| $spacing-06 | 24px | Section padding |
| $spacing-07 | 32px | Layout margins |
| $spacing-09 | 48px | Page margins |

**Spacing in cards:** [Best Practice]
Use \`$spacing-05\` (16px) for internal card padding and \`$spacing-05\` between stacked cards.

**Figma usage:**
In the Carbon Figma kit, spacing is built into auto-layout frames. Use the "Spacing" component set for visual reference.`,
      sources: [
        {
          type: 'documentation',
          title: 'Spacing — Carbon Design System',
          url: 'https://carbondesignsystem.com/elements/spacing/overview/',
        },
        {
          type: 'figma',
          title: 'Carbon Design Kit — Figma Community',
          url: 'https://www.figma.com/community/file/874592104192380079',
        },
      ],
      trustBadges: ['official', 'best-practice'],
    },
  },
  {
    keywords: ['color', 'palette', 'token', 'notification'],
    response: {
      content: `Carbon provides semantic color tokens for UI states.

**Notification and status colors:** [Official Rule]
- Success: \`$support-success\` (green)
- Warning: \`$support-warning\` (yellow)
- Error: \`$support-error\` (red)
- Info: \`$support-info\` (blue)

**Gray scale:** Use \`$layer-01\`, \`$layer-02\`, \`$text-primary\`, \`$text-secondary\` for backgrounds and text. Never use raw hex in designs — always use tokens. [Best Practice]`,
      sources: [
        {
          type: 'documentation',
          title: 'Color — Carbon Design System',
          url: 'https://carbondesignsystem.com/elements/color/overview/',
        },
      ],
      trustBadges: ['official', 'best-practice'],
    },
  },
  {
    keywords: ['modal', 'panel', 'side panel', 'dialog'],
    response: {
      content: `**Modal vs. side panel:** [Best Practice]

- **Modal:** Use for critical, focused tasks that must be completed or dismissed (e.g., confirm delete, short forms). Blocks the whole view.
- **Side panel:** Use for supplementary workflows that don’t require full attention (e.g., filters, details, multi-step flows). Keeps context visible.

Carbon provides \`Modal\` and \`ComposedModal\` for dialogs, and side panels can be built with \`Layer\` + \`Panel\`-style layout. See the pattern guidelines for decision trees.`,
      sources: [
        {
          type: 'documentation',
          title: 'Modal — Carbon Design System',
          url: 'https://carbondesignsystem.com/components/modal/usage/',
        },
      ],
      trustBadges: ['best-practice'],
    },
  },
  {
    keywords: [],
    response: {
      content: `I can help with spacing tokens, color palettes, typography, component usage guidelines, and Figma resources. Try asking: "What spacing token for card padding?" or "Show me color tokens for notifications." [Flexible]`,
      sources: [
        {
          type: 'documentation',
          title: 'Carbon Design System',
          url: 'https://carbondesignsystem.com',
        },
      ],
      trustBadges: ['flexible'],
    },
  },
];

const developerResponses: { keywords: string[]; response: MockResponse }[] = [
  {
    keywords: ['button', 'btn'],
    response: {
      content: `The Button component is one of Carbon's most used components.

**Import:**
\`\`\`jsx
import { Button } from '@carbon/react';
\`\`\`

**Basic usage:**
\`\`\`jsx
<Button kind="primary">Primary button</Button>
<Button kind="secondary">Secondary button</Button>
<Button kind="tertiary">Tertiary button</Button>
<Button kind="ghost">Ghost button</Button>
<Button kind="danger">Danger button</Button>
\`\`\`

**Key props:** [Official Rule]
- \`kind\`: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger'
- \`size\`: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
- \`disabled\`: boolean
- \`renderIcon\`: Carbon icon component

**Accessibility:** [Best Practice]
Always include descriptive text content or an \`aria-label\` for icon-only buttons.`,
      sources: [
        {
          type: 'documentation',
          title: 'Button — Carbon Design System',
          url: 'https://carbondesignsystem.com/components/button/usage/',
        },
        {
          type: 'storybook',
          title: 'Button — Carbon React Storybook',
          url: 'https://react.carbondesignsystem.com/?path=/story/components-button--default',
        },
      ],
      trustBadges: ['official', 'best-practice'],
    },
  },
  {
    keywords: ['datatable', 'data table', 'table', 'sorting'],
    response: {
      content: `**DataTable with sorting:**

\`\`\`jsx
import { DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@carbon/react';

const headers = [
  { key: 'name', header: 'Name' },
  { key: 'status', header: 'Status' },
];
const rows = [
  { id: '1', name: 'Row 1', status: 'Active' },
  { id: '2', name: 'Row 2', status: 'Inactive' },
];

<DataTable rows={rows} headers={headers} isSortable>
  {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
    <Table {...getTableProps()}>
      <TableHead>
        <TableRow>
          {headers.map((header) => (
            <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow {...getRowProps({ row })}>
            {row.cells.map((cell) => (
              <TableCell key={cell.id}>{cell.value}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )}
</DataTable>
\`\`\`

[Official Rule] Use \`isSortable\` and the render prop pattern for controlled sorting.`,
      sources: [
        {
          type: 'storybook',
          title: 'DataTable — Carbon React Storybook',
          url: 'https://react.carbondesignsystem.com/?path=/story/components-datatable--default',
        },
        {
          type: 'documentation',
          title: 'Data table — Carbon Design System',
          url: 'https://carbondesignsystem.com/components/data-table/usage/',
        },
      ],
      trustBadges: ['official'],
    },
  },
  {
    keywords: ['modal', 'props'],
    response: {
      content: `**Modal component key props:** [Official Rule]

- \`open\`: boolean — controls visibility
- \`passiveModal\`: boolean — no footer/actions
- \`danger\`: boolean — danger styling
- \`modalHeading\`: string
- \`modalLabel\`: string (optional)
- \`primaryButtonText\`, \`secondaryButtonText\`
- \`onRequestClose\`: () => void
- \`onRequestSubmit\`: () => void

\`\`\`jsx
import { Modal } from '@carbon/react';
<Modal open={isOpen} modalHeading="Confirm" primaryButtonText="Save" secondaryButtonText="Cancel" onRequestClose={() => setIsOpen(false)} onRequestSubmit={() => { /* save */ setIsOpen(false); }} />
\`\`\``,
      sources: [
        {
          type: 'documentation',
          title: 'Modal — Carbon Design System',
          url: 'https://carbondesignsystem.com/components/modal/usage/',
        },
        {
          type: 'storybook',
          title: 'Modal — Carbon React Storybook',
          url: 'https://react.carbondesignsystem.com/?path=/story/components-modal--default',
        },
      ],
      trustBadges: ['official'],
    },
  },
  {
    keywords: [],
    response: {
      content: `I can help with component APIs, code snippets, props, and implementation patterns. Try: "How do I implement the DataTable with sorting?" or "What are the props for the Modal component?" [Flexible]`,
      sources: [
        {
          type: 'storybook',
          title: 'Carbon React Storybook',
          url: 'https://react.carbondesignsystem.com',
        },
      ],
      trustBadges: ['flexible'],
    },
  },
];

const guardianResponses: { keywords: string[]; response: MockResponse }[] = [
  {
    keywords: ['compliance', 'issues', 'audit', 'health', 'adoption'],
    response: {
      content: `Here's a summary of current design system compliance across your product teams.

**System Health Overview:**
- ✅ Compliant components: 142
- ⚠️ Warnings: 8
- 🔍 Pending audits: 23
- 👥 Active contributors: 47

**Top Issues:** [Official Rule]
1. **Button variants** — 3 teams using custom button styles instead of Carbon \`<Button>\`
2. **Spacing inconsistency** — Marketing pages using hardcoded px values instead of spacing tokens
3. **Color tokens** — 2 products using hex values instead of Carbon color tokens

**Recommendation:**
Schedule a Token Validation workshop with the 3 teams showing the most drift. The Component Audit tool can generate a detailed report.`,
      sources: [
        {
          type: 'documentation',
          title: 'Carbon Design System',
          url: 'https://carbondesignsystem.com',
        },
        {
          type: 'github',
          title: 'Carbon — GitHub',
          url: 'https://github.com/carbon-design-system/carbon',
        },
      ],
      trustBadges: ['official'],
    },
  },
  {
    keywords: ['token', 'changes', 'design token'],
    response: {
      content: `**Latest design token changes:** [Best Practice]

- \`v11\` spacing scale unchanged; ensure all new work uses \`$spacing-*\` tokens.
- Color tokens: \`$focus\` and \`$focus-inset\` updated for accessibility.
- Typography: IBM Plex Sans remains the primary typeface; token names unchanged.

Check the Carbon changelog on GitHub for version-specific token diffs. Guardians should run the token audit script quarterly.`,
      sources: [
        {
          type: 'github',
          title: 'Carbon Changelog — GitHub',
          url: 'https://github.com/carbon-design-system/carbon/blob/main/CHANGELOG.md',
        },
        {
          type: 'documentation',
          title: 'Design tokens — Carbon Design System',
          url: 'https://carbondesignsystem.com/elements/design-tokens/overview/',
        },
      ],
      trustBadges: ['best-practice'],
    },
  },
  {
    keywords: [],
    response: {
      content: `I can help with compliance metrics, system health, component adoption, and audit recommendations. Try: "Which components have the most compliance issues?" or "Show me the latest design token changes." [Flexible]`,
      sources: [
        {
          type: 'documentation',
          title: 'Carbon Design System',
          url: 'https://carbondesignsystem.com',
        },
      ],
      trustBadges: ['flexible'],
    },
  },
];

function matchResponse(
  message: string,
  list: { keywords: string[]; response: MockResponse }[]
): MockResponse {
  const lower = message.toLowerCase().trim();
  for (const { keywords, response } of list) {
    if (keywords.length === 0) continue;
    if (keywords.some((k) => lower.includes(k))) return response;
  }
  // Fallback: last item is usually the default
  return list[list.length - 1].response;
}

export function getMockResponse(userMessage: string, role: Role): MockResponse {
  switch (role) {
    case 'designer':
      return matchResponse(userMessage, designerResponses);
    case 'developer':
      return matchResponse(userMessage, developerResponses);
    case 'guardian':
      return matchResponse(userMessage, guardianResponses);
    default:
      return matchResponse(userMessage, developerResponses);
  }
}
