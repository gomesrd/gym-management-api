import {FastifyRequest} from "fastify";
import {Filters} from "../../../utils/common.schema";
// import {getManyReportTrainingRepository} from "./trainingReport.repository";

export async function getManyReportTrainingHandler(request: FastifyRequest<{
  Querystring: Filters;
}>) {
  const {id, member_id, personal_trainer_id} = request.query;
  const filters = {
    id,
    member_id,
    personal_trainer_id,
  };
  // return await getManyReportTrainingRepository(filters);

}