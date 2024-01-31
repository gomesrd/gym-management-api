import fastify, {FastifyInstance} from 'fastify';
import {Env} from './config/env';
import {documentation} from "./config/documentation";
import {loginServer} from "./modules/auth/login";
import {authorizationServer} from "./modules/auth/authorization";
import {responseSchema} from "./responseSchema";
import env from './config/env';

export const server = fastify();
const setupServer = async (): Promise<{
  server: FastifyInstance
}> => {
  const router = require('./infra/router').router;
  await documentation(server);
  await loginServer(server);
  await authorizationServer(server);
  await responseSchema(server);
  await router(server);
  return {server};
};

export default setupServer;
