import { AuthService } from 'src/app/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/users/users.service';
import { User } from 'src/app/shared/models/user.model';
import { Router } from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  user: User;

  constructor(
    private readonly router: Router,
    readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  ngOnInit() {
    this.initUser();
  }

  isRouteActive(route: string): boolean {
    return this.router.isActive(route, false);
  }

  private async initUser(): Promise<void> {
    try {
      const user = await this.usersService.getFromToken();
      this.user = user;
    } catch (error) {
      console.log(error);
    }
  }
}
