import { Injectable, computed, signal } from '@angular/core';
import { DEFAULT_CATEGORY, Todo } from '../models/todo.model';

const STORAGE_KEY = 'angular-todo.todos';

export interface AddTodoOptions {
  description?: string;
  category?: string;
}

export interface EditTodoOptions {
  text?: string;
  description?: string;
  category?: string;
}

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly todosSignal = signal<Todo[]>(this.loadFromStorage());

  readonly todos = this.todosSignal.asReadonly();

  readonly activeCount = computed(
    () => this.todosSignal().filter((todo) => !todo.completed).length,
  );

  readonly completedCount = computed(
    () => this.todosSignal().filter((todo) => todo.completed).length,
  );

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === STORAGE_KEY) {
          this.todosSignal.set(this.loadFromStorage());
        }
      });
    }
  }

  add(text: string, options: AddTodoOptions = {}): void {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    const todo: Todo = {
      id: this.generateId(),
      text: trimmed,
      description: (options.description ?? '').trim(),
      category: this.normalizeCategory(options.category),
      completed: false,
      createdAt: Date.now(),
    };
    this.update([...this.todosSignal(), todo]);
  }

  toggle(id: string): void {
    this.update(
      this.todosSignal().map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }

  edit(id: string, updates: EditTodoOptions): void {
    const text = updates.text?.trim();
    if (text !== undefined && !text) {
      this.remove(id);
      return;
    }
    this.update(
      this.todosSignal().map((todo) => {
        if (todo.id !== id) {
          return todo;
        }
        return {
          ...todo,
          ...(text !== undefined ? { text } : {}),
          ...(updates.description !== undefined ? { description: updates.description.trim() } : {}),
          ...(updates.category !== undefined
            ? { category: this.normalizeCategory(updates.category) }
            : {}),
        };
      }),
    );
  }

  remove(id: string): void {
    this.update(this.todosSignal().filter((todo) => todo.id !== id));
  }

  clearCompleted(): void {
    this.update(this.todosSignal().filter((todo) => !todo.completed));
  }

  toggleAll(completed: boolean): void {
    this.update(this.todosSignal().map((todo) => ({ ...todo, completed })));
  }

  private normalizeCategory(category: string | undefined): string {
    const trimmed = category?.trim();
    return trimmed ? trimmed : DEFAULT_CATEGORY;
  }

  private update(todos: Todo[]): void {
    this.todosSignal.set(todos);
    this.saveToStorage(todos);
  }

  private loadFromStorage(): Todo[] {
    if (typeof window === 'undefined' || !window.localStorage) {
      return [];
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.map((entry) => this.normalizeTodo(entry)) : [];
    } catch {
      return [];
    }
  }

  private normalizeTodo(entry: Record<string, unknown>): Todo {
    return {
      id: typeof entry['id'] === 'string' ? entry['id'] : this.generateId(),
      text: typeof entry['text'] === 'string' ? entry['text'] : '',
      description: typeof entry['description'] === 'string' ? entry['description'] : '',
      category:
        typeof entry['category'] === 'string' && entry['category'].trim()
          ? (entry['category'] as string)
          : DEFAULT_CATEGORY,
      completed: Boolean(entry['completed']),
      createdAt: typeof entry['createdAt'] === 'number' ? entry['createdAt'] : Date.now(),
    };
  }

  private saveToStorage(todos: Todo[]): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  private generateId(): string {
    return typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}
