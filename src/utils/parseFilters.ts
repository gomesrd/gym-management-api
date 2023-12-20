import {Filters} from "./common.schema";
import {queryUserRole} from "./permissions.service";

export async function parseFiltersCommon(filters: Filters, userId: string) {
  const userRole = await queryUserRole(userId);
  let parseDeleted = undefined;

  if (userRole !== 'Admin') {
    parseDeleted = false;
  }
  if (filters?.deleted === 'true' || filters?.deleted === 'false' && userRole === 'Admin') {
    parseDeleted = filters?.deleted === 'true';
  }
  return {
    deleted: parseDeleted
  };
}


export async function parseFiltersTraining(filters: Filters, userId: string) {
  const userRole = await queryUserRole(userId);
  const personal_trainer_id = (userRole === 'Employee') ? userId : filters.personal_trainer_id;
  const member_id = (userRole === 'Member') ? userId : filters.member_id;
  let parseDeleted = undefined;


  if (filters?.deleted === 'true' || filters?.deleted === 'false') {
    parseDeleted = filters?.deleted === 'true';
  }

  return {
    deleted: parseDeleted,
    personal_trainer_id,
    member_id
  };
}

export async function parseFiltersPermission(userId: string, paramsId?: string) {
  const userRole = await queryUserRole(userId);
  const user_id = (userRole !== 'Admin') ? userId : paramsId;
  const personal_trainer_id = (userRole === 'Employee') ? userId : undefined;
  const member_id = (userRole === 'Member') ? userId : undefined;
  const deleted = (userRole !== 'Admin') ? false : undefined;

  return {
    user_id,
    personal_trainer_id,
    member_id,
    deleted
  }
}