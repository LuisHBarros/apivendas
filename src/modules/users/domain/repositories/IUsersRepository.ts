import { ICreateUser } from '../models/ICreateUser';
import { IUser } from '../models/IUsers';

export interface IUsersRepository{
	findAll(): Promise<IUser[]>;
	findById(id: string): Promise<IUser | undefined>;
	findByName(name: string): Promise<IUser | undefined>;
	findByEmail(email: string): Promise<IUser | undefined>;
	create(data: ICreateUser): Promise<IUser>;
	save(user: IUser): Promise<IUser>;


}
