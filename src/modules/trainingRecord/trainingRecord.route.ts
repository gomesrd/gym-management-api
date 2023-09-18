import {FastifyInstance} from "fastify";
import {$ref} from "./trainingRecord.schema";
import {
    deleteTrainingRecordHandler, getUniqueTrainingRecordHandler, getManyTrainingRecordsHandler,
    registerTrainingRecordHandler, updateTrainingRecordHandler
} from "./trainingRecord.controller";

async function trainingRecordRoutes(server: FastifyInstance) {
    server.get('', {
        preHandler: [server.authenticate],
        schema: {
            tags: ['TrainingRecord'],
            summary: 'Get all training records',
            querystring: {
                type: 'object',
                properties: {
                    id: {type: 'string'},
                    member_id: {type: 'string'},
                    personal_trainer_id: {type: 'string'},
                }
            },
            response: {
                200: {
                    type: 'array',
                    items: $ref('trainingRecordFindManyScheme')
                }
            }
        }
    }, getManyTrainingRecordsHandler);

    server.get('/:id', {
        preHandler: [server.authenticate],
        schema: {
            tags: ['TrainingRecord'],
            summary: 'Get a specific training record',
            params: {
                id: {type: 'string'},
            },
            response: {
                200: {
                    type: 'array',
                    items: $ref('trainingRecordFindUniqueSchema')
                }
            }
        },
    }, getUniqueTrainingRecordHandler);

    server.post('', {
        preHandler: [server.authenticate, server.authorizationLimited],
        schema: {
            tags: ['TrainingRecord'],
            body: $ref('createTrainingRecordSchema'),
            summary: 'Create a new training record',
            response: {
                201: $ref('createTrainingRecordSchema')
            }
        }
    }, registerTrainingRecordHandler);

    server.put('/:id', {
            preHandler: [server.authenticate, server.authorizationExclusive],
            schema: {
                tags: ['TrainingRecord'],
                summary: 'Update a specific training record',
                params: {
                    id: {type: 'string'},
                },
                body: $ref('updateTrainingRecordSchema'),
                response: {
                    200: $ref('updateTrainingRecordSchema')
                },

            }
        }, updateTrainingRecordHandler
    );

    server.delete('/:id', {
            preHandler: [server.authenticate, server.authorizationExclusive],
            schema: {
                tags: ['TrainingRecord'],
                summary: 'Delete a specific training record',
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
        }, deleteTrainingRecordHandler
    );
}

export default trainingRecordRoutes;