import { User } from '../domain/user';
import { UserRepositoryPort } from '../ports/driven/userRepositoryPort';
import { UserPort } from "../ports/driving/userPort";
import bcrypt from "bcrypt";

export class UserService implements UserPort {
  	constructor(private repo: UserRepositoryPort) {}

	async authenticate(userFromApp: User): Promise<{ isAuthenticated: Boolean, userWithID: User | null }> {
		const userFromDb = await this.repo.findByName(userFromApp.name);

		if (!userFromDb) {
			return { isAuthenticated: false, userWithID: null };
		}

		const passwordMatches = await bcrypt.compare(
			userFromApp.password!,
			userFromDb.password!
		);
		if (passwordMatches) {
			delete userFromDb.password;
			return { isAuthenticated: true, userWithID: userFromDb };
		}
		return { isAuthenticated: false, userWithID: null };
	}


}
