import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[RandomBgColor]',
  standalone: true,
})
export class RandomBgColorDirective {
  private readonly elementRef = inject(ElementRef);
  private randColorsClasses = [
    'list-group-item-light',
    'list-group-item-secondary',
    'list-group-item-success',
    'list-group-item-danger',
    'list-group-item-warning',
    'list-group-item-info',
    'list-group-item-dark'
  ];

  constructor() {}

  ngAfterViewInit() {
    this.elementRef.nativeElement.classList.add(
      this.randColorsClasses[Math.round(Math.random() * (this.randColorsClasses.length-1))]
    );
  }
}
