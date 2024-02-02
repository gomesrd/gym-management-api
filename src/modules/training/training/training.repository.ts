import prisma from '../../../config/prisma'
import { CreateTrainingInput, FindManyTraining, UpdateTraining } from '../training.schema'
import { DaysOfWeek, Filters } from '../../../utils/common.schema'
import { FiltersPermissions } from '../../../utils/types'

export async function createTraining(input: CreateTrainingInput) {
  const dataTraining = input.map(training => {
    return {
      start_time: training.start_time,
      end_time: training.end_time,
      modality: training.modality,
      type: training.type,
      personal_trainer_id: training.personal_trainer_id,
      member_id: training.member_id,
      regular_training: training.regular_training,
      singular_training: training.singular_training,
      training_replacement_id: training.training_replacement_id || undefined
    }
  })

  return prisma.training.createMany({
    data: dataTraining
  })
}

export async function findManyTrainings(
  filters: Filters,
  parseFilters: FiltersPermissions,
  dayTraining: DaysOfWeek | undefined
): Promise<FindManyTraining> {
  const filtersTraining = {
    OR: [
      {
        singular_training: {
          equals: filters.training_date,
          not: null
        }
      },
      {
        regular_training: {
          equals: dayTraining,
          not: null
        }
      }
    ],
    member_id: parseFilters.member_id,
    personal_trainer_id: parseFilters.personal_trainer_id,
    deleted: parseFilters.deleted,
    start_time: filters.start_time,
    end_time: filters.end_time,
    modality: filters.modality,
    type: filters.type,
    created_at: {
      gte: filters.created_at_gte,
      lte: filters.created_at_lte
    }
  }

  const trainingsCount = await prisma.training.count({
    where: {
      ...filtersTraining
    }
  })

  const trainings = await prisma.training.findMany({
    where: {
      ...filtersTraining
    },
    select: {
      id: true,
      regular_training: true,
      singular_training: true,
      start_time: true,
      end_time: true,
      modality: true,
      type: true,
      training_replacement_id: true,
      member: {
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  })

  return {
    count: trainingsCount,
    data: trainings
  }
}

export async function findUniqueTraining(trainingId: string, parseFilters: FiltersPermissions) {
  return prisma.training.findUnique({
    where: {
      id: trainingId,
      personal_trainer_id: parseFilters.personal_trainer_id,
      member_id: parseFilters.member_id,
      deleted: parseFilters.deleted
    },
    select: {
      id: true,
      regular_training: true,
      singular_training: true,
      start_time: true,
      end_time: true,
      modality: true,
      training_replacement_id: true,
      type: true,
      member: {
        select: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      personal_trainer: {
        select: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      created_at: true,
      updated_at: true
    }
  })
}

export async function updateTraining(dataUpdate: UpdateTraining, trainingId: string, parseFilters: FiltersPermissions) {
  const { start_time, modality, personal_trainer_id, type, singular_training, regular_training, end_time } = dataUpdate

  try {
    return await prisma.training.update({
      where: {
        id: trainingId,
        personal_trainer_id: parseFilters.personal_trainer_id
      },
      data: {
        start_time: start_time,
        end_time: end_time,
        regular_training: regular_training,
        singular_training: singular_training,
        personal_trainer_id: personal_trainer_id,
        modality: modality,
        type: type
      }
    })
  } catch (error) {
    throw error
  }
}

export async function deleteTraining(trainingId: string, parseFilters: FiltersPermissions) {
  return prisma.training.update({
    where: {
      id: trainingId,
      personal_trainer_id: parseFilters.personal_trainer_id
    },
    data: {
      deleted: true
    }
  })
}
