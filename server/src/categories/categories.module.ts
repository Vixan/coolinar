import { Module } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./categories.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Category])],
    exports: [CategoriesService],
    providers: [CategoriesService]
})
export class CategoriesModule {}
