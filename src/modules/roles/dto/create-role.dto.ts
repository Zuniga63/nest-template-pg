import { IsArray, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { IsValidPermission } from '../decorators/is-valid-permission.decorator';
import { Permissions } from 'src/config';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    example: 'Admin',
    description: 'The name of the role',
    minLength: 3,
    maxLength: 50,
  })
  @MaxLength(50)
  @MinLength(3)
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The permissions of the role',
    example: [Permissions.READ_ROLE, Permissions.CREATE_ROLE, Permissions.UPDATE_ROLE, Permissions.DELETE_ROLE],
    isArray: true,
    enum: Permissions,
    required: false,
  })
  @IsValidPermission({ message: 'One or more permissions are invalid', each: true })
  @IsNotEmpty()
  @IsArray()
  @IsOptional()
  permissions: Permissions[];
}
