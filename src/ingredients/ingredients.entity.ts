import { BaseEntity } from '../shared/base/base.entity';
import { Column, Entity } from 'typeorm';
import { IsString, MaxLength } from 'class-validator';

/**
 * Recipe ingredient database model.
 *
 * @class Ingredient
 */
@Entity()
export class Ingredient extends BaseEntity {
  @Column({ unique: true })
  @IsString()
  @MaxLength(255)
  name: string;

  constructor(props: any) {
    super();
    Object.assign(this, props);
  }
}
