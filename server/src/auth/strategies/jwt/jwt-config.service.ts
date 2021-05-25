import { JwtOptionsFactory, JwtModuleOptions } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import { ApiConfigService } from "src/config/api-config.service";

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
    constructor(private readonly configService: ApiConfigService) {}

    createJwtOptions(): JwtModuleOptions | Promise<JwtModuleOptions> {
        const secret = this.configService.jwtSecret;
        const expiresIn = this.configService.jwtExpiration;

        return {
            secret,
            signOptions: {
                expiresIn
            }
        };
    }
}
