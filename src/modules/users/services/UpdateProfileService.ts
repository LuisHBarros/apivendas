import AppError from "@shared/errors/AppError";
import { compare, hash } from "bcryptjs";
import { getCustomRepository } from "typeorm"
import User from "../typeorm/entities/User";
import UsersRepository  from "../typeorm/repositories/UsersRepository"

interface IRequest{
	user_id: string;
	name: string,
	email: string,
	password?: string,
	old_password?: string,
}

class UpdateProfileService {
	public async execute({
		user_id,
		name,
		email,
    password,
    old_password,
	}: IRequest): Promise<User> {
		const usersRepository = getCustomRepository(UsersRepository);

		const user = await usersRepository.findOne(user_id)

		if (!user) {
			throw new AppError("User not found", 404)
		}

		const userUpdateEmail = await usersRepository.findByEmail(email);

		if (userUpdateEmail && email !== user.email) {
			throw new AppError("Email already registered", 404)
		}
		if (password && old_password) {
			if (await compare(old_password, user.password)) {
				throw new AppError("Old password is not correct", 400)
			}
			user.password = await hash(password, 8)
		}

		user.name = name;
		user.email = email;
		await usersRepository.save(user)

    return user
  }
}

export default UpdateProfileService
