import { Module } from "@nestjs/common";
import { DirectionsService } from "./directions.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Direction } from "./directions.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Direction])],
    exports: [DirectionsService],
    providers: [DirectionsService]
})
export class DirectionsModule {}
