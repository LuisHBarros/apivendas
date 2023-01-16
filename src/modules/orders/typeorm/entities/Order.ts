import { CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import OrdersProducts from "./OrdersProducts";
import Customer from "../../../custumers/typeorm/entities/Customer";

@Entity('orders')
class Order{
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Customer)
	@JoinColumn({ name: 'customer_id' })
		customer: Customer

	@OneToMany(() => OrdersProducts, order_products => order_products.order, { cascade: true })
	order_products: OrdersProducts[]

	@CreateDateColumn()
	created_at: Date;

	@CreateDateColumn()
	updated_at: Date;
}

export default Order;
