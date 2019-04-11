import { Injectable, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { Pagination } from './pagination';

interface ClassType<T> {
  new (): T;
}

@Injectable()
export class PaginationTransformInterceptor<T>
  implements NestInterceptor<Partial<Pagination<T>>, T> {
  constructor(private readonly classType: ClassType<T>) {}

  intercept(
    context: ExecutionContext,
    call$: Observable<Partial<Pagination<T>>>,
  ): Observable<any> {
    return call$.pipe(
      map(data => {
        const results = plainToClass(this.classType, data.results);

        return {
          ...data,
          results,
        };
      }),
    );
  }
}
