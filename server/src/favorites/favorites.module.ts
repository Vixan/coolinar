import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { UsersModule } from 'src/users/users.module';
import { RecipesModule } from 'src/recipes/recipes.module';

@Module({
  imports: [UsersModule, RecipesModule],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
