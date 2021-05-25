import { Injectable } from "@nestjs/common";
import { Direction } from "./directions.entity";
import { BaseService } from "../shared/base/base.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class DirectionsService extends BaseService<Direction> {
    constructor(
        @InjectRepository(Direction)
        private readonly directionsRepository: Repository<Direction>
    ) {
        super(directionsRepository);
    }

    async findByName(name: string): Promise<Direction> {
        return this.directionsRepository.findOne({
            name
        });
    }
}
