export enum routesPath {
  members = '/members',
  personalTrainers = '/personal-trainers',
  trainings = '/trainings',
  trainingsRecord = '/trainings-record',
  trainingsReport = '/reports/trainings',
}

export enum tags {
  personalTrainer = 'Personal Trainer',
  member = 'Member',
  training = 'Training',
  trainingRecord = 'Training Record',
  trainingReport = 'Training Report',
  trainingReplacement = 'Training Replacement',
}

export enum personalTrainerSummary {
  findAll = 'Get all Personal Trainers',
  findById = 'Get a specific Personal Trainer',
  register = 'Create a new Personal Trainer',
  login = 'Login in the application',
  update = 'Update a specific Personal Trainer',
  delete = 'Delete a specific Personal Trainer',
}

export enum personalTrainerRoutesPath {
  findAll = '',
  findById = '/:personal_trainer_id',
  register = '',
  login = '/login',
  update = '/:personal_trainer_id',
  delete = '/:personal_trainer_id',
}

export enum memberSummary {
  findAll = 'Get all Members',
  findById = 'Get a specific Member',
  register = 'Create a new Member',
  login = 'Login in the application',
  update = 'Update a specific Member',
  delete = 'Delete a specific Member',
  resume = 'Get resume data a specific member'
}

export enum memberRoutesPath {
  findAll = '',
  findById = '/:member_id',
  resumeAll = '/resume/:member_id',
  register = '/register',
  login = '/login',
  update = '/:member_id',
  delete = '/:member_id',
}


export enum trainingSummary {
  findAll = 'Get all Trainings',
  findById = 'Get a specific Training',
  register = 'Create a new Training',
  update = 'Update a specific Training',
  delete = 'Delete a specific Training',
}

export enum trainingRoutesPath {
  findAll = '',
  findById = '/:training_id',
  register = '',
  update = '/:training_id',
  delete = '/:training_id',
}

export enum trainingRecordSummary {
  findAll = 'Get all Trainings Records',
  findById = 'Get a specific Training Record',
  register = 'Create a new Training Record',
  update = 'Update a specific Training Record',
  delete = 'Delete a specific Training Record',
}

export enum trainingRecordRoutesPath {
  findAll = '',
  findById = '/:training_record_id',
  register = '',
  update = '/:training_record_id',
  delete = '/:training_record_id',
}

export enum trainingReportSummary {
  findAll = 'Get reports of all Trainings',
}

export enum trainingReportRoutesPath {
  findAll = '/:member_id',

}
export enum trainingReplacementSummary {
  findAll = 'Get all Trainings Replacements',
  findById = 'Get a specific Training Replacement',
  register = 'Create a new Training Replacement',
  update = 'Update a specific Training Replacement',
  delete = 'Delete a specific Training Replacement',
}

export enum trainingReplacementRoutesPath {
  findAll = '/replacement',
  findById = '/replacement/:training_replacement_id',
  register = '/replacement',
  update = '/replacement/:training_replacement_id',
  delete = '/replacement/:training_replacement_id',
}