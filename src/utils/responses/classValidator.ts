import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  protected exceptionFactory = (errors: ValidationError[]) => {
    const constraints = getAllConstraints(errors);

    return new BadRequestException({
      status_code: 400,
      error_code: '00',
      message: 'รูปแบบข้อมูลไม่ถูกต้อง',
      errors: constraints,
    });
  };
}

function getAllConstraints(errors: ValidationError[]): string[] {
  const constraints: string[] = [];

  for (const error of errors) {
    if (error.constraints) {
      const constraintValues = Object.values(error.constraints);
      constraints.push(...constraintValues);
    }

    if (error.children) {
      const childConstraints = getAllConstraints(error.children);
      constraints.push(...childConstraints);
    }
  }

  return constraints;
}
