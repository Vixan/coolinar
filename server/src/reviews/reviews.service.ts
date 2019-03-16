import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SlugProvider } from '../shared/providers/slug.provider';
import { Recipe } from 'src/recipes/recipes.entity';
import { Review } from 'src/reviews/reviews.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
    private readonly slugProvider: SlugProvider,
  ) {}

  async create(recipe: Recipe, review: Review) {
    recipe.reviews.push(review);

    return this.recipesRepository.save(recipe);
  }

  async update(recipe: Recipe, review: Review) {
    const reviewIndex = recipe.reviews.findIndex(
      reviewToUpdate => reviewToUpdate.author === review.author,
    );
    recipe.reviews[reviewIndex] = review;

    return this.recipesRepository.save(recipe);
  }

  async delete(recipe: Recipe, review: Review) {
    const reviewIndex = recipe.reviews.indexOf(review);
    recipe.reviews.splice(reviewIndex, 1);

    return this.recipesRepository.save(recipe);
  }
}
