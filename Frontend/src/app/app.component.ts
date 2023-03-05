import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
import { TodoService } from './todo.service';
import { BehaviorSubject, switchMap } from 'rxjs';

export interface Todo {
  id?: number;
  description: string;
  isCompleted: boolean;
}

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
