import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
    UseInterceptors,
    UsePipes
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { TransformInterceptor } from "../shared/interceptors/transform.interceptor";
import { ValidationPipe } from "../shared/pipes/validation.pipe";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserDto } from "./dto/user.dto";
import { User } from "./users.entity";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @UseGuards(AuthGuard("jwt"))
    @UseInterceptors(new TransformInterceptor(UserDto))
    async getAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get("/search")
    @UseInterceptors(new TransformInterceptor(UserDto))
    async searchByName(@Query() params: any): Promise<User> {
        if (params.name) {
            return await this.usersService.findOneByName(params.name);
        }

        return null;
    }

    @Post()
    @UseInterceptors(new TransformInterceptor(UserDto))
    async getByEmail(@Body("email") email: string): Promise<User> {
        return this.usersService.findOneByEmail(email);
    }

    @Get(":slug")
    @UseInterceptors(new TransformInterceptor(UserDto))
    async getBySlug(@Param("slug") slug: string): Promise<User> {
        return this.usersService.findOneBySlug(slug);
    }

    @Put(":slug")
    @UseGuards(AuthGuard("jwt"))
    @UsePipes(new ValidationPipe())
    @UseInterceptors(new TransformInterceptor(UserDto))
    async update(
        @Param("slug") slug: string,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<User> {
        const user = await this.usersService.findOneBySlug(slug);

        if (!user) {
            throw new NotFoundException({ errors: { slug: "User not found" } });
        }

        user.email = updateUserDto.email;
        user.name = updateUserDto.name;
        user.password = updateUserDto.password;
        user.avatarUrl = updateUserDto.avatarUrl;

        return this.usersService.update(user);
    }

    @Delete(":slug")
    @UseGuards(AuthGuard("jwt"))
    @UseInterceptors(new TransformInterceptor(UserDto))
    async delete(@Param("slug") slug: string): Promise<User> {
        const user = await this.usersService.findOneBySlug(slug);

        if (!user) {
            throw new NotFoundException({ errors: { slug: "User not found" } });
        }

        return this.usersService.delete(user);
    }
}
