import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { UsersModule } from 'src/users/users.module';
import { RecipesModule } from 'src/recipes/recipes.module';

/**
 * Module to encapsulate the favorites logic.
 *
 * @export FavoritesService Service that exposes methods for handling favorites.
 * @class FavoritesModule
 */
@Module({
  imports: [UsersModule, RecipesModule],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
