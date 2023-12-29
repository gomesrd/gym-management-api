import {Filters} from "./common.schema";
import {queryUserRole} from "./permissions.service";
import {Role} from "@prisma/client";

export async function parseFiltersCommon(filters: Filters, userId: string) {
  const userRole = await queryUserRole(userId);
  let parseDeleted = undefined;

  if (userRole !== Role.admin) {
    parseDeleted = false;
  }
  if (filters?.deleted === 'true' || filters?.deleted === 'false' && userRole === Role.admin) {
    parseDeleted = filters?.deleted === 'true';
  }
  return {
    deleted: parseDeleted
  };
}


export async function parseFiltersTraining(filters: Filters, userId: string) {
  const userRole = await queryUserRole(userId);
  const personal_trainer_id = (userRole === Role.employee) ? userId : filters.personal_trainer_id;
  const member_id = (userRole === Role.member) ? userId : filters.member_id;
  let parseDeleted = undefined;
  let parseRealized = undefined;


  if (filters?.deleted === 'true' || filters?.deleted === 'false') {
    parseDeleted = filters?.deleted === 'true';
  }

    if (filters?.realized === 'true' || filters?.realized === 'false') {
    parseRealized = filters?.realized === 'true';
  }

  return {
    deleted: parseDeleted,
    personal_trainer_id,
    member_id,
    realized: parseRealized
  };
}

export async function parseFiltersPermission(userId: string, paramsId?: string) {
  const userRole = await queryUserRole(userId);
  const user_id = (userRole !== Role.admin) ? userId : paramsId;
  const personal_trainer_id = (userRole === Role.employee) ? userId : undefined;
  const member_id = (userRole === Role.member) ? userId : undefined;
  const deleted = (userRole !== Role.admin) ? false : undefined;

  return {
    user_id,
    personal_trainer_id,
    member_id,
    deleted
  }
}