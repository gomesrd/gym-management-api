import {FastifyInstance} from "fastify";
import {$ref} from "../../training/training.schema";
import {getManyReportTrainingHandler} from "./trainingReport.service";

async function trainingReportRoutes(server: FastifyInstance) {

  server.get('/:member_id', {
    preHandler: [server.authenticate, server.authorizationLimited],
    schema: {
      tags: ['Report Training'],
      summary: 'Get report trainings',
      params: {
        type: 'object',
        properties: {
          member_id: {type: 'string'},
        }
      },
      querystring: {
        type: 'object',
        properties: {
          id: {type: 'string'},
          personal_trainer_id: {type: 'string'},
          created_at_gte: {type: 'string'},
          created_at_lte: {type: 'string'},
        }
      },
      // response: {
      //   200: {
      //     type: 'object',
      //     items: $ref('trainingReportSchema')
      //   }
      //  }
    }
  }, getManyReportTrainingHandler);

}

export default trainingReportRoutes;