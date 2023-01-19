import { IProduct } from '@modules/products/domain/models/IProducts';
import { IOrder } from './IOrder';

export interface IOrderProducts {
	id?: string;
	order?: IOrder;
	product?: IProduct;
	price: number;
	quantity: number;
	created_at: Date;
	updated_at: Date;
}
