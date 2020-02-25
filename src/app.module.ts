import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { RecipesService } from './recipes/recipes.service';
import { RecipesController } from './recipes/recipes.controller';
import { RecipesModule } from './recipes/recipes.module';
import { DateProvider } from './shared/providers/date.provider';
import { ReviewsModule } from './reviews/reviews.module';
import { FavoritesModule } from './favorites/favorites.module';
import { CategoriesModule } from './categories/categories.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { DirectionsModule } from './directions/directions.module';
import { DbConfigService } from './config/db-config.service';

/**
 * Main module of the application.
 *
 * @export
 * @class AppModule
 */
@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule,
    CategoriesModule,
    DirectionsModule,
    RecipesModule,
    ReviewsModule,
    FavoritesModule,
    IngredientsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useExisting: DbConfigService,
    }),
  ],
  providers: [RecipesService, DateProvider],
  controllers: [RecipesController],
})
export class AppModule {}
