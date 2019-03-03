import { Module } from '@nestjs/common';
import { Recipe } from './recipes.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe]), UsersModule],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
