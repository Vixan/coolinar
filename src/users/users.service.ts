import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { EncryptionService } from '../encryption/encryption.service';
import { BaseService } from '../shared/base/base.service';
import { SlugProvider } from 'src/shared/providers/slug.provider';

/**
 * Injectable service for user database logic.
 *
 * @class UsersService
 * @extends {BaseService<User>}
 */
@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    private readonly encryptionService: EncryptionService,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly slugProvider: SlugProvider,
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
  async findByName(name: string): Promise<User> {
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
  async findBySlug(slug: string): Promise<User> {
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
  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      relations: ['favoriteRecipes', 'createdRecipes', 'reviews'],
      where: { email },
    });
  }

  /**
   * Retrieve the user by email and password.
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<User>} Promise of the user.
   * @memberof UsersService
   */
  async findByEmailAndPassword(email: string, password: string): Promise<User> {
    return this.usersRepository.findOne({
      relations: ['favoriteRecipes', 'createdRecipes', 'reviews'],
      where: { email, password },
    });
  }

  /**
   * Add a user to the database.
   *
   * @param {User} user
   * @returns {Promise<User>} Promise of created the user.
   * @memberof UsersService
   */
  async create(user: User): Promise<User> {
    user.slug = this.slugProvider.createSlug(user.name, { lower: true });
    user.password = await this.encryptionService.getHash(user.password);
    user.favoriteRecipes = [];

    return this.usersRepository.save(user);
  }

  /**
   * Update a user in the database.
   *
   * @param {User} user
   * @returns {Promise<User>} Promise of the updated user.
   * @memberof UsersService
   */
  async update(user: User): Promise<User> {
    const updatedUser = new User({
      ...user,
      password: await this.encryptionService.getHash(user.password),
    });

    return this.usersRepository.save(updatedUser);
  }
}
