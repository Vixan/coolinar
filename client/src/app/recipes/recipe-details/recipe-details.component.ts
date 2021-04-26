import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../recipes.service';
import { UsersService } from 'src/app/users/users.service';
import { Recipe } from 'src/app/shared/models/recipe.model';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css'],
})
export class RecipeDetailsComponent implements OnInit {
  recipe: Recipe;
  author: User;
  user: User;
  isLoading = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly recipesService: RecipesService,
    private readonly usersService: UsersService,
  ) {}

  ngOnInit() {
    this.initUser();
    this.initRecipe();
  }

  private async initRecipe(): Promise<void> {
    this.isLoading = true;
    const recipeSlug = this.route.snapshot.params.slug;

    try {
      const recipe = await this.recipesService.getBySlug(recipeSlug);
      this.recipe = recipe;
      this.isLoading = false;

      this.author = recipe.author;
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }

  hasNutrition(): boolean {
    return Object.keys(this.recipe.nutrition).some(
      key => this.recipe.nutrition[key],
    );
  }

  private async initUser(): Promise<void> {
    try {
      const user = await this.usersService.getFromToken();
      this.user = user;
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }
}
