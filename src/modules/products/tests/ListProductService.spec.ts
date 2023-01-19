import { FakeProductsRepository } from '@modules/products/domain/repositories/fakes/FakeProductsRepository';
import CreateProductService from '@modules/products/services/CreateProductService';
import ListProductService from '../services/ListProductService';

let fakeProductRepository: FakeProductsRepository;
let createProductService: CreateProductService;
let listUserService: ListProductService;

describe('ListProduct', () => {
	beforeEach(() => {
		fakeProductRepository = new FakeProductsRepository();
		listUserService = new ListProductService(fakeProductRepository);
		createProductService = new CreateProductService(fakeProductRepository);
	});
	it('should be able to list the products', async () => {
		const product = await createProductService.execute({
			name: 'test-product',
			price: 10,
			quantity: 10,
		});
		const listProduct = await listUserService.execute();
		expect(listProduct[0].name).toBe(product.name);
	});
});
