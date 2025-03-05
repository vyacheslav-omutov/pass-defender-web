import {Component, inject, signal} from '@angular/core';
import {
  ApiClient,
  ApiException,
  LoginEmailConfirmRequest,
  LoginEmailRequest
} from '../../../api/api-client';
import { Router, RouterLink } from '@angular/router';
import { AuthorizationService } from '../../services/authorization.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingComponent } from '../../components/loading/loading.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matErrorOutline, matArrowBack } from "@ng-icons/material-icons/baseline";
import { NgIf } from '@angular/common';
import { AuthErrorAlertComponent } from '../../components/error-alert/auth-error-alert.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    LoadingComponent,
    ReactiveFormsModule,
    RouterLink,
    NgIcon,
    NgIf,
    AuthErrorAlertComponent
  ],
  templateUrl: './login-page.component.html',
  viewProviders: [provideIcons({ matErrorOutline, matArrowBack })]
})
export class LoginPageComponent {
  codeValue: string = '';

  steps: "sendCode" | "confirmCode" = "sendCode";
  loading = false;
  codeLength = 6;

  error = signal<ApiException | null>(null);

  apiClient = inject(ApiClient);
  router = inject(Router);
  authService = inject(AuthorizationService);

  sendCodeForm = new FormGroup({
    email: new FormControl<string>("", [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(254),
      Validators.email
    ])
  })

  confirmCodeForm = new FormGroup({
    code: new FormControl<string>("", [
      Validators.required,
      Validators.maxLength(6)
    ])
  })

  backToSendCode(){
    this.confirmCodeForm.reset();
    this.sendCodeForm.enable();
    this.error.set(null);
    this.loading = false;
    this.steps = "sendCode";
  }

  sendCode() {
    this.loading = true;
    this.sendCodeForm.disable();
    this.apiClient
      .email(new LoginEmailRequest({
        email: this.sendCodeForm.value.email!
      }))
      .subscribe({
        next: () => {
          this.loading = false;
          this.steps = "confirmCode";
        },
        error: (err) => {
          this.error.set(err);
          this.loading = false;
          this.sendCodeForm.enable();
        },
        complete: () => {
          this.error.set(null);
        }
      });
  }

  confirmCode() {
    this.loading = true;
    this.confirmCodeForm.disable();
    this.apiClient
      .confirm(new LoginEmailConfirmRequest({
        email: this.sendCodeForm.value.email!,
        code: this.confirmCodeForm.value.code?.toString()
      }))
      .subscribe({
        next: result => {
          this.authService.setNewPayLoad(result);
          this.router.navigate(["/"]).then();
        },
        error: (err) => {
          this.error.set(err);
          this.loading = false;
          this.confirmCodeForm.enable();
        },
        complete: () => {
          this.error.set(null);
        }
      });
  }

  onCodeInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const numericValue = input.value.replace(/[^0-9]/g, '');
    this.codeValue = numericValue;
    input.value = numericValue;
  }
}
