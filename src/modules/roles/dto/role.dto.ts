import { ApiProperty } from '@nestjs/swagger';
import { Permissions } from 'src/config';

export class RoleDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The id of the role' })
  id: string;

  @ApiProperty({ example: 'admin', description: 'The name of the role' })
  name: string;

  @ApiProperty({
    description: 'The permissions of the role',
    example: [Permissions.READ_ROLE, Permissions.CREATE_ROLE, Permissions.UPDATE_ROLE, Permissions.DELETE_ROLE],
    isArray: true,
    enum: Permissions,
    required: false,
  })
  permissions: Permissions[];
}
