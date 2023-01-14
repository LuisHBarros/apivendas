import UpdateProductService from "@modules/products/services/UpdateProductService";
import { Request, Response } from "express";
import CreateCustomerService from "../services/CreateCustomerService";
import DeleteCustomerService from "../services/DeleteCustomerService";
import ListCustomerService from "../services/ListCustomerService";
import UpdateCustomerService from "../services/UpdateCustomerService";

export default class CustomersController {
	public async show(request: Request, response: Response): Promise<Response> {
		const listUsers = new ListCustomerService()
		const customers = await listUsers.execute()

		return response.json(customers);
	}
	public async create(request: Request, response: Response): Promise<Response> {
		const { name, email } = request.body;

		const createCustomer = new CreateCustomerService();

		const customer = await createCustomer.execute({ name, email });

		return response.json(customer)
	}
	public async update(request: Request, response: Response): Promise<Response> {
		const { id, name, email } = request.body;

		const updateCostumer = new UpdateCustomerService();
		const customer = await updateCostumer.execute({ id, name, email });

		return response.json(customer);
	}
	public async delete(request: Request, response: Response): Promise<Response> {
		const { id } = request.params;

		const deleteCustomer = new DeleteCustomerService();
		await deleteCustomer.execute({ id });

		return response.json([])
	}
}
