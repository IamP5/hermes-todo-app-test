export interface Todo {
  id: string;
  text: string;
  description: string;
  category: string;
  completed: boolean;
  createdAt: number;
}

export const DEFAULT_CATEGORY = 'Personal';

export const CATEGORIES: readonly string[] = ['Personal', 'Work', 'Errands', 'Ideas'];

export type TodoFilter = 'all' | 'active' | 'completed';

export type CategoryFilter = 'all' | string;
