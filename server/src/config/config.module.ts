import * as Joi from "@hapi/joi";
import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { JwtConfigService } from "src/auth/strategies/jwt/jwt-config.service";
import { ApiConfigService } from "./api-config.service";
import { DbConfigService } from "./db-config.service";

@Module({
    imports: [
        NestConfigModule.forRoot({
            validationSchema: Joi.object({
                NODE_ENV: Joi.string()
                    .valid("development", "production")
                    .default("development"),
                API_PORT: Joi.number().default(4100),
                API_GLOBAL_PREFIX: Joi.string().default("api"),
                DB_TYPE: Joi.string()
                    .valid("postgres", "mysql", "mariadb", "mssql")
                    .required(),
                DB_HOST: Joi.string().required(),
                DB_PORT: Joi.number().required(),
                DB_USERNAME: Joi.string().required(),
                DB_PASSWORD: Joi.string().required(),
                DB_NAME: Joi.string().required(),
                DB_SYNCHRONIZE: Joi.boolean().default(false),
                JWT_SECRET: Joi.string().required(),
                JWT_EXPIRATION: Joi.alternatives(
                    Joi.number(),
                    Joi.string()
                ).default("1d")
            })
        })
    ],
    providers: [ApiConfigService, DbConfigService, JwtConfigService],
    exports: [ApiConfigService, DbConfigService, JwtConfigService]
})
export class ConfigModule {}
