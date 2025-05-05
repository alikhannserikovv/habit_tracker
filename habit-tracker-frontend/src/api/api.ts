import axios from 'axios';
import { Habit, HabitLog, HabitRequest, HabitLogRequest } from '../types';

const API_URL = 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const habitApi = {
  // Получение всех привычек
  getAllHabits: async (): Promise<Habit[]> => {
    const response = await apiClient.get('/habits');
    return response.data;
  },

  // Создание новой привычки
  createHabit: async (habit: HabitRequest): Promise<void> => {
    await apiClient.post('/habits/create', habit);
  },

  // Обновление привычки
  updateHabit: async (id: number, habit: HabitRequest): Promise<void> => {
    await apiClient.put(`/habits/${id}`, habit);
  },

  // Удаление привычки
  deleteHabit: async (id: number): Promise<void> => {
    await apiClient.delete(`/habits/${id}`);
  },

  // Получение логов привычки
  getHabitLogs: async (habitId: number): Promise<HabitLog[]> => {
    const response = await apiClient.get(`/habits/${habitId}/log`);
    return response.data;
  },

  // Трекинг привычки
  trackHabit: async (habitId: number, log: HabitLogRequest): Promise<HabitLog> => {
    const response = await apiClient.post(`/habits/${habitId}/track`, log);
    return response.data;
  },

  // Отмена трекинга привычки
  untrackHabit: async (habitId: number, date: string): Promise<void> => {
    await apiClient.delete(`/habits/${habitId}/track/${date}`);
  },
};