import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { AppPermissions, SwaggerTags } from 'src/config';
import { RoleDto } from './dto/role.dto';
import { ValidationErrorDto } from '../common/dto/validation-error.dto';
import { JwtAuthGuard, PermissionsGuard } from '../auth/guards';
import { RequirePermissions } from '../auth/decorators/required-permission.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('roles')
@ApiTags(SwaggerTags.Roles)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({ description: 'Forbidden' })
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // * -------------------------------------------------------------------------------------------------------------
  // * CREATE NEW ROLE
  // * -------------------------------------------------------------------------------------------------------------
  @Post()
  @RequirePermissions(AppPermissions.CREATE_ROLE)
  @ApiOperation({
    summary: 'Create a new role',
    description: 'This end point creates a new role',
  })
  @ApiOkResponse({
    description: 'The role has been successfully created',
    type: RoleDto,
  })
  @ApiBadRequestResponse({
    description: 'Some of the submitted field have not passed primary validation',
    type: ValidationErrorDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Has not passed the validation for saving in the database',
    type: ValidationErrorDto,
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  // * -------------------------------------------------------------------------------------------------------------
  // * GET ALL ROLES
  // * -------------------------------------------------------------------------------------------------------------
  @Get()
  @RequirePermissions(AppPermissions.READ_ROLE)
  @ApiOperation({
    summary: 'Get all roles',
    description: 'This end point returns all roles',
  })
  @ApiOkResponse({
    description: 'The roles have been successfully returned',
    type: [RoleDto],
  })
  findAll() {
    return this.rolesService.findAll();
  }

  // * -------------------------------------------------------------------------------------------------------------
  // * GET ONE ROLE
  // * -------------------------------------------------------------------------------------------------------------
  @Get(':id')
  @RequirePermissions(AppPermissions.READ_ROLE)
  @ApiOperation({
    summary: 'Get one role',
    description: 'This end point returns one role',
  })
  @ApiOkResponse({
    description: 'The role has been successfully returned',
    type: RoleDto,
  })
  @ApiBadRequestResponse({
    description: 'The id is not a valid UUID',
    type: ValidationErrorDto,
  })
  @ApiNotFoundResponse({
    description: 'The role with the provided id was not found',
    type: ValidationErrorDto,
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the role',
    type: String,
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.findOne(id);
  }

  // * ----------------------------------------------------------------------------------------------------------------
  // * UPDATE ROLE
  // * ----------------------------------------------------------------------------------------------------------------
  @Patch(':id')
  @RequirePermissions(AppPermissions.UPDATE_ROLE)
  @ApiOperation({
    summary: 'Update one role',
    description: 'This end point updates one role',
  })
  @ApiOkResponse({
    description: 'The role has been successfully updated',
    type: RoleDto,
  })
  @ApiBadRequestResponse({
    description: 'The id is not a valid UUID or some of the submitted field have not passed primary validation',
    type: ValidationErrorDto,
  })
  @ApiNotFoundResponse({
    description: 'The role with the provided id was not found',
    type: ValidationErrorDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Has not passed the validation for saving in the database',
    type: ValidationErrorDto,
  })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  // * ----------------------------------------------------------------------------------------------------------------
  // * DELETE ROLE
  // * ----------------------------------------------------------------------------------------------------------------
  @Delete(':id')
  @RequirePermissions(AppPermissions.DELETE_ROLE)
  @ApiOperation({
    summary: 'Delete one role',
    description: 'This end point deletes one role',
  })
  @ApiOkResponse({
    description: 'The role has been successfully deleted',
  })
  @ApiBadRequestResponse({
    description: 'The id is not a valid UUID',
    type: ValidationErrorDto,
  })
  @ApiNotFoundResponse({
    description: 'The role with the provided id was not found',
    type: ValidationErrorDto,
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.remove(id);
  }
  // * ----------------------------------------------------------------------------------------------------------------
  // * ADD USER TO ROLE
  // * ----------------------------------------------------------------------------------------------------------------
  @Post(':roleId/users/:userId')
  @RequirePermissions(AppPermissions.ADD_USER_ROLE)
  @ApiOperation({
    summary: 'Add user to role',
    description: 'This end point adds a user to a role',
  })
  @ApiOkResponse({
    description: 'The user has been successfully added to the role',
  })
  @ApiBadRequestResponse({
    description: 'The id is not a valid UUID',
    type: ValidationErrorDto,
  })
  @ApiNotFoundResponse({
    description: 'The role with the provided id was not found',
    type: ValidationErrorDto,
  })
  async addUserToRole(@Param('roleId', ParseUUIDPipe) roleId: string, @Param('userId', ParseUUIDPipe) userId: string) {
    return this.rolesService.addUserToRole(roleId, userId);
  }

  // * ----------------------------------------------------------------------------------------------------------------
  // * DELETE USER FROM ROLE
  // * ----------------------------------------------------------------------------------------------------------------
  @Delete(':roleId/users/:userId')
  @RequirePermissions(AppPermissions.REMOVE_USER_ROLE)
  @ApiOperation({
    summary: 'Delete user from role',
    description: 'This end point deletes a user from a role',
  })
  @ApiOkResponse({
    description: 'The user has been successfully deleted from the role',
  })
  @ApiBadRequestResponse({
    description: 'The id is not a valid UUID',
    type: ValidationErrorDto,
  })
  @ApiNotFoundResponse({
    description: 'The role with the provided id was not found',
    type: ValidationErrorDto,
  })
  async deleteUserFromRole(
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.rolesService.deleteUserFromRole(roleId, userId);
  }
}
