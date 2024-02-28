import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Toaster } from '@/components/ui/sonner';
import { checkAuth } from '@/lib/auth/utils';
import { ClerkProvider, Protect } from '@clerk/nextjs';
import Link from 'next/link';
import { AdminFallback } from './_components/admin-fallback';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAuth();
  return (
    <>
      <ClerkProvider>
        <Protect permission="org:admin" fallback={<AdminFallback />}>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 md:p-8 pt-2 p-8 overflow-y-auto">
              <Navbar />
              {children}
            </main>
          </div>
        </Protect>
      </ClerkProvider>

      <Toaster richColors />
    </>)
}
