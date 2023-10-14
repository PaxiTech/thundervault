import { Catch, ArgumentsHost, HttpException, HttpStatus, LoggerService } from '@nestjs/common';
import { Response } from 'express';
import { AppException } from '@src/common/exceptions/app.exception';
import { BaseExceptionFilter } from '@nestjs/core';
import * as _ from 'lodash';
//import { I18nContext, I18nTranslation } from 'nestjs-i18n';

@Catch()
export class AppExceptionFilter extends BaseExceptionFilter {
  private appLogger: LoggerService;
  constructor(logger: LoggerService) {
    super();
    this.appLogger = logger;
  }

  async catch(exception: any, host: ArgumentsHost) {
    //const i18n = I18nContext.current<I18nTranslation>(host);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>() as any;
    const { code, status, message, data } = this._parseError(exception);
    // const messageTranslate = i18n.service.translate(message as never, {
    //   lang: i18n.lang,
    // });
    const messageTranslate = message;
    response.status(status).json({
      status: status,
      error: {
        code,
        message: messageTranslate,
      },
      data: {
        result: data,
      },
    });

    // skip log for testing environment
    if (process.env.NODE_ENV !== 'test') {
      this.appLogger.error(message, exception.stack);
    }
  }

  private _parseError(exception: unknown): {
    code: string;
    message: string;
    status: number;
    data: any;
  } {
    let code = '';
    let message = '';
    let data = {};
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    // Handle AppException
    if (exception instanceof AppException) {
      code = exception.code;
      status = exception.httpStatus;
      message = exception.message;
      data = exception.data;
    }

    // Handle HttpException
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseData = exception.getResponse();
      if (typeof responseData === 'string') {
        message = responseData;
      } else {
        message = 'internal error';
        if (typeof _.get(responseData, 'message') === 'string') {
          message = _.get(responseData, 'message');
        }
        if (typeof _.get(responseData, 'error') === 'string') {
          code = _.get(responseData, 'error');
        }
        data = responseData;
      }
    }

    // Handle general error
    if (message === '') {
      const error = exception as Error;
      message = error.message;
    }

    return {
      code,
      status,
      message,
      data,
    };
  }
}
