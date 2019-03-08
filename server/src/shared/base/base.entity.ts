import { ObjectIdColumn, CreateDateColumn, UpdateDateColumn, ObjectID } from 'typeorm';

export abstract class BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @CreateDateColumn()
  dateCreated: Date;

  @UpdateDateColumn()
  dateUpdated: Date;
}
