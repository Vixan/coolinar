import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../shared/models/user.model';
import { AuthService } from 'src/app/auth/auth.service';
import { ConfigService } from '../shared/services/config.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  async getByName(name: string): Promise<User> {
    const userUrl = `${this.configService.apiEndpointUrl}/users/search/`;

    try {
      const response = await this.httpClient
        .get<User>(userUrl, {
          params: {
            name,
          },
        })
        .toPromise();

      return response;
    } catch (error) {
      return error.error;
    }
  }

  async getBySlug(slug: string): Promise<User> {
    const userUrl = `${this.configService.apiEndpointUrl}/users/${slug}`;

    try {
      const response = await this.httpClient.get<User>(userUrl).toPromise();

      return response;
    } catch (error) {
      return error.error;
    }
  }

  async getByEmail(email: string): Promise<User> {
    const userUrl = `${this.configService.apiEndpointUrl}/users`;

    try {
      const response = await this.httpClient
        .post<User>(userUrl, { email })
        .toPromise();

      return response;
    } catch (error) {
      return error.error;
    }
  }

  async getFromToken(): Promise<User | null> {
    const decodedToken = this.authService.decodedToken;

    if (decodedToken && decodedToken.email) {
      return this.getByEmail(decodedToken.email);
    }

    return null;
  }
}
