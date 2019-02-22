import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Config } from './interfaces/config.interface';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

export class ConfigService {
  private envConfig: Config;

  constructor(configFilePath: string) {
    this.readConfigFile(configFilePath)
      .then(config => {
        this.envConfig = config;
      })
      .catch(error => {
        throw new Error(error);
      });
  }

  private async readConfigFile(configFilePath: string) {
    const configObject = dotenv.parse(fs.readFileSync(configFilePath));

    return this.validateConfigFile(configObject);
  }

  private async validateConfigFile(configObject: any) {
    const config = plainToClass(Config, configObject as Config);
    const validationErrors = await validate(config);

    if (validationErrors.length > 0) {
      throw new InternalServerErrorException({
        errors: this.toErrors(validationErrors),
      });
    }

    return config;
  }

  private toErrors(errors: ValidationError[]) {
    return errors.reduce((acc, error) => {
      acc[error.property] = Object.values(error.constraints);
      return acc;
    }, {});
  }

  public get port() {
    return this.envConfig.PORT;
  }

  public get jwtSecret() {
    return this.envConfig.JWT_SECRET;
  }

  public get jwtExpiration() {
      return this.envConfig.JWT_EXPIRATION;
  }
}
