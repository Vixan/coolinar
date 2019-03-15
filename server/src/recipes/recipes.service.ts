import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base/base.service';
import { Recipe } from './recipes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SlugProvider } from '../shared/providers/slug.provider';
import { Review } from './reviews.entity';

@Injectable()
export class RecipesService extends BaseService<Recipe> {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
    private readonly slugProvider: SlugProvider,
  ) {
    super(recipesRepository);
  }

  async create(recipe: Recipe) {
    const slug = this.slugProvider.createSlug(recipe.title, { lower: true });
    const categories = recipe.categories.map(category => ({
      ...category,
      slug: this.slugProvider.createSlug(category.name, { lower: true }),
    }));
    const reviews: Review[] = [];

    return this.recipesRepository.save({
      ...recipe,
      slug,
      categories,
      reviews,
    });
  }

  async createReview(recipe: Recipe, review: Review) {
    recipe.reviews.push(review);

    return this.recipesRepository.save(recipe);
  }

  async updateReview(recipe: Recipe, review: Review) {
    const reviewIndex = recipe.reviews.findIndex(reviewToUpdate => reviewToUpdate.author === review.author);
    recipe.reviews[reviewIndex] = review;

    return this.recipesRepository.save(recipe);
  }

  async deleteReview(recipe: Recipe, review: Review) {
    const reviewIndex = recipe.reviews.indexOf(review);
    recipe.reviews.splice(reviewIndex, 1);

    return this.recipesRepository.save(recipe);
  }

  async findBySlug(slug: string) {
    return this.recipesRepository.findOne({
      slug,
    });
  }

  async findByTitle(title: string) {
    return this.recipesRepository.findOne({
      title,
    });
  }

  async update(recipe: Recipe) {
    const slug = this.slugProvider.createSlug(recipe.title, { lower: true });
    const categories = recipe.categories.map(category => ({
      ...category,
      slug: this.slugProvider.createSlug(category.name, { lower: true }),
    }));
    const dateUpdated = new Date();
    const id = recipe.id;
    delete recipe.id;
    await this.recipesRepository.update(
      { id },
      { ...recipe, slug, categories, dateUpdated },
    );

    return this.recipesRepository.findOne(id);
  }

  async delete(recipe: Recipe) {
    await this.recipesRepository.delete({ ...recipe, id: recipe.id });

    return recipe;
  }
}
