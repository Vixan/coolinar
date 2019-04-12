import {
  Controller,
  Post,
  UseGuards,
  Param,
  NotFoundException,
  UseInterceptors,
  Delete,
  Get,
  ConflictException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RecipeDto } from 'src/recipes/dto/recipe.dto';
import { UsersService } from 'src/users/users.service';
import { RecipesService } from 'src/recipes/recipes.service';
import { FavoritesService } from './favorites.service';
import { TransformInterceptor } from 'src/shared/interceptors/transform.interceptor';

/**
 * Controller that handles the routes for favorite collections.
 *
 * @class FavoritesController
 */
@Controller('users/:userSlug/favorites')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly usersService: UsersService,
    private readonly recipesService: RecipesService,
  ) {}

  /**
   * Retrieve the favorite recipes of the user.
   *
   * @param {string} userSlug User slug.
   * @returns {Promise<RecipeDto[]>} Promise of the list of favorite recipes.
   * @memberof FavoritesController
   */
  @Get('/recipes')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(new TransformInterceptor(RecipeDto))
  async getFavoriteRecipes(
    @Param('userSlug') userSlug: string,
  ): Promise<RecipeDto[]> {
    const user = await this.usersService.findBySlug(userSlug);

    if (!user) {
      throw new NotFoundException({
        errors: { userSlug: 'User not found' },
      });
    }

    return this.favoritesService.findAll(user);
  }

  /**
   * Add recipe to the favorites list of the user.
   *
   * @param {string} userSlug User slug.
   * @param {string} slug Recipe slug.
   * @returns {Promise<RecipeDto[]>} Promise of the list of favorite recipes.
   * @memberof FavoritesController
   */
  @Post('/recipes/:slug')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(new TransformInterceptor(RecipeDto))
  async favoriteRecipe(
    @Param('userSlug') userSlug: string,
    @Param('slug') slug: string,
  ): Promise<RecipeDto[]> {
    let user = await this.usersService.findBySlug(userSlug);

    if (!user) {
      throw new NotFoundException({
        errors: { userSlug: 'User not found' },
      });
    }

    if (user.favoriteRecipes.includes(slug)) {
      throw new ConflictException({
        errors: { slug: 'Recipe already favorited' },
      });
    }

    const recipe = await this.recipesService.findBySlug(slug);

    if (!recipe) {
      throw new NotFoundException({
        errors: { slug: 'Recipe slug not found' },
      });
    }

    user = await this.favoritesService.favoriteRecipe(user, slug);

    return this.favoritesService.findAll(user);
  }

  /**
   * Remove recipe from the favorites list of the user.
   *
   * @param {string} userSlug User slug.
   * @param {string} slug Recipe slug.
   * @returns {Promise<RecipeDto[]>} Promise of the list of favorite recipes.
   * @memberof FavoritesController
   */
  @Delete('/recipes/:slug')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(new TransformInterceptor(RecipeDto))
  async unfavoriteRecipe(
    @Param('userSlug') userSlug: string,
    @Param('slug') slug: string,
  ): Promise<RecipeDto[]> {
    let user = await this.usersService.findBySlug(userSlug);

    if (!user) {
      throw new NotFoundException({
        errors: { userSlug: 'User not found' },
      });
    }

    const recipe = await this.recipesService.findBySlug(slug);

    if (!recipe) {
      throw new NotFoundException({ errors: { slug: 'Inexistent slug' } });
    }

    user = await this.favoritesService.unfavoriteRecipe(user, slug);

    return this.favoritesService.findAll(user);
  }
}
