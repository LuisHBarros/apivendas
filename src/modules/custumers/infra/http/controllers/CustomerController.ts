import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateCustomerService from '@modules/custumers/services/CreateCustomerService';
import DeleteCustomerService from '@modules/custumers/services/DeleteCustomerService';
import ListCustomerService from '@modules/custumers/services/ListCustomerService';
import UpdateCustomerService from '@modules/custumers/services/UpdateCustomerService';
import ShowCustomerService from '@modules/custumers/services/ShowCustomerService';

export default class CustomersController {

	public async show(request: Request, response: Response): Promise<Response> {
		const { id } = request.params;

    const showCustomer = container.resolve(ShowCustomerService);

    const customer = await showCustomer.execute({ id });

    return response.json(customer);
  }
	public async index(request: Request, response: Response): Promise<Response> {
		const listCustomers = container.resolve(ListCustomerService);

		const customers = await listCustomers.execute();

		return response.json(customers);
	}

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email } = request.body;

    const createCustomer = container.resolve(CreateCustomerService);

    const customer = await createCustomer.execute({
      name,
      email,
    });

    return response.json(customer);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name, email } = request.body;
    const { id } = request.params;

    const updateCustomer = container.resolve(UpdateCustomerService);

    const customer = await updateCustomer.execute({
      id,
      name,
      email,
    });

    return response.json(customer);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteCustomer = container.resolve(DeleteCustomerService);

    await deleteCustomer.execute({ id });

    return response.json([]);
  }
}
