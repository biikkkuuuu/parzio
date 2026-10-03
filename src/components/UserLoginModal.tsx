import React from 'react';
import { UserLoginView } from './UserLoginView';
import { UserProfile } from '../services/userService';

interface UserLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const UserLoginModal: React.FC<UserLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#faf8f5] overflow-y-auto animate-fadeIn">
      <UserLoginView
        onBack={onClose}
        onSuccess={(profile) => {
          onSuccess(profile);
          onClose();
        }}
      />
    </div>
  );
};
