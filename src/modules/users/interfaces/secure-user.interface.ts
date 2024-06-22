import { User } from '../entities/user.entity';

export type SecureUser = Omit<User, 'password'>;
