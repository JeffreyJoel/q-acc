'use client';
import { ParaProviders } from '@/providers/ParaProvider';
import { NavBar } from '@/components/shared/NavBar';
import { Footer } from '@/components/shared/Footer';
import { ModalProvider } from '@/contexts/ModalContext';
import { UserController } from '@/controllers/userController';
export default function ClientLayout({
  children
}: {
  children: React.ReactNode;
}) {

  return (
    <ParaProviders>
      <ModalProvider>
        <NavBar/>
        <div>{children}</div>
        <Footer/>
        <UserController/>
      </ModalProvider>
    </ParaProviders>
  );
}