'use client';
import { ParaProviders } from '@/providers/ParaProvider';
import { NavBar } from '@/components/shared/NavBar';
export default function ClientLayout({
  children
}: {
  children: React.ReactNode;
}) {

  return (
    <ParaProviders>
      <NavBar/>
      <div>{children}</div>
     
    </ParaProviders>
  );
}