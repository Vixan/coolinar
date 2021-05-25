import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException
} from "@nestjs/common";
import { Request, Response } from "express";

export interface HttpExceptionResponse {
    statusCode: number;
    timestamp: string;
    path: string;
    method: string;
    message: any;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();
        const statusCode = exception.getStatus();
        const exceptionResponse: HttpExceptionResponse = {
            statusCode,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: exception.message || null
        };

        response.status(statusCode).json(exceptionResponse);
    }
}
