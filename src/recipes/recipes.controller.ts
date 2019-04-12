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
import { PaginationOptions } from 'src/shared/pagination/pagination-options.interface';
import { Pagination } from 'src/shared/pagination/pagination';
import { PaginationTransformInterceptor } from 'src/shared/pagination/pagination-transform.interceptor';

/**
 * Controller that handles the recipe routes.
 *
 * @class RecipesController
 */
@Controller('recipes')
@UseFilters(HttpExceptionFilter)
export class RecipesController {
  constructor(
    private readonly recipesService: RecipesService,
    private readonly dateProvider: DateProvider,
  ) {}

  /**
   * Retrieve all available recipes in a paginated format.
   *
   * @param {PaginationOptions} pagination Pagination options.
   * @returns {Promise<Pagination<RecipeDto>>} Promise of the pagination of the recipes.
   * @memberof RecipesController
   */
  @Get()
  @UseInterceptors(new PaginationTransformInterceptor(RecipeDto))
  async getAll(
    @Query() pagination: PaginationOptions,
  ): Promise<Pagination<RecipeDto>> {
    return await this.recipesService.paginate({
      take: Number(pagination.take) || 10,
      skip: Number(pagination.skip) || 0,
    });
  }

  /**
   * Retrieve the daily recipes in a paginated format.
   *
   * @param {PaginationOptions} pagination Pagination options.
   * @returns {Promise<Pagination<RecipeDto>>} Promise of the pagination of the recipes.
   * @memberof RecipesController
   */
  @Get('/daily')
  @UseInterceptors(new PaginationTransformInterceptor(RecipeDto))
  async getDaily(
    @Query() pagination: PaginationOptions,
  ): Promise<Pagination<RecipeDto>> {
    const dateInterval = this.dateProvider.createDateInterval(
      new Date(),
      DatePart.DAY,
    );

    return this.recipesService.findByCreatedDateInterval(dateInterval, {
      take: Number(pagination.take) || 10,
      skip: Number(pagination.skip) || 0,
    });
  }

  /**
   * Retrieve the latest created recipes in a paginated format.
   *
   * @param {PaginationOptions} pagination Pagination options.
   * @returns {Promise<Pagination<RecipeDto>>} Promise of the pagination of the recipes.
   * @memberof RecipesController
   */
  @Get('/latest')
  @UseInterceptors(new PaginationTransformInterceptor(RecipeDto))
  async getLatest(
    @Query() pagination: PaginationOptions,
  ): Promise<Pagination<RecipeDto>> {
    return this.recipesService.paginateAndSort(
      {
        take: Number(pagination.take) || 10,
        skip: Number(pagination.skip) || 0,
      },
      'dateCreated',
    );
  }

  /**
   * Retrieve the top rated recipes in a paginated format.
   *
   * @param {PaginationOptions} pagination Pagination options.
   * @returns {Promise<Pagination<RecipeDto>>} Promise of the pagination of the recipes.
   * @memberof RecipesController
   */
  @Get('/top-rated')
  @UseInterceptors(new PaginationTransformInterceptor(RecipeDto))
  async getTopRated(
    @Query() pagination: PaginationOptions,
  ): Promise<Pagination<RecipeDto>> {
    const minScore: number = 4;

    return this.recipesService.findByReviewMinScore(minScore, {
      take: Number(pagination.take) || 10,
      skip: Number(pagination.skip) || 0,
    });
  }

  /**
   * Retrieve the searched recipes in a paginated format.
   * Recipes can be searched by title, ingredients and categories.
   *
   * @param {PaginationOptions} pagination Pagination options.
   * @returns {Promise<Pagination<RecipeDto>>} Promise of the pagination of the recipes.
   * @memberof RecipesController
   */
  @Get('/search')
  @UseInterceptors(new PaginationTransformInterceptor(RecipeDto))
  async search(
    @Query() params: SearchRecipeDto,
    @Query() pagination: PaginationOptions,
  ) {
    return this.recipesService.search(params, {
      take: Number(pagination.take) || 10,
      skip: Number(pagination.skip) || 0,
    });
  }

  /**
   * Retrieve recipe by slug.
   *
   * @param {string} slug Recipe slug.
   * @returns {Promise<RecipeDto>} Promise of the recipe.
   * @memberof RecipesController
   */
  @Get(':slug')
  @UseInterceptors(new TransformInterceptor(RecipeDto))
  async getBySlug(@Param('slug') slug: string): Promise<RecipeDto> {
    const recipe = await this.recipesService.findBySlug(slug);

    if (!recipe) {
      throw new NotFoundException({ errors: { slug: 'Inexisting slug' } });
    }

    return recipe;
  }

  /**
   * Create a new recipe.
   *
   * @param {CreateRecipeDto} createRecipeDto Recipe data sent by the client.
   * @returns {Promise<RecipeDto>} Promise of the created recipe.
   * @memberof RecipesController
   */
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

  /**
   * Update an existing recipe.
   *
   * @param {string} slug Recipe slug.
   * @param {Partial<UpdateRecipeDto>} updateRecipeDto Updated recipe data sent by the client.
   * @returns {Promise<RecipeDto>} Promise of the updted recipe.
   * @memberof RecipesController
   */
  @Put(':slug')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  @UseInterceptors(
    RecipeValidationInterceptor,
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

  /**
   * Remove the speficied recipe.
   *
   * @param {string} slug Recipe slug.
   * @returns {Promise<Recipe>} Promise of the removed recipe.
   * @memberof RecipesController
   */
  @Delete(':slug')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  @UseInterceptors(new TransformInterceptor(RecipeDto))
  async delete(@Param('slug') slug: string): Promise<Recipe> {
    const recipe = await this.recipesService.findBySlug(slug);

    if (!recipe) {
      throw new NotFoundException({ errors: { slug: 'Inexistent slug' } });
    }

    return this.recipesService.delete(recipe);
  }
}
