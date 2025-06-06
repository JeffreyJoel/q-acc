'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SignModal } from '@/components/modals/SignModal';
import { UpdateProfileModal } from '@/components/modals/UpdateProfileModal';
import { InfoModal } from '@/components/modals/InfoModal';
import { IUser } from '@/types/user.type';

interface ModalContextType {
  showSignModal: boolean;
  showUpdateProfileModal: boolean;
  showInfoModal: boolean;
  setShowSignModal: (show: boolean) => void;
  setShowUpdateProfileModal: (show: boolean) => void;
  setShowInfoModal: (show: boolean) => void;
  openUpdateProfileModal: (user?: IUser, sendOtp?: boolean) => void;
  openSignModal: () => void;
  openInfoModal: (title: string, description: string) => void;
  currentUser: IUser | null;
  setCurrentUser: (user: IUser | null) => void;
  onSign?: (signedInUser: IUser) => void;
  setOnSign: (callback: (signedInUser: IUser) => void) => void;
  infoModalData: { title: string; description: string };
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
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [sendOtp, setSendOtp] = useState(false);
  const [onSign, setOnSign] = useState<((signedInUser: IUser) => void) | undefined>();
  const [infoModalData, setInfoModalData] = useState({ title: '', description: '' });

  const openUpdateProfileModal = (user?: IUser, sendOtp?: boolean) => {
    if (user) setCurrentUser(user);
    if (sendOtp) setSendOtp(sendOtp);
    setShowUpdateProfileModal(true);
  };
  
  const openSignModal = () => setShowSignModal(true);

  const openInfoModal = (title: string, description: string) => {
    setInfoModalData({ title, description });
    setShowInfoModal(true);
  };

  const value = {
    showSignModal,
    showUpdateProfileModal,
    showInfoModal,
    setShowSignModal,
    setShowUpdateProfileModal,
    setShowInfoModal,
    openUpdateProfileModal,
    openSignModal,
    openInfoModal,
    currentUser,
    setCurrentUser,
    onSign,
    setOnSign,
    infoModalData
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

      <InfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title={infoModalData.title}
        description={infoModalData.description}
      />
    </ModalContext.Provider>
  );
}; 