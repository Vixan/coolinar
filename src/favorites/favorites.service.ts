import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
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
    return user.favoriteRecipes;
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
    const recipe = await this.recipesRepository.findOne({ slug: recipeSlug });
    if (recipe) {
      user.favoriteRecipes.push(recipe);
    }

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
    const recipes = await this.recipesRepository.find({
      where: { slug: In(recipeSlugs) },
    });

    user.favoriteRecipes = recipes;

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
    user.favoriteRecipes = user.favoriteRecipes.filter(
      favoriteRecipe => favoriteRecipe.slug === recipeSlug,
    );

    return this.usersRepository.save(user);
  }
}
