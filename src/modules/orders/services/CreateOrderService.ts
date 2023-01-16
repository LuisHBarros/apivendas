import CustomersRepository from "@modules/custumers/typeorm/repositories/customersRepository";
import { ProductRepository } from "@modules/products/typeorm/repositories/ProductsRepository";
import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import Order from "../typeorm/entities/Order";
import OrdersProducts from "../typeorm/entities/OrdersProducts";
import OrderRepository from "../typeorm/repositories/OrdersRepository";

interface Iproducts{
	id: string;
	quantity: number
}

interface IRequest{
	customer_id: string;
	products: Iproducts[];
}

class CreateOrderService{
	public async execute({ customer_id, products }: IRequest): Promise<Order | undefined> {
		const ordersRepository = getCustomRepository(OrderRepository)
		const customersRepository = getCustomRepository(CustomersRepository)
		const productsRepository = getCustomRepository(ProductRepository)

		const customerExists = await customersRepository.findById(customer_id)

		if (!customerExists)
			throw new AppError("Customer not found", 404)

		const productExists = await productsRepository.findAllByIds(products);
		if (!productExists.length)
			throw new AppError("Could not find any products", 404);

		const existsProductsIds = productExists.map(product => product.id);
		const checkInexistentProducts = products.filter(
			product => !existsProductsIds.includes(product.id)
		);
				if (checkInexistentProducts.length)
					throw new AppError(
						"This product cannot be found " + checkInexistentProducts[0].id, 404
					);
		const quantityAvailable = products.filter(
			product => productExists.filter(
				p => p.id === product.id
			)[0].quantity < product.quantity);

		if (quantityAvailable.length)
			throw new AppError(
				`The quantity of ${quantityAvailable[0].id}
				 is not available for ${quantityAvailable[0].id}`, 400);

		const serializedProducts = products.map(product => ({
			product_id: product.id,
			quantity: product.quantity,
			price: productExists.filter(
				p => p.id === product.id)[0].price
		})
		);
		const order = await ordersRepository.createOrder({
			customer: customerExists,
			products: serializedProducts
		})

		const { order_products } = order
		const updatedProductQuantity = order_products.map(product => ({
			id: product.product_id,
			quantity:
				productExists.filter(p => p.id === product.product_id)[0].quantity - product.quantity
		}))

		await productsRepository.save(updatedProductQuantity)

    return order
		return order;
	}
}

export default CreateOrderService;
