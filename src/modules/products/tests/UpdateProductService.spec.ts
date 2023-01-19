import { FakeProductsRepository } from '@modules/products/domain/repositories/fakes/FakeProductsRepository';
import CreateProductService from '@modules/products/services/CreateProductService';
import AppError from '@shared/errors/AppError';
import UpdateProductService from '../services/UpdateProductService';

let fakeProductRepository: FakeProductsRepository;
let createProductService: CreateProductService;
let updateProductService: UpdateProductService;

describe('UpdateProduct', () => {
	beforeEach(() => {
		fakeProductRepository = new FakeProductsRepository();
		createProductService = new CreateProductService(fakeProductRepository);
		updateProductService = new UpdateProductService(fakeProductRepository);
	});
	it('should be able to update a registered product', async () => {
		const product = await createProductService.execute({
			name: 'test-product',
			price: 10,
			quantity: 10,
		});
		const updatedProduct = await updateProductService.execute({
			id: product.id,
			name: 'test-product-updated',
			price: 10,
			quantity: 10,
		});
		expect(updatedProduct.name).toBe('test-product-updated');
	});
	it('should not be able to delete a unregistered product', async () => {
		expect(
			updateProductService.execute({
				id: 'not an id',
				name: 'test',
				price: 10,
				quantity: 10,
			}),
		).rejects.toBeInstanceOf(AppError);
	});
	it('should not be able to update a product with a name already in use', async () => {
		await createProductService.execute({
			name: 'test-product',
			price: 10,
			quantity: 10,
		});
		const product = await createProductService.execute({
			name: 'test-product2',
			price: 10,
			quantity: 10,
		});
		expect(
			updateProductService.execute({
				id: product.id,
				name: 'test-product',
				price: 10,
				quantity: 10,
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
