import AppError from "@shared/errors/AppError";
import { hash } from "bcryptjs";
import { getCustomRepository } from "typeorm"
import User from "../typeorm/entities/User";
import UsersRepository from "../typeorm/repositories/UsersRepository";

interface IRequest{
	name: string,
	email: string,
	password: string
}


class CreateUserService {
	private regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
	public async execute({name, email, password}: IRequest ):Promise<User> {
		const usersRepository = getCustomRepository(UsersRepository);
		const userExists = await usersRepository.findByEmail(email);

		if (userExists) {
			throw new AppError('There is already one account with this email');
		}
		if(!this.regex.test(password)){
            throw new AppError("a password needs at least 8 characters, between letters(uppercases and lowercases) and numbers");
		}

		const hashPassword = await hash(password, 8)

		const user = usersRepository.create({
			name,
			email,
			password: hashPassword
		})
		await usersRepository.save(user);

		return user;
	}
}

export default CreateUserService
