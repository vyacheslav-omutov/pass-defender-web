import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { LoadingComponent } from '../../components/loading/loading.component';
import { ApiClient, ApiException, RegisterRequest } from '../../../api/api-client';
import { Router, RouterLink } from '@angular/router';
import { errorMessages } from '../../data/error-messages.data';
import { InputComponent } from '../../components/input/input.component';
import { AlertComponent } from '../../components/alert/alert.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    FormsModule,
    LoadingComponent,
    ReactiveFormsModule,
    RouterLink,
    InputComponent,
    AlertComponent,
    NgIf
  ],
  templateUrl: './register-page.component.html'
})
export class RegisterPageComponent {
  loading = false;

  private readonly usernamePattern = "^[a-zA-Z0-9](?:[a-zA-Z0-9_-]*[a-zA-Z0-9])?$";

  error = signal<ApiException | null>(null);

  apiClient = inject(ApiClient);
  router = inject(Router);

  registerForm = new FormGroup({
    username: new FormControl("", [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
      Validators.pattern(this.usernamePattern)]),
    email: new FormControl<string>("", [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(254),
      Validators.email
    ]),
  });

  register() {
    this.loading = true;
    this.error.set(null);
    this.registerForm.disable();
    this.apiClient
      .register(new RegisterRequest({
        username: this.registerForm.value.username!,
        email: this.registerForm.value.email!
      }))
      .subscribe({
        next: () => {
          this.router.navigate(["/login"]).then();
        },
        error: (err) => {
          this.error.set(err);
          this.loading = false;
          this.registerForm.enable();
        }
      })
  }

  protected readonly userErrorMessages = errorMessages;
}
