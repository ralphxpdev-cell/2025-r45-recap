export interface Task {
  id: string;
  text: string;
  status: 'pending' | 'done' | 'not-today';
  createdAt: string;
  reason?: NotTodayReason;
}

export type NotTodayReason =
  | '체력'
  | '일정 초과'
  | '집중 안 됨'
  | '우선순위 혼동'
  | '외부 일정';

export const NOT_TODAY_REASONS: NotTodayReason[] = [
  '체력',
  '일정 초과',
  '집중 안 됨',
  '우선순위 혼동',
  '외부 일정',
];
