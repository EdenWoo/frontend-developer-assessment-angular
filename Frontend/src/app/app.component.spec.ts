import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { TodoService } from './todo.service';
import { By } from '@angular/platform-browser';
import { SortListPipe } from './sort-list.pipe';
import { DebugElement } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let todoService: TodoService;
  let descriptionInput: HTMLInputElement;
  let addButton: HTMLElement;
  let todoItems: DebugElement[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [AppComponent, SortListPipe],
      providers: [TodoService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    descriptionInput = fixture.debugElement.query(By.css('#formAddTodoItem')).nativeElement;
    addButton = fixture.debugElement.query(By.css('.add-item')).nativeElement;
    todoItems = fixture.debugElement.queryAll(By.css('.todo'));
    todoService = TestBed.inject(TodoService);
    spyOn(todoService, 'getTodos').and.returnValue(of([{description: 'New Todo', isCompleted: false}]));
    spyOn(todoService, 'addTodo').and.returnValue(of({description: 'New Todo', isCompleted: false}));
    spyOn(todoService, 'markTodoAsDone').and.returnValue(of());
    fixture.detectChanges();
  });

  it('should display the title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.h4')?.textContent).toContain('Todo List App (Angular)');
  });

  it('should be created with 0 todos', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(todoItems.length).toBe(0);
  });

  it('should display todos after adding add a correct todo', () => {
    const todo = {description: 'New Todo', isCompleted: false};
    component.todoForm.patchValue(todo);
    fixture.detectChanges();
    addButton.click();
    fixture.detectChanges();

    // Expect the new todo item to be added to the list
    expect(fixture.debugElement.queryAll(By.css('.todo')).length).toEqual(1);
  });

  it('should display ordered todos', () => {
    const input = [
      {id: 1, description: 'B', isCompleted: false},
      {id: 2, description: 'A', isCompleted: false},
    ];
    const expectedOutput = [
      {id: 2, description: 'A', isCompleted: false},
      {id: 1, description: 'B', isCompleted: false}
    ];
    component.todos$ = of(input);
    fixture.detectChanges();
    const todoDescriptionElements = fixture.debugElement.queryAll(By.css('.description'));

    // Test that the todos are displayed in the correct order
    const todoDescriptions = todoDescriptionElements.map(el => el.nativeElement.textContent.trim());
    const expectedDescriptions = expectedOutput.map(todo => todo.description);
    expect(todoDescriptions).toEqual(expectedDescriptions);
  });

  it('should display error message for forbidden words in description field', () => {
    const forbiddenWords = ['cat', 'dog', 'yes', 'no'];
    descriptionInput.value = '';

    for (const word of forbiddenWords) {
      descriptionInput.value = word;
      descriptionInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const errorEl = fixture.debugElement.query(By.css('.error'));
      expect(errorEl.nativeElement.textContent).toContain('Description contains forbidden words.');
    }
  });

  it('should add a todo when the addTodo method is called', () => {
    const todo = {description: 'New Todo', isCompleted: false};
    component.todoForm.patchValue(todo);
    component.addTodo();
    expect(todoService.addTodo).toHaveBeenCalledWith({...todo, isCompleted: false});
  });

  it('should mark a todo as done when the markTodoAsDone method is called', () => {
    const todo = {id: 1, description: 'New Todo', isCompleted: false};
    component.markTodoAsDone(todo);
    expect(todoService.markTodoAsDone).toHaveBeenCalledWith(1);
  });

});
