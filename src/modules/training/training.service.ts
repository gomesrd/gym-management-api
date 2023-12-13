import prisma from "../../config/prisma";
import {
  CreateTrainingInput,
  DeleteTraining,
  GetTraining,
  TrainingsQueryString,
  UpdateTraining
} from "./training.schema";
import {Prisma} from "@prisma/client";

export async function createTraining(input: CreateTrainingInput) {

  const training = prisma.training.createMany({
    data: input,
  });
    return training;
}

export async function findManyTrainings(filters: TrainingsQueryString, data: any & {
  user_id: string,
  user_role: string
}) {
  const personal_trainer_id = (data.user_role === 'personal_trainer') ? data.user_id : filters.personal_trainer_id;
  const member_id = (data.user_role === 'member') ? data.user_id : filters.member_id;
  const active = (data.user_role !== 'admin') ? true : filters.active;

  return prisma.training.findMany({
    where: {
      id: filters.id,
      member_id: member_id,
      personal_trainer_id: personal_trainer_id,
      active: active,
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
          id: false,
          name: true,
        }
      },
      personal_trainer: {
        select: {
          id: false,
          name: true,
        }
      }
    }
  });
}

export async function findUniqueTraining(params: GetTraining & { user_id: string, user_role: string }) {
  const personal_trainer_id = (params.user_role === 'personal_trainer') ? params.user_id : undefined;
  const member_id = (params.user_role === 'member') ? params.user_id : undefined;
  const active = (params.user_role !== 'admin') ? true : undefined;

  return prisma.training.findMany({
    where: {
      id: params.id,
      personal_trainer_id: personal_trainer_id,
      member_id: member_id,
      active: active,
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
          name: true,
          id: true,
        }
      },
      personal_trainer: {
        select: {
          name: true,
          id: true,
        }
      },
      created_at: true,
      updated_at: true,
    }
  });
}

export async function updateTraining(data: UpdateTraining, params: GetTraining & {
  user_id: string,
  user_role: string
}) {
  const personal_trainer_id = (params.user_role !== 'admin') ? params.user_id : undefined;
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

export async function disableTraining(params: GetTraining & {
  user_id: string,
  user_role: string
}) {
  const personal_trainer_id = (params.user_role !== 'admin') ? params.user_id : undefined;
  try {
    return await prisma.training.update({
      where: {
        id: params.id,
        personal_trainer_id: personal_trainer_id,
      },
      data: {
        active: false,
        fixed_day: null,
        single_date: null,
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
