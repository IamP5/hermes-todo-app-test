import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Todo, TodoFilter } from './models/todo.model';
import { TodoService } from './services/todo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly todoService = inject(TodoService);

  readonly newTodoText = signal('');
  readonly filter = signal<TodoFilter>('all');
  readonly editingId = signal<string | null>(null);
  readonly editingText = signal('');

  readonly todos = this.todoService.todos;
  readonly activeCount = this.todoService.activeCount;
  readonly completedCount = this.todoService.completedCount;

  readonly filteredTodos = computed(() => {
    const filter = this.filter();
    const todos = this.todos();
    if (filter === 'active') {
      return todos.filter((todo) => !todo.completed);
    }
    if (filter === 'completed') {
      return todos.filter((todo) => todo.completed);
    }
    return todos;
  });

  readonly hasTodos = computed(() => this.todos().length > 0);

  addTodo(): void {
    this.todoService.add(this.newTodoText());
    this.newTodoText.set('');
  }

  toggleTodo(id: string): void {
    this.todoService.toggle(id);
  }

  removeTodo(id: string): void {
    this.todoService.remove(id);
  }

  setFilter(filter: TodoFilter): void {
    this.filter.set(filter);
  }

  clearCompleted(): void {
    this.todoService.clearCompleted();
  }

  toggleAll(completed: boolean): void {
    this.todoService.toggleAll(completed);
  }

  startEditing(todo: Todo): void {
    this.editingId.set(todo.id);
    this.editingText.set(todo.text);
  }

  saveEdit(id: string): void {
    if (this.editingId() !== id) {
      return;
    }
    this.todoService.edit(id, this.editingText());
    this.cancelEdit();
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.editingText.set('');
  }

  editByPrompt(todo: Todo): void {
    const result = window.prompt('Edit todo', todo.text);
    if (result !== null) {
      this.todoService.edit(todo.id, result);
    }
  }

  trackById(_index: number, todo: Todo): string {
    return todo.id;
  }
}
