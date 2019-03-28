import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from 'src/recipes/recipes.entity';
import { User } from 'src/users/users.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
  ) {}

  async findAll(user: User) {
    const favoriteSlugs = user.favoriteRecipes;
    const favoriteRecipes: Recipe[] = [];

    for (const slug of favoriteSlugs) {
      const recipe = await this.recipesRepository.findOne({ slug });
      favoriteRecipes.push(recipe);
    }

    return favoriteRecipes;
  }

  async favoriteRecipe(user: User, recipeSlug: string) {
    user.favoriteRecipes.push(recipeSlug);

    return this.usersRepository.save(user);
  }

  async updateFavorites(user: User, recipeSlugs: string[]) {
    user.favoriteRecipes = recipeSlugs;

    return this.usersRepository.save(user);
  }

  async unfavoriteRecipe(user: User, recipeSlug: string) {
    const recipeSlugIndex = user.favoriteRecipes.indexOf(recipeSlug);
    user.favoriteRecipes.splice(recipeSlugIndex, 1);

    return this.usersRepository.save(user);
  }
}
