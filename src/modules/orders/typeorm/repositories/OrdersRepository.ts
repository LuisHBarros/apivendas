import Customer from "@modules/custumers/typeorm/entities/Customer";
import { EntityRepository, Repository } from "typeorm";
import Order from "../entities/Order";

interface IProduct {
	product_id: string;
  quantity: number;
  price: number;
}

interface Irequest{
	customer: Customer;
	products: IProduct[];
}

@EntityRepository(Order)
class OrderRepository extends Repository<Order> {
	public async findById(id: string): Promise<Order | undefined> {
		const order = this.findOne(id, {
			relations: ['customer', 'order_products'],
		});
		return order;
	}
	public async createOrder({ customer, products }: Irequest): Promise<Order> {
		const order = this.create({
			customer,
			order_products: products
		});
		await this.save(order);
		return order;
	}
}

export default OrderRepository;

