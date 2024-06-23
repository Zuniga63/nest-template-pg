import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 'Jhon Doe' })
  name: string;

  @ApiProperty({ example: 'jhondoe@email.com' })
  email: string;

  @ApiProperty({ example: null, nullable: true })
  profilePhotoPath: string | null;

  @ApiProperty({ example: null, nullable: true })
  emailVerifiedAt: string | null;

  @ApiProperty({ example: 'df5e7f56-ce51-4428-9d43-84e35a077618' })
  id: string;

  @ApiProperty({ example: false })
  isSuperUser: boolean;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2024-06-23T05:13:57.328Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-06-23T05:13:57.328Z' })
  updatedAt: string;
}
