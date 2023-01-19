import { FakeProductsRepository } from '@modules/products/domain/repositories/fakes/FakeProductsRepository';
import CreateProductService from '@modules/products/services/CreateProductService';
import AppError from '@shared/errors/AppError';
import ShowProductService from '../services/ShowProductService';

let fakeProductRepository: FakeProductsRepository;
let createProductService: CreateProductService;
let showProductService: ShowProductService;

describe('CreateProduct', () => {
	beforeEach(() => {
		fakeProductRepository = new FakeProductsRepository();
		showProductService = new ShowProductService(fakeProductRepository);
		createProductService = new CreateProductService(fakeProductRepository);
	});
	it('should be able to show a product', async () => {
		const product = await createProductService.execute({
			name: 'test-product',
			price: 10,
			quantity: 10,
		});
		const showProduct = await showProductService.execute({ id: product.id });
		expect(showProduct.name).toBe(product.name);
	});
	it('should not be able to show a unregistered product', async () => {
		expect(
			showProductService.execute({
				id: 'not a id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
