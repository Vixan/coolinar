import { IsString, IsUrl, IsNotEmpty, IsOptional } from 'class-validator';
import { Column } from 'typeorm';

export class Direction {
  @Column()
  @IsNotEmpty({ message: 'Direction text is required' })
  @IsString({ message: 'Direction text must be a string' })
  text: string;

  @Column()
  @IsUrl({}, { message: 'Direction media link must be valid URL' })
  @IsOptional()
  mediaLink: string[];
}
