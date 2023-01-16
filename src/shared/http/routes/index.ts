import customersRouter from '@modules/custumers/routes/customer.routes'
import productsRouter from '@modules/products/routes/products.routes'
import passwordRouter from '@modules/users/routes/password.routes'
import profileRouter from '@modules/users/routes/profile.routes'
import sessionsRouter from '@modules/users/routes/session.routes'
import usersRouter from '@modules/users/routes/users.routes'
import ordersRouter from '@modules/orders/routes/Order.routes'

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
