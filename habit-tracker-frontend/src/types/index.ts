export interface Habit {
  id: number;
  title: string;
  description: string | null;
}

export interface HabitLog {
  id: number;
  habit_id: number;
  date: string;
}

export interface HabitRequest {
  title: string;
  description?: string | null;
}

export interface HabitLogRequest {
  date: string;
}

export enum HabitFilter {
  ALL = "ALL",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}