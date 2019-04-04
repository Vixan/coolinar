import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { EncryptionService } from '../encryption/encryption.service';
import { BaseService } from '../shared/base/base.service';
import { SlugProvider } from 'src/shared/providers/slug.provider';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    private readonly encryptionService: EncryptionService,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly slugProvider: SlugProvider,
  ) {
    super(usersRepository);
  }

  async findByName(name: string): Promise<User> {
    return this.usersRepository.findOne({
      name,
    });
  }

  async findBySlug(slug: string): Promise<User> {
    return this.usersRepository.findOne({
      slug,
    });
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      email,
    });
  }

  async findByEmailAndPassword(email: string, password: string): Promise<User> {
    return this.usersRepository.findOne({
      email,
      password,
    });
  }

  async create(user: User): Promise<User> {
    user.slug = this.slugProvider.createSlug(user.name, { lower: true });
    user.password = await this.encryptionService.getHash(user.password);
    user.favoriteRecipes = [];

    return this.usersRepository.save(user);
  }

  async update(user: User): Promise<User> {
    const updatedUser = new User({
      ...user,
      password: await this.encryptionService.getHash(user.password),
    });

    return this.usersRepository.save(updatedUser);
  }
}
