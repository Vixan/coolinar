import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';
import { UsersService } from 'src/app/users/users.service';
import { FavoritesService } from 'src/app/shared/services/favorites.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Recipe } from 'src/app/shared/models/recipe.model';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.css'],
})
export class RecipeCardComponent implements OnInit {
  user: User;
  cardRecipe: Recipe;

  constructor(
    private readonly usersService: UsersService,
    private readonly favoritesService: FavoritesService,
    private readonly messageService: NzMessageService,
  ) {}

  @Input()
  public set recipe(recipe: Recipe) {
    this.cardRecipe = recipe;
  }

  ngOnInit() {
    this.initUser();
  }

  truncateDescription(description: string): string {
    const maxLength = 90;
    const isLongTag = description.length > maxLength;

    return isLongTag ? `${description.slice(0, maxLength)}...` : description;
  }

  isRecipeInFavorites(slug: string): boolean {
    if (!this.user) {
      return false;
    }

    return this.user.favoriteRecipes.some(
      recipe => recipe.slug === this.cardRecipe.slug,
    );
  }

  async toggleFavorite(slug: string): Promise<void> {
    if (this.isRecipeInFavorites(slug)) {
      return await this.unfavoriteRecipe(slug);
    }

    await this.favoriteRecipe(slug);
  }

  async favoriteRecipe(slug: string): Promise<void> {
    try {
      const favoriteResult = await this.favoritesService.favoriteRecipe(
        this.user.slug,
        slug,
      );

      this.user.favoriteRecipes.push(this.cardRecipe);

      if (favoriteResult && favoriteResult.errors) {
        this.messageService.create(
          'error',
          'Could not add recipe to favorites',
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  async unfavoriteRecipe(slug: string): Promise<void> {
    try {
      const unfavoriteResult = await this.favoritesService.unfavoriteRecipe(
        this.user.slug,
        slug,
      );
      const recipeIndex = this.user.favoriteRecipes.indexOf(this.cardRecipe);

      this.user.favoriteRecipes.splice(recipeIndex, 1);

      if (unfavoriteResult && unfavoriteResult.errors) {
        this.messageService.create(
          'error',
          'Could not remove recipe from favorites',
        );
      }
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
