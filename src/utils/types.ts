export interface FiltersPermissions {
  user_id?: string | undefined;
  personal_trainer_id?: string | undefined;
  member_id?: string | undefined;
  deleted?: boolean | undefined;
  realized?: boolean | undefined;
}
export interface PersonalTrainerId {
  personal_trainer_id: string;
}

export interface MemberId {
  member_id: string;
}

export interface TrainingId {
  training_id: string;
}

export interface TrainingReplacementId {
  training_replacement_id: string;
}