export class User {
	id?: number;
	name: string;
	password?: string;

	constructor(name: string, password?: string, id?: number) {
		this.id = id;
		this.name = name;
		this.password = password;
	}
}
