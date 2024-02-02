import Fastify, { FastifyInstance } from 'fastify'
import { documentation } from './config/documentation'
import { loginServer } from './modules/auth/login'
import { authorizationServer } from './modules/auth/authorization'
import { responseSchema } from './responseSchema'
import { router } from './infra/router'

export const server = Fastify()
const setupServer = async (): Promise<{
  server: FastifyInstance
}> => {
  await documentation(server)
  await loginServer(server)
  await authorizationServer(server)
  await responseSchema(server)
  await router(server)

  return { server }
}

export default setupServer
