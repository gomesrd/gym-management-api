import {FastifyInstance} from "fastify";
import {
    deletePersonalTrainerHandler,
    getUniquePersonalTrainerHandler,
    loginHandler,
    registerPersonalTrainerHandler,
    updatePersonalTrainerHandler
} from "./personalTrainer.controller";
import {$ref} from "./personalTrainer.schema";
import {findManyPersonalTrainers} from "./personalTrainer.service";

async function personalTrainerRoutes(server: FastifyInstance) {
    server.get('', {
        preHandler: [server.authenticate, server.authorizationExclusive],
        schema: {
            tags: ['PersonalTrainer'],
            summary: 'Get all Personal Trainers',
            response: {
                200: {
                    type: 'array',
                    items: $ref('PersonalTrainersManyResponseSchema')
                },
            },
        },
    }, findManyPersonalTrainers);

    server.get('/:id', {
        preHandler: [server.authenticate, server.authorizationLimited],
        schema: {
            tags: ['PersonalTrainer'],
            summary: 'Get a specific Personal Trainer',
            params: {
                id: {type: 'string'},
            },
            response: {
                200: $ref('PersonalTrainerUniqueResponseSchema')
            }
        },
    }, getUniquePersonalTrainerHandler);

    server.post('', {
        preHandler: [server.authenticate, server.authorizationExclusive],
        schema: {
            tags: ['PersonalTrainer'],
            body: $ref('createPersonalTrainerSchema'),
            summary: 'Create a new Personal Trainer',
            response: {
                201: $ref('createPersonalTrainerResponseSchema')
            }
        }
    }, registerPersonalTrainerHandler);

    server.post('/login', {
        schema: {
            tags: ['PersonalTrainer'],
            body: $ref('loginSchema'),
            summary: 'Login in the application',
            response: {
                200: $ref('loginResponseSchema')
            }
        }
    }, loginHandler);

    server.put('/:id', {
            preHandler: [server.authenticate, server.authorizationLimited],
            schema: {
                tags: ['PersonalTrainer'],
                summary: 'Update a specific Personal Trainer',
                params: {
                    id: {type: 'string'},
                },
                body: $ref('updatePersonalTrainerSchema'),
                response: {
                    200: $ref('updatePersonalTrainerSchema')
                }
            }
        }, updatePersonalTrainerHandler
    );

    server.delete('/:id', {
            preHandler: [server.authenticate, server.authorizationExclusive],
            schema: {
                tags: ['PersonalTrainer'],
                summary: 'Delete a specific Personal Trainer',
                params: {
                    id: {type: 'string'},
                },
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            message: {type: 'string', example: ''}
                        }
                    }
                }
            }
        }, deletePersonalTrainerHandler
    );
}

export default personalTrainerRoutes;