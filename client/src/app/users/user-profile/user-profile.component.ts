import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { Title } from '@angular/platform-browser';
import { User } from '../../shared/models/user.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  user: User;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly titleService: Title,
    private readonly usersService: UsersService,
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Your profile');
    this.initUser();
  }

  private async initUser(): Promise<void> {
    try {
      const userSlug = this.route.snapshot.params.slug;

      this.user = await this.usersService.getBySlug(userSlug);
    } catch (error) {
      console.log(error);
    }
  }
}
