# IDS Hackathon: AI Hub (based on Carbon Design System)

AI-powered documentation assistant for IBM's Carbon Design System.

## Quick Start

1. Clone the repo:
   ```bash
   git clone https://github.com/[your-org]/carbon-ai-hub.git
   cd carbon-ai-hub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the dev server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000

## Project Structure

- `src/app/page.tsx` — Home page (role selector)
- `src/app/chat/page.tsx` — Chat interface
- `src/components/` — All UI components (this is where you'll make most edits)
- `src/lib/mock-responses.ts` — Mock AI responses (edit to add more)
- `src/lib/roles.ts` — Role definitions
- `src/lib/knowledge-sources.ts` — Official Carbon documentation sources and URLs
- `src/lib/system-prompt.ts` — System prompt for future API use

## For Designers on the Team

Most of your edits will be in:

- `src/components/` — Edit JSX (it's like HTML with `className` instead of `class`)
- `src/styles/` — Edit SCSS (it's CSS with nesting and variables)

### Common edits

- **Change text:** Find the string in the component file and edit it
- **Change colors:** Use Carbon color tokens like `$blue-60`, `$gray-90`
- **Change spacing:** Use Carbon spacing tokens like `$spacing-05`
- **Add a component:** Check https://react.carbondesignsystem.com for Carbon React components

## Switching to Real AI (Future)

1. Get an Anthropic API key from https://console.anthropic.com
2. Create `.env.local` and add: `ANTHROPIC_API_KEY=your-key-here`
3. Create `src/app/api/chat/route.ts` with the API integration
4. Update `ChatShell.tsx` to call `/api/chat` instead of mock responses

## Tech Stack

- Next.js 14 (App Router)
- Carbon React (`@carbon/react`, `@carbon/icons-react`, `@carbon/styles`)
- Sass for styling
- Mock AI responses (no API keys required)
