import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { getCustomRepository } from "typeorm"
import { IDeleteCustomer } from "../domain/models/IDeleteCustomer";
import {ICustomersRepository} from "../domain/repositories/ICustomersRepository";


@injectable()
class DeleteCustomerService {
		constructor(
		@inject("CustomersRepository")
			private customerRepository: ICustomersRepository) { }

	public async execute({ id: user_id }: IDeleteCustomer): Promise<void> {


		const customer = await this.customerRepository.findById(user_id)

		if (!customer) {
			throw new AppError("Customer not found", 404)
    }
		await this.customerRepository.delete(customer)

	}
}

export default DeleteCustomerService
