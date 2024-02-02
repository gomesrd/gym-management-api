import { Role } from '@prisma/client'
import prisma from '../config/prisma'

export async function queryUserRole(id: string) {
  const user = await prisma.users.findUnique({
    where: {
      id: id
    },
    select: {
      role: true
    }
  })
  if (!user) return Promise.reject({ message: 'Not Authorized', status: 401 })

  return user?.role
}

export async function verifyUserRole(id: string, allowedRoles: Role[]) {
  const user = await queryUserRole(id)
  if (!user) return

  if (!allowedRoles.includes(user)) {
    return Promise.reject({ code: 403 })
  }

  return user
}

export async function verifyPermissionAdmin(id: string) {
  return verifyUserRole(id, [Role.admin])
}

export async function verifyPermissionPersonalTrainer(id: string) {
  return verifyUserRole(id, [Role.employee, Role.admin])
}

export async function verifyPermissionMember(id: string) {
  return verifyUserRole(id, [Role.member, Role.admin])
}

export async function personalTrainerValidate(userId: string, personalTrainerId: string, memberId: string) {
  const personalTrainerValidate = userId === personalTrainerId
  const memberValidate = userId === memberId

  if (!personalTrainerValidate) {
    return "You can't register trainings for another personal trainer"
  }

  if (memberValidate) {
    return "You can't register training as a personal trainer and member"
  }
}

export async function verifyPermissionActionOnlyMember(userId: string, memberId: string) {
  const userRole = await queryUserRole(userId)

  if (userRole !== Role.admin && userId !== memberId) {
    return Promise.reject({ code: 403 })
  }
}
