import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { SlugProvider } from '../shared/providers/slug.provider';
import { DateProvider } from 'src/shared/providers/date.provider';
import { Recipe } from 'src/recipes/recipes.entity';
import { RecipesService } from 'src/recipes/recipes.service';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

/**
 * Module to encapsulate reviews logic.
 *
 * @export
 * @class ReviewsModule
 */
@Module({
  imports: [TypeOrmModule.forFeature([Recipe]), UsersModule],
  controllers: [ReviewsController],
  providers: [RecipesService, ReviewsService, SlugProvider, DateProvider],
})
export class ReviewsModule {}
