import { NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { ItemComponent } from '../item/item.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoadingService } from '../../../../core/services/loading.service';
import { ProcessedTodoService } from '../../services/processed-todo.service';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
  CdkDragPlaceholder,
  CdkDragEnter,
} from '@angular/cdk/drag-drop';
import { RandomBgColorDirective } from '../../directives/random-bg-color.directive';
import { ITodo } from '../../interfaces/todo';
import { ToastsService } from '../../../../core/services/toasts.service';
import { Router } from '@angular/router';
import { updateId } from '../../helpers/generate-id';
import { MainInputComponent } from '../main-input/main-input.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
/*
 * Step 1: refactor with best practices
 *
 * What you will need to do:
 *
 *     Avoid any as a type. Using Interface to leverage Typescript type system prevent errors
 *     Use a separate service for all your http calls and use a Signal for your todoList
 *     Don’t mutate data
 *
 *
 * Step 2: Improve
 *
 * Add a Delete button: Doc of fake API [https://jsonplaceholder.typicode.com/]
 * Handle errors correctly. (Globally)
 * Add a Global loading indicator. You can use MatProgressSpinnerModule
 *
 * Step 3:
 *  Have a localized Loading/Error indicator, e.g. only on the Todo being processed and disable all buttons of the processed Todo. (Hint: you will need to create an ItemComponent)
 */

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    ItemComponent,
    ReactiveFormsModule,
    DragDropModule,
    CdkDrag,
    CdkDropList,
    CdkDragPlaceholder,
    NgStyle,
    RandomBgColorDirective,
    MainInputComponent,
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProcessedTodoService],
})
export class TodoComponent {
  private router = inject(Router);
  private toastr = inject(ToastsService);
  private todoService = inject(TodoService);
  private loadingService = inject(LoadingService);
  private processedTodoService = inject(ProcessedTodoService);
  destroyRef = inject(DestroyRef);
  private destroyEffect = effect(() => {
    this.destroyRef.onDestroy(this.loadingService.showSpinner);
  });

  newTodoTitle = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^$|\S+/g)],
    }),
  });

  readonly todos = signal<ITodo[]>([]);
  activeTodos = computed(() => this.todos().filter((todo) => !todo.completed));
  completedTodos = computed(() =>
    this.todos().filter((todo) => todo.completed)
  );
  processedTodos = this.processedTodoService.processedTodos;
  ngOnInit(): void {
    try {
      const localStorageTodos = JSON.parse(
        localStorage.getItem('todos') as string
      );
      if (localStorageTodos != null) {
        setTimeout(() => {
          this.todos.set(localStorageTodos as ITodo[]);
          this.loadingService.hideSpinner();
        }, 1000);
      } else {
        this.todoService
          .getTodos()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (res) => {
              this.todos.set(res.map((todo) => ({ ...todo, id: updateId() })));
              this.onTodosChange();
              this.loadingService.hideSpinner();
            },
            error: () => {
              this.toastr.error(
                'Creating Task Failed ,Please try again .',
                'Creating Task Failed!'
              );
            },
          });
      }
    } catch (error) {
      this.router.navigate(['not-found']);
    }
  }

  createTodo() {
    let newTodo = {
      id: (Math.max(...[...this.todos()].map((todo) => todo.id)) || 0) + 1,
      completed: false,
      userId: 1,
      title: this.newTodoTitle.controls.title.value as string,
    };
    this.todoService.createTodo(newTodo).subscribe({
      next: (res) => {
        this.todos.update((oldTodos) => [...oldTodos, newTodo]);
        this.newTodoTitle.reset();
        this.onTodosChange();
        this.toastr.success(
          'Todo has been Added successfully .',
          'Todo Added!'
        );
      },
      error: (err) => {
        this.toastr.error(
          "Couldn't Add Todo ,Please try again .",
          'Adding Todo Failed..!'
        );
      },
    });
  }

  update(oldTodo: ITodo, updatedTitle: string) {
    setTimeout(() => {
      this.todos.update((t) =>
        t.map((todo) =>
          todo.id === oldTodo.id ? { ...oldTodo, title: updatedTitle } : todo
        )
      );
      this.processedTodoService.deleteTodo(oldTodo.id);
      this.onTodosChange();
      this.toastr.success(
        'Todo has been Updated successfully .',
        'Todo Updated!'
      );
    }, 1000);
  }

  delete(todoId: number) {
    this.todoService.deleteTodo(todoId).subscribe({
      next: (res) => {
        this.todos.update((oldTodos) => {
          return oldTodos.filter((todo) => todo.id != todoId);
        });
        this.processedTodoService.deleteTodo(todoId);
        this.onTodosChange();
        this.toastr.success(
          'Todo has been Deleted successfully .',
          'Todo Deleted!'
        );
      },
      error: (err) => {
        this.toastr.error(
          "Couldn't Delete Todo ,Please try again .",
          'Deleting Todo Failed..!'
        );
      },
    });
  }

  drop(event: CdkDragDrop<ITodo[], ITodo[], ITodo>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      if (event.currentIndex != event.previousIndex) {
        this.toastr.success(
          "Todo's Order has been Changed successfully .",
          'Todo Ordered!'
        );
      }
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.toastr.success(
        "Todo's State has been Changed successfully .",
        'Todo State!'
      );
    }
    this.onTodosChange();
  }

  toggleTodo(e: CdkDragEnter<any>) {
    const draggedTodoData = e.item.data;
    this.todos().map((todo) => {
      if (todo.id === draggedTodoData.id) {
        todo.completed = !todo.completed;
        this.onTodosChange();
      }
    });
  }

  onTodosChange() {
    localStorage.setItem(
      'todos',
      JSON.stringify([...this.activeTodos(), ...this.completedTodos()])
    );
  }
}
