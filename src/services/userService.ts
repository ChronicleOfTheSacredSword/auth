import { User } from '../domain/user';
import { UserRepositoryPort } from '../ports/driven/userRepositoryPort';
import { UserPort } from "../ports/driving/userPort";
import bcrypt from "bcrypt";

export class UserService implements UserPort {
  	constructor(private repo: UserRepositoryPort) {}

	async authentificate(userFromApp: User): Promise<boolean> {
		console.log("userFromApp", userFromApp);
		const userFromDb = await this.repo.findByName(userFromApp.name);

		console.log("userFromDb", userFromDb);

		if (!userFromDb) return false;

		const passwordMatches = await bcrypt.compare(
			userFromApp.password!,
			userFromDb.password!
		);

		return passwordMatches;
	}

}
