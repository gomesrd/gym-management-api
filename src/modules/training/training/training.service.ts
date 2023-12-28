import {FastifyReply, FastifyRequest} from "fastify";
import {
  CreateTrainingInput, UpdateTraining
} from "../training.schema";
import {
  createTraining,
  deleteTraining,
  findManyTrainings,
  findUniqueTraining,
  updateTraining
} from "./training.repository";
import {Filters} from "../../../utils/common.schema";
import {parseFiltersPermission, parseFiltersTraining} from "../../../utils/parseFilters";
import {TrainingId} from "../../../utils/types";
import {getDayTraining} from "../../../utils/getDay";


export async function registerTrainingHandler(request: FastifyRequest<{
  Body: CreateTrainingInput
}>, reply: FastifyReply) {
  const body = request.body;
  const personalTrainerId = body.map((training) => training.personal_trainer_id)
  const personalTrainerValidate = personalTrainerId.every((id) => id === request.user.id)

  if (!personalTrainerValidate) {
    return reply.code(403).send('You can only register trainings for yourself')
  }

  try {
    return await createTraining(body)
  } catch (e: any) {
    console.log(e)
    if (e.code === 'P2002') {
      return reply.code(400).send({
        message: 'Training already exists'
      })
    }
    return reply.code(500).send('Something went wrong')
  }
}

export async function getManyTrainingsHandler(request: FastifyRequest<{
  Querystring: Filters;
}>) {
  const userId = request.user.id;
  const filters = request.query;
  const parseFilters = await parseFiltersTraining(filters, userId);
  const dayTraining = await getDayTraining(filters.training_date)
  try {
    return findManyTrainings(filters, parseFilters, dayTraining);
  } catch (e) {
    console.log(e)
  }
}

export async function getUniqueTrainingHandler(request: FastifyRequest<{
  Params: TrainingId;
}>) {
  const userId = request.user.id;
  const trainingId = request.params.training_id;
  const parseFilters = await parseFiltersPermission(userId);

  return findUniqueTraining(trainingId, parseFilters);
}

export async function updateTrainingHandler(request: FastifyRequest<{
  Body: UpdateTraining;
  Params: TrainingId;
}>, reply: FastifyReply) {
  const userId = request.user.id;
  const dataUpdate = request.body
  const trainingId = request.params.training_id;
  const parseFilters = await parseFiltersPermission(userId);

  try {
    return await updateTraining(dataUpdate, trainingId, parseFilters);
  } catch (e: any) {
    console.log(e)
    if (e.code === 'P2002') {
      return reply.code(400).send({
        message: 'Training already exists'
      })
    }
    return reply.code(500).send('Something went wrong')
  }

}

export async function deleteTrainingHandler(request: FastifyRequest<{
  Params: TrainingId;
}>, reply: FastifyReply) {
  const userId = request.user.id;
  const trainingId = request.params.training_id;
  const parseFilters = await parseFiltersPermission(userId);

  await deleteTraining(trainingId, parseFilters);
  return reply.code(200).send('');
}