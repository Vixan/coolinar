import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Config } from './interfaces/config.interface';
import { InternalServerErrorException, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

/**
 * Injectable service for configuration logic.
 *
 * @export
 * @class ConfigService
 */
@Injectable()
export class ConfigService {
  /**
   * Configuration from the evironment variables file.
   *
   * @type {Config}
   * @memberof ConfigService
   */
  private envConfig: Config = null;

  constructor(configFilePath: string) {
    this.readConfigFile(configFilePath)
      .then(config => {
        this.envConfig = config;
      })
      .catch(error => {
        this.envConfig = new Config();
        console.log(error.message);
        console.log('Configuration file invalid. Using default values.');
      });
  }

  /**
   * Read the environment variables file.
   *
   * @param {string} configFilePath Environment variables filepath.
   * @returns {Promise<Config>} Promise of the configuration read
   * from the specified enviroment variables file.
   * @memberof ConfigService
   */
  private async readConfigFile(configFilePath: string): Promise<Config> {
    const configObject = dotenv.parse(fs.readFileSync(configFilePath));

    return this.validateConfigFile(configObject);
  }

  /**
   * Validate the environment variables configuration file.
   *
   * @param {*} configObject Configuration read from file.
   * @returns {Promise<Config>} Promise of the Configuration if 
   * validation passes
   * @memberof ConfigService
   */
  private async validateConfigFile(configObject: any): Promise<Config> {
    const config = plainToClass(Config, configObject as Config);
    const validationErrors = await validate(config);

    if (validationErrors.length > 0) {
      throw new InternalServerErrorException({
        errors: this.toErrors(validationErrors),
      });
    }

    return config;
  }

  /**
   * Collect validation errors into an object.
   *
   * @param {ValidationError[]} errors Validation errors created by class-validator.
   * @returns {*} Object with all validation errors as keys.
   * @memberof ConfigService
   */
  private toErrors(errors: ValidationError[]): any {
    return errors.reduce((acc, error) => {
      acc[error.property] = Object.values(error.constraints);
      return acc;
    }, {});
  }

  public get port(): number {
    return this.envConfig.PORT;
  }

  public get jwtSecret() {
    return this.envConfig.JWT_SECRET;
  }

  public get jwtExpiration() {
    return this.envConfig.JWT_EXPIRATION;
  }

  public get hashSaltRounds() {
    return this.envConfig.HASH_SALT_ROUNDS;
  }
}
