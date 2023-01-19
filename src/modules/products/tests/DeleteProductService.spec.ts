import { FakeProductsRepository } from '@modules/products/domain/repositories/fakes/FakeProductsRepository';
import CreateProductService from '@modules/products/services/CreateProductService';
import AppError from '@shared/errors/AppError';
import DeleteProductService from '../services/DeleteProductService';
import ListProductService from '../services/ListProductService';

let fakeProductRepository: FakeProductsRepository;
let createProductService: CreateProductService;
let deleteProductService: DeleteProductService;
let listUserService: ListProductService;

describe('DeleteProduct', () => {
	beforeEach(() => {
		fakeProductRepository = new FakeProductsRepository();
		listUserService = new ListProductService(fakeProductRepository);
		createProductService = new CreateProductService(fakeProductRepository);
		deleteProductService = new DeleteProductService(fakeProductRepository);
	});
	it('should be able to delete a product', async () => {
		const product = await createProductService.execute({
			name: 'test-product',
			price: 10,
			quantity: 10,
		});
		await deleteProductService.execute({ id: product.id });
		const showProduct = await listUserService.execute();
		expect(showProduct[0]).toBe(undefined);
	});
	it('should not be able to delete a unregistered product', async () => {
		expect(
			deleteProductService.execute({ id: 'not-an-id' }),
		).rejects.toBeInstanceOf(AppError);
	});
});
