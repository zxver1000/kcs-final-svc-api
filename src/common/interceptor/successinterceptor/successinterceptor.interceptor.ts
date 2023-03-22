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

      //* get destination from multerOptions

      return next.handle().pipe(
        map((data) => {
          return this.setDataAsMicroserviceDataWrapper(data);
        }),
      );
      // ({ ...data, result: uploadedArray })));
    }

    setDataAsMicroserviceDataWrapper(postResult): MicroserviceDataWrapper {
      const success = postResult !== null;
      const code = success ? successCode : HttpStatus.NO_CONTENT;

      if (typeof postResult === 'number') {
        if (postResult >= 200 && postResult < 400) {
          return {
            success: true,
            code: postResult,
          };
        }

        return {
          success: false,
          code: postResult,
        };
      }

      this.logger.debug('postResult:', postResult);

      if (!postResult.length) {
        postResult = [postResult];
      }

      const result = [];
      for (let i = 0; i < postResult.length; i++) {
        const _file = postResult[i];
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
