import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Service } from '../shared/interfaces/service.interface';
import { RegisterUserDto } from '../auth/dto/user-register.dto';

@Injectable()
export class UsersService implements Service<User> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findById(id: string): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      email,
    });
  }

  async findByName(name: string): Promise<User> {
    return await this.userRepository.findOne({
      name,
    });
  }

  async add(registerDto: RegisterUserDto): Promise<User> {
    const user = new User({ ...registerDto });

    return await this.userRepository.save(user);
  }

  async update(user: User): Promise<User> {
    const userToUpdate = await this.userRepository.findOne({ name: user.name });

    if (!userToUpdate) {
      return null;
    }

    userToUpdate.name = user.name;
    userToUpdate.email = user.email;
    userToUpdate.password = user.password;

    return await this.userRepository.save(userToUpdate);
  }

  async delete(user: User): Promise<User> {
    const userToDelete: User = await this.userRepository.findOne(user.id);

    if (!userToDelete) {
      return null;
    }

    return this.userRepository.remove(userToDelete);
  }
}
