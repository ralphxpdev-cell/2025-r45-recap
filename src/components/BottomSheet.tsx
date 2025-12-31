import React, { useEffect } from 'react';
import { NOT_TODAY_REASONS, NotTodayReason } from '../types';
import { COLORS } from '../utils/constants';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReason: (reason: NotTodayReason) => void;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  onSelectReason,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 999,
          animation: 'fadeIn 0.2s ease',
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: COLORS.card,
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          padding: '24px 20px 32px',
          zIndex: 1000,
          animation: 'slideUp 0.3s ease',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '4px',
            backgroundColor: COLORS.neutral,
            borderRadius: '2px',
            margin: '0 auto 24px',
          }}
        />
        <div
          style={{
            fontSize: '14px',
            color: COLORS.secondaryText,
            marginBottom: '16px',
            textAlign: 'center',
          }}
        >
          오늘은 이 이유로 넘길게요
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {NOT_TODAY_REASONS.map((reason) => (
            <button
              key={reason}
              onClick={() => {
                onSelectReason(reason);
                onClose();
              }}
              style={{
                padding: '16px',
                backgroundColor: COLORS.background,
                borderRadius: '16px',
                fontSize: '15px',
                color: COLORS.primaryText,
                textAlign: 'center',
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E8ECF3';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.background;
              }}
            >
              {reason}
            </button>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  );
};
