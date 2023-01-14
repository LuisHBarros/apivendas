import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm"
import Customer from "../typeorm/entities/Customer";
import CustomersRepository from "../typeorm/entities/repositories/customersRepository";

interface IRequest{
	id: string;
}

class ShowCustomerService {
	public async execute({id: user_id}: IRequest):Promise<Customer> {
		const customersRepository = getCustomRepository(CustomersRepository);

		const customer = await customersRepository.findOne(user_id)

		if (!customer) {
			throw new AppError("Customer not found", 404)
    }

		return customer;
	}
}

export default ShowCustomerService
