import AppError from "@shared/errors/AppError";
import { injectable, inject } from "tsyringe";
import { ICreateCustomer } from "../domain/models/ICreateCustomer";
import { ICustomer } from "../domain/models/ICustomer";
import {ICustomersRepository} from "../domain/repositories/ICustomersRepository";

@injectable()
class CreateCustomerService {

	constructor(
		@inject("CustomersRepository")
		private customerRepository: ICustomersRepository) { }

	public async execute({ name, email }: ICreateCustomer): Promise<ICustomer> {
		const emailExists = await this.customerRepository.findByEmail(email);
		if (emailExists) {
			throw new AppError("Email already used", 400);
		}
		const customer = await this.customerRepository.create({
			name,
			email
		})
		return customer;
	}
}

export default CreateCustomerService;
