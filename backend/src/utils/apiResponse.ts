import { Request, Response, NextFunction } from 'express';

export enum StatusCodes {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHENTICATED = 401,
  UNAUTHORIZED = 403,
  NOT_FOUND = 404,
  INVALID_INPUT = 406,
  INTERNAL_SERVER_ERROR = 500,
}

const errorTypes = {
  200: 'Success',
  201: 'Created',
  400: 'Bad Request',
  401: 'Unauthenticated',
  403: 'Unauthorized',
  404: 'Not Found',
  406: 'Input Validation Error',
  500: 'Internal Server Error',
};

export type StatusCodesType = keyof typeof errorTypes;

export class ApiError {
  statusCode: StatusCodesType;
  errCode: string | null;
  type: string;
  message: string;
  data: unknown | null;

  constructor(
    statusCode: StatusCodesType = 500,
    info: { code?: string; message?: string } = {},
    data: unknown = null,
    type?: string
  ) {
    this.statusCode = statusCode;
    this.errCode = info.code || null;
    this.type = type || errorTypes[statusCode] || errorTypes[500];
    this.message = info.message || errorTypes[statusCode];
    this.data = data;
  }
}

// Middleware to Catch Async Errors
export const catchApiError =
  (
    fn: (req: Request, res: Response, next?: NextFunction) => Promise<unknown>
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      if (err instanceof ApiError) {
        return res.status(err.statusCode).json(err);
      }
      // Handle unexpected errors
      console.error('Unexpected error:', err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, {
            message: 'Internal Server Error',
          })
        );
    }
  };

// Standard Success Response
export const successResponse = (
  res: Response,
  data: unknown,
  message = 'Operation Successful'
) => {
  return res.status(StatusCodes.SUCCESS).json({
    statusCode: StatusCodes.SUCCESS,
    message,
    data,
  });
};

// Route Not Found Response
export const routeNotFound = (req: Request, res: Response) => {
  return res.status(StatusCodes.NOT_FOUND).json({
    statusCode: StatusCodes.NOT_FOUND,
    message: 'Route not found',
  });
};

// Application is Live Response
export const appIsLive = (req: Request, res: Response) => {
  return res.status(StatusCodes.SUCCESS).json({
    statusCode: StatusCodes.SUCCESS,
    message: 'App is live',
  });
};
