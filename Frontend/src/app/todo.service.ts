import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Todo } from './app.component';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = 'http://localhost:7002/api/todoItems';

  public constructor(private http: HttpClient) {
  }

  public getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl).pipe(
      catchError((error) => {
        window.alert(error.error);
        return throwError(error);
      })
    );
  }

  public addTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, todo).pipe(
      catchError((error) => {
        window.alert(error.error);
        return throwError(error);
      })
    );
  }

  public markTodoAsDone(id: number): Observable<Todo> {
    const url = `${this.apiUrl}/${id}/markAsDone`;
    return this.http.post<Todo>(url, null).pipe(
      catchError((error) => {
        window.alert(error.error);
        return throwError(error);
      })
    );
  }
}
