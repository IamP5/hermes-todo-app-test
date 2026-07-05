import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';

const STORAGE_KEY = 'angular-todo.todos';

describe('TodoService', () => {
  beforeEach(() => {
    window.localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('adds a todo with a description and category', () => {
    const service = TestBed.inject(TodoService);

    service.add('Buy milk', { description: 'Whole milk', category: 'Errands' });

    const [todo] = service.todos();
    expect(todo.text).toBe('Buy milk');
    expect(todo.description).toBe('Whole milk');
    expect(todo.category).toBe('Errands');
    expect(todo.completed).toBe(false);
  });

  it('defaults category to Personal when none is provided', () => {
    const service = TestBed.inject(TodoService);

    service.add('Read a book');

    expect(service.todos()[0].category).toBe('Personal');
    expect(service.todos()[0].description).toBe('');
  });

  it('edits text, description, and category independently', () => {
    const service = TestBed.inject(TodoService);
    service.add('Original');
    const id = service.todos()[0].id;

    service.edit(id, { description: 'New description' });
    expect(service.todos()[0].text).toBe('Original');
    expect(service.todos()[0].description).toBe('New description');

    service.edit(id, { category: 'Work' });
    expect(service.todos()[0].category).toBe('Work');

    service.edit(id, { text: 'Updated' });
    expect(service.todos()[0].text).toBe('Updated');
  });

  it('removes the todo when edited to an empty title', () => {
    const service = TestBed.inject(TodoService);
    service.add('Delete via empty edit');
    const id = service.todos()[0].id;

    service.edit(id, { text: '   ' });

    expect(service.todos().length).toBe(0);
  });

  it('migrates legacy todos missing description and category fields', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ id: 'legacy-1', text: 'Old todo', completed: true, createdAt: 1 }]),
    );

    const service = TestBed.inject(TodoService);

    const [todo] = service.todos();
    expect(todo.text).toBe('Old todo');
    expect(todo.completed).toBe(true);
    expect(todo.category).toBe('Personal');
    expect(todo.description).toBe('');
  });

  it('ignores malformed localStorage data', () => {
    window.localStorage.setItem(STORAGE_KEY, 'not json');

    const service = TestBed.inject(TodoService);

    expect(service.todos()).toEqual([]);
  });
});
