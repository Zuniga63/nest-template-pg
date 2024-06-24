export enum Permissions {
  // ---------------------------------------------------------------
  // USERS PERMISSIONS
  // ---------------------------------------------------------------
  READ_USERS = 'READ_USERS',
  CREATE_NEW_USER = 'CREATE_NEW_USER',
  UPDATE_USER = 'UPDATE_USER',
  READ_USER = 'READ_USER',
  DELETE_USER = 'DELETE_USER',

  // ---------------------------------------------------------------
  // ROLES PERMISSIONS
  // ---------------------------------------------------------------
  CREATE_ROLE = 'CREATE_ROLE',
  READ_ROLE = 'READ_ROLE',
  UPDATE_ROLE = 'UPDATE_ROLE',
  DELETE_ROLE = 'DELETE_ROLE',
  ADD_ROLE_TO_USER = 'ADD_ROLE_TO_USER',
  REMOVE_ROLE_TO_USER = 'REMOVE_ROLE_TO_USER',
  UPDATE_ROLE_PERMISSIONS = 'UPDATE_ROLE_PERMISSIONS',
}
