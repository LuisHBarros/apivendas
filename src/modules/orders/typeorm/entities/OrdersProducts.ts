import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Product from "../../../products/typeorm/entities/Product";
import Order from "./Order";

@Entity('orders_products')
class OrdersProducts{
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	order_id: string;

	@Column()
	product_id: string;

	@Column('decimal')
	price: number;

	@Column('int')
		quantity: number;

	@ManyToOne(() => Order, order => order.order_products)
	@JoinColumn({name: 'order_id'})
	order: Order

	@ManyToOne(() => Product, product => product.order_products)
	@JoinColumn({ name: 'product_id' })
		product: Product

	@CreateDateColumn()
	created_at: Date;

	@CreateDateColumn()
	updated_at: Date;
}

export default OrdersProducts;
