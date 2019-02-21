export interface Service<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T>;
  add(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(entity: T): Promise<T>;
}
