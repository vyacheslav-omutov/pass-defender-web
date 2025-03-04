import { Component, inject } from '@angular/core';
import { ApiClient, LoginEmailConfirmRequest, LoginEmailRequest } from '../../../api/api-client';
import { Router, RouterLink } from '@angular/router';
import { AuthorizationService } from '../../services/authorization.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingComponent } from '../../components/loading/loading.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matErrorOutline, matArrowBack } from "@ng-icons/material-icons/baseline";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    LoadingComponent,
    ReactiveFormsModule,
    RouterLink,
    NgIcon
  ],
  templateUrl: './login-page.component.html',
  viewProviders: [provideIcons({ matErrorOutline, matArrowBack })]
})
export class LoginPageComponent {
  codeValue: string = '';

  steps: "sendCode" | "confirmCode" = "sendCode";
  loading = false;
  hasError = false;
  codeLength = 6;

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
    this.loading = false;
    this.hasError = false;
    this.steps = "sendCode";
  }

  async sendCode() {
    this.loading = true;
    this.hasError = false;

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
        error: () => {
          this.hasError = true;
          this.loading = false;
          this.sendCodeForm.enable();
        }
      });
  }

  confirmCode() {
    this.loading = true;
    this.hasError = false;
    this.confirmCodeForm.disable();
    this.apiClient
      .confirm(new LoginEmailConfirmRequest({
        email: this.sendCodeForm.value.email!,
        code: this.confirmCodeForm.value.code?.toString()
      }))
      .subscribe({
        next: result => {
          this.authService.setNewPayLoad(result);
          this.router.navigate([""]).then();
        },
        error: () => {
          this.hasError = true;
          this.loading = false;
          this.confirmCodeForm.enable();
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
