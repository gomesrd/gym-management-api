import {FastifyReply, FastifyRequest} from "fastify";
import {
  CreateTrainingInput,
  DeleteTraining,
  GetTraining,
  UpdateTraining
} from "./training.schema";
import {
  createTraining,
  deleteTraining,
  findManyTrainings,
  findUniqueTraining,
  updateTraining
} from "./training.repository";
import {Filters} from "../../utils/common.schema";


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
  try {
    const userId = request.user.id;
    return findManyTrainings({...request.query}, userId);
  } catch (e) {
    console.log(e)
  }
}

export async function getUniqueTrainingHandler(request: FastifyRequest<{
  Params: GetTraining;
}>) {
  const userId = request.user.id;

  return findUniqueTraining({
    ...request.params
  }, userId);
}

export async function updateTrainingHandler(request: FastifyRequest<{
  Body: UpdateTraining;
  Params: GetTraining;
}>, reply: FastifyReply) {
  const userId = request.user.id;

  try {
    return await updateTraining({
      ...request.body
    }, {
      ...request.params,
    }, userId);
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
  Params: DeleteTraining;
}>, reply: FastifyReply) {
  const userId = request.user.id;

  await deleteTraining({
    ...request.params
  });
  return reply.code(200).send('');
}