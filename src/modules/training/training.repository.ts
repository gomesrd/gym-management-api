import prisma from "../../config/prisma";
import {
  CreateTrainingInput,
  DeleteTraining, FindManyTraining,
  GetTraining,
  UpdateTraining
} from "./training.schema";
import {Prisma} from "@prisma/client";
import {parseFiltersPermission, parseFiltersTraining} from "../../utils/parseFilters";
import {Filters} from "../../utils/common.schema";

export async function createTraining(input: CreateTrainingInput) {

  return prisma.training.createMany({
    data: input
  });
}

export async function findManyTrainings(filters: Filters, userId: string): Promise<FindManyTraining> {
  const applyFilters = await parseFiltersTraining(filters, userId);

  const filtersTraining = {
    member_id: applyFilters.member_id,
    personal_trainer_id: applyFilters.personal_trainer_id,
    deleted: applyFilters.deleted,
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
        include:{
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

export async function findUniqueTraining(params: GetTraining, userId: string) {
  const applyFilters = await parseFiltersPermission(userId);

  return prisma.training.findUnique({
    where: {
      id: params.id,
      personal_trainer_id: applyFilters.personal_trainer_id,
      member_id: applyFilters.member_id,
      deleted: applyFilters.deleted,
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

export async function updateTraining(data: UpdateTraining, params: GetTraining, userId: string) {
  const applyFilters = await parseFiltersPermission(userId);

  try {
    return await prisma.training.update({
      where: {
        id: params.id,
        personal_trainer_id: applyFilters.personal_trainer_id,
      },
      data: {
        start_time: data.start_time,
        fixed_day: data.fixed_day,
        single_date: data.single_date,
        personal_trainer_id: data.personal_trainer_id,
        modality: data.modality,
        type: data.type,
      }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new Error('Training not found');
      }
    }
    throw error;
  }
}

export async function deleteTraining(data: DeleteTraining) {
  return prisma.training.delete({
    where: {
      id: data.id,
    }
  })
}
