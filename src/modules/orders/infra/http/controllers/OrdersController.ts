import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateOrderService from '@modules/orders/services/CreateOrderService';
import ShowOrderService from '@modules/orders/services/ShowOrderService';

export default class OrdersController {
	public async show(request: Request, response: Response): Promise<Response> {
		const showOrderService = container.resolve(ShowOrderService);

		const { id } = request.params;
		const order = await showOrderService.execute(id);

		return response.json(order);
	}

	public async create(request: Request, response: Response): Promise<Response> {
		const createOrderService = container.resolve(CreateOrderService);

		const { customer_id, products } = request.body;

		const order = await createOrderService.execute({ customer_id, products });

		return response.json(order);
	}
}
