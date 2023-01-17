import CreateSessionService from "@modules/users/services/CreateSessionService";
import { instanceToInstance } from "class-transformer";
import { Response, Request } from "express";
import { container } from "tsyringe";

export default class SessionsController{
	public async login(request: Request, response: Response): Promise<Response> {
		const { email, password } = request.body;

		const createSession =  container.resolve(CreateSessionService);

		const user  = await createSession.execute({
			email,
			password
		})
		return response.json(instanceToInstance(user));
	}
}
