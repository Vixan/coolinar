import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router, NavigationStart, Event } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {
    this.checkTokenExpiredOnRouteChange();
  }

  private checkTokenExpiredOnRouteChange(): void {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart && this.authService.isTokenExpired) {
        this.authService.logout();
      }
    });
  }

  get isAuthPageActive(): boolean {
    return (
      this.router.isActive('/login', false) ||
      this.router.isActive('/register', false)
    );
  }
}
