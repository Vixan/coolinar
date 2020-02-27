import {
    Entity,
    Column,
    OneToMany,
    ManyToMany,
    JoinTable,
    BeforeInsert,
    BeforeUpdate
} from "typeorm";
import { BaseEntity } from "../shared/base/base.entity";
import { Review } from "../reviews/reviews.entity";
import { Recipe } from "../recipes/recipes.entity";
import * as bcrypt from "bcryptjs";
import constraints from "./users.constraints";
import slug = require("slug");

/**
 * User database entity.
 *
 * @class User
 * @extends {BaseEntity}
 */
@Entity()
export class User extends BaseEntity {
    @Column()
    name: string;

    @Column()
    slug: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    avatarUrl: string;

    @ManyToMany(type => Recipe, { onDelete: "CASCADE" })
    @JoinTable()
    favoriteRecipes: Recipe[];

    @OneToMany(type => Recipe, recipe => recipe.author, { onDelete: "CASCADE" })
    createdRecipes: Recipe[];

    @OneToMany(type => Review, review => review.author, { onDelete: "CASCADE" })
    reviews: Review[];

    @BeforeInsert()
    @BeforeUpdate()
    async beforeSave(): Promise<void> {
        this.password = await bcrypt.hash(
            this.password,
            constraints.PASSWORD_HASH_SALT_LENGTH
        );

        this.slug = slug(this.name, { lower: true });
    }

    async comparePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }

    constructor(props: Partial<User>) {
        super();
        Object.assign(this, props);
    }
}
