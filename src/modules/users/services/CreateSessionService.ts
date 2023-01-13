import AppError from "@shared/errors/AppError";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import authConfig from '../../../config/auth'
import { getCustomRepository } from "typeorm"
import User from "../typeorm/entities/User";
import UsersRepository from "../typeorm/repositories/UsersRepository";

interface IRequest{
	email: string,
	password: string
}

interface IResponse{
	userData: {
		name: string,
		email: string,
		id : string
	}
	token : string
}

class CreateSessionService {
	public async execute({ email, password}: IRequest ):Promise<IResponse> {
		const usersRepository = getCustomRepository(UsersRepository);
		const user = await usersRepository.findByEmail(email);

			if (!user) {
			throw new AppError('Incorrect email/password combination', 401);
		}

		const passwordConfirmed = await compare(password, user.password)

		if (!passwordConfirmed) {
			throw new AppError('Incorrect email/password combination', 401);
		}
		const token = sign({}, authConfig.jwt.secret, {
			subject: user.id,
			expiresIn: authConfig.jwt.expiresIn
		} )

		const userData: IResponse["userData"] = {
			id: user.id,
			name: user.name,
			email: user.email
		}

		return {
			userData,
			token
		};
	}
}

export default CreateSessionService
