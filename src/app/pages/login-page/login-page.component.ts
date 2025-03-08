import { Component, inject, OnInit, signal } from '@angular/core';
import {
  ApiClient,
  ApiException,
  LoginEmailConfirmRequest,
  LoginEmailRequest
} from '../../../api/api-client';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthorizationService } from '../../services/authorization.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingComponent } from '../../components/loading/loading.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matErrorOutline, matArrowBack } from "@ng-icons/material-icons/baseline";
import { NgIf } from '@angular/common';
import { AuthErrorAlertComponent } from '../../components/error-alert/auth-error-alert.component';
import { NumberRestrictDirective } from '../../directives/number-restrict.directive';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    LoadingComponent,
    ReactiveFormsModule,
    RouterLink,
    NgIcon,
    NgIf,
    AuthErrorAlertComponent,
    NumberRestrictDirective
  ],
  templateUrl: './login-page.component.html',
  viewProviders: [provideIcons({ matErrorOutline, matArrowBack })]
})
export class LoginPageComponent implements OnInit {
  steps: "sendCode" | "confirmCode" = "sendCode";
  loading = false;
  codeLength = 6;
  redirectUrl = "";

  error = signal<ApiException | null>(null);

  apiClient = inject(ApiClient);
  router = inject(Router);
  authService = inject(AuthorizationService);
  route = inject(ActivatedRoute);

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

  ngOnInit() {
    try {
      let url = this.route.snapshot.queryParams["redirectUrl"];
      if (url) {
        this.redirectUrl = decodeURI(url);
      }
    }
    catch (e) {
      if (e instanceof URIError) {
        console.log(e.message);
      }
    }
  }

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
          this.router.navigateByUrl(this.redirectUrl);
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
}
