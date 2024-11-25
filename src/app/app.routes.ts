import { Routes } from '@angular/router';
import { TodoComponent } from './features/todo/components/todo/todo.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
export const routes: Routes = [
  {
    path:'',
    redirectTo: 'todos',
    pathMatch: 'full'
  },
  {
    path: 'todos',
    component: TodoComponent,
  },
  {
    path: 'not-found',
    component:NotFoundComponent
  },
  {
    path:'**',
    component:NotFoundComponent
  }
];
