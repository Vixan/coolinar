import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RecipesService } from '../recipes.service';
import { PaginationService } from '../../shared/services/pagination.service';
import { PaginationOptions } from '../../pagination/pagination-options.interface';
import { Recipe } from '../../shared/models/recipe.model';
import { User } from '../../shared/models/user.model';
import { UsersService } from '../../users/users.service';
import { Pagination } from '../../pagination/pagination';

@Component({
  selector: 'app-favorite-recipes',
  templateUrl: './favorite-recipes.component.html',
  styleUrls: ['./favorite-recipes.component.css'],
})
export class FavoriteRecipesComponent implements OnInit {
  user: User;
  recipes: Recipe[];
  isLoading = false;

  constructor(
    private readonly titleService: Title,
    private readonly usersService: UsersService,
    private readonly recipesService: RecipesService,
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.titleService.setTitle('Your favorite recipes');
    this.initUser().then(_ => {
      this.initRecipes();
    });
  }

  private async initRecipes(): Promise<void> {
    this.isLoading = true;

    try {
      const favorites = await this.recipesService.getFavorites(
        this.user.slug
      );

      this.recipes = favorites;
      this.isLoading = false;
    } catch (error) {
      console.log(error);
    }
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
