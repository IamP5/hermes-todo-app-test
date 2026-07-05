import { Injectable, computed, signal } from '@angular/core';
import { Todo } from '../models/todo.model';

const STORAGE_KEY = 'angular-todo.todos';

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

  add(text: string): void {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    const todo: Todo = {
      id: this.generateId(),
      text: trimmed,
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

  edit(id: string, text: string): void {
    const trimmed = text.trim();
    if (!trimmed) {
      this.remove(id);
      return;
    }
    this.update(
      this.todosSignal().map((todo) => (todo.id === id ? { ...todo, text: trimmed } : todo)),
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
      return raw ? (JSON.parse(raw) as Todo[]) : [];
    } catch {
      return [];
    }
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
