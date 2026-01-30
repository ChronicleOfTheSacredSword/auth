import { User } from '../../domain/user';

export interface UserRepositoryPort {
  findByName(name: string): Promise<User | null>;
}