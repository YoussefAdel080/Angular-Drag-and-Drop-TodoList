import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { ITodo } from '../../interfaces/todo';
import { FormsModule } from '@angular/forms';
import { NgClass, NgStyle } from '@angular/common';
import { ProcessedTodoService } from '../../services/processed-todo.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [FormsModule, NgStyle, MatProgressSpinnerModule, NgClass],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemComponent {
  private processedTodoService = inject(ProcessedTodoService);

  update = output<string>();
  delete = output<void>();
  todo = input.required<ITodo>({ alias: 'todo' });

  private updatesTitleEffect = effect(() => {
    const todo = this.todo();
    this.updatedTitle = todo.title;
  });

  editDisability = true;

  processedTodos = this.processedTodoService.processedTodos;
  processing = computed(() => this.processedTodos().includes(this.todo().id));
  updatedTitle!: string;
  updateTodo() {
    this.update.emit(this.updatedTitle);
    this.processedTodoService.addTodo(this.todo().id);
    this.editDisability = true;
  }

  deleteTodo() {
    this.delete.emit();
    this.processedTodoService.addTodo(this.todo().id);
    this.editDisability = true;
  }
}
