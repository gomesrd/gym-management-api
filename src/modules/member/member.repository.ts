import prisma from "../../config/prisma";
import {CreateMemberInput, UpdateMember} from "./member.schema";
import {hashPassword} from "../../utils/hash";
import {parseFiltersCommon, parseFiltersPermission} from "../../utils/parseFilters";
import {Filters} from "../../utils/common.schema";

export async function createMember(input: CreateMemberInput) {
  const {
    password, cpf, email, birth_date,
    phone, name
  } = input;

  const {hash, salt} = hashPassword(password);

  return prisma.users.create({
    data: {
      name,
      cpf,
      birth_date,
      email,
      phone,
      salt,
      password: hash,
      member: {
        create: {}
      }
    },
  });
}

export async function findMemberByEmailCpf(email?: string | undefined, cpf?: string | undefined) {
  return prisma.users.findUnique({
    where: {
      cpf: cpf,
      email: email,
    },
  });
}

export async function findManyMembers(filters: Filters, userId: string) {
  const applyFilters = await parseFiltersCommon(filters, userId);

  const membersCount = await prisma.users.count({
    where: {
      name: {
        contains: filters.name,
        mode: 'insensitive',
      },
      cpf: filters.cpf,
      email: filters.email,
      deleted: applyFilters.deleted
    }
  });

  const members = await prisma.users.findMany({
    where: {
      name: {
        contains: filters.name,
        mode: 'insensitive',
      },
      cpf: filters.cpf,
      email: filters.email,
      deleted: applyFilters.deleted
    },
    select: {
      id: true,
      name: true,
      deleted: true,
    }
  });

  return {
    count: membersCount,
    data: members
  };

}

export async function findUniqueMember(memberId: string, userId: string) {
  const applyFilters = await parseFiltersPermission(userId, memberId);

  return prisma.users.findUnique({
    where: {
      id: applyFilters.user_id,
    },
    select: {
      id: true,
      name: true,
      cpf: true,
      users_address: {
        select: {
          address: true,
          address_number: true,
          address_complement: true,
          address_neighborhood: true,
          city: true,
          state: true,
          country: true,
          zip_code: true,
        }
      },
      birth_date: true,
      email: true,
      phone: true,
      password: false,
      salt: false,
      deleted: true,
      created_at: true,
      updated_at: true,
    }
  });
}

export async function findUniqueMemberResume(memberId: string) {

  return prisma.users.findUnique({
    where: {
      id: memberId,
    },
    select: {
      id: true,
      name: true,
      birth_date: true,
      email: true,
      phone: true,
      deleted: true,
      created_at: true,
      updated_at: true,
    }
  });
}

export async function updateMember(data: UpdateMember, memberId: string) {

  const {name, email, phone, birth_date} = data

  return prisma.users.update({
    where: {
      id: memberId
    },
    data: {
      name: name,
      email: email,
      phone: phone,
      birth_date: birth_date,
    }
  });
}

export async function deleteMember(memberId: string) {

  return prisma.users.update({
    where: {
      id: memberId,
    },
    data: {
      deleted: true,
    }
  });
}