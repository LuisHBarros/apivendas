import { IcreateProduct } from '@modules/products/domain/models/ICreateProduct';
import { IFindProducts } from '@modules/products/domain/models/IFindProducts';
import { IUpdateStockProduct } from '@modules/products/domain/models/IUpdateStockProduct';
import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';
import { getRepository, In, Repository } from 'typeorm';
import Product from '../entities/Product';

export class ProductsRepository implements IProductsRepository {
	private ormRepository: Repository<Product>;

	constructor() {
		this.ormRepository = getRepository(Product);
	}
	public async create({
		name,
		price,
		quantity,
	}: IcreateProduct): Promise<Product> {
		const product = this.ormRepository.create({ name, price, quantity });
		await this.ormRepository.save(product);
		return product;
	}
	public async save(product: Product): Promise<Product> {
		await this.ormRepository.save(product);

		return product;
	}

	public async remove(product: Product): Promise<void> {
		await this.ormRepository.remove(product);
	}
	public async updateStock(
		products: IUpdateStockProduct[],
	): Promise<Product[]> {
		await this.ormRepository.save(products);
		const products_ids = products.map(product => product.id);
		const existsProducts = await this.ormRepository.find({
			where: {
				id: In(products_ids),
			},
		});
		return existsProducts;
	}

	public async findByName(name: string): Promise<Product | undefined> {
		const product = this.ormRepository.findOne({
			where: {
				name,
			},
		});
		return product;
	}
	public async findAll(): Promise<Product[]> {
		const products = this.ormRepository.find();

		return products;
	}
	public async findById(id: string): Promise<Product | undefined> {
		return await this.ormRepository.findOne(id);
	}
	public async findAllByIds(products: IFindProducts[]): Promise<Product[]> {
		const products_ids = products.map(product => product.id);
		const existsProducts = await this.ormRepository.find({
			where: {
				id: In(products_ids),
			},
		});
		return existsProducts;
	}
}
