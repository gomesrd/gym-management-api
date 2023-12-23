import prisma from "../../config/prisma";
import {CreatePersonalTrainerInput, PersonalTrainerId, UpdatePersonalTrainer} from "./personalTrainer.schema";
import {hashPassword} from "../../utils/hash";
import {queryUserRole} from "../../utils/permissions.service";
import {Filters} from "../../utils/common.schema";
import {parseFiltersPermission} from "../../utils/parseFilters";

export async function createPersonalTrainer(input: CreatePersonalTrainerInput) {
  const {
    password, cpf, email, phone, name, personal_trainer: {occupation},
    role, birth_date, address
  } = input;
  const {hash, salt} = hashPassword(password);

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
        create: address,
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

export async function findPersonalTrainerByEmail(email: string) {
  return prisma.users.findUnique({
    where: {
      email,
      deleted: false
    },
  });
}

export async function findUniquePersonalTrainer(data: PersonalTrainerId,
                                                userId: string) {
  const applyFilters = await parseFiltersPermission(userId, data.id);

  return prisma.users.findUnique({
    where: {
      id: applyFilters.user_id,
      deleted: applyFilters.deleted
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
      role: false,
      created_at: true,
      updated_at: true,
    }
  });
}

export async function findManyPersonalTrainers(filters: Filters) {
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

export async function updatePersonalTrainer(data: UpdatePersonalTrainer, params: PersonalTrainerId,
                                            userId: string) {
  const userRole = await queryUserRole(userId);
  if (userRole !== 'Admin' && userId !== params.id) {
    return Promise.reject('You can only update your own data');
  }

  return prisma.users.update({
    where: {
      id: params.id
    },
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
    }
  });
}

export async function deletePersonalTrainer(params: PersonalTrainerId) {
  try {
    return await prisma.users.update({
      where: {
        id: params.id,
      },
      data: {
        deleted: true,
      }
    });
  } catch (error) {
    throw error;
  }
}
