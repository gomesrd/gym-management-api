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

export const personalTrainerTag = ['Personal Trainer']
