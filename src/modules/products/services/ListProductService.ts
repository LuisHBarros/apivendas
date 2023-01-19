import { inject, injectable } from 'tsyringe';
import RedisCache from '@shared/cache/RedisCache';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';
import { IProduct } from '../domain/models/IProducts';

@injectable()
class ListProductService {
	constructor(
		@inject('ProductsRepository')
		private productsRepository: IProductsRepository,
	) {}
	public async execute(): Promise<IProduct[]> {
		//REDIS CACHE -- NOT TESTED
		let products = await RedisCache.recover<IProduct[]>(
			'api-vendas-PRODUCT_LIST',
		);
		if (!products) {
			products = await this.productsRepository.findAll();
			await RedisCache.save('api-vendas-PRODUCT_LIST', products);
		}

		//TESTED SERVICE:
		// const products = await this.productsRepository.findAll();

		return products;
	}
}

export default ListProductService;
