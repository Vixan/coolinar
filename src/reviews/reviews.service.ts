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

  async create(recipe: Recipe, review: Review) {
    recipe.reviews.push(review);
    recipe.averageReviewScore = this.calculateReviewsAverage(recipe);

    return this.recipesRepository.save(recipe);
  }

  async update(recipe: Recipe, review: Review) {
    const reviewIndex = recipe.reviews.findIndex(
      reviewToUpdate => reviewToUpdate.author === review.author,
    );
    recipe.reviews[reviewIndex] = review;
    recipe.averageReviewScore = this.calculateReviewsAverage(recipe);

    return this.recipesRepository.save(recipe);
  }

  async delete(recipe: Recipe, review: Review) {
    const reviewIndex = recipe.reviews.indexOf(review);
    recipe.reviews.splice(reviewIndex, 1);
    recipe.averageReviewScore = this.calculateReviewsAverage(recipe);

    return this.recipesRepository.save(recipe);
  }

  private calculateReviewsAverage(recipe: Recipe): number {
    return (
      recipe.reviews.reduce((avg, review) => avg + review.score, 0) /
        recipe.reviews.length || 0
    );
  }
}
