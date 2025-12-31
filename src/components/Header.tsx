import React from 'react';
import { GENTLE_MESSAGES, COLORS } from '../utils/constants';

export const Header: React.FC = () => {
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const randomMessage = React.useMemo(
    () => GENTLE_MESSAGES[Math.floor(Math.random() * GENTLE_MESSAGES.length)],
    []
  );

  return (
    <header
      style={{
        padding: '32px 20px 24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: '14px',
          color: COLORS.secondaryText,
          marginBottom: '8px',
          fontWeight: 500,
        }}
      >
        {dateString}
      </div>
      <div
        style={{
          fontSize: '12px',
          color: COLORS.secondaryText,
          opacity: 0.8,
        }}
      >
        {randomMessage}
      </div>
    </header>
  );
};
