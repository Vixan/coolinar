export interface Service<T> {
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    create(entity: T): Promise<T>;
    update(entity: T): Promise<T>;
    delete(entity: T): Promise<T>;
}
