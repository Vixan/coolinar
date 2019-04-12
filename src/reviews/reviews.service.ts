import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from 'src/recipes/recipes.entity';
import { Review } from 'src/reviews/reviews.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
  ) {}

  /**
   * Add a recipe review to the database.
   *
   * @param {Recipe} recipe Recipe to be reviewed.
   * @param {Review} review
   * @returns {Promise<Recipe>} Promise of the reviewed recipe.
   * @memberof ReviewsService
   */
  async create(recipe: Recipe, review: Review): Promise<Recipe> {
    recipe.reviews.push(review);
    recipe.averageReviewScore = this.calculateReviewsAverage(recipe);

    return this.recipesRepository.save(recipe);
  }

  /**
   * Update the review of a recipe in the database.
   *
   * @param {Recipe} recipe Recipe to be reviewed.
   * @param {Review} review
   * @returns {Promise<Recipe>} Promise of the reviewed recipe.
   * @memberof ReviewsService
   */
  async update(recipe: Recipe, review: Review): Promise<Recipe> {
    const reviewIndex = recipe.reviews.findIndex(
      reviewToUpdate => reviewToUpdate.author === review.author,
    );
    recipe.reviews[reviewIndex] = review;
    recipe.averageReviewScore = this.calculateReviewsAverage(recipe);

    return this.recipesRepository.save(recipe);
  }

  /**
   * Remove the recipe review from the database.
   *
   * @param {Recipe} recipe
   * @param {Review} review Review to be removed.
   * @returns {Promise<Recipe>} Promise of the reviewed recipe.
   * @memberof ReviewsService
   */
  async delete(recipe: Recipe, review: Review): Promise<Recipe> {
    const reviewIndex = recipe.reviews.indexOf(review);
    recipe.reviews.splice(reviewIndex, 1);
    recipe.averageReviewScore = this.calculateReviewsAverage(recipe);

    return this.recipesRepository.save(recipe);
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
    return (
      recipe.reviews.reduce((avg, review) => avg + review.score, 0) /
        recipe.reviews.length || 0
    );
  }
}
