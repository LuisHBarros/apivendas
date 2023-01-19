import { container } from 'tsyringe';

import { ICustomersRepository } from '@modules/custumers/domain/repositories/ICustomersRepository';
import CustomersRepository from '@modules/custumers/infra/typeorm/repositories/customersRepository';
import OrdersRepository from '@modules/orders/infra/typeorm/repositories/OrdersRepository';
import { IOrdersRepository } from '@modules/orders/domain/repositories/IOrdersRepository';
import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';
import { ProductsRepository } from '@modules/products/infra/typeorm/repositories/ProductsRepository';
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';
import { IUserTokensRepository } from '@modules/users/domain/repositories/IUserTokenRepository';
import { IHashProvider } from '@modules/users/providers/models/IHashProvider';
import BcryptHashProvider from '@modules/users/providers/implementations/BcryptHashProvider';

container.registerSingleton<ICustomersRepository>(
	'CustomersRepository',
	CustomersRepository,
);
container.registerSingleton<IHashProvider>('HashProvider', BcryptHashProvider);

container.registerSingleton<IProductsRepository>(
	'ProductsRepository',
	ProductsRepository,
);

container.registerSingleton<IOrdersRepository>(
	'OrdersRepository',
	OrdersRepository,
);

container.registerSingleton<IUsersRepository>(
	'UsersRepository',
	UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
	'UserTokensRepository',
	UserTokensRepository,
);
