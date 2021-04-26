export interface HttpExceptionResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: any;
}
