import { redirect } from 'next/navigation';

import { getUserAuth } from '@/lib/auth/utils';
import { ClerkProvider } from '@clerk/nextjs';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getUserAuth();
  if (session?.session) redirect("/dash");

  return (
    <div className="bg-muted h-screen pt-8">
      <ClerkProvider>{children}</ClerkProvider>
    </div>
  );
}
