import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export const APP_CONFIG_FILE_PATH = '/assets/app.config.json';

interface Config {
  apiBaseUrl: string;
  accessTokenName: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: Config;

  constructor(private http: HttpClient) {}

  load() {
    return this.http
      .get(APP_CONFIG_FILE_PATH)
      .toPromise()
      .then((config: Config) => (this.config = config))
      .catch(_ => {
        throw new Error('App configuration file could not be loaded');
      });
  }

  get apiEndpointUrl() {
    return this.config.apiBaseUrl;
  }

  get accessTokenName() {
    return this.config.accessTokenName;
  }
}
