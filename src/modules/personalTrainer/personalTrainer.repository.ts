import prisma from "../../config/prisma";
import {CreatePersonalTrainerInput, UpdatePersonalTrainer} from "./personalTrainer.schema";
import {Filters} from "../../utils/common.schema";
import {FiltersPermissions, PersonalTrainerId} from "../../utils/types";


export async function findManyPersonalTrainers(filters: Filters, parseFilters: FiltersPermissions) {
  const countOfPersonalTrainers = await prisma.users.count({
    where: {
      name: {
        contains: filters.name,
        mode: 'insensitive',
      },
      cpf: filters.cpf,
      email: filters.email,
      personal_trainer: {
        is: {occupation: filters.occupation} || {not: null}
      },
      deleted: parseFilters.deleted,
    }
  });

  const personalTrainers = await prisma.users.findMany({
    where: {
      name: {
        contains: filters.name,
        mode: 'insensitive',
      },
      cpf: filters.cpf,
      email: filters.email,
      personal_trainer: {
        is: {occupation: filters.occupation} || {not: null}
      },
      deleted: parseFilters.deleted,
    },
    select: {
      id: true,
      name: true,
      personal_trainer: {
        select: {
          occupation: true,
        }
      },
      deleted: true,
    },
  });

  const simplifiedResult = personalTrainers.map((user) => ({
    id: user.id,
    name: user.name,
    deleted: user.deleted,
    occupation: user.personal_trainer?.occupation,
  }));

  return {
    data: simplifiedResult,
    count: countOfPersonalTrainers,
  };
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
          zip_code: true,
        }
      },
      personal_trainer: {
        select: {
          occupation: true,
        }
      },
      password: false,
      salt: false,
      role: true,
      created_at: true,
      updated_at: true,
    }
  });
}

export async function createPersonalTrainer(input: CreatePersonalTrainerInput, hash: string, salt: string) {
  const {
    cpf, email, phone, name, personal_trainer: {occupation},
    role, birth_date, users_address
  } = input;

  return prisma.users.create({
    data: {
      name,
      cpf,
      birth_date,
      email,
      phone,
      role,
      salt,
      password: hash,
      users_address: {
        create: users_address,
      },
      personal_trainer: {
        create: {
          occupation,
        }
      },
      member: {
        create: {}
      }
    },
  });
}


export async function updatePersonalTrainer(dataUpdate: UpdatePersonalTrainer, personalTrainerId: string) {
  const {name, email, phone} = dataUpdate

  return prisma.users.update({
    where: {
      id: personalTrainerId
    },
    data: {
      name: name,
      email: email,
      phone: phone,
    }
  });
}

export async function deletePersonalTrainer(personalTrainerId: string) {
  try {
    return await prisma.users.update({
      where: {
        id: personalTrainerId,
      },
      data: {
        deleted: true,
      }
    });
  } catch (error) {
    throw error;
  }
}

export async function findPersonalTrainerByEmailCpf(email?: string | undefined, cpf?: string | undefined) {
  return prisma.users.findUnique({
    where: {
      email: email,
      cpf: cpf,
      deleted: false
    },
  });
}

export async function findPersonalTrainerById(personalTrainerId: string) {
  return prisma.users.findUnique({
    where: {
      id: personalTrainerId,
    },
  });
}