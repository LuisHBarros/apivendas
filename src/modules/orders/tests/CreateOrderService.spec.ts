import { ICustomer } from '@modules/custumers/domain/models/ICustomer';
import { FakeCustomersRepository } from '@modules/custumers/domain/repositories/fakes/fakeCustomersRepository';
import CreateCustomerService from '@modules/custumers/services/CreateCustomerService';
import { IProduct } from '@modules/products/domain/models/IProducts';
import { FakeProductsRepository } from '@modules/products/domain/repositories/fakes/FakeProductsRepository';
import CreateProductService from '@modules/products/services/CreateProductService';
import AppError from '@shared/errors/AppError';
import { FakeOrdersRepository } from '../domain/fakes/FakeOrdersRepository';
import CreateOrderService from '../services/CreateOrderService';

let fakeOrdersRepository: FakeOrdersRepository;
let fakeCustomersRepository: FakeCustomersRepository;
let fakeProductsRepository: FakeProductsRepository;
let createProductService: CreateProductService;
let createCustomerService: CreateCustomerService;
let createOrderService: CreateOrderService;

describe('CreateOrderService', () => {
	beforeEach(() => {
		fakeOrdersRepository = new FakeOrdersRepository();
		fakeCustomersRepository = new FakeCustomersRepository();
		fakeProductsRepository = new FakeProductsRepository();
		createProductService = new CreateProductService(fakeProductsRepository);
		createCustomerService = new CreateCustomerService(fakeCustomersRepository);
		createOrderService = new CreateOrderService(
			fakeOrdersRepository,
			fakeCustomersRepository,
			fakeProductsRepository,
		);
	});
	it('should create an new order', async () => {
		const customer = await createCustomerService.execute({
			name: 'John Doe',
			email: 'john@doe.com',
		});
		const product = await createProductService.execute({
			name: 'product',
			price: 10,
			quantity: 10,
		});
		const product2 = await createProductService.execute({
			name: 'product2',
			price: 10,
			quantity: 10,
		});

		const order = await createOrderService.execute({
			customer_id: customer.id,
			products: [
				{
					id: product.id,
					quantity: 2,
					name: product.name,
					price: product.price,
					created_at: product.created_at,
					updated_at: product.updated_at,
				},
				{
					id: product2.id,
					quantity: 2,
					name: product2.name,
					price: product2.price,
					created_at: product2.created_at,
					updated_at: product2.updated_at,
				},
			],
		});
		expect(order.customer.name).toBe('John Doe');
	});
	it('should not be able to create an order with a customer that does not exist', async () => {
		const product = await createProductService.execute({
			name: 'product',
			price: 10,
			quantity: 10,
		});
		const customer = createFakeCustomer();
		expect(
			createOrderService.execute({
				customer_id: customer.id,
				products: [
					{
						id: product.id,
						quantity: 2,
						name: product.name,
						price: product.price,
						created_at: product.created_at,
						updated_at: product.updated_at,
					},
				],
			}),
		).rejects.toBeInstanceOf(AppError);
	});
	it('should not be able to create an order with no products', async () => {
		const customer = await createCustomerService.execute({
			name: 'John Doe',
			email: 'john@doe.com',
		});
		expect(
			createOrderService.execute({
				customer_id: customer.id,
				products: [],
			}),
		).rejects.toBeInstanceOf(AppError);
	});
	it('should not be able to create an order with a false product', async () => {
		const customer = await createCustomerService.execute({
			name: 'John Doe',
			email: 'john@doe.com',
		});
		const product = createFakeProduct();
		const product2 = await createProductService.execute({
			name: 'product',
			price: 10,
			quantity: 10,
		});
		expect(
			createOrderService.execute({
				customer_id: customer.id,
				products: [
					{
						id: product.id,
						quantity: 1,
						name: product.name,
						price: product.price,
						created_at: product.created_at,
						updated_at: product.updated_at,
					},
					{
						id: product2.id,
						quantity: 1,
						name: product2.name,
						price: product2.price,
						created_at: product2.created_at,
						updated_at: product2.updated_at,
					},
				],
			}),
		).rejects.toBeInstanceOf(AppError);
	});
	it('should not be able to create an order with a product quantity greater than stock', async () => {
		const customer = await createCustomerService.execute({
			name: 'John Doe',
			email: 'john@doe.com',
		});
		const product = await createProductService.execute({
			name: 'Product',
			price: 10,
			quantity: 1,
		});
		expect(
			createOrderService.execute({
				customer_id: customer.id,
				products: [
					{
						id: product.id,
						quantity: 2,
						name: product.name,
						price: product.price,
						created_at: product.created_at,
						updated_at: product.updated_at,
					},
				],
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});

function createFakeCustomer(): ICustomer {
	return {
		name: 'John Doe',
		email: 'john@doe.com',
		id: '1',
		created_at: new Date(),
		updated_at: new Date(),
	};
}

function createFakeProduct(): IProduct {
	return {
		id: '1',
		name: 'product',
		price: 10,
		quantity: 2,
		created_at: new Date(),
		updated_at: new Date(),
	};
}
