import AppError from "@shared/errors/AppError";
import { compare, hash } from "bcryptjs";
import { getCustomRepository } from "typeorm"
import Customer from "../typeorm/entities/Customer";
import CustomersRepository from "../typeorm/entities/repositories/customersRepository";

interface IRequest{
	id: string;
	name: string,
	email: string,
}

class UpdateCustomerService {
	public async execute({ id, name,email }: IRequest): Promise<Customer> {
		const customerRepository = getCustomRepository(CustomersRepository);

		const customer = await customerRepository.findOne(id)

		if (!customer) {
			throw new AppError("Customer not found", 404)
		}

		const customerUpdateEmail = await customerRepository.findByEmail(email);

		if (customerUpdateEmail && email !== customer.email) {
			throw new AppError("Email already registered", 404)
		}
		customer.name = name;
		customer.email = email;
		await customerRepository.save(customer)

    return customer
  }
}

export default UpdateCustomerService
