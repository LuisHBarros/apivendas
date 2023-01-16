import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import Order from "../typeorm/entities/Order";
import OrderRepository from "../typeorm/repositories/OrdersRepository";


class ShowOrderService{
	public async execute(order_id: string): Promise<Order | undefined> {
		const ordersRepository = getCustomRepository(OrderRepository)

		const order = await ordersRepository.findById(order_id);

		if (!order)
			throw new AppError("Customer not found", 404)

		return order;
	}
}

export default ShowOrderService;
