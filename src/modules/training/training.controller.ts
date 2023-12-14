import {FastifyReply, FastifyRequest} from "fastify";
import {
  CreateTrainingInput,
  DeleteTraining,
  GetTraining,
  TrainingsQueryString,
  UpdateTraining
} from "./training.schema";
import {
  createTraining,
  deleteTraining,
  findManyTrainings,
  findUniqueTraining,
  updateTraining
} from "./training.service";


export async function registerTrainingHandler(request: FastifyRequest<{
  Body: CreateTrainingInput
}>, reply: FastifyReply) {

  const personalTrainerId = request.body.map((training) => training.personal_trainer_id)
  const personalTrainerValidate = personalTrainerId.every((id) => id === request.user.id)


  if (!personalTrainerValidate) {
    return reply.code(403).send('You can only register trainings for yourself')
  }
  const body = request.body;
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
  Querystring: TrainingsQueryString;
}>) {
  try {
    return findManyTrainings({...request.query}, {
      user_id: request.user.id,
      user_role: request.user.role
    });
  } catch (e) {
    console.log(e)
  }
}

export async function getUniqueTrainingHandler(request: FastifyRequest<{
  Params: GetTraining;
}>) {
  return findUniqueTraining({
    ...request.params,
    user_id: request.user.id,
    user_role: request.user.role
  });
}

export async function updateTrainingHandler(request: FastifyRequest<{
  Body: UpdateTraining;
  Params: GetTraining;
}>) {
  return updateTraining({
    ...request.body
  }, {
    ...request.params,
    user_id: request.user.id,
    user_role: request.user.role
  });

}

export async function deleteTrainingHandler(request: FastifyRequest<{
  Params: DeleteTraining;
}>, reply: FastifyReply) {
  await deleteTraining({
    ...request.params
  });
  return reply.code(200).send('');
}