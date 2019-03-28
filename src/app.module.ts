import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { RecipesService } from './recipes/recipes.service';
import { RecipesController } from './recipes/recipes.controller';
import { RecipesModule } from './recipes/recipes.module';
import { SlugProvider } from './shared/providers/slug.provider';
import { DateProvider } from './shared/providers/date.provider';
import { ReviewsModule } from './reviews/reviews.module';
import { FavoritesModule } from './favorites/favorites.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UsersModule,
    AuthModule,
    ConfigModule,
    RecipesModule,
    ReviewsModule,
    FavoritesModule,
  ],
  providers: [RecipesService, SlugProvider, DateProvider],
  controllers: [RecipesController],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
