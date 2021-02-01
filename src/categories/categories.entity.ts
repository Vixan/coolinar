import {
    IsString,
    MaxLength
} from "class-validator";
import { Column, Entity } from "typeorm";
import { BaseEntity } from "../shared/base/base.entity";

/**
 * Recipe category database model.
 *
 * @class Category
 */
@Entity()
export class Category extends BaseEntity {
    @Column({ unique: true })
    @IsString()
    @MaxLength(255)
    name: string;

    constructor(props: any) {
        super();
        Object.assign(this, props);
    }
}
