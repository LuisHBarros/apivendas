import { getCustomRepository } from "typeorm"
import User from "../typeorm/entities/User";
import UsersRepository  from "../typeorm/repositories/UsersRepository"



class ListProductService {
	public async execute():Promise<User[]> {
		const usersRepository = getCustomRepository(UsersRepository);



		const users = await usersRepository.find()

		return users;
	}
}

export default ListProductService
