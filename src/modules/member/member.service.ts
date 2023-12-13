import prisma from "../../config/prisma";
import {CreateMemberInput, DeleteMember, MemberId, UpdateMember} from "./member.schema";
import {hashPassword} from "../../utils/hash";

export async function createMember(input: CreateMemberInput) {
  const {password, ...rest} = input;
  const {hash, salt} = hashPassword(password);


  return prisma.member.create({
    data: {...rest, salt, password: hash},
  });
}

export async function findMemberByEmail(email: string) {
  return prisma.member.findUnique({
    where: {
      email,
      active: true
    },
  });
}

export async function findManyMembers(data: any & {
  user_role: string
}) {
  return prisma.member.findMany({
    select: {
      id: true,
      name: true,
      cpf: false,
      address: false,
      address_number: false,
      address_complement: false,
      address_neighborhood: false,
      city: false,
      state: false,
      country: false,
      zip_code: false,
      birth_date: false,
      email: false,
      phone: false,
      password: false,
      salt: false,
      active: false,
      created_at: false,
      updated_at: false,
      training: false,
      training_record: false,
    }
  });

}

export async function findUniqueMember(data: MemberId & {
  user_id: string, user_role: string
}) {
  const id = (data.user_role === 'admin' || 'personal_trainer') ? data.id : data.user_id;
  const active = (data.user_role !== 'admin') ? true : undefined;
  return prisma.member.findUnique({
    where: {
      id: id,
      active: active
    },
    select: {
      id: true,
      name: true,
      cpf: true,
      address: true,
      address_number: true,
      address_complement: true,
      address_neighborhood: true,
      city: true,
      state: true,
      country: true,
      zip_code: true,
      birth_date: true,
      email: true,
      phone: true,
      password: false,
      salt: false,
      active: true,
      created_at: true,
      updated_at: true,
      training: false,
      training_record: false,
    }
  });
}

export async function updateMember(data: UpdateMember, params: MemberId & {
  user_id: string, user_role: string
}) {
  if (params.user_role !== 'admin' && params.user_id !== params.id) {
    return Promise.reject('You do not have permission to realize this action');
  }
  return prisma.member.update({
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

export async function disableMember(params: MemberId) {
  try {
    return await prisma.member.update({
      where: {
        id: params.id,
      },
      data: {
        active: false,
      }
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteMember(params: DeleteMember & {
  user_id: string, user_role: string
}) {
  if (params.user_role !== 'admin' && params.user_id !== params.id) {
    return Promise.reject('You do not have permission to realize this action');
  }
  return prisma.member.delete({
    where: {
      id: params.id,
    }
  })
}