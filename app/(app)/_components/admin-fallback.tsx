
import Link from 'next/link';

export function AdminFallback() {
  return (
    <div className="border w-full h-full">
      <div className="flex w-full h-full flex-col items-center justify-center">
        <p>You do not have the permissions to view this dashboard. <Link href="/">Go Back.</Link></p>
      </div>
    </div>
  )
}
