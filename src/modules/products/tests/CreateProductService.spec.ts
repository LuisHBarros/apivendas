import { FakeProductsRepository } from '@modules/products/domain/repositories/fakes/FakeProductsRepository';
import CreateProductService from '@modules/products/services/CreateProductService';
import AppError from '@shared/errors/AppError';

let fakeProductRepository: FakeProductsRepository;
let createProductService: CreateProductService;

describe('CreateProduct', () => {
	beforeEach(() => {
		fakeProductRepository = new FakeProductsRepository();
		createProductService = new CreateProductService(fakeProductRepository);
	});
	it('should be able to register a product', async () => {
		const product = await createProductService.execute({
			name: 'test-product',
			price: 10,
			quantity: 10,
		});
		expect(product.name).toBe('test-product');
	});
	it('should not be able to register a product with a name already in use', async () => {
		await createProductService.execute({
			name: 'test-product2',
			price: 10,
			quantity: 10,
		});
		expect(
			createProductService.execute({
				name: 'test-product2',
				price: 10,
				quantity: 10,
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
