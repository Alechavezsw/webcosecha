import React from 'react';
import GeminiContactChat from './GeminiContactChat';

interface GeminiContactChatModalProps {
  open: boolean;
  onClose: () => void;
}

const GeminiContactChatModal: React.FC<GeminiContactChatModalProps> = ({ open, onClose }) => (
  <GeminiContactChat variant="modal" open={open} onClose={onClose} />
);

export default GeminiContactChatModal;
