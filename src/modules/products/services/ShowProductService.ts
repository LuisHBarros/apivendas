import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm"
import Product from "../typeorm/entities/Product";
import { ProductRepository } from "../typeorm/repositories/ProductsRepository"

interface Irequest{
	id: string
}

class ShowProductService {
	public async execute({ id }: Irequest):Promise<Product | undefined> {
		const productsRepository = getCustomRepository(ProductRepository);

		const product = await productsRepository.findOne(id)

		if (!product) {
			throw new AppError('Product not found', 404)
		}

		return product;
	}
}

export default ShowProductService
