import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base/base.service';
import { Recipe } from './recipes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SlugProvider } from '../shared/providers/slug.provider';
import { DateInterval } from 'src/shared/providers/date.provider';
import { PaginationOptions } from 'src/shared/interfaces/pagination-options.interface';

@Injectable()
export class RecipesService extends BaseService<Recipe> {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
    private readonly slugProvider: SlugProvider,
  ) {
    super(recipesRepository);
  }

  async paginate(paginationOptions: PaginationOptions) {
    const [results] = await this.recipesRepository.findAndCount({
      ...paginationOptions,
    });

    return results;
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

  async findByCreatedDateInterval(
    dateInterval: DateInterval,
    paginationOptions?: PaginationOptions,
  ) {
    const [results] = await this.recipesRepository.find({
      where: {
        dateCreated: { $gte: dateInterval.start, $lt: dateInterval.end },
      },
      ...paginationOptions,
    });

    return results;
  }

  async findByReviewMinScore(
    reviewScore: number,
    paginationOptions?: PaginationOptions,
  ) {
    return this.recipesRepository.find({
      where: {
        'reviews.score': { $gte: reviewScore },
      },
      order: { averageReviewScore: -1 },
      ...paginationOptions,
    });
  }

  async findByTitleMatch(title: string, paginationOptions?: PaginationOptions) {
    return this.recipesRepository.find({
      where: {
        title: { $regex: new RegExp(title, 'i') },
      },
      ...paginationOptions,
    });
  }

  async fingByIngredients(
    ingredientNames: string[],
    paginationOptions?: PaginationOptions,
  ) {
    return this.recipesRepository.find({
      where: {
        ingredients: { $regex: new RegExp(ingredientNames.join('|'), 'i') },
      },
      ...paginationOptions,
    });
  }

  async fingByCategories(
    categorySlugs: string[],
    paginationOptions?: PaginationOptions,
  ) {
    return this.recipesRepository.find({
      where: {
        categories: { $regex: new RegExp(categorySlugs.join('|'), 'i') },
      },
      ...paginationOptions,
    });
  }

  async create(recipe: Recipe) {
    recipe.slug = this.slugProvider.createSlug(recipe.title, { lower: true });
    recipe.reviews = [];
    recipe.averageReviewScore = 0;

    return this.recipesRepository.save(recipe);
  }

  async update(recipe: Recipe) {
    recipe.slug = this.slugProvider.createSlug(recipe.title, { lower: true });
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
