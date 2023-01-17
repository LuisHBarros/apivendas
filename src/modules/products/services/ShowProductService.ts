import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { IProduct } from "../domain/models/IProducts";
import { IShowProduct } from "../domain/models/IShowProduct";
import { IProductsRepository } from "../domain/repositories/IProductsRepository";

@injectable()
class ShowProductService {
			constructor(
		@inject('ProductsRepository')
    private productsRepository: IProductsRepository,
	){}

	public async execute({ id }: IShowProduct): Promise<IProduct> {


		const product = await this.productsRepository.findById(id)

		if (!product) {
			throw new AppError('Product not found', 404)
		}

		return product;
	}
}

export default ShowProductService
