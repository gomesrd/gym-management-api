export enum routesPath {
  members = '/members',
  personalTrainers = '/personal-trainers',
  trainings = '/trainings',
  trainingsRecord = '/trainings-record',
  trainingsReport = '/reports/trainings',
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

export enum tags {
  personalTrainer = 'Personal Trainer',
  member = 'Member',
  training = 'Training',
  training_record = 'Training Record',
  training_report = 'Training Report',
  training_replacement = 'Training Replacement',
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
