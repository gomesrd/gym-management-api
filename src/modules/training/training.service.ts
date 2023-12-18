import prisma from "../../config/prisma";
import {
  CreateTrainingInput,
  DeleteTraining,
  GetTraining,
  TrainingsQueryString,
  UpdateTraining
} from "./training.schema";
import {Prisma} from "@prisma/client";
import {queryUserRole} from "../../utils/permissions.service";
import {parseFiltersTraining} from "../../utils/parseFilters";
import {Filters} from "../../utils/common.schema";

export async function createTraining(input: CreateTrainingInput) {

  return prisma.training.createMany({
    data: input,
  });
}

export async function findManyTrainings(filters: Filters, userId: string) {

  const userRole = await queryUserRole(userId);
  const applyFilters = await parseFiltersTraining(filters, userRole, userId);


  return prisma.training.findMany({
    where: {
      member_id: applyFilters.member_id,
      personal_trainer_id: applyFilters.personal_trainer_id,
      deleted: applyFilters.deleted,
      fixed_day: filters.fixed_day,
      single_date: filters.single_date,
      start_time: filters.start_time,
      modality: filters.modality,
      type: filters.type,
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
        },
      },
    }
  });
}

export async function findUniqueTraining(params: GetTraining, userId: string) {
  const personal_trainer_id = (params.user_role === 'personal_trainer') ? params.user_id : undefined;
  const member_id = (params.user_role === 'member') ? params.user_id : undefined;
  const deleted = (params.user_role !== 'Admin') ? true : undefined;

  return prisma.training.findMany({
    where: {
      id: params.id,
      personal_trainer_id: personal_trainer_id,
      member_id: member_id,
      deleted: deleted,
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
  const personal_trainer_id = (params.user_role !== 'Admin') ? userId : undefined;
  try {
    return await prisma.training.update({
      where: {
        id: params.id,
        personal_trainer_id: personal_trainer_id,
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

export async function deleteTraining(data: DeleteTraining, userId: string) {
  return prisma.training.delete({
    where: {
      id: data.id,
    }
  })
}
