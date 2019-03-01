import { ObjectIdColumn, CreateDateColumn, UpdateDateColumn, Entity } from 'typeorm';

export abstract class BaseEntity {
  @ObjectIdColumn()
  id: string;

  @CreateDateColumn()
  dateCreated: Date;

  @UpdateDateColumn()
  dateUpdated: Date;
}
