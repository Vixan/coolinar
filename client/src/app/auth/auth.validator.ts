import { Injectable } from '@angular/core';
import { UsersService } from 'src/app/users/users.service';
import { FormControl } from '@angular/forms';

@Injectable()
export class AuthValidator {
  private emailDebounceTimer: any;
  private readonly DEBOUNCE_SECONDS = 500;

  constructor(private readonly usersService: UsersService) {}

  async emailExists(
    emailControl: FormControl,
  ): Promise<{ [key: string]: any } | null> {
    if (this.emailDebounceTimer) {
      clearTimeout(this.emailDebounceTimer);
    }

    return new Promise(resolve => {
      this.emailDebounceTimer = setTimeout(async () => {
        const user = await this.usersService.getByEmail(emailControl.value);

        if (!user) {
          return resolve({ notFound: true });
        }

        return resolve(null);
      }, this.DEBOUNCE_SECONDS);
    });
  }

  async emailNotUsed(
    emailControl: FormControl,
  ): Promise<{ [key: string]: any } | null> {
    if (this.emailDebounceTimer) {
      clearTimeout(this.emailDebounceTimer);
    }

    return new Promise(resolve => {
      this.emailDebounceTimer = setTimeout(async () => {
        const user = await this.usersService.getByEmail(emailControl.value);

        if (user) {
          return resolve({ inUse: true });
        }

        return resolve(null);
      }, this.DEBOUNCE_SECONDS);
    });
  }

  async nameNotUsed(
    nameControl: FormControl,
  ): Promise<{ [key: string]: any } | null> {
    if (this.emailDebounceTimer) {
      clearTimeout(this.emailDebounceTimer);
    }

    return new Promise(resolve => {
      this.emailDebounceTimer = setTimeout(async () => {
        const user = await this.usersService.getByName(nameControl.value);

        if (user) {
          return resolve({ inUse: true });
        }

        return resolve(null);
      }, this.DEBOUNCE_SECONDS);
    });
  }
}
