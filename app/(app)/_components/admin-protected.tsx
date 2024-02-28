import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export function AdminProtected({ children }: { children: React.ReactNode }) {
  const { sessionClaims } = auth() as { sessionClaims: CustomJwtSessionClaims };


  // users can be given the admin role from the clerk dashboard, but adding it to their public metadata object.
  // https://dashboard.clerk.com/apps/app_2cvS7JB0DcuBUo9ndFvHkVpRZju/instances/ins_2cvS7PLQGUI8HWdkW6L9nsC56Z0/users

  // we can add more variables by adding them to the session object.
  // @SEE: https://dashboard.clerk.com/apps/app_2cvS7JB0DcuBUo9ndFvHkVpRZju/instances/ins_2cvS7PLQGUI8HWdkW6L9nsC56Z0/sessions

  if (sessionClaims?.metadata?.role !== 'admin') {
    redirect('/');
  }
  return (
    <>
      {children}
    </>
  );
}
