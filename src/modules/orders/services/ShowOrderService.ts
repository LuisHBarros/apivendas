import { inject, injectable } from 'tsyringe';
import AppError from "@shared/errors/AppError";
import { IOrdersRepository } from '../domain/repositories/IOrdersRepository';
import { IOrder } from '../domain/models/IOrder';


@injectable()
class ShowOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
  ) {}
	public async execute(order_id: string): Promise<IOrder> {

		const order = await this.ordersRepository.findById(order_id);

		if (!order)
			throw new AppError("Customer not found", 404)

		return order;
	}
}

export default ShowOrderService;
