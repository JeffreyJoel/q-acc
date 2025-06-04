'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SignModal } from '@/components/modals/SignModal';
import { UpdateProfileModal } from '@/components/modals/UpdateProfileModal';
import { IUser } from '@/types/user.type';

interface ModalContextType {
  showSignModal: boolean;
  showUpdateProfileModal: boolean;
  setShowSignModal: (show: boolean) => void;
  setShowUpdateProfileModal: (show: boolean) => void;
  openUpdateProfileModal: (user?: IUser, sendOtp?: boolean) => void;
  openSignModal: () => void;
  currentUser: IUser | null;
  setCurrentUser: (user: IUser | null) => void;
  onSign?: (signedInUser: IUser) => void;
  setOnSign: (callback: (signedInUser: IUser) => void) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [showSignModal, setShowSignModal] = useState(false);
  const [showUpdateProfileModal, setShowUpdateProfileModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [sendOtp, setSendOtp] = useState(false);
  const [onSign, setOnSign] = useState<((signedInUser: IUser) => void) | undefined>();

  const openUpdateProfileModal = (user?: IUser, sendOtp?: boolean) => {
    if (user) setCurrentUser(user);
    if (sendOtp) setSendOtp(sendOtp);
    setShowUpdateProfileModal(true);
  };
  
  const openSignModal = () => setShowSignModal(true);

  const value = {
    showSignModal,
    showUpdateProfileModal,
    setShowSignModal,
    setShowUpdateProfileModal,
    openUpdateProfileModal,
    openSignModal,
    currentUser,
    setCurrentUser,
    onSign,
    setOnSign
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      
      {/* Global Modals */}
      <SignModal
        isOpen={showSignModal}
        onClose={() => setShowSignModal(false)}
        onSign={onSign || (() => {})}
      />
      
      <UpdateProfileModal
        isOpen={showUpdateProfileModal}
        onClose={() => setShowUpdateProfileModal(false)}
        currentUser={currentUser}
        sendOtp={sendOtp}
      />
    </ModalContext.Provider>
  );
}; 