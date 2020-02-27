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
    UseFilters
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { TransformInterceptor } from "src/shared/interceptors/transform.interceptor";
import { CreateReviewDto } from "src/reviews/dto/create-review.dto";
import { RecipeDto } from "src/recipes/dto/recipe.dto";
import { RecipesService } from "src/recipes/recipes.service";
import { UsersService } from "src/users/users.service";
import { UpdateReviewDto } from "src/reviews/dto/update-review.dto";
import { ReviewsService } from "./reviews.service";
import { HttpExceptionFilter } from "src/shared/filters/http-exception.filter";
import { Review } from "./reviews.entity";
import { Recipe } from "../recipes/recipes.entity";
import { ReviewDto } from "./dto/review.dto";
import { CurrentUser } from "src/users/current-user.decorator";
import { JwtPayload } from "../auth/strategies/jwt/jwt-payload.interface";
import { JwtAuthGuard } from "../auth/strategies/jwt/jwt-auth.guard";

/**
 * Controller that handles the reviews routes.
 *
 * @class RecipesController
 */
@Controller("reviews")
@UseGuards(JwtAuthGuard)
@UseFilters(HttpExceptionFilter)
export class ReviewsController {
    constructor(
        private readonly recipesService: RecipesService,
        private readonly usersService: UsersService,
        private readonly reviewsService: ReviewsService
    ) {}

    @Post(":slug")
    @UsePipes(new ValidationPipe())
    @UseInterceptors(new TransformInterceptor(ReviewDto))
    async create(
        @Param("slug") slug: string,
        @Body() createReviewDto: CreateReviewDto,
        @CurrentUser() currentUser: JwtPayload
    ): Promise<Review> {
        return this.reviewsService.create(currentUser, slug, createReviewDto);
    }

    @Put(":slug")
    @UsePipes(new ValidationPipe())
    @UseInterceptors(new TransformInterceptor(ReviewDto))
    async update(
        @Param("slug") slug: string,
        @Body() updateReviewDto: UpdateReviewDto,
        @CurrentUser() currentUser: JwtPayload
    ): Promise<Review> {
        return this.reviewsService.update(currentUser, slug, updateReviewDto);
    }

    @Delete(":slug")
    @UsePipes(new ValidationPipe())
    @UseInterceptors(new TransformInterceptor(ReviewDto))
    async delete(
        @Param("slug") slug: string,
        @Body("author") author: string,
        @CurrentUser() currentUser: JwtPayload
    ): Promise<Review> {
        return this.reviewsService.delete(currentUser, slug);
    }
}
