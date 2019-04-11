import { PaginationResult } from './pagination-result.interface';

export class Pagination<T> {
  public results: T[];
  public count: number;
  public total: number;

  constructor(paginationResults: PaginationResult<T>) {
    this.results = paginationResults.results;
    this.count = paginationResults.results.length;
    this.total = paginationResults.total;
  }
}
