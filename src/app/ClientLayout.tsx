"use client";
import { ParaProviders } from "@/providers/ParaProvider";
import { ModalProvider } from "@/contexts/ModalContext";
import { UserController } from "@/controllers/userController";
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ParaProviders>
      <ModalProvider>
        <div>{children}</div>
        <UserController />
      </ModalProvider>
    </ParaProviders>
  );
}
