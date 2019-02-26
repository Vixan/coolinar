import { ObjectIdColumn, CreateDateColumn, UpdateDateColumn, Entity } from 'typeorm';

@Entity()
export class BaseEntity {
  @ObjectIdColumn()
  id: string;

  @CreateDateColumn()
  dateCreated: Date;

  @UpdateDateColumn()
  dateUpdated: Date;
}
