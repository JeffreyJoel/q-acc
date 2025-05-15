'use client';
import { ParaProviders } from '@/providers/ParaProvider';
import { NavBar } from '@/components/shared/NavBar';
import { Footer } from '@/components/shared/Footer';
export default function ClientLayout({
  children
}: {
  children: React.ReactNode;
}) {

  return (
    <ParaProviders>
      <NavBar/>
      <div>{children}</div>
      <Footer/>
    </ParaProviders>
  );
}