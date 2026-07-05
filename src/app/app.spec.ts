import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    window.localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the empty state when there are no todos', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-state')?.textContent).toContain('No todos yet');
  });

  it('should add a todo', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    app.newTodoText.set('Write tests');
    app.addTodo();
    fixture.detectChanges();

    expect(app.todos().length).toBe(1);
    expect(app.todos()[0].text).toBe('Write tests');
    expect(app.newTodoText()).toBe('');
  });

  it('should toggle a todo as completed and update counts', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    app.newTodoText.set('Ship feature');
    app.addTodo();
    fixture.detectChanges();

    const id = app.todos()[0].id;
    app.toggleTodo(id);
    fixture.detectChanges();

    expect(app.todos()[0].completed).toBe(true);
    expect(app.completedCount()).toBe(1);
    expect(app.activeCount()).toBe(0);
  });

  it('should filter todos by active/completed', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    app.newTodoText.set('Active one');
    app.addTodo();
    app.newTodoText.set('Completed one');
    app.addTodo();
    fixture.detectChanges();

    const completedId = app.todos()[1].id;
    app.toggleTodo(completedId);
    fixture.detectChanges();

    app.setFilter('active');
    expect(app.filteredTodos().length).toBe(1);
    expect(app.filteredTodos()[0].text).toBe('Active one');

    app.setFilter('completed');
    expect(app.filteredTodos().length).toBe(1);
    expect(app.filteredTodos()[0].text).toBe('Completed one');

    app.setFilter('all');
    expect(app.filteredTodos().length).toBe(2);
  });

  it('should edit a todo', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    app.newTodoText.set('Original text');
    app.addTodo();
    fixture.detectChanges();

    const id = app.todos()[0].id;
    app.startEditing(app.todos()[0]);
    app.editingText.set('Updated text');
    app.saveEdit(id);
    fixture.detectChanges();

    expect(app.todos()[0].text).toBe('Updated text');
    expect(app.editingId()).toBeNull();
  });

  it('should delete a todo', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    app.newTodoText.set('Delete me');
    app.addTodo();
    fixture.detectChanges();

    const id = app.todos()[0].id;
    app.removeTodo(id);
    fixture.detectChanges();

    expect(app.todos().length).toBe(0);
  });

  it('should clear completed todos', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    app.newTodoText.set('Keep me');
    app.addTodo();
    app.newTodoText.set('Clear me');
    app.addTodo();
    fixture.detectChanges();

    const clearId = app.todos()[1].id;
    app.toggleTodo(clearId);
    app.clearCompleted();
    fixture.detectChanges();

    expect(app.todos().length).toBe(1);
    expect(app.todos()[0].text).toBe('Keep me');
  });

  it('should persist todos to localStorage', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    app.newTodoText.set('Persisted todo');
    app.addTodo();
    fixture.detectChanges();

    const raw = window.localStorage.getItem('angular-todo.todos');
    expect(raw).toBeTruthy();
    const stored = JSON.parse(raw as string);
    expect(stored[0].text).toBe('Persisted todo');
  });

  it('should add a todo with a description and category and display them', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    app.newTodoText.set('Plan trip');
    app.newTodoDescription.set('Book flights and hotel');
    app.newTodoCategory.set('Work');
    app.addTodo();
    fixture.detectChanges();

    expect(app.todos()[0].description).toBe('Book flights and hotel');
    expect(app.todos()[0].category).toBe('Work');

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.todo-item__description')?.textContent).toContain(
      'Book flights and hotel',
    );
    expect(compiled.querySelector('.todo-item__category')?.textContent).toContain('Work');
  });

  it('should default new todos to the Personal category', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    app.newTodoText.set('No category chosen');
    app.addTodo();
    fixture.detectChanges();

    expect(app.todos()[0].category).toBe('Personal');
  });

  it('should edit the description and category of a todo', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    app.newTodoText.set('Task');
    app.addTodo();
    fixture.detectChanges();

    const id = app.todos()[0].id;
    app.startEditing(app.todos()[0]);
    app.editingDescription.set('Updated description');
    app.editingCategory.set('Ideas');
    app.saveEdit(id);
    fixture.detectChanges();

    expect(app.todos()[0].description).toBe('Updated description');
    expect(app.todos()[0].category).toBe('Ideas');
  });

  it('should filter todos by category', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    app.newTodoText.set('Work item');
    app.newTodoCategory.set('Work');
    app.addTodo();
    app.newTodoText.set('Personal item');
    app.newTodoCategory.set('Personal');
    app.addTodo();
    fixture.detectChanges();

    app.setCategoryFilter('Work');
    expect(app.filteredTodos().length).toBe(1);
    expect(app.filteredTodos()[0].text).toBe('Work item');

    app.setCategoryFilter('all');
    expect(app.filteredTodos().length).toBe(2);
  });

  it('should toggle dark mode and persist the preference', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    const initial = app.isDarkTheme();
    app.toggleTheme();
    fixture.detectChanges();

    expect(app.isDarkTheme()).toBe(!initial);
    expect(window.localStorage.getItem('angular-todo.theme')).toBe(
      app.isDarkTheme() ? 'dark' : 'light',
    );
    expect(document.documentElement.getAttribute('data-theme')).toBe(
      app.isDarkTheme() ? 'dark' : 'light',
    );
  });

  it('should hide description/category behind a collapsed "Add details" control by default', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    expect(app.detailsExpanded()).toBe(false);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#newTodoDescription')).toBeNull();
    expect(compiled.querySelector('#newTodoCategory')).toBeNull();

    const toggle = compiled.querySelector('.add-todo__details-toggle') as HTMLButtonElement;
    expect(toggle.textContent).toContain('Add details');
    toggle.click();
    fixture.detectChanges();

    expect(app.detailsExpanded()).toBe(true);
    expect(compiled.querySelector('#newTodoDescription')).not.toBeNull();
    expect(compiled.querySelector('#newTodoCategory')).not.toBeNull();
    expect(toggle.textContent).toContain('Hide details');
  });

  it('should not discard description/category when collapsing the details panel', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    app.toggleDetails();
    app.newTodoDescription.set('Bring snacks');
    app.newTodoCategory.set('Errands');
    fixture.detectChanges();

    app.toggleDetails();
    fixture.detectChanges();

    expect(app.newTodoDescription()).toBe('Bring snacks');
    expect(app.newTodoCategory()).toBe('Errands');

    const compiled = fixture.nativeElement as HTMLElement;
    const summary = compiled.querySelector('.add-todo__details-summary');
    expect(summary?.textContent).toContain('Errands');
    expect(summary?.textContent).toContain('Bring snacks');
  });

  it('should reset the details panel to collapsed after a successful add', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    app.toggleDetails();
    app.newTodoText.set('Task with details');
    app.newTodoDescription.set('Some detail');
    app.addTodo();
    fixture.detectChanges();

    expect(app.detailsExpanded()).toBe(false);
    expect(app.newTodoDescription()).toBe('');
  });

  it('should load legacy todos missing description and category with sensible defaults', () => {
    window.localStorage.setItem(
      'angular-todo.todos',
      JSON.stringify([{ id: 'legacy-1', text: 'Legacy todo', completed: false, createdAt: 1 }]),
    );

    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    expect(app.todos()[0].text).toBe('Legacy todo');
    expect(app.todos()[0].category).toBe('Personal');
    expect(app.todos()[0].description).toBe('');
  });
});
