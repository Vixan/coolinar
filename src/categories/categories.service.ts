import { Injectable } from '@nestjs/common';
import { Category } from './categories.entity';
import { BaseService } from '../shared/base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/**
 * Injectable service for user database logic.
 *
 * @class CategoriesService
 * @extends {BaseService<Category>}
 */
@Injectable()
export class CategoriesService extends BaseService<Category> {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {
    super(categoriesRepository);
  }

  /**
   * Retrieve category by name.
   *
   * @param {string} name
   * @returns {Promise<Category>} Promise of the category.
   * @memberof CategoriesService
   */
  async findByName(name: string): Promise<Category> {
    return this.categoriesRepository.findOne({
      name,
    });
  }
}
