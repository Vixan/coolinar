import { Injectable, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Service } from '../shared/interfaces/service.interface';
import { UserDto } from './dto/user.dto';

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

  async add(userDto: UserDto): Promise<User> {
    const userToAdd = await this.userRepository.findOne({
      name: userDto.name,
    });

    if (userToAdd) {
      throw new ConflictException();
    }

    const user = new User({ ...userDto });

    return await this.userRepository.save(user);
  }

  async update(user: User): Promise<User> {
    const userToUpdate = await this.userRepository.findOne(user.name);

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
