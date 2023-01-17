import customersRouter from '@modules/custumers/infra/http/routes/customer.routes'
import productsRouter from '@modules/products/infra/http/routes/products.routes'
import passwordRouter from '@modules/users/infra/http/routes/password.routes'
import profileRouter from '@modules/users/infra/http/routes/profile.routes'
import sessionsRouter from '@modules/users/infra/http/routes/session.routes'
import usersRouter from '@modules/users/infra/http/routes/users.routes'
import ordersRouter from '@modules/orders/infra/http/routes/Order.routes'

import { Router } from 'express'

const routes = Router()


routes.get('/', (req, res) => {
	return res.json({message: 'Hello Dev!'})
})
routes
	.use('/products', productsRouter)
	.use('/sessions', sessionsRouter)
	.use('/password', passwordRouter)
	.use('/profiles', profileRouter)
	.use('/users', usersRouter)
	.use('/customers', customersRouter)
	.use('/orders', ordersRouter)


export default routes;
