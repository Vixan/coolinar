import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { RegisterUserDto } from '../auth/dto/user-register.dto';
import { EncryptionService } from '../encryption/encryption.service';
import { BaseService } from '../shared/base/base.service';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    private readonly encryptionService: EncryptionService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async findByName(name: string): Promise<User> {
    return this.userRepository.findOne({
      name,
    });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      email,
    });
  }

  async findByEmailAndPassword(email: string, password: string): Promise<User> {
    return this.userRepository.findOne({
      email,
      password,
    });
  }

  async add(registerDto: RegisterUserDto): Promise<User> {
    const user = new User({
      ...registerDto,
      password: await this.encryptionService.getHash(registerDto.password),
    });

    return this.userRepository.save(user);
  }

  async update(user: User): Promise<User> {
    const userToUpdate = await this.userRepository.findOne({ name: user.name });

    if (!userToUpdate) {
      return null;
    }

    userToUpdate.name = user.name;
    userToUpdate.email = user.email;
    userToUpdate.password = user.password;

    return this.userRepository.save(userToUpdate);
  }
}
