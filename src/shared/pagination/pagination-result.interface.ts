export interface PaginationResult<T> {
  results: T[];
  total: number;
  next?: string;
  previous?: string;
}
