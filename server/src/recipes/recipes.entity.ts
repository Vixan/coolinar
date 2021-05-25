import { Review } from "src/reviews/reviews.entity";
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany
} from "typeorm";
import { Category } from "../categories/categories.entity";
import { Direction } from "../directions/directions.entity";
import { Ingredient } from "../ingredients/ingredients.entity";
import { BaseEntity } from "../shared/base/base.entity";
import { User } from "../users/users.entity";
import { Nutrition } from "./nutrition.entity";
import slug = require("slug");

@Entity()
export class Recipe extends BaseEntity {
    @Column()
    slug: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @ManyToMany(type => Category, { onDelete: "CASCADE" })
    @JoinTable()
    categories: Category[];

    @OneToMany(type => Ingredient, ingredient => ingredient.recipe, {
        onDelete: "CASCADE"
    })
    ingredients: Ingredient[];

    @OneToMany(type => Direction, direction => direction.recipe, {
        onDelete: "CASCADE"
    })
    directions: Direction[];

    @Column()
    preparationTime: number;

    @Column()
    cookingTime: number;

    @Column({ nullable: true })
    notes: string;

    @Column({ type: "jsonb", nullable: false })
    nutrition: Nutrition;

    @OneToMany(type => Review, review => review.recipe, { onDelete: "CASCADE" })
    reviews: Review[];

    @Column()
    averageReviewScore: number;

    @Column({ type: String, array: true })
    imageUrls: string[];

    @Column()
    servings: number;

    @ManyToOne(type => User, user => user.createdRecipes)
    author: User;

    @BeforeInsert()
    @BeforeUpdate()
    async beforeSave(): Promise<void> {
        this.slug = slug(this.title, { lower: true });
    }

    constructor(props: Partial<Recipe>) {
        super();
        Object.assign(this, props);
    }
}
