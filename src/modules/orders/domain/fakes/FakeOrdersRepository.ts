import Order from '@modules/orders/infra/typeorm/entities/Order';
import { ICreateOrder } from '../models/ICreateOrder';
import { IOrdersRepository } from '../repositories/IOrdersRepository';
import { v4 as uuidv4, v4 } from 'uuid';
import { IOrderProducts } from '../models/IOrderProducts';
import { IProductInOrderRequest } from '../models/IProductInOrderRequest';
import { IOrder } from '../models/IOrder';

export class FakeOrdersRepository implements IOrdersRepository {
	private orders: Order[] = [];
	public async findById(id: string): Promise<Order | undefined> {
		return this.orders.find(order => order.id === id);
	}
	public async create(data: ICreateOrder): Promise<Order> {
		const order = new Order();
		Object.assign(order, {
			id: uuidv4(),
			customer: data.customer,
			order_products: data.products,
		});

		this.orders.push(order);
		return order;
	}
}
