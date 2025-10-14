'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className,
  showCloseButton = true 
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal Content */}
      <div
        ref={modalRef}
        className={cn(
          "relative bg-background border border-border rounded-lg shadow-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto",
          className
        )}
        tabIndex={-1}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-border">
            {title && (
              <h2 id="modal-title" className="text-lg font-semibold">
                {title}
              </h2>
            )}
            
            {showCloseButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 ml-auto"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className={cn("p-6", (title || showCloseButton) && "pt-0")}>
          {children}
        </div>
      </div>
    </div>
  );
}