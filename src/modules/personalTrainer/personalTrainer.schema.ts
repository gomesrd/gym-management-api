import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'
import {
  count,
  dateCreatedUpdated,
  loginResponseSchema,
  loginSchema,
  personalTrainerOccupation,
  userCore,
  userPassword,
  usersAddress,
  usersRole
} from '../../utils/common.schema'

const personalTrainerId = {
  id: z.string()
}

const personalTrainerCore = {
  ...userCore,
  personal_trainer: z.object({
    occupation: personalTrainerOccupation
  }),
  ...usersAddress
}

const personalTrainerResume = {
  id: z.string(),
  name: z.string(),
  deleted: z.boolean().nullable(),
  occupation: personalTrainerOccupation.optional()
}

const updatePersonalTrainerSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  birth_date: z.string().optional()
})

export const personalTrainerIdSchema = {
  type: 'object',
  properties: {
    personal_trainer_id: { type: 'string', description: 'Personal Trainer Id' }
  }
}

export const queryAllPersonalTrainersSchema = {
  type: 'object',
  properties: {
    cpf: { type: 'string', description: 'CPF' },
    email: { type: 'string', description: 'Email' },
    name: { type: 'string', description: 'Name' },
    occupation: { type: 'string', description: 'physical_educator or physiotherapist' }
  }
}

const personalTrainerFindUnique = {
  ...personalTrainerId,
  ...personalTrainerCore,
  ...dateCreatedUpdated
}

const personalTrainerFindMany = {
  data: z.array(
    z.object({
      ...personalTrainerResume
    })
  )
}

const createPersonalTrainerSchema = z.object({
  ...personalTrainerCore,
  ...userPassword,
  ...usersRole
})

const PersonalTrainerUniqueResponseSchema = z.object({
  ...personalTrainerFindUnique
})

const PersonalTrainersManyResponseSchema = z.object({
  ...count,
  ...personalTrainerFindMany
})

export type CreatePersonalTrainerInput = z.infer<typeof createPersonalTrainerSchema>
export type UpdatePersonalTrainer = z.infer<typeof updatePersonalTrainerSchema>
export type PersonalTrainersManyResponse = z.infer<typeof PersonalTrainersManyResponseSchema>

export const { schemas: personalTrainerSchemas, $ref } = buildJsonSchemas(
  {
    createPersonalTrainerSchema,
    loginSchema,
    loginResponseSchema,
    PersonalTrainerUniqueResponseSchema,
    PersonalTrainersManyResponseSchema,
    updatePersonalTrainerSchema
  },
  { $id: 'personalTrainerSchemas' }
)
