import { getRepository, Repository } from 'typeorm';
import { ICustomer } from '@modules/custumers/domain/models/ICustomer';
import Order from '../entities/Order';
import { IOrdersRepository } from '@modules/orders/domain/repositories/IOrdersRepository';
import { ICreateOrder } from '@modules/orders/domain/models/ICreateOrder';

class OrderRepository implements IOrdersRepository {
	private ormRepository: Repository<Order>;
	constructor() {
		this.ormRepository = getRepository(Order);
	}

	public async findById(id: string): Promise<Order | undefined> {
		const order = this.ormRepository.findOne(id, {
			relations: ['customer', 'order_products'],
		});
		return order;
	}
	public async create({ customer, products }: ICreateOrder): Promise<Order> {
		const order = this.ormRepository.create({
			customer,
			order_products: products,
		});
		await this.ormRepository.save(order);
		return order;
	}
}

export default OrderRepository;
