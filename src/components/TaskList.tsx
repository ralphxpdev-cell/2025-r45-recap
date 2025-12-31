import React from 'react';
import { Task, NotTodayReason } from '../types';
import { TaskCard } from './TaskCard';
import { COLORS } from '../utils/constants';

interface TaskListProps {
  tasks: Task[];
  onDone: (id: string) => void;
  onNotToday: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onDone, onNotToday }) => {
  if (tasks.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: COLORS.secondaryText,
          fontSize: '14px',
        }}
      >
        오늘의 루프를 시작해보세요
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '0 20px',
      }}
    >
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onDone={onDone} onNotToday={onNotToday} />
      ))}
    </div>
  );
};
