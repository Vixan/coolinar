import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base/base.service';
import { Recipe } from './recipes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SlugProvider } from '../shared/providers/slug.provider';

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

    return this.recipesRepository.save({ ...recipe, slug });
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
    const dateUpdated = new Date();
    const id = recipe.id;
    delete recipe.id;
    await this.recipesRepository.update(
      { id },
      { ...recipe, slug, dateUpdated },
    );

    return this.recipesRepository.findOne(id);
  }

  async delete(recipe: Recipe) {
    await this.recipesRepository.delete({ ...recipe, id: recipe.id });

    return recipe;
  }
}
