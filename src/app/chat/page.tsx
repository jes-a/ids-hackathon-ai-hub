import { ChatShell } from '@/components/ChatShell';
import type { Role } from '@/lib/roles';

const VALID_ROLES: Role[] = ['designer', 'developer', 'guardian'];

interface ChatPageProps {
  searchParams: Promise<{ role?: string }>;
}

export default async function ChatPage({ searchParams }: ChatPageProps) {
  const params = await searchParams;
  const roleParam = params.role?.toLowerCase();
  const role: Role = VALID_ROLES.includes(roleParam as Role)
    ? (roleParam as Role)
    : 'designer';

  return (
    <div className="chat-page">
      <ChatShell role={role} />
    </div>
  );
}
