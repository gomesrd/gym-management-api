import prisma from "../../config/prisma";
import {
  CreateTrainingRecordInput, DeleteTrainingRecord, GetTrainingRecord,
  UpdateTrainingRecord
} from "./trainingRecord.schema";
import {Filters} from "../../utils/common.schema";
import {parseFiltersPermission, parseFiltersTraining} from "../../utils/parseFilters";

export async function createTrainingRecord(input: CreateTrainingRecordInput) {
  const {training_id, personal_trainer_id, status, type, member_id} = input;
  return prisma.trainingRecord.create({
    data: {
      training_id,
      personal_trainer_id,
      status,
      type,
      member_id,
    },
  });
}

export async function findManyTrainingRecords(filters: Filters, userId: string) {
  const applyFilters = await parseFiltersTraining(filters, userId);

  const trainingRecordsCount = await prisma.trainingRecord.count({
    where: {
      training_id: filters.training_id,
      member_id: applyFilters.member_id,
      personal_trainer_id: applyFilters.personal_trainer_id,
      status: filters.status,
      type: filters.type,
      created_at: {
        gte: filters.created_at_gte,
        lte: filters.created_at_lte,
      },
    }
  });

  const trainingRecords = await prisma.trainingRecord.findMany({
    where: {
      training_id: filters.training_id,
      member_id: applyFilters.member_id,
      personal_trainer_id: applyFilters.personal_trainer_id,
      status: filters.status,
      type: filters.type,
      created_at: {
        gte: filters.created_at_gte,
        lte: filters.created_at_lte,
      },
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

  return {
    count: trainingRecordsCount,
    data: trainingRecords,
  }

}

export async function findUniqueTrainingRecord(params: GetTrainingRecord, userId: string) {
  const applyFilters = await parseFiltersPermission(userId);

  return prisma.trainingRecord.findMany({
    where: {
      id: params.id,
      personal_trainer_id: applyFilters.personal_trainer_id,
      member_id: applyFilters.member_id,
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
          user: {
            select: {
              id: true,
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
          user: {
            select: {
              id: true,
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
