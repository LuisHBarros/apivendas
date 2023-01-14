import AppError from "@shared/errors/AppError";
import {  getCustomRepository } from "typeorm";
import Customer from "../typeorm/entities/Customer";
import CustomersRepository from "../typeorm/entities/repositories/customersRepository";

interface Irequest {
	name: string;
	email: string;
}

class CreateCustomerService {
	public async execute({ name, email }: Irequest): Promise<Customer> {
		const customersRepository = getCustomRepository(CustomersRepository);
		const emailExists = await customersRepository.findByEmail(email);
		if (emailExists) {
			throw new AppError("Email already used", 400);
		}
		const customer = customersRepository.create({
			name,
			email
		})

		return customer;
	}
}

export default CreateCustomerService;
