import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesService } from 'src/recipes/recipes.service';
import { DateProvider } from 'src/shared/providers/date.provider';
import { RecipesModule } from '../recipes/recipes.module';
import { UsersModule } from '../users/users.module';
import { ReviewsController } from './reviews.controller';
import { Review } from './reviews.entity';
import { ReviewsService } from './reviews.service';

/**
 * Module to encapsulate reviews logic.
 *
 * @export
 * @class ReviewsModule
 */
@Module({
  imports: [TypeOrmModule.forFeature([Review]), RecipesModule, UsersModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, DateProvider],
})
export class ReviewsModule {}
