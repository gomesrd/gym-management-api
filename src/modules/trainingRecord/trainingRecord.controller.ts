import {FastifyReply, FastifyRequest} from "fastify";
import {
  CreateTrainingRecordInput, DeleteTrainingRecord, GetTrainingRecord, TrainingRecordsQueryString,
  UpdateTrainingRecord
} from "./trainingRecord.schema";
import {
  createTrainingRecord, deleteTrainingRecord, findUniqueTrainingRecord, findManyTrainingRecords,
  updateTrainingRecord
} from "./trainingRecord.service";


export async function registerTrainingRecordHandler(request: FastifyRequest<{
  Body: CreateTrainingRecordInput
}>, reply: FastifyReply) {
  const personalTrainerValidate = request.user.id === request.body.personal_trainer_id;
  if (!personalTrainerValidate) {
    return reply.code(403).send('You can only register trainings for yourself')
  }
  const body = request.body;
  try {
    const trainingRecord = await createTrainingRecord(body);
    return reply.code(201).send(trainingRecord)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getManyTrainingRecordsHandler(request: FastifyRequest<{
  Querystring: TrainingRecordsQueryString;
}>) {
  try {
    return findManyTrainingRecords({...request.query}, {
      user_id: request.user.id,
      user_role: request.user.role
    });
  } catch (e) {
    console.log(e)
  }
}

export async function getUniqueTrainingRecordHandler(request: FastifyRequest<{
  Params: GetTrainingRecord;
}>) {

  return findUniqueTrainingRecord({
    ...request.params
  }, {
    user_id: request.user.id,
    user_role: request.user.role
  });
}

export async function updateTrainingRecordHandler(request: FastifyRequest<{
  Body: UpdateTrainingRecord;
  Params: GetTrainingRecord;
}>) {
  return updateTrainingRecord({
    ...request.body
  }, {...request.params,});

}

export async function deleteTrainingRecordHandler(request: FastifyRequest<{
  Params: DeleteTrainingRecord;
}>, reply: FastifyReply) {

  await deleteTrainingRecord({
    ...request.params
  });

  return reply.code(200).send('');
}