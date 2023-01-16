import RedisCache from "@shared/cache/RedisCache";
import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm"
import Product from "../typeorm/entities/Product";
import { ProductRepository } from "../typeorm/repositories/ProductsRepository"

interface Irequest{
	id: string
}

class DeleteProductService {
	public async execute({ id }: Irequest): Promise<void> {
		const redisCache = new RedisCache();
		const productsRepository = getCustomRepository(ProductRepository);

		const product = await productsRepository.findOne(id)

		if (!product) {
			throw new AppError('Product not found')
		}
		await redisCache.invalidate('api-vendas_PRODUCT_LIST')
		productsRepository.remove(product)
	}
}

export default DeleteProductService
