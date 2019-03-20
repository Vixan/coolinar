import { ArrayUtils } from 'src/shared/utils/array.utils';
import { AuthGuard } from '@nestjs/passport';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { DatePart, DateProvider } from 'src/shared/providers/date.provider';
import { Recipe } from './recipes.entity';
import { RecipeDto } from './dto/recipe.dto';
import { RecipesService } from './recipes.service';
import { RecipeValidationInterceptor } from './interceptors/recipe-validation.interceptor';
import { SearchRecipeDto } from './dto/search-recipe.dto';
import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { UpdateRecipeValidationInterceptor } from './interceptors/update-recipe-validation.interceptor';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  UsePipes,
  UseInterceptors,
  Put,
  Param,
  NotFoundException,
  Delete,
  Query,
  UseFilters,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/shared/filters/http-exception.filter';

@Controller('recipes')
@UseFilters(HttpExceptionFilter)
export class RecipesController {
  constructor(
    private readonly recipesService: RecipesService,
    private readonly dateProvider: DateProvider,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(new TransformInterceptor(RecipeDto))
  async getAll(): Promise<RecipeDto[]> {
    return this.recipesService.findAll();
  }

  @Get('/daily')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(new TransformInterceptor(RecipeDto))
  async getDaily() {
    const dateInterval = this.dateProvider.createDateInterval(
      new Date(),
      DatePart.DAY,
    );

    return this.recipesService.findByCreatedDateInterval(dateInterval);
  }

  @Get('/top-rated')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(new TransformInterceptor(RecipeDto))
  async getTopRated() {
    const minScore: number = 4;

    return this.recipesService.findByReviewMinScore(minScore);
  }

  @Get('/search')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(new TransformInterceptor(RecipeDto))
  async search(@Query() params: SearchRecipeDto) {
    let recipes = await this.recipesService.findAll();

    if (params.title) {
      const recipesByTitle = await this.recipesService.findByTitleMatch(
        params.title,
      );
      recipes = ArrayUtils.intersect(recipes, recipesByTitle, 'title');
    }

    if (params.ingredients) {
      const recipesByIngredients = await this.recipesService.fingByIngredients(
        params.ingredients,
      );
      recipes = ArrayUtils.intersect(recipes, recipesByIngredients, 'title');
    }

    if (params.categories) {
      const recipesByCategories = await this.recipesService.fingByCategories(
        params.categories,
      );
      recipes = ArrayUtils.intersect(recipes, recipesByCategories, 'title');
    }

    return recipes;
  }

  @Get(':slug')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(new TransformInterceptor(RecipeDto))
  async getBySlug(@Param('slug') slug: string): Promise<RecipeDto> {
    const recipe = await this.recipesService.findBySlug(slug);

    if (!recipe) {
      throw new NotFoundException({ errors: { slug: 'Inexisting slug' } });
    }

    return recipe;
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  @UseInterceptors(
    RecipeValidationInterceptor,
    new TransformInterceptor(RecipeDto),
  )
  async create(@Body() createRecipeDto: CreateRecipeDto): Promise<RecipeDto> {
    const recipe = new Recipe({ ...createRecipeDto });

    return this.recipesService.create(recipe);
  }

  @Put(':slug')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  @UseInterceptors(
    UpdateRecipeValidationInterceptor,
    new TransformInterceptor(RecipeDto),
  )
  async update(
    @Param('slug') slug: string,
    @Body() updateRecipeDto: Partial<UpdateRecipeDto>,
  ): Promise<RecipeDto> {
    const recipe = await this.recipesService.findBySlug(slug);

    if (!recipe) {
      throw new NotFoundException({ errors: { slug: 'Inexistent slug' } });
    }

    return this.recipesService.update({ ...recipe, ...updateRecipeDto });
  }

  @Delete(':slug')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  @UseInterceptors(new TransformInterceptor(RecipeDto))
  async delete(@Param('slug') slug: string) {
    const recipe = await this.recipesService.findBySlug(slug);

    if (!recipe) {
      throw new NotFoundException({ errors: { slug: 'Inexistent slug' } });
    }

    return this.recipesService.delete(recipe);
  }
}
