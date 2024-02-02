import prisma from '../../../config/prisma'
import { CreateTrainingInput, FindManyTraining, UpdateTraining } from '../training.schema'
import { DaysOfWeek, Filters } from '../../../utils/common.schema'
import { FiltersPermissions } from '../../../utils/types'

export async function createTraining(input: CreateTrainingInput) {
  const { training, training_replacement_id, personal_trainer_id, member_id, modality, type } = input

  const dataTraining = training.map(training => {
    return {
      regular_training: training.regular_training,
      singular_training: training.singular_training,
      start_time: training.start_time,
      end_time: training.end_time,
      modality: modality,
      type: type,
      training_replacement_id: training_replacement_id,
      personal_trainer_id: personal_trainer_id,
      member_id: member_id
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
) {
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
  const { modality, personal_trainer_id, type, training, training_replacement_id, active } = dataUpdate

  try {
    return await prisma.training.update({
      where: {
        id: trainingId,
        personal_trainer_id: parseFilters.personal_trainer_id
      },
      data: {
        start_time: training[0].start_time,
        end_time: training[0].end_time,
        regular_training: training[0].regular_training,
        singular_training: training[0].singular_training,
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
