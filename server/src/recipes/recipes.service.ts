import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base/base.service';
import { Recipe } from './recipes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SlugProvider } from '../shared/providers/slug.provider';
import { DateInterval } from 'src/shared/providers/date.provider';

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
    recipe.slug = this.slugProvider.createSlug(recipe.title, { lower: true });
    recipe.categories = recipe.categories.map(category => ({
      ...category,
      slug: this.slugProvider.createSlug(category.name, { lower: true }),
    }));
    recipe.reviews = [];
    recipe.averageReviewScore = 0;

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

  async findByCreatedDateInterval(dateInterval: DateInterval) {
    return this.recipesRepository.find({
      where: {
        dateCreated: { $gte: dateInterval.start, $lt: dateInterval.end },
      },
    });
  }

  async findByReviewMinScore(reviewScore: number) {
    return this.recipesRepository.find({
      where: {
        'reviews.score': { $gte: reviewScore },
      },
      order: { averageReviewScore: -1 },
    });
  }

  async findByTitleMatch(title: string) {
    return this.recipesRepository.find({
      where: {
        title: { $regex: new RegExp(title, 'i') },
      },
    });
  }

  async fingByIngredients(ingredientNames: string[]) {
    return this.recipesRepository.find({
      where: {
        'ingredients.name': {
          $all: ingredientNames,
        },
      },
    });
  }

  async fingByCategories(categorySlugs: string[]) {
    return this.recipesRepository.find({
      where: {
        'categories.slug': {
          $all: categorySlugs,
        },
      },
    });
  }

  async update(recipe: Recipe) {
    recipe.slug = this.slugProvider.createSlug(recipe.title, { lower: true });
    recipe.categories = recipe.categories.map(category => ({
      ...category,
      slug: this.slugProvider.createSlug(category.name, { lower: true }),
    }));
    recipe.averageReviewScore =
      recipe.reviews.reduce(
        (totalScore, review) => review.score + totalScore,
        0,
      ) / recipe.reviews.length;

    return this.recipesRepository.save(recipe);
  }

  async delete(recipe: Recipe) {
    return this.recipesRepository.remove(recipe);
  }
}
