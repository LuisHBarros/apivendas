import Product from '@modules/products/infra/typeorm/entities/Product';
import { IcreateProduct } from '../../models/ICreateProduct';
import { IProduct } from '../../models/IProducts';
import { IUpdateStockProduct } from '../../models/IUpdateStockProduct';
import { IProductsRepository } from '../IProductsRepository';
import { v4 as uuidv4 } from 'uuid';

export class FakeProductsRepository implements IProductsRepository {
	private products: Product[] = [];

	async findAll(): Promise<Product[]> {
		return this.products;
	}
	async findAllByIds(): Promise<Product[]> {
		const products_ids = this.products.map(product => product.id);
		let productsArray: Product[] = [];
		for (let i = 0; i < products_ids.length; i++) {
			for (let j = 0; j < this.products.length; j++) {
				if (this.products[j].id === products_ids[i])
					productsArray.push(this.products[j]);
			}
		}
		return productsArray;
	}
	async findById(id: string): Promise<Product | undefined> {
		return this.products.find(p => p.id === id);
	}
	async findByName(name: string): Promise<Product | undefined> {
		return this.products.find(p => p.name === name);
	}
	async remove(product: IProduct): Promise<void> {
		const findIndex = this.products.findIndex(p => p.name === product.name);
		this.products.splice(findIndex, 1);
	}
	async create({ name, price, quantity }: IcreateProduct): Promise<Product> {
		const product = new Product();
		product.id = uuidv4();
		product.name = name;
		product.price = price;
		product.quantity = quantity;
		this.products.push(product);
		return product;
	}
	async save(product: Product): Promise<IProduct> {
		const findIndex = this.products.findIndex(p => p.name === product.name);
		this.products[findIndex] = product;
		return product;
	}
	async updateStock(products: IUpdateStockProduct[]): Promise<Product[]> {
		let findIndex;
		let productsArray: Product[] = [];
		for (let i = 0; i < products.length; i++) {
			findIndex = this.products.findIndex(
				product => product.id === products[i].id,
			);
			this.products[findIndex].quantity = products[i].quantity;
			productsArray.push(this.products[findIndex]);
		}

		return productsArray;
	}
}
