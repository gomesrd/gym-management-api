import prisma from "../../config/prisma";
import {CreateMemberInput, DeleteMember, MemberId, UpdateMember} from "./member.schema";
import {hashPassword} from "../../utils/hash";

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
      deleted: true
    },
  });
}

export async function findManyMembers() {
  return prisma.user.findMany({
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
      deleted: false,
      created_at: false,
      updated_at: false,
    }
  });
}

export async function findUniqueMember(data: MemberId & {
  user_id: string, user_role: string
}) {
  const id = (data.user_role === 'Admin' || 'personal_trainer') ? data.id : data.user_id;
  const deleted = (data.user_role !== 'Admin') ? false : undefined;
  return prisma.user.findUnique({
    where: {
      id: id,
      deleted: deleted
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

export async function updateMember(data: UpdateMember, params: MemberId & {
  user_id: string, user_role: string
}) {
  if (params.user_role !== 'Admin' && params.user_id !== params.id) {
    return Promise.reject('You do not have permission to realize this action');
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

export async function deleteMember(params: DeleteMember & {
  user_id: string, user_role: string
}) {
  if (params.user_role !== 'Admin' && params.user_id !== params.id) {
    return Promise.reject('You do not have permission to realize this action');
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