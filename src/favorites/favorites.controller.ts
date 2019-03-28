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

@Controller('users/:userName/favorites')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly usersService: UsersService,
    private readonly recipesService: RecipesService,
  ) {}

  @Get('/recipes')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(new TransformInterceptor(RecipeDto))
  async getFavoriteRecipes(
    @Param('userName') userName: string,
  ): Promise<RecipeDto[]> {
    const user = await this.usersService.findByName(userName);

    if (!user) {
      throw new NotFoundException({
        errors: { username: 'Inexistent username' },
      });
    }

    return this.favoritesService.findAll(user);
  }

  @Post('/recipes/:slug')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(new TransformInterceptor(RecipeDto))
  async favoriteRecipe(
    @Param('userName') userName: string,
    @Param('slug') slug: string,
  ): Promise<RecipeDto[]> {
    let user = await this.usersService.findByName(userName);

    if (!user) {
      throw new NotFoundException({
        errors: { username: 'Username not found' },
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

  @Delete('/recipes/:slug')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(new TransformInterceptor(RecipeDto))
  async unfavoriteRecipe(
    @Param('userName') userName: string,
    @Param('slug') slug: string,
  ): Promise<RecipeDto[]> {
    let user = await this.usersService.findByName(userName);

    if (!user) {
      throw new NotFoundException({
        errors: { username: 'Inexistent username' },
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
