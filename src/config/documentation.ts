import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import {FastifyInstance} from "fastify";

export async function documentation(server: FastifyInstance) {

    server.register(fastifySwagger, {
        swagger: {
            info: {
                title: 'API Gym Management',
                description: 'API about Gym Management System',
                version: '1.0.0'
            },
            schemes: ['http'],
            consumes: ['application/json'],
            produces: ['application/json'],
        }
    });
    server.register(fastifySwaggerUi, {routePrefix: '/docs'});

}