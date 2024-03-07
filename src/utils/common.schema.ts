import { z } from 'zod'

export const daysOfWeek = z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])

export const usersRole = {
  role: z.enum(['admin', 'employee', 'member'])
}

export const trainingModalities = z.enum(['pilates', 'functional'])

export const personalTrainerOccupation = z.enum(['physical_educator', 'physiotherapist'])

export const trainingStatus = z.enum(['realized', 'foul', 'pending', 'scheduled'])

export const trainingTypes = z.enum(['plan', 'singular', 'replacement'])

export const filtersSchema = z.object({
  search: z.string().optional(),
  cpf: z.string().optional(),
  created_at_gte: z.string().optional(),
  created_at_lte: z.string().optional(),
  deleted: z.string().optional(),
  email: z.string().optional(),
  regular_training: daysOfWeek.optional().nullable(),
  id: z.string().optional(),
  member_id: z.string().optional(),
  modality: trainingModalities.optional(),
  name: z.string().optional(),
  occupation: personalTrainerOccupation.optional(),
  personal_trainer_id: z.string().optional(),
  singular_training: z.string().optional(),
  status: trainingStatus.optional(),
  starts_at: z.string().optional(),
  ends_at: z.string().optional(),
  training_id: z.string().optional(),
  type: trainingTypes.optional(),
  training_date: z.string().optional(),
  realized: z.string().optional(),
  page: z.number().gte(1).optional(),
  pageSize: z.number().gte(1).lte(10).optional()
})

export const usersAddress = {
  users_address: z.object({
    address: z.string(),
    address_number: z.string(),
    address_complement: z.string().nullable().optional(),
    address_neighborhood: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string().nullable(),
    zip_code: z.string()
  })
}

export const userCore = {
  name: z.string(),
  cpf: z.string(),
  birth_date: z.string(),
  email: z.string().email({ message: 'Email must be a valid email' }),
  phone: z.string(),
  role: z.string().optional()
}

export const userPassword = {
  password: z.string()
}

export const pageableQueryString = {
  page: { type: 'number', description: 'Page number' },
  pageSize: { type: 'number', description: 'Page size' }
}

export const responseManyDefault = {
  totalCount: z.number(),
  page: z.number(),
  pageSize: z.number()
}

export const dateCreatedUpdated = {
  created_at: z.date().nullable(),
  updated_at: z.date().nullable()
}

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export const loginResponseSchema = z.object({
  loggedUser: z.object({
    idToken: z.object({
      jwtToken: z.string()
    }),
    refreshToken: z.object({
      token: z.string()
    })
  })
})

export const responseDeleteSchema = {
  type: 'null',
  description: 'Deleted Success'
}

export const responseInvalidLogin = {
  type: 'object',
  description: 'Invalid Login',
  properties: {
    message: { type: 'string', example: 'Invalid email or password' }
  }
}

export const responseNotAllowed = {
  type: 'object',
  description: 'Not Allowed',
  properties: {
    message: { type: 'string', example: 'Not Allowed' }
  }
}
export const responseIdSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', description: 'Id return', example: '9fb45576-6e37-4ffb-972a-0b6ed9720bd7' }
  }
}

export const responseMemberExists = {
  type: 'object',
  description: 'Member already exists',
  properties: {
    message: { type: 'string', example: 'Member already exists' }
  }
}

export const responsePersonalTrainerExists = {
  type: 'object',
  description: 'Not found',
  properties: {
    message: { type: 'string', example: 'Personal Trainer already exists' }
  }
}

export const responseNotFound = {
  type: 'object',
  description: 'Not found',
  properties: {
    message: { type: 'string', example: 'Not found' }
  }
}

export const responsePersonalTrainerNotFound = {
  type: 'object',
  description: 'Personal Trainer not found',
  properties: {
    message: { type: 'string', example: 'Personal Trainer not found' }
  }
}

export const responseMemberNotFound = {
  type: 'object',
  description: 'Member not found',
  properties: {
    message: { type: 'string', example: 'Member not found' }
  }
}

export const personalTrainerNotFound = {
  message: 'Personal Trainer not found'
}

export const memberNotFound = {
  message: 'Member not found'
}

export const personalTrainerExists = {
  message: 'Personal Trainer already exists'
}

export const memberExists = {
  message: 'Member already exists'
}

export const invalidLogin = {
  message: 'Invalid email or password'
}

export const noPermissionAction = {
  message: 'You do not have permission to realize this action'
}

export const count = { count: z.number() }

export const queryStringTraining = {
  type: 'object',
  properties: {
    training_id: { type: 'string' },
    training_record_id: { type: 'string' },
    member_id: { type: 'string' },
    personal_trainer_id: { type: 'string' },
    ...pageableQueryString
  },
  required: ['page', 'pageSize']
}

export type Filters = z.infer<typeof filtersSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type DaysOfWeek = z.infer<typeof daysOfWeek>
