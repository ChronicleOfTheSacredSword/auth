import { User } from '../../domain/user';
import { UserRepositoryPort } from '../../ports/driven/userRepositoryPort';
import pool from './db';

export class UserRepo implements UserRepositoryPort {
	async findByName(name: string): Promise<User | null> {
		const res = await pool.query(
			`
			SELECT
				id,
				name,
				password
			FROM users
			WHERE name = $1 
			`,
			[name]
		);

		return res.rows[0] ?? null;
	}
}
