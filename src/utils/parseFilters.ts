import {Filters} from "./common.schema";

export async function parseFiltersCommon(filters: Filters) {
  let parseDeleted = undefined;
  if (filters?.deleted === 'true' || filters?.deleted === 'false') {
    parseDeleted = filters?.deleted === 'true';
  }
  return {
    deleted: parseDeleted
  };
}


export async function parseFiltersTraining(filters: Filters, userRole: string, userId: string) {
  let parseDeleted = undefined;
  if (filters?.deleted === 'true' || filters?.deleted === 'false') {
    parseDeleted = filters?.deleted === 'true';
  }

  const personal_trainer_id = (userRole === 'Employee') ? userId : filters.personal_trainer_id;
  const member_id = (userRole === 'Member') ? userId : filters.member_id;

  return {
    deleted: parseDeleted,
    personal_trainer_id,
    member_id
  };
}