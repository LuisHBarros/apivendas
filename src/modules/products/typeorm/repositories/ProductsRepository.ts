import { EntityRepository, In, Repository } from "typeorm";
import Product from "../entities/Product"

interface IfindProducts{
	id: string
}

@EntityRepository(Product)
export class ProductRepository extends Repository<Product>{
	public async findByName(name: string): Promise<Product | undefined>{
		const product = this.findOne({
			where: {
				name,
			}
		})
		return product
	}
	public async findAllByIds(products: IfindProducts[]): Promise<Product[]> {
		const products_ids = products.map(product => product.id);
		const existsProducts = await this.find({
			where: {
				id: In(products_ids)
			}
		})
		return existsProducts
	}
}
