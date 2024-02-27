import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/sonner';
import { checkAuth } from '@/lib/auth/utils';
import { ClerkProvider } from '@clerk/nextjs';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAuth();
  return (
    <>
      <ClerkProvider>
        <Providers>
          <div className="flex h-screen">
            <main className="flex-1 md:p-8 pt-2 p-8 overflow-y-auto">
              {children}
            </main>
          </div>
        </Providers>
      </ClerkProvider>

      <Toaster richColors />
    </>
  )
}
