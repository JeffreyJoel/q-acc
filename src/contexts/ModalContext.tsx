"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import EmailModal from "@/components/profile/EmailModal";

interface EmailModalData {
  email?: string;
}

interface ModalContextType {
  openEmailModal: (data?: EmailModalData) => void;
  closeEmailModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailModalData, setEmailModalData] = useState<EmailModalData | undefined>();

  const openEmailModal = useCallback((data?: EmailModalData) => {
    setEmailModalData(data);
    setIsEmailModalOpen(true);
  }, []);

  const closeEmailModal = useCallback(() => {
    setIsEmailModalOpen(false);
    setEmailModalData(undefined);
  }, []);

  return (
    <ModalContext.Provider value={{ openEmailModal, closeEmailModal }}>
      {children}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={closeEmailModal}
        initialData={emailModalData}
        onSubmit={async (data) => {
          console.log("Email submitted:", data);
          closeEmailModal();
        }}
      />
    </ModalContext.Provider>
  );
}

export function useProfileModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useProfileModal must be used within a ModalProvider");
  }
  return context;
} 