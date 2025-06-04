"use client";
import { ModalProvider } from "@/contexts/ModalContext";
import { UserController } from "@/controllers/userController";
import Providers from "@/providers/PrivyProvider";
import { Toaster } from "sonner";
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <ModalProvider>
        <div>{children}</div>
        <Toaster position="top-center" richColors />
        <UserController />
      </ModalProvider>
    </Providers>
  );
}
