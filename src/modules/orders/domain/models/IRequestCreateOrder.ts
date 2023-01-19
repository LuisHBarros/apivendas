import { IProduct } from '@modules/products/domain/models/IProducts';

export interface IRequestCreateOrder {
	customer_id: string;
	products: IProduct[];
}
