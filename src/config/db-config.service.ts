import { Injectable } from "@nestjs/common";
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { User } from "src/users/users.entity";
import { Recipe } from "src/recipes/recipes.entity";
import { Category } from "src/categories/categories.entity";
import { Direction } from "src/directions/directions.entity";
import { Ingredient } from "src/ingredients/ingredients.entity";
import { Review } from "src/reviews/reviews.entity";

@Injectable()
export class DbConfigService implements TypeOrmOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: this.type as any,
            host: this.host,
            port: this.port,
            username: this.username,
            password: this.password,
            database: this.name,
            entities: [User, Recipe, Category, Direction, Ingredient, Review],
            synchronize: this.isSynchronizationEnabled
        };
    }

    private get type(): string {
        return this.configService.get("DB_TYPE");
    }

    get host(): string {
        return this.configService.get("DB_HOST");
    }

    get port(): number {
        return this.configService.get("DB_PORT");
    }

    get username(): string {
        return this.configService.get("DB_USERNAME");
    }

    private get password(): string {
        return this.configService.get("DB_PASSWORD");
    }

    get name(): string {
        return this.configService.get("DB_NAME");
    }

    private get isSynchronizationEnabled(): boolean {
        return this.configService.get<boolean>("DB_SYNCHRONIZE");
    }
}
