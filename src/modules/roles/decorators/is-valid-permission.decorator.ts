import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';
import { Permissions } from 'src/config';

export function IsValidPermission(validationOptions?: ValidationOptions) {
  return (target: object, propertyName: string) => {
    registerDecorator({
      name: 'isValidPermission',
      target: target.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return Object.values(Permissions).includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} contains an invalid permission`;
        },
      },
    });
  };
}
