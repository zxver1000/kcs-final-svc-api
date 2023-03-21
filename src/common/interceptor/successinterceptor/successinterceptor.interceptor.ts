import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Logger,
  mixin,
  NestInterceptor,
  Type,
} from '@nestjs/common';

import { map, Observable } from 'rxjs';
import { MicroserviceDataWrapper } from '../../../common/data/microservice.dto';

export function SuccessInterceptor(
  successCode: HttpStatus,
): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    private logger = new Logger('SuccessInterceptor');
    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const ctx = context.switchToRpc();
      const rpcData = ctx.getData();
      const uploadedArray = [];

      //* get destination from multerOptions

      return next.handle().pipe(
        map((data) => {
          return this.setDataAsMicroserviceDataWrapper(data);
        }),
      );
      // ({ ...data, result: uploadedArray })));
    }

    setDataAsMicroserviceDataWrapper(PostResult): MicroserviceDataWrapper {
      const success = PostResult !== null;
      const code = success ? successCode : HttpStatus.NO_CONTENT;

      if (typeof PostResult === 'number') {
        if (PostResult >= 200 && PostResult < 400) {
          return {
            success: true,
            code: PostResult,
          };
        }

        return {
          success: false,
          code: PostResult,
        };
      }

      if (!PostResult.length) {
        PostResult = [PostResult];
      }

      const result = [];
      for (let i = 0; i < PostResult.length; i++) {
        const _file = PostResult[i];
        result.push(_file);
      }

      return {
        success,
        code,
        result,
      };
    }
  }
  const Interceptor = mixin(MixinInterceptor);
  return Interceptor;
}
