import { ICustomer } from '@modules/custumers/domain/models/ICustomer';
import { FakeCustomersRepository } from '@modules/custumers/domain/repositories/fakes/fakeCustomersRepository';
import Customer from '@modules/custumers/infra/typeorm/entities/Customer';
import CreateCustomerService from '@modules/custumers/services/CreateCustomerService';
import { IProduct } from '@modules/products/domain/models/IProducts';
import { FakeProductsRepository } from '@modules/products/domain/repositories/fakes/FakeProductsRepository';
import Product from '@modules/products/infra/typeorm/entities/Product';
import CreateProductService from '@modules/products/services/CreateProductService';
import AppError from '@shared/errors/AppError';
import { FakeOrdersRepository } from '../domain/fakes/FakeOrdersRepository';
import { IOrder } from '../domain/models/IOrder';
import CreateOrderService from '../services/CreateOrderService';
import ShowOrderService from '../services/ShowOrderService';

let fakeOrdersRepository: FakeOrdersRepository;
let showOrderService: ShowOrderService;
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
		showOrderService = new ShowOrderService(fakeOrdersRepository);
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
		const showOrder = await showOrderService.execute(order.id);
		expect(showOrder.customer.name).toBe('John Doe');
	});
	it('should not be able to create an order with a customer that does not exist', async () => {
		const product = await createProductService.execute({
			name: 'product',
			price: 10,
			quantity: 10,
		});
		const customer = await createCustomerService.execute({
			name: 'John Doe',
			email: 'john@doe.com',
		});
		const fakeOrder = createFakeOrder(customer, product);
		expect(showOrderService.execute(fakeOrder.id)).rejects.toBeInstanceOf(
			AppError,
		);
	});
});

function createFakeOrder(customer: Customer, product: IProduct): IOrder {
	return {
		id: '1',
		customer: customer,
		order_products: [
			{
				product_id: product.id,
				quantity: 2,
				price: product.price,
			},
		],
		created_at: new Date(),
		updated_at: new Date(),
	};
}
