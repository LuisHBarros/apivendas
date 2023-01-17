import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn }
	from "typeorm";
import { ICustomer } from "@modules/custumers/domain/models/ICustomer";

@Entity('customers')
class Customer implements ICustomer {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column()
	email: string;

	@CreateDateColumn()
	created_at: Date;

	@CreateDateColumn()
	updated_at: Date;
}

export default Customer;
