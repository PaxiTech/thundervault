import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const status = context.switchToHttp().getResponse().statusCode;
    return next.handle().pipe(
      map((data) => {
        if (_.isString(data) || _.isArray(data)) {
          if (data?.docs) {
            return {
              status: status,
              data: {
                docs: data,
              },
            };
          } else {
            return {
              status: status,
              data: data,
            };
          }
        }
        return {
          status: status,
          data: data,
        };
      }),
    );
  }
}
