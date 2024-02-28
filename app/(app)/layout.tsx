import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Toaster } from '@/components/ui/sonner';
import { checkAuth } from '@/lib/auth/utils';
import { ClerkProvider } from '@clerk/nextjs';
import { AdminProtected } from './_components/admin-protected';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAuth();
  return (
    <>
      <ClerkProvider>
        <AdminProtected>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 md:p-8 pt-2 p-8 overflow-y-auto">
              <Navbar />
              {children}
            </main>
          </div>
        </AdminProtected>
      </ClerkProvider>

      <Toaster richColors />
    </>)
}
