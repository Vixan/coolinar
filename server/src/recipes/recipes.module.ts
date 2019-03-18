import { Module } from '@nestjs/common';
import { Recipe } from './recipes.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { UsersModule } from '../users/users.module';
import { SlugProvider } from '../shared/providers/slug.provider';
import { DateProvider } from 'src/shared/providers/date.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe]), UsersModule],
  controllers: [RecipesController],
  providers: [RecipesService, SlugProvider, DateProvider],
})
export class RecipesModule {}
