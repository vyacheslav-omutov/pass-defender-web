import {Directive, ElementRef, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
  selector: 'input[appNumberRestrict]',
  standalone: true
})
export class NumberRestrictDirective {
  constructor(private _elementRef : ElementRef) { }

  @Output()
  valueChange = new EventEmitter();

  @HostListener('input', ['$event'])
  onInputChange(event: Event) {
    const initialValue = this._elementRef.nativeElement.value;
    const newValue = initialValue.replace(/[^0-9]/g, '');
    this._elementRef.nativeElement.value = newValue;
    this.valueChange.emit(newValue);

    if (initialValue !== this._elementRef.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
