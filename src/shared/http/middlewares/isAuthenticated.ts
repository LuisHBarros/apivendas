import AppError from "@shared/errors/AppError";
import { NextFunction, Request, Response } from "express";
import authConfig from '../../../config/auth'
import { verify } from "jsonwebtoken";

interface ITokenPayload{
  iat: number,
  exp: number,
  sub: string
}

export default function isAuthenticated(
	request: Request,
	response: Response,
	next: NextFunction
): void {
	const authHeader = request.headers.authorization;

	if (!authHeader) {
		throw new AppError('JTW Token is missing.')
	}

	const [, token]: string[] = authHeader.split(' ')

	try {
		const decodedToken = verify(token, authConfig.jwt.secret)
		const { sub } = decodedToken as ITokenPayload

		request.user = {
			id: sub
		}
		return next();
	} catch (e) {
		throw new AppError('Error on token authentication')
	}
}
