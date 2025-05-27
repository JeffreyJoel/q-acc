"use client";
import { ModalProvider } from "@/contexts/ModalContext";
import { UserController } from "@/controllers/userController";
import Providers from "@/providers/PrivyRovider";
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      {/* <ModalProvider> */}
        <div>{children}</div>
        {/* <UserController /> */}
      {/* </ModalProvider> */}
    </Providers>
  );
}
