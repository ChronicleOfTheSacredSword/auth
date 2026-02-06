import { Express, Request, Response } from 'express';
import { UserService } from '../../services/userService';
import { User } from '../../domain/user';

export class UserController {
	private service_user: UserService;

	constructor(private readonly userService: UserService) {
		this.service_user = userService;
	}

	async authUser(user: User) {
		return await this.service_user.authenticate(user);
	}
}