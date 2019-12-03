import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from 'src/recipes/recipes.entity';
import { Review } from 'src/reviews/reviews.entity';
import { User } from '../users/users.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
  ) {}

  async findByRecipe(recipe: Recipe): Promise<Review[]> {
    return this.reviewsRepository.find({
      relations: ['recipe', 'author'],
      where: { recipe },
    });
  }

  async findByAuthor(author: User): Promise<Review[]> {
    return this.reviewsRepository.find({
      relations: ['recipe', 'author'],
      where: { author },
    });
  }

  async findOne(recipe: Recipe, author: User): Promise<Review> {
    return this.reviewsRepository.findOne({
      relations: ['recipe', 'author'],
      where: { recipe, author },
    });
  }

  /**
   * Add a recipe review to the database.
   *
   * @param {Recipe} recipe Recipe to be reviewed.
   * @param {Review} review
   * @returns {Promise<Recipe>} Promise of the reviewed recipe.
   * @memberof ReviewsService
   */
  async create(review: Review): Promise<Review> {
    review.recipe.averageReviewScore = this.calculateReviewsAverage(
      review.recipe,
    );
    this.recipesRepository.save(review.recipe);

    return this.reviewsRepository.save(review);
  }

  /**
   * Update the review of a recipe in the database.
   *
   * @param {Recipe} recipe Recipe to be reviewed.
   * @param {Review} review
   * @returns {Promise<Recipe>} Promise of the reviewed recipe.
   * @memberof ReviewsService
   */
  async update(review: Review): Promise<Review> {
    review.recipe.averageReviewScore = this.calculateReviewsAverage(
      review.recipe,
    );
    this.recipesRepository.save(review.recipe);

    return this.reviewsRepository.save(review);
  }

  /**
   * Remove the recipe review from the database.
   *
   * @param {Recipe} recipe
   * @param {Review} review Review to be removed.
   * @returns {Promise<Recipe>} Promise of the reviewed recipe.
   * @memberof ReviewsService
   */
  async delete(review: Review): Promise<Review> {
    review.recipe.averageReviewScore = this.calculateReviewsAverage(
      review.recipe,
    );
    this.recipesRepository.save(review.recipe);

    return this.reviewsRepository.remove(review);
  }

  /**
   * Average the reviews score.
   *
   * @private
   * @param {Recipe} recipe
   * @returns {number} Review score average.
   * @memberof ReviewsService
   */
  private calculateReviewsAverage(recipe: Recipe): number {
    if (!recipe.reviews) {
      return;
    }

    return (
      recipe.reviews.reduce((avg, review) => avg + review.score, 0) /
        recipe.reviews.length || 0
    );
  }
}
