import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from 'src/recipes/recipes.entity';
import { User } from 'src/users/users.entity';

/**
 * Injectable service that exposes methods for handling user favorites.
 *
 * @class FavoritesService
 */
@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
  ) {}

  /**
   * Retrieve the list of favorite user recipes from the database.
   *
   * @param {User} user
   * @returns {Promise<Recipe[]>} List of favorite user recipes.
   * @memberof FavoritesService
   */
  async findAll(user: User): Promise<Recipe[]> {
    const favoriteSlugs = user.favoriteRecipes;
    const favoriteRecipes: Recipe[] = [];

    for (const slug of favoriteSlugs) {
      const recipe = await this.recipesRepository.findOne({ slug });
      favoriteRecipes.push(recipe);
    }

    return favoriteRecipes;
  }

  /**
   * Add recipe to the list of favorites in the database.
   *
   * @param {User} user
   * @param {string} recipeSlug Recipe slug.
   * @returns {Promise<User>} Promise of the list owner.
   * @memberof FavoritesService
   */
  async favoriteRecipe(user: User, recipeSlug: string): Promise<User> {
    user.favoriteRecipes.push(recipeSlug);

    return this.usersRepository.save(user);
  }

  /**
   * Update the list of favorite user recipes in the database.
   *
   * @param {User} user
   * @param {string[]} recipeSlugs Recipe slugs to be favorited.
   * @returns {Promise<User>} Promise of the list owner.
   * @memberof FavoritesService
   */
  async updateFavorites(user: User, recipeSlugs: string[]): Promise<User> {
    user.favoriteRecipes = recipeSlugs;

    return this.usersRepository.save(user);
  }

  /**
   * Remove the recipe from the list of user favorites.
   *
   * @param {User} user
   * @param {string} recipeSlug Recipe slug to be removed from the list.
   * @returns {Promise<User>} Promise of the list owner.
   * @memberof FavoritesService
   */
  async unfavoriteRecipe(user: User, recipeSlug: string): Promise<User> {
    const recipeSlugIndex = user.favoriteRecipes.indexOf(recipeSlug);
    user.favoriteRecipes.splice(recipeSlugIndex, 1);

    return this.usersRepository.save(user);
  }
}
