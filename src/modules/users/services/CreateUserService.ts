import AppError from "@shared/errors/AppError";
import { hash } from "bcryptjs";
import { inject, injectable } from "tsyringe";
import { ICreateUser } from "../domain/models/ICreateUser";
import { IUser } from "../domain/models/IUsers";
import { IUsersRepository } from "../domain/repositories/IUsersRepository";

@injectable()
class CreateUserService {
	private regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}
	public async execute({name, email, password}: ICreateUser ):Promise<IUser> {
		const userExists = await this.usersRepository.findByEmail(email);

		if (userExists) {
			throw new AppError('There is already one account with this email');
		}
		if(!this.regex.test(password)){
            throw new AppError("a password needs at least 8 characters, between letters(uppercases and lowercases) and numbers");
		}

		const hashPassword = await hash(password, 8)

	return this.usersRepository.create({
			name,
			email,
			password: hashPassword
		})

	}
}

export default CreateUserService
