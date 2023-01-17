import { inject, injectable } from "tsyringe";
import { IUser } from "../domain/models/IUsers";
import { IUsersRepository } from "../domain/repositories/IUsersRepository";



@injectable()
class ListProductService {
	  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}
	public async execute():Promise<IUser[]> {

		const users = await this.usersRepository.findAll()

		return users;
	}
}

export default ListProductService
