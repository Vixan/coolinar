import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { UsersService } from 'src/app/users/users.service';
import HttpStatusCodes from 'src/app/shared/enums/http-status-codes.enum';
import { HttpExceptionResponse } from 'src/app/shared/interfaces/http-exception-response.interface';
import { Title } from '@angular/platform-browser';
import { AuthValidator } from '../auth.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  passwordMinLength = 4;

  constructor(
    private readonly titleService: Title,
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder,
    private readonly authValidator: AuthValidator,
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Register');

    this.registerForm = this.formBuilder.group({
      name: [
        null,
        {
          validators: [Validators.required],
          asyncValidators: [
            this.authValidator.nameNotUsed.bind(this.authValidator),
          ],
        },
      ],
      email: [
        null,
        {
          validators: [Validators.required, Validators.email],
          asyncValidators: [
            this.authValidator.emailNotUsed.bind(this.authValidator),
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
    });
  }

  updateEmailValidator(): void {
    Promise.resolve().then(() =>
      this.registerFormControls.email.updateValueAndValidity(),
    );
  }

  updateNameValidator(): void {
    Promise.resolve().then(() =>
      this.registerFormControls.name.updateValueAndValidity(),
    );
  }

  async submitForm() {
    if (this.registerForm.invalid) {
      return;
    }

    try {
      await this.authService.register(
        this.registerFormControls.name.value,
        this.registerFormControls.email.value,
        this.registerFormControls.password.value,
      );
    } catch (error) {
      this.handleregisterFailure(error);
    }
  }

  private handleregisterFailure(exceptionResponse: HttpExceptionResponse) {
    const errors = exceptionResponse.message.errors;

    if (
      exceptionResponse.statusCode === HttpStatusCodes.UNAUTHORIZED &&
      errors.password
    ) {
      this.registerFormControls.password.setErrors({ incorrect: true });
    }

    console.log(exceptionResponse);
  }

  private get registerFormControls() {
    return this.registerForm.controls;
  }
}
