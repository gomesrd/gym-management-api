import prisma from "../../config/prisma";
import {
  CreateTrainingRecordInput, DeleteTrainingRecord, GetTrainingRecord,
  TrainingRecordsQueryString, UpdateTrainingRecord
} from "./trainingRecord.schema";

export async function createTrainingRecord(input: CreateTrainingRecordInput) {
  return prisma.trainingRecord.create({
    data: input,
  });
}

export async function findManyTrainingRecords(filters: TrainingRecordsQueryString, data: any & {
  user_id: string,
  user_role: string
}) {
  const personal_trainer_id = (data.user_role === 'personal_trainer') ? data.user_id : filters.personal_trainer_id;
  const member_id = (data.user_role === 'member') ? data.user_id : filters.member_id;
  return prisma.trainingRecord.findMany({
    where: {
      id: filters.id,
      training_id: filters.training_id,
      member_id: member_id,
      personal_trainer_id: personal_trainer_id,
    },
    select: {
      id: true,
      type: true,
      status: true,
      training_id: true,
      personal_trainer_id: false,
      member_id: false,
      personal_trainer: {
        select: {
          user_id: false,
          user: {
            select: {
              id: false,
              name: true,
              email: false,
              password: false,
              role: false,
              created_at: false,
              updated_at: false,
            }
          }
        }
      },
      member: {
        select: {
          user_id: false,
          user: {
            select: {
              id: false,
              name: true,
              email: false,
              password: false,
              role: false,
              created_at: false,
              updated_at: false,
            }
          }
        }
      },
      created_at: true,
      updated_at: false
    }
  });
}

export async function findUniqueTrainingRecord(params: GetTrainingRecord, data: any & {
  user_id: string,
  user_role: string
}) {
  const personal_trainer_id = (data.user_role === 'personal_trainer') ? data.user_id : undefined;
  const member_id = (data.user_role === 'member') ? data.user_id : undefined;
  return prisma.trainingRecord.findMany({
    where: {
      id: params.id,
      personal_trainer_id: personal_trainer_id,
      member_id: member_id,
    },
    select: {
      id: true,
      type: true,
      status: true,
      training_id: true,
      personal_trainer_id: false,
      member_id: false,
      personal_trainer: {
        select: {
          user_id: true,
          user: {
            select: {
              id: false,
              name: true,
              email: false,
              password: false,
              role: false,
              created_at: false,
              updated_at: false,
            }
          }
        }
      },
      member: {
        select: {
          user_id: true,
          user: {
            select: {
              id: false,
              name: true,
              email: false,
              password: false,
              role: false,
              created_at: false,
              updated_at: false,
            }
          }
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
      status: data.status,
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
