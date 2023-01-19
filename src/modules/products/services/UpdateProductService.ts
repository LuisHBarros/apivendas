import RedisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IProduct } from '../domain/models/IProducts';
import { IUpdateProduct } from '../domain/models/IUpdateProducts';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';

@injectable()
class UpdateProductService {
	constructor(
		@inject('ProductsRepository')
		private productsRepository: IProductsRepository,
	) {}
	public async execute({
		id,
		name,
		price,
		quantity,
	}: IUpdateProduct): Promise<IProduct> {
		const product = await this.productsRepository.findById(id);

		if (!product) {
			throw new AppError('Product not found');
		}
		const productExists = await this.productsRepository.findByName(name);

		if (productExists && product.name !== name) {
			throw new AppError('There is already one product with this name');
		}

		product.name = name;
		product.price = price;
		product.quantity = quantity;

		//REDIS CACHE -- not tested
		await RedisCache.invalidate('api-vendas_PRODUCT_LIST');
		await this.productsRepository.save(product);

		return product;
	}
}

export default UpdateProductService;
