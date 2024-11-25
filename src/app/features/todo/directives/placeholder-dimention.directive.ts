import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[PlaceholderDimention]',
  standalone: true
})
export class PlaceholderDimentionDirective {
  private readonly elementRef = inject(ElementRef);

  constructor() { }
  ngAfterViewInit(): void {
    console.log(this.elementRef.nativeElement.style);
  }
}
