import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DateProvider } from "src/shared/providers/date.provider";
import { CategoriesModule } from "../categories/categories.module";
import { DirectionsModule } from "../directions/directions.module";
import { IngredientsModule } from "../ingredients/ingredients.module";
import { UsersModule } from "../users/users.module";
import { RecipesController } from "./recipes.controller";
import { Recipe } from "./recipes.entity";
import { RecipesService } from "./recipes.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Recipe]),
        UsersModule,
        CategoriesModule,
        IngredientsModule,
        DirectionsModule
    ],
    controllers: [RecipesController],
    providers: [RecipesService, DateProvider],
    exports: [RecipesService]
})
export class RecipesModule {}
