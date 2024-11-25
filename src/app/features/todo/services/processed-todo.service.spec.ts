import { TestBed } from '@angular/core/testing';

import { ProcessedTodoService } from '../features/todo/services/processed-todo.service';

describe('ProcessedTodoService', () => {
  let service: ProcessedTodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessedTodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
