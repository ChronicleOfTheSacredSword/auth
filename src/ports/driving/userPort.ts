import { User } from '../../domain/user';
export interface UserPort {
	authentificate(userFromApp: User): Promise<Boolean>;
}