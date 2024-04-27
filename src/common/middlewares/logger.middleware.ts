import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const startTime = Date.now();
    const userAgent = request.get('user-agent') || '';
    response.on('finish', () => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      this.logger.log(
        `metod-${method} url-${originalUrl} status-${statusCode} length-${contentLength} userAgent-${userAgent} ipAddress-${ip} responseTime-${responseTime}ms`,
      );
    });
    next();
  }
}
