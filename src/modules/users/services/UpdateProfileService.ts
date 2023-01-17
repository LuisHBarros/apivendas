import AppError from "@shared/errors/AppError";
import { compare, hash } from "bcryptjs";
import { inject, injectable } from "tsyringe";
import { IUpdateProfile } from "../domain/models/IUpdateProfile";
import { IUser } from "../domain/models/IUsers";
import { IUsersRepository } from "../domain/repositories/IUsersRepository";

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}
	public async execute({
		user_id,
		name,
		email,
    password,
    old_password,
	}: IUpdateProfile): Promise<IUser> {

		const user = await this.usersRepository.findById(user_id)

		if (!user) {
			throw new AppError("User not found", 404)
		}

		const userUpdateEmail = await this.usersRepository.findByEmail(email);

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
		await this.usersRepository.save(user)

    return user
  }
}

export default UpdateProfileService
