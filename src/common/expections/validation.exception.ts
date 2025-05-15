import { BadRequestException } from '@nestjs/common';

export class ValidationErrorException extends BadRequestException {
  constructor(message: string, public readonly validationErrors?: any) {
    super({
      statusCode: 400,
      message
    });
  }
}