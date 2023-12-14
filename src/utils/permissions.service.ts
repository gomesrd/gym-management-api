import {Role} from '@prisma/client';
import prisma from "../config/prisma";

export async function queryUserRole(id: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      role: true,
    },
  });
  if (!user) return Promise.reject({message: 'Not Authorized', status: 401});
  return user?.role;
}

export async function verifyUserRole(id: string, allowedRoles: Role[]) {
  const user = await queryUserRole(id);
  if (!user) return;

  if (!allowedRoles.includes(user)) {
    return Promise.reject({message: 'Not Allowed', status: 403});
  }
  return user;
}

export async function verifyPermissionAdmin(id: string) {
  return verifyUserRole(id, [Role.Admin]);
}

export async function verifyPermissionPersonalTrainer(id: string) {
  return verifyUserRole(id, [Role.Employee, Role.Admin]);
}

export async function verifyPermissionMember(id: string) {
  return verifyUserRole(id, [Role.Member, Role.Admin]);
}
