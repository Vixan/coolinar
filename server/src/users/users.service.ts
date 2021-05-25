import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { BaseService } from "../shared/base/base.service";

@Injectable()
export class UsersService extends BaseService<User> {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
    ) {
        super(usersRepository);
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find({
            relations: ["favoriteRecipes", "createdRecipes", "reviews"]
        });
    }

    async findOneByName(name: string): Promise<User> {
        return this.usersRepository.findOne({
            relations: ["favoriteRecipes", "createdRecipes", "reviews"],
            where: { name }
        });
    }

    async findOneBySlug(slug: string): Promise<User> {
        return this.usersRepository.findOne({
            relations: ["favoriteRecipes", "createdRecipes", "reviews"],
            where: { slug }
        });
    }

    async findOneByEmail(email: string): Promise<User> {
        return this.usersRepository.findOne({
            relations: ["favoriteRecipes", "createdRecipes", "reviews"],
            where: { email }
        });
    }

    async save(user: User): Promise<User> {
        return this.usersRepository.save(user);
    }
}
