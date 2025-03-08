import { Component, forwardRef, Input } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf],
  template: `
    <input [type]="type"
           [placeholder]="placeholder"
           [value]="value"
           (input)="onInput($event)"
           (blur)="onTouched()"
           [formControl]="formControl"
           [formGroup]="formGroup"
           [ngClass]="formControl.invalid && formControl.dirty ? 'is-invalid' : ''"
           class="primary-input">
    @if (formControl.invalid && formControl.dirty) {
      <ul class="flex flex-col gap-1 text-carnation-400 text-sm py-1">
        @for (error of controlErrorMessages; track $index) {
          <li *ngIf="formControl.hasError(error.type)">
            {{ error.message }}
          </li>
        }
      </ul>
    }`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() type: string = "text";
  @Input() placeholder: string = '';
  @Input() formGroup!: FormGroup;
  @Input() formControl!: FormControl;
  @Input() controlErrorMessages!: { type: string; message: string; }[];

  value: string = '';

  private onChange: (value: string) => void = () => {};
  protected onTouched: () => void = () => {};

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
