import { Module } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient } from './ingredients.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient])],
  exports: [IngredientsService],
  providers: [IngredientsService],
})
export class IngredientsModule {}
