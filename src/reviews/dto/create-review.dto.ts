import { Exclude, Expose } from "class-transformer";
import {
    IsString,
    IsOptional,
    IsNotEmpty,
    IsInt,
    Max,
    Min
} from "class-validator";

/**
 * Recipe review created by the client.
 *
 * @class CreateReviewDto
 */
@Exclude()
export class CreateReviewDto {
    @Expose()
    @IsString({ message: "Review text must be a string" })
    @IsOptional()
    readonly text: string;

    @Expose()
    @IsInt({ message: "Review score must be an integer" })
    @Min(1, { message: "Review minimum score is 1" })
    @Max(5, { message: "Review maximum score is 5" })
    readonly score: number;

    @Expose()
    @IsString({ message: "Review author must be a string" })
    readonly author: string;
}
