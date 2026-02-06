import { User } from '../../domain/user';
export interface UserPort {
	authenticate(userFromApp: User): Promise<{ isAuthenticated: Boolean, userWithID: User | null }>;
}