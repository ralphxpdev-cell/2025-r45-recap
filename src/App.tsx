import React, { useState, useEffect } from 'react';
import { Task, NotTodayReason } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Header } from './components/Header';
import { TaskList } from './components/TaskList';
import { AddTaskButton } from './components/AddTaskButton';
import { BottomSheet } from './components/BottomSheet';
import { COLORS } from './utils/constants';

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('flowing-loop-tasks', []);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Reset tasks at midnight
  useEffect(() => {
    const checkAndResetTasks = () => {
      const today = new Date().toDateString();
      const lastCheck = localStorage.getItem('flowing-loop-last-check');

      if (lastCheck !== today) {
        setTasks([]);
        localStorage.setItem('flowing-loop-last-check', today);
      }
    };

    checkAndResetTasks();

    // Check every minute
    const interval = setInterval(checkAndResetTasks, 60000);

    return () => clearInterval(interval);
  }, [setTasks]);

  const addTask = (text: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  };

  const markAsDone = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: 'done' as const } : task
      )
    );
  };

  const openNotTodaySheet = (id: string) => {
    setSelectedTaskId(id);
    setBottomSheetOpen(true);
  };

  const handleReasonSelect = (reason: NotTodayReason) => {
    if (selectedTaskId) {
      setTasks(
        tasks.map((task) =>
          task.id === selectedTaskId
            ? { ...task, status: 'not-today' as const, reason }
            : task
        )
      );
    }
    setSelectedTaskId(null);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: COLORS.background,
        paddingBottom: '40px',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        <Header />

        <div
          style={{
            backgroundColor: COLORS.card,
            borderRadius: '20px',
            margin: '0 20px',
            padding: '24px 0',
            boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
          }}
        >
          <div
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: COLORS.primaryText,
              marginBottom: '20px',
              padding: '0 24px',
            }}
          >
            Today Loop
          </div>

          <TaskList
            tasks={tasks}
            onDone={markAsDone}
            onNotToday={openNotTodaySheet}
          />
        </div>

        <AddTaskButton onAdd={addTask} taskCount={tasks.length} />
      </div>

      <BottomSheet
        isOpen={bottomSheetOpen}
        onClose={() => {
          setBottomSheetOpen(false);
          setSelectedTaskId(null);
        }}
        onSelectReason={handleReasonSelect}
      />
    </div>
  );
}

export default App;
