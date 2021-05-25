import { Injectable } from "@nestjs/common";
import { Ingredient } from "./ingredients.entity";
import { BaseService } from "../shared/base/base.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class IngredientsService extends BaseService<Ingredient> {
    constructor(
        @InjectRepository(Ingredient)
        private readonly ingredientsRepository: Repository<Ingredient>
    ) {
        super(ingredientsRepository);
    }

    async findByName(name: string): Promise<Ingredient> {
        return this.ingredientsRepository.findOne({
            name
        });
    }
}
