import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CATEGORIES, DEFAULT_CATEGORY, Todo, TodoFilter } from './models/todo.model';
import { TodoService } from './services/todo.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly todoService = inject(TodoService);
  private readonly themeService = inject(ThemeService);

  readonly categories = CATEGORIES;
  readonly defaultCategory = DEFAULT_CATEGORY;

  readonly newTodoText = signal('');
  readonly newTodoDescription = signal('');
  readonly newTodoCategory = signal(DEFAULT_CATEGORY);
  readonly detailsExpanded = signal(false);

  readonly filter = signal<TodoFilter>('all');
  readonly categoryFilter = signal<string>('all');

  readonly editingId = signal<string | null>(null);
  readonly editingText = signal('');
  readonly editingDescription = signal('');
  readonly editingCategory = signal(DEFAULT_CATEGORY);

  readonly todos = this.todoService.todos;
  readonly activeCount = this.todoService.activeCount;
  readonly completedCount = this.todoService.completedCount;

  readonly isDarkTheme = this.themeService.isDark;

  readonly filteredTodos = computed(() => {
    const status = this.filter();
    const category = this.categoryFilter();
    return this.todos().filter((todo) => {
      const statusMatches =
        status === 'all' || (status === 'active' ? !todo.completed : todo.completed);
      const categoryMatches = category === 'all' || todo.category === category;
      return statusMatches && categoryMatches;
    });
  });

  readonly hasTodos = computed(() => this.todos().length > 0);

  readonly hasDetailsSummary = computed(
    () => this.newTodoDescription().trim().length > 0 || this.newTodoCategory() !== DEFAULT_CATEGORY,
  );

  addTodo(): void {
    this.todoService.add(this.newTodoText(), {
      description: this.newTodoDescription(),
      category: this.newTodoCategory(),
    });
    this.newTodoText.set('');
    this.newTodoDescription.set('');
    this.newTodoCategory.set(DEFAULT_CATEGORY);
    this.detailsExpanded.set(false);
  }

  toggleDetails(): void {
    this.detailsExpanded.set(!this.detailsExpanded());
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

  setCategoryFilter(category: string): void {
    this.categoryFilter.set(category);
  }

  clearCompleted(): void {
    this.todoService.clearCompleted();
  }

  toggleAll(completed: boolean): void {
    this.todoService.toggleAll(completed);
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  startEditing(todo: Todo): void {
    this.editingId.set(todo.id);
    this.editingText.set(todo.text);
    this.editingDescription.set(todo.description);
    this.editingCategory.set(todo.category);
  }

  saveEdit(id: string): void {
    if (this.editingId() !== id) {
      return;
    }
    this.todoService.edit(id, {
      text: this.editingText(),
      description: this.editingDescription(),
      category: this.editingCategory(),
    });
    this.cancelEdit();
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.editingText.set('');
    this.editingDescription.set('');
    this.editingCategory.set(DEFAULT_CATEGORY);
  }

  trackById(_index: number, todo: Todo): string {
    return todo.id;
  }
}
