import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UsersService } from '../../users/users.service';
import { RecipesService } from '../recipes.service';
import { User } from '../../shared/models/user.model';
import { Recipe } from '../../shared/models/recipe.model';
import { Pagination } from '../../pagination/pagination';
import { PaginationOptions } from '../../pagination/pagination-options.interface';
import { PaginationService } from '../../shared/services/pagination.service';

@Component({
  selector: 'app-created-recipes',
  templateUrl: './created-recipes.component.html',
  styleUrls: ['./created-recipes.component.css'],
})
export class CreatedRecipesComponent implements OnInit {
  user: User;
  recipes: Pagination<Recipe>;
  paginationOptions: PaginationOptions = {
    skip: 0,
    take: 4,
  };

  isLoading = false;

  constructor(
    private readonly titleService: Title,
    private readonly usersService: UsersService,
    private readonly recipesService: RecipesService,
    private readonly paginationService: PaginationService,
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.titleService.setTitle('Your created recipes');
    this.paginationOptions = this.paginationService.options;
    this.initUser().then(_ => {
      this.initRecipes();
    });
  }

  private async initRecipes(): Promise<void> {
    this.isLoading = true;

    try {
      const recipes = await this.recipesService.getCreated(
        this.user.slug,
        this.paginationService.toZeroIndexed(this.paginationOptions),
      );

      this.recipes = recipes;
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
