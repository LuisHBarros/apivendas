import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import { IUserToken } from '../../models/IUserToken';
import { IUserTokensRepository } from '../IUserTokenRepository';
import { v4 as uuidv4 } from 'uuid';
import { addHours, subHours } from 'date-fns';

export class FakeUserTokensRepository implements IUserTokensRepository {
	private tokens: UserToken[] = [];

	public async findByToken(token: string): Promise<UserToken | undefined> {
		return this.tokens.find(t => t.token === token);
	}
	public async delete(userToken: IUserToken): Promise<void> {}

	public async generate(user_id: string): Promise<UserToken> {
		const userToken = new UserToken();
		userToken.id = await uuidv4();
		userToken.user_id = user_id;
		userToken.token = await uuidv4();
		this.tokens.push(userToken);
		return userToken;
	}
	public add5Hours(userToken: IUserToken): IUserToken {
		const findIndex = this.tokens.findIndex(
			userToken => userToken.user_id === userToken.user_id,
		);
		userToken.created_at = subHours(Date.now(), 5);
		this.tokens[findIndex] = userToken;
		return userToken;
	}
}
