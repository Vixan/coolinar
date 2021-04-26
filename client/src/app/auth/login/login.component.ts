import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import HttpStatusCodes from 'src/app/shared/enums/http-status-codes.enum';
import { HttpExceptionResponse } from 'src/app/shared/interfaces/http-exception-response.interface';
import { Title } from '@angular/platform-browser';
import { AuthValidator } from '../auth.validator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  passwordMinLength = 4;

  constructor(
    private readonly router: Router,
    private readonly titleService: Title,
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder,
    private readonly authValidator: AuthValidator,
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Login');

    this.loginForm = this.formBuilder.group({
      email: [
        null,
        {
          validators: [Validators.required, Validators.email],
          asyncValidators: [
            this.authValidator.emailExists.bind(this.authValidator),
          ],
        },
      ],
      password: [
        null,
        {
          validators: [
            Validators.required,
            Validators.minLength(this.passwordMinLength),
          ],
        },
      ],
      remember: [true],
    });
  }

  updateEmailValidator(): void {
    Promise.resolve().then(() =>
      this.loginFormControls.email.updateValueAndValidity(),
    );
  }

  async submitForm() {
    if (this.loginForm.invalid) {
      return;
    }

    try {
      await this.authService.login(
        this.loginFormControls.email.value,
        this.loginFormControls.password.value,
        this.loginFormControls.remember.value,
      );
    } catch (error) {
      this.handleLoginFailure(error);

      return;
    }

    this.navigateToHome();
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  private handleLoginFailure(exceptionResponse: HttpExceptionResponse) {
    const errors = exceptionResponse.message.errors;

    if (
      exceptionResponse.statusCode === HttpStatusCodes.UNAUTHORIZED &&
      errors.password
    ) {
      this.loginFormControls.password.setErrors({ incorrect: true });
    }
  }

  get loginFormControls() {
    return this.loginForm.controls;
  }
}
