import { Injectable } from '@nestjs/common';
import { Ingredient } from './ingredients.entity';
import { BaseService } from '../shared/base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/**
 * Injectable service for user database logic.
 *
 * @class IngredientsService
 * @extends {BaseService<Ingredient>}
 */
@Injectable()
export class IngredientsService extends BaseService<Ingredient> {
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientsRepository: Repository<Ingredient>,
  ) {
    super(ingredientsRepository);
  }

  /**
   * Retrieve ingredient by name.
   *
   * @param {string} name
   * @returns {Promise<Ingredient>} Promise of the ingredient.
   * @memberof IngredientsService
   */
  async findByName(name: string): Promise<Ingredient> {
    return this.ingredientsRepository.findOne({
      name,
    });
  }
}
