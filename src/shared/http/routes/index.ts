import productsRouter from '@modules/products/routes/products.routes'
import passwordRouter from '@modules/users/routes/password.routes'
import sessionsRouter from '@modules/users/routes/session.routes'
import usersRouter from '@modules/users/routes/users.routes'
import { Router } from 'express'

const routes = Router()


routes.get('/', (req, res) => {
	return res.json({message: 'Hello Dev!'})
})
routes.use('/products', productsRouter)
routes.use('/users', usersRouter)
routes.use('/sessions', sessionsRouter)
routes.use('/password', passwordRouter)

export default routes;
