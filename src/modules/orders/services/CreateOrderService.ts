import { inject, injectable } from 'tsyringe';
import RedisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { IOrdersRepository } from '../domain/repositories/IOrdersRepository';
import { ICustomersRepository } from '@modules/custumers/domain/repositories/ICustomersRepository';
import { IRequestCreateOrder } from '../domain/models/IRequestCreateOrder';
import { IOrder } from '../domain/models/IOrder';
import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';

@injectable()
class CreateOrderService {
	constructor(
		@inject('OrdersRepository')
		private ordersRepository: IOrdersRepository,
		@inject('CustomersRepository')
		private customersRepository: ICustomersRepository,

		@inject('ProductsRepository')
		private productsRepository: IProductsRepository,
	) {}
	public async execute({
		customer_id,
		products,
	}: IRequestCreateOrder): Promise<IOrder> {
		const customerExists = await this.customersRepository.findById(customer_id);

		if (!customerExists) throw new AppError('Customer not found', 404);

		const productExists = await this.productsRepository.findAllByIds(products);
		if (!productExists.length)
			throw new AppError('Could not find any products', 404);

		const existsProductsIds = productExists.map(product => product.id);
		const checkInexistentProducts = products.filter(
			product => !existsProductsIds.includes(product.id),
		);
		if (checkInexistentProducts.length)
			throw new AppError(
				'This product cannot be found ' + checkInexistentProducts[0].id,
				404,
			);
		const quantityAvailable = products.filter(
			product =>
				productExists.filter(p => p.id === product.id)[0].quantity <
				product.quantity,
		);

		if (quantityAvailable.length)
			throw new AppError(
				`The quantity of ${quantityAvailable[0].id}
				 is not available for ${quantityAvailable[0].id}`,
				400,
			);

		const serializedProducts = products.map(product => ({
			product_id: product.id,
			quantity: product.quantity,
			price: productExists.filter(p => p.id === product.id)[0].price,
		}));
		const order = await this.ordersRepository.create({
			customer: customerExists,
			products: serializedProducts,
		});

		const { order_products } = order;
		const updatedProductQuantity = order_products.map(product => ({
			id: product.product_id,
			quantity:
				productExists.filter(p => p.id === product.product_id)[0].quantity -
				product.quantity,
		}));

		//REDIS -- Not tested
		// await RedisCache.invalidate('api-vendas_PRODUCT_LIST');
		await this.productsRepository.updateStock(updatedProductQuantity);

		return order;
	}
}

export default CreateOrderService;
