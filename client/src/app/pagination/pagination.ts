import { PaginationResults } from './pagination-results.interface';

export class Pagination<T> {
  results: T[] = [];
  count = 0;
  total = 0;

  constructor(params?: Partial<PaginationResults<T>>) {
    Object.assign(this, params);
  }
}
