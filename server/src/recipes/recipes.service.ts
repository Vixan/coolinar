import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Pagination } from "src/shared/pagination/pagination";
import { PaginationOptions } from "src/shared/pagination/pagination-options.interface";
import { DateInterval } from "src/shared/providers/date.provider";
import { Between, In, Like, MoreThanOrEqual, Repository } from "typeorm";
import { BaseService } from "../shared/base/base.service";
import { SearchRecipeDto } from "./dto/search-recipe.dto";
import { Recipe } from "./recipes.entity";

@Injectable()
export class RecipesService extends BaseService<Recipe> {
    constructor(
        @InjectRepository(Recipe)
        private readonly recipesRepository: Repository<Recipe>
    ) {
        super(recipesRepository);
    }

    async paginate(
        paginationOptions: PaginationOptions
    ): Promise<Pagination<Recipe>> {
        const [results, total] = await this.recipesRepository.findAndCount({
            relations: [
                "categories",
                "ingredients",
                "directions",
                "reviews",
                "author",
                "reviews.author"
            ],
            ...paginationOptions
        });

        return new Pagination<Recipe>({
            results,
            total
        });
    }

    async paginateAndSort(
        paginationOptions: PaginationOptions,
        sortBy: string,
        isAscending?: boolean
    ): Promise<Pagination<Recipe>> {
        const [results, total] = await this.recipesRepository.findAndCount({
            relations: [
                "categories",
                "ingredients",
                "directions",
                "reviews",
                "author",
                "reviews.author"
            ],
            order: { [sortBy]: isAscending ? 1 : -1 },
            ...paginationOptions
        });

        return new Pagination<Recipe>({
            results,
            total
        });
    }

    async findOneBySlug(slug: string): Promise<Recipe> {
        return this.recipesRepository.findOne(
            {
                slug
            },
            {
                relations: [
                    "categories",
                    "ingredients",
                    "directions",
                    "reviews",
                    "author",
                    "reviews.author"
                ]
            }
        );
    }

    async findByTitle(title: string): Promise<Recipe> {
        return this.recipesRepository.findOne(
            {
                title
            },
            {
                relations: [
                    "categories",
                    "ingredients",
                    "directions",
                    "reviews",
                    "author",
                    "reviews.author"
                ]
            }
        );
    }

    async findByCreatedDateInterval(
        dateInterval: DateInterval,
        paginationOptions?: PaginationOptions
    ): Promise<Pagination<Recipe>> {
        const [results, total] = await this.recipesRepository.findAndCount({
            where: {
                relations: [
                    "categories",
                    "ingredients",
                    "directions",
                    "reviews",
                    "author",
                    "reviews.author"
                ],
                dateCreated: Between(dateInterval.start, dateInterval.end)
            },
            ...paginationOptions
        });

        return new Pagination<Recipe>({
            results,
            total
        });
    }

    async findByReviewMinScore(
        reviewScore: number,
        paginationOptions?: PaginationOptions
    ): Promise<Pagination<Recipe>> {
        const [results, total] = await this.recipesRepository.findAndCount({
            where: {
                relations: [
                    "categories",
                    "ingredients",
                    "directions",
                    "reviews",
                    "author",
                    "reviews.author"
                ],
                reviews: { score: MoreThanOrEqual(reviewScore) }
            },
            order: { averageReviewScore: -1 },
            ...paginationOptions
        });

        return new Pagination<Recipe>({
            results,
            total
        });
    }

    async search(
        searchRecipeDto: SearchRecipeDto,
        paginationOptions?: PaginationOptions
    ): Promise<Pagination<Recipe>> {
        let query = this.recipesRepository.manager
            .createQueryBuilder(Recipe, "recipe")
            .leftJoinAndSelect("recipe.author", "author")
            .leftJoinAndSelect("recipe.ingredients", "ingredient")
            .leftJoinAndSelect("recipe.directions", "direction")
            .leftJoinAndSelect("recipe.categories", "category")
            .leftJoinAndSelect("recipe.reviews", "review")
            .skip(paginationOptions.skip)
            .take(paginationOptions.take);

        if (searchRecipeDto.title) {
            query = query.andWhere(`recipe.title ILIKE :title`, {
                title: `%${searchRecipeDto.title}%`
            });
        }

        if (searchRecipeDto.author) {
            query = query.andWhere(`author.slug = :author`, {
                author: searchRecipeDto.author
            });
        }

        if (searchRecipeDto.ingredients) {
            query = query.andWhere(`ingredient.name ILIKE ANY(:ingredients)`, {
                ingredients: searchRecipeDto.ingredients.map(i => `%${i}%`)
            });
        }

        if (searchRecipeDto.categories) {
            query = query.andWhere(`category.name ILIKE ANY(:categories)`, {
                categories: searchRecipeDto.categories.map(c => `%${c}%`)
            });
        }

        const [results, total] = await query.getManyAndCount();

        return new Pagination<Recipe>({
            results,
            total
        });
    }

    async findByTitleMatch(
        title: string,
        paginationOptions?: PaginationOptions
    ): Promise<Pagination<Recipe>> {
        const [results, total] = await this.recipesRepository.findAndCount({
            where: {
                relations: [
                    "categories",
                    "ingredients",
                    "directions",
                    "reviews",
                    "author",
                    "reviews.author"
                ],
                title: Like(title)
            },
            ...paginationOptions
        });

        return new Pagination<Recipe>({
            results,
            total
        });
    }

    async findBySomeIngredients(
        ingredients: string[],
        paginationOptions?: PaginationOptions
    ): Promise<Pagination<Recipe>> {
        const [results, total] = await this.recipesRepository.findAndCount({
            where: {
                relations: [
                    "categories",
                    "ingredients",
                    "directions",
                    "reviews",
                    "author",
                    "reviews.author"
                ],
                ingredients: {
                    name: In(ingredients)
                }
            },
            ...paginationOptions
        });

        return new Pagination<Recipe>({
            results,
            total
        });
    }

    async findBySomeCategories(
        categorySlugs: string[],
        paginationOptions?: PaginationOptions
    ): Promise<Pagination<Recipe>> {
        const [results, total] = await this.recipesRepository.findAndCount({
            where: {
                relations: [
                    "categories",
                    "ingredients",
                    "directions",
                    "reviews",
                    "author",
                    "reviews.author"
                ],
                categories: {
                    name: In(categorySlugs)
                }
            },
            ...paginationOptions
        });

        return new Pagination<Recipe>({
            results,
            total
        });
    }

    async create(recipe: Recipe): Promise<Recipe> {
        recipe.averageReviewScore = 0;
        recipe.reviews = recipe.reviews || [];
        recipe.imageUrls = recipe.imageUrls || [];

        return this.recipesRepository.save(recipe);
    }

    async update(recipe: Recipe): Promise<Recipe> {
        if (recipe.reviews && recipe.reviews.length) {
            recipe.averageReviewScore =
                recipe.reviews.reduce(
                    (totalScore, review) => review.score + totalScore,
                    0
                ) / recipe.reviews.length;
        }

        return this.recipesRepository.save(recipe);
    }

    async delete(recipe: Recipe): Promise<Recipe> {
        return this.recipesRepository.remove(recipe);
    }
}
