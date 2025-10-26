import { LoginUserHandler } from './login-user/login-user.handler';
import { RefreshAccessTokenHandler } from './refresh-access-token/refresh-access-token.handler';
import { RegisterUserHandler } from './register-user/register-user.handler';

export const CommandHandlers = [
  RegisterUserHandler,
  LoginUserHandler,
  RefreshAccessTokenHandler,
];
