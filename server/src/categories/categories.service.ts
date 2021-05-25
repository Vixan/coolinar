import { Injectable } from "@nestjs/common";
import { Category } from "./categories.entity";
import { BaseService } from "../shared/base/base.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class CategoriesService extends BaseService<Category> {
    constructor(
        @InjectRepository(Category)
        private readonly categoriesRepository: Repository<Category>
    ) {
        super(categoriesRepository);
    }

    async findByName(name: string): Promise<Category> {
        return this.categoriesRepository.findOne({
            name
        });
    }
}
