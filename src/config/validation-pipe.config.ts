import { BadRequestException, ValidationPipeOptions, ValidationError } from '@nestjs/common';

export const validationPipeConfig: ValidationPipeOptions = {
  validationError: { target: true, value: true },

  whitelist: true, // Elimina las propiedades no especificadas en los DTO

  forbidNonWhitelisted: true, // Lanza una excepción si se encuentran propiedades no permitidas

  stopAtFirstError: true, // Detiene la validación en el primer error encontrado

  exceptionFactory(errors: ValidationError[]) {
    const validationErrors = errors.reduce(
      (acc, validationError) => {
        const { property, value, constraints, children } = validationError;
        let message = '';

        if (constraints) {
          message = Object.values(constraints).join(' ').trim();
        }

        if (children && children.length > 0) {
          acc[property] = {
            message: 'Validation failed in nested objects',
            value,
            children: this.mapChildrenErrors(children),
          };
        } else {
          acc[property] = { message, value };
        }

        return acc;
      },
      {} as Record<string, { message: string; value: any; children?: any }>,
    );

    return new BadRequestException({ validationErrors });
  },
};
