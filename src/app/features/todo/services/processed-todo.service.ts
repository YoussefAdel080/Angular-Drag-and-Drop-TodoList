import { Injectable, signal } from '@angular/core';
import { ITodo } from '../interfaces/todo';

@Injectable()
export class ProcessedTodoService {

  constructor() { }

  private readonly processedTodosSignal = signal<number[]>([]);
  processedTodos = this.processedTodosSignal.asReadonly()


  addTodo(id: number){
    this.processedTodosSignal.update((oldProcessedTodos) => {return [...oldProcessedTodos,id]})
  }

  deleteTodo(id: number){
    this.processedTodosSignal.update((oldProcessedTodos) => {return oldProcessedTodos.filter((i) => {i != id}) || []});
  }


}
