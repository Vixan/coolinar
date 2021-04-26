import { Injectable } from '@angular/core';
import {
  PaginationOptions,
  PaginationOptionsAsStrings,
} from 'src/app/pagination/pagination-options.interface';

const DEFAULT_SKIP = 1;
const DEFAULT_TAKE = 16;
const DEFAULT_PAGINATION: PaginationOptions = {
  skip: DEFAULT_SKIP,
  take: DEFAULT_TAKE,
};

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  pagination = DEFAULT_PAGINATION;

  constructor() {}

  get options(): PaginationOptions {
    return {
      skip: this.pagination.skip,
      take: this.pagination.take,
    };
  }

  set options(pagination: PaginationOptions) {
    this.pagination = pagination;
  }

  toZeroIndexed(options: PaginationOptions) {
    return {
      skip: this.getSkip(options),
      take: options.take,
    };
  }

  toString(options: PaginationOptions): PaginationOptionsAsStrings {
    return {
      skip: `${this.getSkip(options)}`,
      take: `${options.take}`,
    };
  }

  private getSkip(options: PaginationOptions): number {
    return options.skip > 0 ? (options.skip - 1) * options.take : 0;
  }
}
