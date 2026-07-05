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
});
