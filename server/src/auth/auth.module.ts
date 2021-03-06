import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule } from "../config/config.module";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtConfigService } from "./strategies/jwt/jwt-config.service";
import { JwtStrategy } from "./strategies/jwt/jwt.strategy";
import { LocalStrategy } from "./strategies/local/local.strategy";
import { IsUserEmailAvailable } from "./validation/user-email-available.constraint";

@Module({
    imports: [
        ConfigModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useClass: JwtConfigService,
            inject: [ConfigService]
        }),
        UsersModule
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy, IsUserEmailAvailable],
    controllers: [AuthController]
})
export class AuthModule {}
