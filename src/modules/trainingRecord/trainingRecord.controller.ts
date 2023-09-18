import {FastifyReply, FastifyRequest} from "fastify";
import {
    CreateTrainingRecordInput,
    DeleteTrainingRecord,
    GetTrainingRecord,
    TrainingRecordsQueryString,
    UpdateTrainingRecord
} from "./trainingRecord.schema";
import {
    createTrainingRecord,
    deleteTrainingRecord,
    findTrainingRecord,
    findTrainingRecords,
    updateTrainingRecord
} from "./trainingRecord.service";


export async function registerTrainingRecordHandler(request: FastifyRequest<{
    Body: CreateTrainingRecordInput
}>, reply: FastifyReply) {
    const body = request.body;
    try {
        return createTrainingRecord(body);
    } catch (e) {
        console.log(e)
        return reply.code(500).send(e)
    }
}

export async function getTrainingRecordsHandler(request: FastifyRequest<{
    Querystring: TrainingRecordsQueryString;
}>) {
    try {
        return findTrainingRecords({...request.query});
    } catch (e) {
        console.log(e)
    }
}

export async function getTrainingRecordHandler(request: FastifyRequest<{
    Params: GetTrainingRecord;
}>) {

    return findTrainingRecord({
        ...request.params,
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