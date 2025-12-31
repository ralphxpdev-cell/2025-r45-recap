import React, { useState } from 'react';
import { COLORS, MAX_TASKS, LIMIT_MESSAGE } from '../utils/constants';

interface AddTaskButtonProps {
  onAdd: (text: string) => void;
  taskCount: number;
}

export const AddTaskButton: React.FC<AddTaskButtonProps> = ({ onAdd, taskCount }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [text, setText] = useState('');

  const canAddMore = taskCount < MAX_TASKS;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && canAddMore) {
      onAdd(text.trim());
      setText('');
      setIsAdding(false);
    }
  };

  if (!canAddMore) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '24px 20px',
          color: COLORS.secondaryText,
          fontSize: '14px',
        }}
      >
        {LIMIT_MESSAGE}
      </div>
    );
  }

  if (isAdding) {
    return (
      <div
        style={{
          padding: '0 20px',
          marginTop: '16px',
        }}
      >
        <form onSubmit={handleSubmit}>
          <div
            style={{
              backgroundColor: COLORS.card,
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
            }}
          >
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="오늘 하고 싶은 것을 입력하세요"
              autoFocus
              style={{
                width: '100%',
                fontSize: '15px',
                color: COLORS.primaryText,
                backgroundColor: 'transparent',
                marginBottom: '16px',
                padding: '8px 0',
              }}
              maxLength={100}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                disabled={!text.trim()}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  backgroundColor: text.trim() ? COLORS.accentBlue : COLORS.neutral,
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 500,
                  opacity: text.trim() ? 1 : 0.6,
                  cursor: text.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                추가
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setText('');
                }}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  backgroundColor: COLORS.background,
                  color: COLORS.primaryText,
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                취소
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '0 20px',
        marginTop: '16px',
      }}
    >
      <button
        onClick={() => setIsAdding(true)}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: COLORS.card,
          borderRadius: '16px',
          boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '15px',
          color: COLORS.accentBlue,
          fontWeight: 500,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#F8F9FB';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = COLORS.card;
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="8" stroke={COLORS.accentBlue} strokeWidth="2" />
          <path
            d="M10 6V14M6 10H14"
            stroke={COLORS.accentBlue}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span>추가</span>
      </button>
    </div>
  );
};
