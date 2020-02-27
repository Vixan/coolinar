import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import {
    IsInt,
    Min,
    IsOptional,
    IsNumber,
    IsString,
    MaxLength
} from "class-validator";
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
