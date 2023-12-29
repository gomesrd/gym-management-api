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
import {deleteTraining} from "../training/training/training.repository";
import {parseFiltersPermission, parseFiltersTraining} from "../../utils/parseFilters";
import {updateRealizedTrainingReplacement} from "../training/replacement/trainingReplacement.repository";

export async function registerTrainingRecordHandler(request: FastifyRequest<{
  Body: CreateTrainingRecordInput
}>, reply: FastifyReply) {
  const body = request.body;
  const userId = request.user.id;
  const personalTrainerId = body.personal_trainer_id;
  const memberId = body.member_id;
  const trainingReplacementId = body.training_replacement_id;
  const trainingType = body.type;
  const parseFilters = await parseFiltersPermission(userId);


  const invalidRequest = await personalTrainerValidate(userId, personalTrainerId, memberId);
  if (invalidRequest) {
    return reply.code(403).send(invalidRequest)
  }

  try {
    const trainingRecord = await createTrainingRecord(body);

    if (trainingType === 'replacement' && trainingReplacementId) {
      await updateRealizedTrainingReplacement(trainingReplacementId);
      await deleteTraining(body.training_id, parseFilters);
    }

    return reply.code(201).send(trainingRecord)
  } catch (e) {
    console.log(e)
    return reply.code(500).send('Something went wrong')
  }
}

export async function getManyTrainingRecordsHandler(request: FastifyRequest<{
  Querystring: TrainingRecordsQueryString;
}>) {
  const userId = request.user.id;
  const filters = request.query;
  const parseFilters = await parseFiltersTraining(filters, userId);

  try {
    return findManyTrainingRecords(filters, parseFilters);
  } catch (e) {
    console.log(e)
  }
}

export async function getUniqueTrainingRecordHandler(request: FastifyRequest<{
  Params: GetTrainingRecord;
}>) {
  const userId = request.user.id;
  const trainingRecordId = request.params.id;
  const parseFilters = await parseFiltersPermission(userId);

  return findUniqueTrainingRecord(trainingRecordId, parseFilters);
}

export async function updateTrainingRecordHandler(request: FastifyRequest<{
  Body: UpdateTrainingRecord;
  Params: GetTrainingRecord;
}>) {
  const trainingRecordId = request.params.id;
  const dataUpdate = request.body;

  return updateTrainingRecord(trainingRecordId, dataUpdate)
}

export async function deleteTrainingRecordHandler(request: FastifyRequest<{
  Params: DeleteTrainingRecord;
}>, reply: FastifyReply) {
  const trainingRecordId = request.params.id;

  await deleteTrainingRecord(trainingRecordId);

  return reply.code(200).send('');
}