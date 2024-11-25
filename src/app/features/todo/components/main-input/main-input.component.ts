import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'main-input',
  standalone: true,
  imports: [NgClass,ReactiveFormsModule],
  templateUrl: './main-input.component.html',
  styleUrl: './main-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainInputComponent {
  control = input.required<FormControl<string>>();
}
