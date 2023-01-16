import { instanceToInstance } from "class-transformer";
import { Response, Request } from "express";
import CreateSessionService from "../services/CreateSessionService";

export default class SessionsController{
	public async login(request: Request, response: Response): Promise<Response> {
		const { email, password } = request.body;

		const createSession = new CreateSessionService();

		const user  = await createSession.execute({
			email,
			password
		})
		return response.json(instanceToInstance(user));
	}
}
