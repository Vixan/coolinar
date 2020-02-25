import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { BaseService } from '../shared/base/base.service';

/**
 * Injectable service for user database logic.
 *
 * @class UsersService
 * @extends {BaseService<User>}
 */
@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {
    super(usersRepository);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['favoriteRecipes', 'createdRecipes', 'reviews'],
    });
  }

  /**
   * Retrieve user by name.
   *
   * @param {string} name
   * @returns {Promise<User>} Promise of the user.
   * @memberof UsersService
   */
  async findOneByName(name: string): Promise<User> {
    return this.usersRepository.findOne({
      relations: ['favoriteRecipes', 'createdRecipes', 'reviews'],
      where: { name },
    });
  }

  /**
   * Retrieve the user by slug.
   *
   * @param {string} slug
   * @returns {Promise<User>} Promise of the user.
   * @memberof UsersService
   */
  async findOneBySlug(slug: string): Promise<User> {
    return this.usersRepository.findOne({
      relations: ['favoriteRecipes', 'createdRecipes', 'reviews'],
      where: { slug },
    });
  }

  /**
   * Retrieve the user by email.
   *
   * @param {string} email
   * @returns {Promise<User>} Promise of the user.
   * @memberof UsersService
   */
  async findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      relations: ['favoriteRecipes', 'createdRecipes', 'reviews'],
      where: { email },
    });
  }

  async save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }
}
