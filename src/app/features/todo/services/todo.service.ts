import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { randText } from '@ngneat/falso';
import { ITodo } from '../interfaces/todo';
import { IUpdatedTodo } from '../interfaces/updated-todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private http = inject(HttpClient);
  private rootUrl = 'https://jsonplaceholder.typicode.com/todos';

  constructor() { }

  getTodos(){
    return this.http.get<ITodo[]>(this.rootUrl);
  }

  createTodo(todo:ITodo){
    return this.http
      .post<IUpdatedTodo>(
        `${this.rootUrl}`,
        JSON.stringify({
          todo: todo.id,
          title: todo.title,
          body: randText(),
          userId: todo.userId,
        }),
        {
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        }
      );
  }

  deleteTodo(todoId:number){
    return this.http.delete(`${this.rootUrl}/${todoId}`);
  }
}
