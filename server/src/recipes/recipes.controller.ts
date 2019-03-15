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
  ConflictException,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { AuthGuard } from '@nestjs/passport';
import { Recipe } from './recipes.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { RecipeValidationInterceptor } from './interceptors/recipe-validation.interceptor';
import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import { RecipeDto } from './dto/recipe.dto';
import { UpdateRecipeValidationInterceptor } from './interceptors/update-recipe-validation.interceptor';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly recipesService: RecipesService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(new TransformInterceptor(RecipeDto))
  async getAll(): Promise<RecipeDto[]> {
    return this.recipesService.findAll();
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

  @Post(':slug/reviews/:reviewAuthor')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  @UseInterceptors(new TransformInterceptor(RecipeDto))
  async createReview(
    @Param('slug') slug: string,
    @Param('reviewAuthor') reviewAuthor: string,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<RecipeDto> {
    const recipe = await this.recipesService.findBySlug(slug);

    if (!recipe) {
      throw new NotFoundException({ errors: { slug: 'Inexistent slug' } });
    }

    if (recipe.reviews.find(review => review.author === reviewAuthor)) {
      throw new ConflictException({
        errors: { author: 'Recipe already reviewd by specified user' },
      });
    }

    const author = await this.usersService.findByName(reviewAuthor);

    if (!author) {
      throw new NotFoundException({
        errors: { author: 'Inexistent review author' },
      });
    }

    return this.recipesService.createReview(recipe, {
      ...createReviewDto,
      author: author.name,
    });
  }

  @Put(':slug/reviews/:reviewAuthor')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  @UseInterceptors(new TransformInterceptor(RecipeDto))
  async updateReview(
    @Param('slug') slug: string,
    @Param('reviewAuthor') reviewAuthor: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<RecipeDto> {
    const recipe = await this.recipesService.findBySlug(slug);

    if (!recipe) {
      throw new NotFoundException({ errors: { slug: 'Inexistent slug' } });
    }

    const reviewToUpdate = recipe.reviews.find(
      review => review.author === reviewAuthor,
    );

    if (!reviewToUpdate) {
      throw new NotFoundException({
        errors: {
          author: 'Specified user does not have a review for this recipe',
        },
      });
    }

    return this.recipesService.updateReview(recipe, {
      ...reviewToUpdate,
      ...updateReviewDto,
    });
  }

  @Delete(':slug/reviews/:reviewAuthor')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  @UseInterceptors(new TransformInterceptor(RecipeDto))
  async deleteReview(
    @Param('slug') slug: string,
    @Param('reviewAuthor') reviewAuthor: string,
  ) {
    const recipe = await this.recipesService.findBySlug(slug);

    if (!recipe) {
      throw new NotFoundException({ errors: { slug: 'Inexistent slug' } });
    }

    const reviewToDelete = recipe.reviews.find(
      review => review.author === reviewAuthor,
    );

    if (!reviewToDelete) {
      throw new NotFoundException({
        errors: {
          author: 'Specified user does not have a review for this recipe',
        },
      });
    }

    return this.recipesService.deleteReview(recipe, reviewToDelete);
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
    @Body() updateRecipeDto: UpdateRecipeDto,
  ): Promise<RecipeDto> {
    const recipe = await this.recipesService.findBySlug(slug);

    if (!recipe) {
      throw new NotFoundException({ errors: { slug: 'Inexistent slug' } });
    }

    return this.recipesService.update({...recipe, ...updateRecipeDto});
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
