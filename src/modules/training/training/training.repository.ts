import prisma from "../../../config/prisma";
import {
  CreateTrainingInput, CreateTrainingReplacement,
  DeleteTraining, FindManyTraining,
  GetTraining,
  UpdateTraining
} from "../training.schema";
import {Prisma} from "@prisma/client";
import {parseFiltersPermission, parseFiltersTraining} from "../../../utils/parseFilters";
import {Filters} from "../../../utils/common.schema";
import {FiltersPermissions} from "../../../utils/types";

export async function createTraining(input: CreateTrainingInput) {
  return prisma.training.createMany(
    {
      data: input
    }
  )
}


export async function createTrainingReplacement(input: CreateTrainingReplacement) {

  return prisma.trainingReplacement.create({
    data: input
  });
}

export async function updateTrainingReplacement(
  trainingReplacementId: string | undefined,
  realized: boolean | undefined
) {

  return prisma.trainingReplacement.update({
    where: {
      id: trainingReplacementId,
    },
    data: {
      realized: realized,
    }
  });
}

export async function findManyTrainings(filters: Filters, parseFilters: FiltersPermissions): Promise<FindManyTraining> {

  const filtersTraining = {
    member_id: parseFilters.member_id,
    personal_trainer_id: parseFilters.personal_trainer_id,
    deleted: parseFilters.deleted,
    fixed_day: filters.fixed_day,
    single_date: filters.single_date,
    start_time: filters.start_time,
    modality: filters.modality,
    type: filters.type,
    created_at: {
      gte: filters.created_at_gte,
      lte: filters.created_at_lte,
    },
  }

  const trainingsCount = await prisma.training.count({
    where: {
      ...filtersTraining
    }
  });

  const trainings = await prisma.training.findMany({
    where: {
      ...filtersTraining
    },
    select: {
      id: true,
      fixed_day: true,
      single_date: true,
      start_time: true,
      modality: true,
      type: true,
      personal_trainer_id: false,
      member_id: false,
      member: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      }
    }
  });

  return {
    count: trainingsCount,
    data: trainings,
  }
}

export async function findUniqueTraining(trainingId: string, parseFilters: FiltersPermissions) {

  return prisma.training.findUnique({
    where: {
      id: trainingId,
      personal_trainer_id: parseFilters.personal_trainer_id,
      member_id: parseFilters.member_id,
      deleted: parseFilters.deleted,
    },
    select: {
      id: true,
      fixed_day: true,
      single_date: true,
      start_time: true,
      modality: true,
      type: true,
      member: {
        select: {
          user_id: false,
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
      personal_trainer: {
        select: {
          user_id: false,
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

export async function updateTraining(dataUpdate: UpdateTraining, trainingId: string, parseFilters: FiltersPermissions) {
  const {
    start_time, modality, personal_trainer_id,
    type, single_date, fixed_day
  } = dataUpdate;

  try {
    return await prisma.training.update({
      where: {
        id: trainingId,
        personal_trainer_id: parseFilters.personal_trainer_id,
      },
      data: {
        start_time: start_time,
        fixed_day: fixed_day,
        single_date: single_date,
        personal_trainer_id: personal_trainer_id,
        modality: modality,
        type: type,
      }
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteTraining(trainingId: string, parseFilters: FiltersPermissions) {
  return prisma.training.update({
    where: {
      id: trainingId,
      personal_trainer_id: parseFilters.personal_trainer_id,
    }, data: {
      deleted: true,
    }
  })
}
