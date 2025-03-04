import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { LoadingComponent } from '../../components/loading/loading.component';
import { ApiClient, RegisterRequest } from '../../../api/api-client';
import { Router, RouterLink } from '@angular/router';
import { errorMessages } from '../../data/error-messages.data';
import { ErrorInputComponent } from '../../components/error-input/error-input.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matErrorOutline } from "@ng-icons/material-icons/baseline";

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    FormsModule,
    LoadingComponent,
    ReactiveFormsModule,
    RouterLink,
    ErrorInputComponent,
    NgIcon
  ],
  templateUrl: './register-page.component.html',
  viewProviders: [provideIcons({ matErrorOutline })]
})
export class RegisterPageComponent {
  loading = false;
  hasError = false;

  apiClient = inject(ApiClient);
  router = inject(Router);

  // TODO: Add the correct check for the "Username" property
  registerForm = new FormGroup({
    username: new FormControl("", [
      Validators.required,
      Validators.minLength(6)]),
    email: new FormControl<string>("", [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(254)
    ]),
  });

  register() {
    this.loading = true;
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
        error: () => {
          this.hasError = true;
          this.loading = false;
          this.registerForm.enable();
        }
      })
  }

  protected readonly userErrorMessages = errorMessages;
}
