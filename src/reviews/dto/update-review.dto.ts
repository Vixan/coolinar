import { Exclude, Expose } from "class-transformer";
import { IsString, IsOptional, IsInt, Max, Min } from "class-validator";

/**
 * Updated recipe review created by the client.
 *
 * @class CreateReviewDto
 */
@Exclude()
export class UpdateReviewDto {
    @Expose()
    @IsOptional()
    @IsString({ message: "Review text must be a string" })
    readonly text: string;

    @Expose()
    @IsOptional()
    @IsInt({ message: "Review score must be an integer" })
    @Min(1, { message: "Review minimum score is 1" })
    @Max(5, { message: "Review maximum score is 5" })
    readonly score: number;

    @Expose()
    @IsString({ message: "Review author must be a string" })
    readonly author: string;
}
