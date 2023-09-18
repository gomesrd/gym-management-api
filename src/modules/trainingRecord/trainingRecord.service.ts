import prisma from "../../utils/prisma";
import {
    CreateTrainingRecordInput, DeleteTrainingRecord, GetTrainingRecord,
    TrainingRecordsQueryString, UpdateTrainingRecord
} from "./trainingRecord.schema";

export async function createTrainingRecord(input: CreateTrainingRecordInput) {
    return prisma.trainingRecord.createMany({
        data: input,
    });
}

export async function findTrainingRecords(filters: TrainingRecordsQueryString) {
    return prisma.trainingRecord.findMany({
        where: {
            id: filters.id,
            training_id: filters.training_id,
            member_id: filters.member_id,
            personal_trainer_id: filters.personal_trainer_id,
        },
        select: {
            id: true,
            type_training: true,
            status_training: true,
            training_id: true,
            personal_trainer_id: false,
            member_id: false,
            personal_trainer: {
                select: {
                    id: false,
                    name: true,
                }
            },
            member: {
                select: {
                    id: false,
                    name: true,
                }
            },
            created_at: true,
            updated_at: false
        }
    });
}

export async function findTrainingRecord(data: GetTrainingRecord) {
    return prisma.trainingRecord.findMany({
        where: {
            id: data.id
        },
        select: {
            id: true,
            type_training: true,
            status_training: true,
            training_id: true,
            personal_trainer_id: false,
            member_id: false,
            personal_trainer: {
                select: {
                    id: true,
                    name: true,
                }
            },
            member: {
                select: {
                    id: true,
                    name: true,
                }
            },
            created_at: true,
            updated_at: true,
        }
    });
}

export async function updateTrainingRecord(data: UpdateTrainingRecord, params: GetTrainingRecord) {
    return prisma.trainingRecord.update({
        where: {
            id: params.id
        },
        data: {
            status_training: data.status_training,
        }
    });
}

export async function deleteTrainingRecord(data: DeleteTrainingRecord) {
    return prisma.trainingRecord.delete({
        where: {
            id: data.id,
        }
    })
}
