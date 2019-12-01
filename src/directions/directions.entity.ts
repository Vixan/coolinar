import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsString, MaxLength } from 'class-validator';
import { BaseEntity } from '../shared/base/base.entity';

/**
 * Recipe Direction database model.
 *
 * @class Direction
 */
@Entity()
export class Direction extends BaseEntity {
  @Column({ unique: true })
  @IsString()
  @MaxLength(255)
  name: string;

  constructor(props: any) {
    super();
    Object.assign(this, props);
  }
}
