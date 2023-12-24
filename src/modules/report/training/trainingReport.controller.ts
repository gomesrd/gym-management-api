import {FastifyInstance} from "fastify";
import {$ref} from "../../training/training.schema";
import {getManyReportTrainingHandler} from "./trainingReport.service";

async function trainingReportRoutes(server: FastifyInstance) {

  server.get('', {
    preHandler: [server.authenticate, server.authorizationLimited],
    schema: {
      tags: ['Report Training'],
      summary: 'Get report trainings',
      querystring: {
        type: 'object',
        properties: {
          id: {type: 'string'},
          member_id: {type: 'string'},
          personal_trainer_id: {type: 'string'},
        }
      },
      response: {}
    }
  }, getManyReportTrainingHandler);

}

export default trainingReportRoutes;