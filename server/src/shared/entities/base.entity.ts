import { ObjectIdColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @ObjectIdColumn()
  id: string;

  @CreateDateColumn()
  dateCreated: Date;

  @UpdateDateColumn()
  dateUpdated: Date;
}
