import AppError from "@shared/errors/AppError";
import { compare, hash } from "bcryptjs";
import { inject, injectable } from "tsyringe";
import { getCustomRepository } from "typeorm"
import { ICustomer } from "../domain/models/ICustomer";
import { IUpdateCustomer } from "../domain/models/IUpdateCustomer";
import {ICustomersRepository} from "../domain/repositories/ICustomersRepository";

@injectable()
class UpdateCustomerService {
		constructor(
			@inject
			("CustomersRepository")
			private customerRepository: ICustomersRepository) { }

	public async execute({ id, name,email }: IUpdateCustomer): Promise<ICustomer> {

		const customer = await this.customerRepository.findById(id)

		if (!customer) {
			throw new AppError("Customer not found", 404)
		}

		const customerUpdateEmail = await this.customerRepository.findByEmail(email);

		if (customerUpdateEmail && email !== customer.email) {
			throw new AppError("Email already registered", 404)
		}
		customer.name = name;
		customer.email = email;
		await this.customerRepository.save(customer)

    return customer
  }
}

export default UpdateCustomerService
