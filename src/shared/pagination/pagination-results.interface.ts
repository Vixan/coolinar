export interface PaginationResults<T> {
  results: T[];
  total: number;
  next?: string;
  previous?: string;
}
