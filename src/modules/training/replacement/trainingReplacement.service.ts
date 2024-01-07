import {FastifyReply, FastifyRequest} from "fastify";
import {CreateTrainingReplacement} from "../training.schema";
import {
  createTrainingReplacement,
  findManyTrainingsReplacement,
  findUniqueTrainingReplacement
} from "./trainingReplacement.repository";
import {Filters} from "../../../utils/common.schema";
import {parseFiltersPermission, parseFiltersTraining} from "../../../utils/parseFilters";
import {TrainingReplacementId} from "../../../utils/types";

export async function registerTrainingReplacementHandler(request: FastifyRequest<{
  Body: CreateTrainingReplacement
}>, reply: FastifyReply) {
  const body = request.body;

  try {
    const trainingReplacement = await createTrainingReplacement(body);
    return reply.code(201).send(trainingReplacement)

  } catch (e: any) {
    console.log(e)
    return reply.code(500).send('Something went wrong')
  }
}

export async function getManyTrainingsReplacementHandler(request: FastifyRequest<{
  Querystring: Filters;
}>, reply: FastifyReply) {
  const userId = request.user.id;
  const filters = request.query;
  const parseFilters = await parseFiltersTraining(filters, userId);

  try {
    const findMany = findManyTrainingsReplacement(filters, parseFilters);
    return reply.code(201).send(findMany)

  } catch (e) {
    console.log(e)
  }
}

export async function getUniqueTrainingReplacementHandler(request: FastifyRequest<{
  Params: TrainingReplacementId;
}>, reply: FastifyReply) {
  const userId = request.user.id;
  const trainingReplacementId = request.params.training_replacement_id;
  const parseFilters = await parseFiltersPermission(userId);

  try {
    const findTraining = findUniqueTrainingReplacement(trainingReplacementId, parseFilters);
    return reply.code(201).send(findTraining)

  } catch (e: any) {
    console.log(e)
  }
}

export async function updateTrainingReplacementHandler(request: FastifyRequest<{
  Body: CreateTrainingReplacement
}>, reply: FastifyReply) {
  const body = request.body;

  try {
    const trainingReplacement = await createTrainingReplacement(body);
    return reply.code(201).send(trainingReplacement)

  } catch (e: any) {
    console.log(e)
    return reply.code(500).send('Something went wrong')
  }
}