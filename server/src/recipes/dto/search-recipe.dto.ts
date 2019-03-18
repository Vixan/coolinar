import { Exclude, Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

@Exclude()
export class SearchRecipeDto {
  @Expose()
  @IsOptional()
  title: string;
}
