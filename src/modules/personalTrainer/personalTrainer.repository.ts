import prisma from '../../config/prisma'
import { CreatePersonalTrainerInput, UpdatePersonalTrainer } from './personalTrainer.schema'
import { Filters } from '../../utils/common.schema'
import { FiltersPermissions } from '../../utils/types'

export async function findManyPersonalTrainers(filters: Filters, parseFilters: FiltersPermissions) {
  const page = filters?.page || 1
  const pageSize = filters?.pageSize || 10
  const skip = (page - 1) * pageSize
  const { search, occupation } = filters

  const countOfPersonalTrainers = await prisma.users.count({
    where: {
      OR: [
        { name: { contains: search ?? '', mode: 'insensitive' } },
        { email: { contains: search ?? '', mode: 'insensitive' } },
        { cpf: { contains: search ?? '' } }
      ],
      personal_trainer: {
        is: { occupation: occupation } || { not: null }
      },
      deleted: parseFilters.deleted
    }
  })

  const personalTrainers = await prisma.users.findMany({
    where: {
      OR: [
        { name: { contains: search ?? '', mode: 'insensitive' } },
        { email: { contains: search ?? '', mode: 'insensitive' } },
        { cpf: { contains: search ?? '' } }
      ],
      personal_trainer: {
        is: { occupation: filters.occupation } || { not: null }
      },
      deleted: parseFilters.deleted
    },
    select: {
      id: true,
      name: true,
      personal_trainer: {
        select: {
          id: true,
          occupation: true
        }
      },
      deleted: true
    },
    skip: skip,
    take: pageSize,
    orderBy: [{ name: 'asc' }]
  })

  const simplifiedResult = personalTrainers.map(user => ({
    id: user.id,
    name: user.name,
    deleted: user.deleted,
    occupation: user.personal_trainer?.occupation,
    personal_trainer_id: user.personal_trainer?.id
  }))

  return {
    data: simplifiedResult,
    totalCount: countOfPersonalTrainers,
    page: page,
    pageSize: pageSize
  }
}

export async function findUniquePersonalTrainer(filters: FiltersPermissions) {
  return prisma.users.findUnique({
    where: {
      id: filters.user_id,
      deleted: filters.deleted
    },
    select: {
      id: true,
      name: true,
      cpf: true,
      birth_date: true,
      email: true,
      phone: true,
      users_address: {
        select: {
          address: true,
          address_number: true,
          address_complement: true,
          address_neighborhood: true,
          country: true,
          city: true,
          state: true,
          zip_code: true
        }
      },
      personal_trainer: {
        select: {
          occupation: true,
          id: true
        }
      },
      role: true,
      created_at: true,
      updated_at: true
    }
  })
}

export async function createPersonalTrainer(input: CreatePersonalTrainerInput, userId: string) {
  const {
    cpf,
    email,
    phone,
    name,
    personal_trainer: { occupation },
    role,
    birth_date,
    users_address
  } = input

  return prisma.users.create({
    data: {
      id: userId,
      name,
      cpf,
      birth_date,
      email,
      phone,
      role,
      users_address: {
        create: users_address
      },
      personal_trainer: {
        create: {
          occupation
        }
      },
      member: {
        create: {}
      }
    }
  })
}

export async function updatePersonalTrainer(dataUpdate: UpdatePersonalTrainer, personalTrainerId: string) {
  const { name, email, phone, birth_date } = dataUpdate

  return prisma.users.update({
    where: {
      id: personalTrainerId
    },
    data: {
      name: name,
      email: email,
      phone: phone,
      birth_date: birth_date
    }
  })
}

export async function deletePersonalTrainer(personalTrainerId: string) {
  try {
    return await prisma.users.update({
      where: {
        id: personalTrainerId
      },
      data: {
        deleted: true
      }
    })
  } catch (error) {
    throw error
  }
}

export async function findPersonalTrainerByEmailCpf(email?: string | undefined, cpf?: string | undefined) {
  return prisma.users.findFirst({
    where: {
      OR: [{ email: email }, { cpf: cpf }],
      deleted: false
    }
  })
}

export async function findPersonalTrainerById(personalTrainerId: string) {
  return prisma.users.findUnique({
    where: {
      id: personalTrainerId
    }
  })
}
