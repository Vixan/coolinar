import { IsString, IsUrl, IsNotEmpty, IsOptional } from 'class-validator';
import { Column } from 'typeorm';

export class Direction {
  @Column()
  @IsNotEmpty({ message: 'Direction text is required' })
  @IsString({ message: 'Direction text must be a string' })
  text: string;

  @Column()
  @IsOptional()
  @IsUrl({}, { message: 'Direction media links must be valid URL' })
  mediaLinks: string[];
}
