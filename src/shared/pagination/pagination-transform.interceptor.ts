import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
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

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        if (!data || !data.results) {
          return data;
        }

        const results = plainToClass(this.classType, data.results);

        return {
          ...data,
          results,
        };
      }),
    );
  }
}
