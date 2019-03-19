import {
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
  ValidationPipe,
  Controller,
  UseFilters,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransformInterceptor } from 'src/shared/interceptors/transform.interceptor';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto';
import { RecipeDto } from 'src/recipes/dto/recipe.dto';
import { RecipesService } from 'src/recipes/recipes.service';
import { UsersService } from 'src/users/users.service';
import { UpdateReviewDto } from 'src/reviews/dto/update-review.dto';
import { ReviewsService } from './reviews.service';
import { HttpExceptionFilter } from 'src/shared/filters/http-exception.filter';

@Controller('reviews')
@UseFilters(HttpExceptionFilter)
export class ReviewsController {
  constructor(
    private readonly recipesService: RecipesService,
    private readonly usersService: UsersService,
    private readonly reviewsService: ReviewsService,
  ) {}

  @Post(':slug/:reviewAuthor')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  @UseInterceptors(new TransformInterceptor(RecipeDto))
  async create(
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

    return this.reviewsService.create(recipe, {
      ...createReviewDto,
      author: author.name,
    });
  }

  @Put(':slug/:reviewAuthor')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  @UseInterceptors(new TransformInterceptor(RecipeDto))
  async update(
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

    return this.reviewsService.update(recipe, {
      ...reviewToUpdate,
      ...updateReviewDto,
    });
  }

  @Delete(':slug/:reviewAuthor')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  @UseInterceptors(new TransformInterceptor(RecipeDto))
  async delete(
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

    return this.reviewsService.delete(recipe, reviewToDelete);
  }
}
