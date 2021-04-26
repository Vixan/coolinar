import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../shared/services/config.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly accessTokenName: string;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly configService: ConfigService,
    private readonly jwtHelperService: JwtHelperService,
  ) {
    this.accessTokenName = configService.accessTokenName;
  }

  async login(email: string, password: string, remember: boolean) {
    const loginUrl = `${this.configService.apiEndpointUrl}/auth/sign-in`;

    try {
      const response = await this.httpClient
        .post<{ accessToken: any }>(loginUrl, { email, password })
        .toPromise();

      if (!response || !response.accessToken) {
        return;
      }

      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(this.accessTokenName, response.accessToken);
    } catch (error) {
      throw error.error;
    }
  }

  async logout() {
    localStorage.removeItem(this.accessTokenName);
    sessionStorage.removeItem(this.accessTokenName);
  }

  async register(username: string, email: string, password: string) {
    const registerUrl = `${this.configService.apiEndpointUrl}/auth/sign-up`;

    try {
      const response = await this.httpClient
        .post<{ accessToken: any }>(registerUrl, { username, email, password })
        .toPromise();

      if (response && response.accessToken) {
        localStorage.setItem(this.accessTokenName, response.accessToken);
      }
    } catch (error) {
      throw error.error;
    }
  }

  get decodedToken(): any {
    return this.jwtHelperService.decodeToken(this.token);
  }

  get token(): string {
    return (
      localStorage.getItem(this.accessTokenName) ||
      sessionStorage.getItem(this.accessTokenName)
    );
  }

  get isLoggedIn(): boolean {
    return this.token !== null;
  }

  get isTokenExpired(): boolean {
    return this.jwtHelperService.isTokenExpired(this.token);
  }
}
