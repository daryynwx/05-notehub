import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from './NoteModal.module.css';

interface NoteModalProps { children: React.ReactNode; onClose: () => void; }

const NoteModal: React.FC<NoteModalProps> = ({ children, onClose }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={onClose}>
      <div className={css.modal} onClick={e => e.stopPropagation()}>{children}</div>
    </div>,
    document.body
  );
};

export default NoteModal;
