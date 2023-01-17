import { IUserToken } from "@modules/users/domain/models/IUserToken";
import { IUserTokensRepository } from "@modules/users/domain/repositories/IUserTokenRepository";
import { Repository, getRepository } from "typeorm";
import UserToken from "../entities/UserToken";

class UserTokensRepository implements IUserTokensRepository {
	private ormRepository: Repository<UserToken>;
	constructor() {
		this.ormRepository = getRepository(UserToken);
	}
	public async findByToken(token: string): Promise<UserToken | undefined> {
		const userToken = await this.ormRepository.findOne({
			where: {
				token,
			}
		})

		return userToken;
	}

		public async generate(user_id: string): Promise<UserToken> {
			const userToken = this.ormRepository.create({ user_id })
			await this.ormRepository.save(userToken)

		return userToken;
		}
	public async delete(userToken: IUserToken): Promise<void>{
		await this.ormRepository.remove(userToken)
	}
}

export default UserTokensRepository
