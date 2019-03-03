import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base/base.service';
import { Recipe } from './recipes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RecipesService extends BaseService<Recipe> {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
  ) {
    super(recipesRepository);
  }

  async findByTitle(title: string) {
    return this.recipesRepository.findOne({
      title,
    });
  }
}
