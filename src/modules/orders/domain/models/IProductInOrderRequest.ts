export interface IProductInOrderRequest {
	id?: string;
	order_id?: string;
	product_id: string;
	quantity: number;
	price: number;
}
