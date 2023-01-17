import RedisCache from "@shared/cache/RedisCache";
import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { IProductsRepository } from "../domain/repositories/IProductsRepository";

interface Irequest{
	id: string
}
@injectable()
class DeleteProductService {
		constructor(
		@inject('ProductsRepository')
    private productsRepository: IProductsRepository,
	){}

	public async execute({ id }: Irequest): Promise<void> {

		const product = await this.productsRepository.findById(id)

		if (!product) {
			throw new AppError('Product not found')
		}
		await RedisCache.invalidate('api-vendas_PRODUCT_LIST')
		this.productsRepository.remove(product)
	}
}

export default DeleteProductService
