import React from 'react';
import { Task, NotTodayReason } from '../types';
import { COLORS } from '../utils/constants';

interface TaskCardProps {
  task: Task;
  onDone: (id: string) => void;
  onNotToday: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onDone, onNotToday }) => {
  const isDone = task.status === 'done';
  const isNotToday = task.status === 'not-today';

  return (
    <div
      style={{
        backgroundColor: COLORS.card,
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
        transition: 'all 0.3s ease',
        border: isDone
          ? `2px solid ${COLORS.success}`
          : isNotToday
          ? `2px solid ${COLORS.neutral}`
          : '2px solid transparent',
      }}
    >
      <div
        style={{
          fontSize: '15px',
          color: isDone || isNotToday ? COLORS.secondaryText : COLORS.primaryText,
          marginBottom: '16px',
          lineHeight: '1.5',
          textDecoration: isDone ? 'line-through' : 'none',
          opacity: isDone || isNotToday ? 0.6 : 1,
        }}
      >
        {task.text}
      </div>

      {task.status === 'pending' && (
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => onDone(task.id)}
            style={{
              flex: 1,
              padding: '12px 20px',
              backgroundColor: COLORS.success,
              color: 'white',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 500,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#45C191';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.success;
            }}
          >
            Done
          </button>
          <button
            onClick={() => onNotToday(task.id)}
            style={{
              flex: 1,
              padding: '12px 20px',
              backgroundColor: COLORS.background,
              color: COLORS.primaryText,
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 500,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E8ECF3';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.background;
            }}
          >
            Not today
          </button>
        </div>
      )}

      {isNotToday && task.reason && (
        <div
          style={{
            fontSize: '13px',
            color: COLORS.secondaryText,
            fontStyle: 'italic',
            marginTop: '12px',
          }}
        >
          {task.reason}
        </div>
      )}

      {isDone && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            color: COLORS.success,
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            style={{ animation: 'checkPop 0.3s ease' }}
          >
            <circle cx="10" cy="10" r="8" fill={COLORS.success} />
            <path
              d="M6 10L9 13L14 7"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>완료</span>
        </div>
      )}

      <style>{`
        @keyframes checkPop {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
