import { Service } from '../interfaces/service.interface';
import { Repository } from 'typeorm';
import { BaseEntity } from './base.entity';

export class BaseService<T extends BaseEntity> implements Service<T> {
  constructor(readonly entityRepository: Repository<T>) {}

  async findAll(): Promise<T[]> {
    return this.entityRepository.find();
  }

  async findById(id: string): Promise<T> {
    return await this.entityRepository.findOne(id);
  }

  async create(entity: T): Promise<T> {
    return await this.entityRepository.save<{}>(entity);
  }

  async update(entity: T): Promise<T> {
    return this.entityRepository.save<{}>(entity);
  }

  async delete(entity: T): Promise<T> {
    return this.entityRepository.remove(entity);
  }
}
