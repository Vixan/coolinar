import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { EncryptionService } from '../encryption/encryption.service';
import { BaseService } from '../shared/base/base.service';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    private readonly encryptionService: EncryptionService,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {
    super(usersRepository);
  }

  async findByName(name: string): Promise<User> {
    return this.usersRepository.findOne({
      name,
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
    const createdUser = new User({
      ...user,
      password: await this.encryptionService.getHash(user.password),
      favoriteRecipes: [],
    });

    return this.usersRepository.save(createdUser);
  }

  async update(user: User): Promise<User> {
    const updatedUser = new User({
      ...user,
      password: await this.encryptionService.getHash(user.password),
    });

    return this.usersRepository.save(updatedUser);
  }
}
