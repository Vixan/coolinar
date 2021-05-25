import {
    Injectable,
    NotFoundException,
    ConflictException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Recipe } from "src/recipes/recipes.entity";
import { Review } from "src/reviews/reviews.entity";
import { User } from "../users/users.entity";
import { CreateReviewDto } from "./dto/create-review.dto";
import { JwtPayload } from "../auth/strategies/jwt/jwt-payload.interface";
import { RecipesService } from "../recipes/recipes.service";
import { UsersService } from "../users/users.service";
import { UpdateReviewDto } from "./dto/update-review.dto";

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewsRepository: Repository<Review>,
        private readonly recipesService: RecipesService,
        private readonly usersService: UsersService
    ) {}

    async findByRecipe(recipe: Recipe): Promise<Review[]> {
        return this.reviewsRepository.find({
            relations: ["recipe", "author"],
            where: { recipe }
        });
    }

    async findByAuthor(author: User): Promise<Review[]> {
        return this.reviewsRepository.find({
            relations: ["recipe", "author"],
            where: { author }
        });
    }

    async findOne(recipe: Recipe, author: User): Promise<Review> {
        return this.reviewsRepository.findOne({
            relations: ["recipe", "author"],
            where: { recipe, author }
        });
    }

    async create(
        currentUser: JwtPayload,
        recipeSlug: string,
        createReviewDto: CreateReviewDto
    ): Promise<Review> {
        const recipe = await this.recipesService.findOneBySlug(recipeSlug);
        if (!recipe) {
            throw new NotFoundException({
                errors: { slug: "Recipe not found" }
            });
        }

        const author = await this.usersService.findOneByEmail(
            currentUser.email
        );
        let review = await this.reviewsRepository.findOne({
            where: {
                author,
                recipe
            }
        });
        if (review) {
            throw new ConflictException({
                errors: { author: "Recipe has already been reviewed" }
            });
        }

        review = await this.reviewsRepository.save(
            new Review({ ...createReviewDto, author })
        );
        recipe.reviews.push(review);
        recipe.averageReviewScore = this.calculateReviewsAverage(recipe);

        await this.recipesService.update(recipe);

        return review;
    }

    async update(
        currentUser: JwtPayload,
        recipeSlug: string,
        updateReviewDto: UpdateReviewDto
    ): Promise<Review> {
        let recipe = await this.recipesService.findOneBySlug(recipeSlug);
        if (!recipe) {
            throw new NotFoundException({
                errors: { slug: "Recipe not found" }
            });
        }

        const author = await this.usersService.findOneByEmail(
            currentUser.email
        );
        let review = await this.reviewsRepository.findOne({
            where: {
                author,
                recipe
            }
        });
        if (!review) {
            throw new ConflictException({
                errors: { author: "No review has been left for this recipe" }
            });
        }

        review.text = updateReviewDto.text;
        review.score = updateReviewDto.score;

        review = await this.reviewsRepository.save(review);

        recipe = await this.recipesService.findOneBySlug(recipeSlug);
        recipe.averageReviewScore = this.calculateReviewsAverage(recipe);
        await this.recipesService.update(recipe);

        return review;
    }

    async delete(currentUser: JwtPayload, recipeSlug: string): Promise<Review> {
        let recipe = await this.recipesService.findOneBySlug(recipeSlug);
        if (!recipe) {
            throw new NotFoundException({
                errors: { slug: "Recipe not found" }
            });
        }

        const author = await this.usersService.findOneByEmail(
            currentUser.email
        );
        let review = await this.reviewsRepository.findOne({
            where: {
                author,
                recipe
            }
        });
        if (!review) {
            throw new ConflictException({
                errors: { author: "No review has been left for this recipe" }
            });
        }

        review = await this.reviewsRepository.remove(review);

        recipe = await this.recipesService.findOneBySlug(recipeSlug);
        recipe.averageReviewScore = this.calculateReviewsAverage(recipe);
        await this.recipesService.update(recipe);

        return review;
    }

    private calculateReviewsAverage(recipe: Recipe): number {
        if (!recipe.reviews || !recipe.reviews.length) {
            return 0;
        }

        return (
            recipe.reviews.reduce((avg, review) => avg + review.score, 0) /
            recipe.reviews.length
        );
    }
}
