import {FastifyReply, FastifyRequest} from "fastify";
import {
  CreateTrainingRecordInput, DeleteTrainingRecord, GetTrainingRecord, TrainingRecordsQueryString,
  UpdateTrainingRecord
} from "./trainingRecord.schema";
import {
  createTrainingRecord, deleteTrainingRecord, findUniqueTrainingRecord, findManyTrainingRecords,
  updateTrainingRecord
} from "./trainingRecord.repository";
import {personalTrainerValidate} from "../../utils/permissions.service";
import {updateTrainingReplacement} from "../training/training.repository";


export async function registerTrainingRecordHandler(request: FastifyRequest<{
  Body: CreateTrainingRecordInput
}>, reply: FastifyReply) {
  const body = request.body;
  const userId = request.user.id;
  const personalTrainerId = body.personal_trainer_id;
  const memberId = body.member_id;
  const trainingReplacementId = body.training_replacement_id;
  const realizedReplacement = body.realized;
  const trainingType = body.type;

  const invalidRequest = await personalTrainerValidate(userId, personalTrainerId, memberId);
  if (invalidRequest) {
    return reply.code(403).send(invalidRequest)
  }

  try {
    const trainingRecord = await createTrainingRecord(body);
    if (trainingType === 'replacement') {
      await updateTrainingReplacement(trainingReplacementId, realizedReplacement);
    }
    return reply.code(201).send(trainingRecord)
  } catch (e) {
    console.log(e)
    return reply.code(500).send(e)
  }
}

export async function getManyTrainingRecordsHandler(request: FastifyRequest<{
  Querystring: TrainingRecordsQueryString;
}>) {
  const userId = request.user.id;
  try {
    return findManyTrainingRecords({...request.query}, userId);
  } catch (e) {
    console.log(e)
  }
}

export async function getUniqueTrainingRecordHandler(request: FastifyRequest<{
  Params: GetTrainingRecord;
}>) {
  const userId = request.user.id;

  return findUniqueTrainingRecord({
    ...request.params
  }, userId);
}

export async function updateTrainingRecordHandler(request: FastifyRequest<{
  Body: UpdateTrainingRecord;
  Params: GetTrainingRecord;
}>) {
  return updateTrainingRecord({
    ...request.body
  }, {...request.params})
}

export async function deleteTrainingRecordHandler(request: FastifyRequest<{
  Params: DeleteTrainingRecord;
}>, reply: FastifyReply) {

  await deleteTrainingRecord({
    ...request.params
  });

  return reply.code(200).send('');
}