import { Request, Response } from "express";
import CreateProductService from "../services/CreateProductService";
import DeleteProductService from "../services/DeleteProductService";
import ListProductService from "../services/ListProductService";
import ShowProductService from "../services/ShowProductService";
import UpdateProductService from "../services/UpdateProductService";

export default class ProductController{
	public async index(request : Request, response: Response): Promise<Response> {
		const listProducts = new ListProductService();
		const produts = await listProducts.execute();

		return response.json(produts);
	}

	public async show(request: Request, response: Response): Promise<Response> {
		const { id } = request.params;

		const showProdut = new ShowProductService;

		const product = await showProdut.execute({ id });

		return response.json(product);

	}

	public async create(request: Request, response: Response): Promise<Response> {
		const { name, price, quantity } = request.body;

		const createProductService = new CreateProductService;

		const product = await createProductService.execute({
			name,
			price,
			quantity
		});
		return response.json(product)
	}

	public async update(request: Request, response: Response): Promise<Response> {
		const { name, price, quantity } = request.body;
		const { id } = request.params;

		const updateProduct = new UpdateProductService();

		const product = await updateProduct.execute({
			id,
			name,
			price,
			quantity
		})

		return response.json(product);
	}

	public async delete(request: Request, response: Response): Promise<Response> {
		const { id } = request.params;

		const deleteProduct = new DeleteProductService();

		await deleteProduct.execute({ id })

		return response.json([])
	}
}
