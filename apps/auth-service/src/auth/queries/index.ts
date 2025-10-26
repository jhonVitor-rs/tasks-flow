import { ConfirmUserExistsHandler } from './confirm-user-exists/confirm-user-exists.handler';
import { GetAllUsersHandler } from './get-all-users/get-all-users.handler';
import { GetUserInformationHandler } from './get-user-information/get-user-information.handler';

export const QueryHandlers = [
  ConfirmUserExistsHandler,
  GetUserInformationHandler,
  GetAllUsersHandler,
];
