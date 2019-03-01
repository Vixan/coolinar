import { IsString, IsUrl } from 'class-validator';
import { Column } from 'typeorm';

export class Direction {
  @Column()
  @IsString()
  text: string;

  @Column()
  @IsUrl()
  media: string[];
}
