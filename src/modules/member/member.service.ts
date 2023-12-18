import prisma from "../../config/prisma";
import {CreateMemberInput, DeleteMember, Filters, MemberId, UpdateMember} from "./member.schema";
import {hashPassword} from "../../utils/hash";
import {queryUserRole} from "../../utils/permissions.service";
import {parseFiltersCommon} from "../../utils/parseFilters";

export async function createMember(input: CreateMemberInput) {
  const {
    password, cpf, email, birth_date, address,
    phone, name
  } = input;
  const {hash, salt} = hashPassword(password);

  return prisma.user.create({
    data: {
      name,
      cpf,
      birth_date,
      email,
      phone,
      salt,
      password: hash,
      address: {
        create: address,
      },
      member: {
        create: {}
      }
    },
  });
}

export async function findMemberByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
      deleted: false
    },
  });
}

export async function findManyMembers(filters: Filters) {
  const applyFilters = await parseFiltersCommon(filters);

  const membersCount = await prisma.user.count({
    where: {
      deleted: applyFilters.deleted
    }
  });

  const members = await prisma.user.findMany({
    where: {
      deleted: applyFilters.deleted
    },
    select: {
      id: true,
      name: true,
      cpf: false,
      address: false,
      birth_date: false,
      email: false,
      phone: false,
      password: false,
      salt: false,
      deleted: true,
      created_at: false,
      updated_at: false,
    }
  });

  return {
    count: membersCount,
    data: members
  };

}

export async function findUniqueMember(data: MemberId, userId: string) {
  const userRole = await queryUserRole(userId);
  const id = (userRole === 'Admin') ? userId : data.id;
  return prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      cpf: true,
      address: {
        select: {
          address: true,
          address_number: true,
          address_complement: true,
          address_neighborhood: true,
          city: true,
          state: true,
          country: true,
          zip_code: true,
        },
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

export async function findUniqueMemberResume(data: MemberId, userId: string) {
  return prisma.user.findUnique({
    where: {
      id: data.id,
    },
    select: {
      id: true,
      name: true,
      cpf: false,
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

export async function updateMember(data: UpdateMember, params: MemberId, userId: string) {
  const userRole = await queryUserRole(userId);

  if (userRole !== 'Admin' && userId !== params.id) {
    return Promise.reject({message: 'You do not have permission to realize this action', status: 403});
  }
  return prisma.user.update({
    where: {
      id: params.id
    },
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      birth_date: data.birth_date,
    }
  });
}

export async function deleteMember(params: DeleteMember, userId: string) {
  const userRole = await queryUserRole(userId);

  if (userRole !== 'Admin' && userId !== params.id) {
    return Promise.reject({message: 'You do not have permission to realize this action', code: 403});
  }
  return prisma.user.update({
    where: {
      id: params.id,
    },
    data: {
      deleted: true,
    }
  });
}