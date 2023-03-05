import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
import { TodoService } from './todo.service';
import { BehaviorSubject, switchMap } from 'rxjs';

export interface Todo {
  id?: number;
  description: string;
  isCompleted: boolean;
}
/**
 * For real word app,
 * 1. I will choose using NgRx,with a single store for managing the state of your application, making it easier to manage and maintain.
 * Also, Ngrx come with predictable data flow and immutable state, also NgRx scales well with larger applications, making it easy to manage complex state and to keep your application maintainable as it grows.
 *
 * 2. Restructure the folder to be clearer and break app-component into more single-functional components.
 * app/
 * ├── core/
 * │   ├── models/
 * │   │   └── todo.ts
 * │   └── services/
 * │       └── todo.service.ts
 * ├── shared/
 * │   ├── components/
 * │   │   ├── footer/
 * │   │   │   └── footer.component.ts
 * │   │   ├── header/
 * │   │   │   └── header.component.ts
 * │   │   ├── todo-form/
 * │   │   │   └── todo-form.component.ts
 * │   │   └── todo-list/
 * │   │       ├── todo-item/
 * │   │       │   └── todo-item.component.ts
 * │   │       └── todo-list.component.ts
 * │   └── directives/
 * │       └── highlight.directive.ts
 * ├── features/
 * │   ├── todo/
 * │   │   ├── pages/
 * │   │   │   ├── todo-page/
 * │   │   │   │   ├── todo-page.component.html
 * │   │   │   │   ├── todo-page.component.scss
 * │   │   │   │   ├── todo-page.component.spec.ts
 * │   │   │   │   ├── todo-page.component.ts
 * │   │   │   │   └── todo-page.module.ts
 * │   │   │   └── index.ts
 * */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public reload$ = new BehaviorSubject(null);
  public todos$ = this.reload$.pipe(switchMap(() => this.todoService.getTodos()))
  public todoForm: FormGroup = new FormGroup({});

  public constructor(
    private todoService: TodoService,
    private formBuilder: FormBuilder
  ) {
  }

  public get description(): FormControl {
    return this.todoForm.get('description') as FormControl;
  }

  public  ngOnInit(): void {
    this.todoForm = this.formBuilder.group({
      description: ['', [Validators.required, this.forbiddenWordsValidator]],
    });
  }

  public getTodos(): void {
    this.reload$.next(null);
  }

  public addTodo(): void {
    this.todoService.addTodo({
      ...this.todoForm.value,
      isCompleted: false,
    }).subscribe(
      () => {
        this.getTodos()
        this.todoForm.reset();
      }
    );
  }

  public resetTodoForm(): void {
    this.todoForm.reset();
  }

  public markTodoAsDone(todo: Todo): void {
    this.todoService.markTodoAsDone(todo.id as number).subscribe(() => {
      this.getTodos()
    });
  }

  private forbiddenWordsValidator(control: FormControl): { [s: string]: boolean } | null {
    const forbiddenWords = ['cat', 'dog', 'yes', 'no'];
    if (forbiddenWords.some((word) => control.value?.includes(word))) {
      return {forbiddenWords: true};
    }
    return null;
  }
}
