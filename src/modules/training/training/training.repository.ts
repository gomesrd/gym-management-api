import prisma from '../../../config/prisma'
import { CreateTrainingInput, UpdateTraining } from '../training.schema'
import { DaysOfWeek, Filters } from '../../../utils/common.schema'
import { FiltersPermissions } from '../../../utils/types'

export async function createTraining(input: CreateTrainingInput) {
  const { training_replacement_id, training, personal_trainer_id, member_id, modality, type } = input

  try {
    const createManyTraining = await prisma.$transaction(
      training.map(training =>
        prisma.training.create({
          data: {
            regular_training: training.regular_training,
            singular_training: training.singular_training,
            starts_at: training.starts_at,
            ends_at: training.ends_at,
            modality: modality,
            type: type,
            personal_trainer_id: personal_trainer_id,
            training_replacement_id: training_replacement_id,
            MemberTraining: {
              createMany: {
                data: member_id.map(member => {
                  return {
                    member_id: member
                  }
                })
              }
            }
          },
          include: {
            MemberTraining: true
          }
        })
      )
    )

    return createManyTraining
  } catch (error) {
    console.log(error)
  }
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
          equals: filters.singular_training,
          not: null
        }
      },
      {
        regular_training: {
          equals: filters.regular_training,
          not: null
        }
      }
    ],
    member_id: parseFilters.member_id,
    personal_trainer_id: parseFilters.personal_trainer_id,
    deleted: parseFilters.deleted,
    starts_at: filters.starts_at,
    ends_at: filters.ends_at,
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
      starts_at: true,
      ends_at: true,
      modality: true,
      type: true,
      training_replacement_id: true,
      MemberTraining: {
        select: {
          member_id: true,
          Member: {
            select: {
              user: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      }
    },
    orderBy: [{ regular_training: 'asc' }, { starts_at: 'asc' }]
  })

  const formattedTrainings = trainings.map(training => ({
    ...training,
    members: training.MemberTraining.map(memberTraining => memberTraining.Member.user.name).join('/')
  }))

  return {
    count: trainingsCount,
    data: formattedTrainings
  }
}

export async function findUniqueTraining(trainingId: string, parseFilters: FiltersPermissions) {
  const findTraining = await prisma.training.findUnique({
    where: {
      id: trainingId,
      personal_trainer_id: parseFilters.personal_trainer_id,
      deleted: parseFilters.deleted
    },
    select: {
      id: true,
      regular_training: true,
      singular_training: true,
      starts_at: true,
      ends_at: true,
      modality: true,
      type: true,
      training_replacement_id: true,
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
      MemberTraining: {
        select: {
          member_id: true,
          Member: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      },
      created_at: true,
      updated_at: true
    }
  })

  return {
    ...findTraining,
    personal_trainer: {
      id: findTraining?.personal_trainer.user.id,
      name: findTraining?.personal_trainer.user.name
    },
    members: findTraining?.MemberTraining.map(memberTraining => ({
      id: memberTraining.Member.user.id,
      name: memberTraining.Member.user.name
    }))
  }
}

export async function updateTraining(dataUpdate: UpdateTraining, trainingId: string, parseFilters: FiltersPermissions) {
  const { modality, personal_trainer_id, type, training, active } = dataUpdate

  try {
    return await prisma.training.update({
      where: {
        id: trainingId,
        personal_trainer_id: parseFilters.personal_trainer_id
      },
      data: {
        starts_at: training[0].starts_at,
        ends_at: training[0].ends_at,
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
