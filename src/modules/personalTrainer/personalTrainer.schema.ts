import {z} from 'zod';
import {buildJsonSchemas} from 'fastify-zod'
import {emailInvalid, emailRequired, passwordInvalid, passwordRequired} from "./personalTrainer.mesages";

export type OccupationT = 'Personal_Trainer' | 'Physiotherapist';

const personalTrainerId = {
  id: z.string()
};

const personalTrainerDate = {
  created_at: z.date(),
  updated_at: z.date(),
};

const personalTrainerAddress = {
  address: z.object({
    address: z.string(),
    address_number: z.string(),
    address_complement: z.string().optional(),
    address_neighborhood: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string().optional(),
    zip_code: z.string(),
  }),
};

const personalTrainerCore = {
  name: z.string(),
  cpf: z.string(),
  birth_date: z.string(),
  email: z.string({
    required_error: 'Email is required',
    invalid_type_error: emailInvalid(),
  }).email(),
  phone: z.string(),
  personal_trainer: z.object({
    occupation: z.enum(['Personal_Trainer', 'Physiotherapist']),
  }),
  ...personalTrainerAddress
}

const PersonalTrainerRole = {
  role: z.enum(['Admin', 'Employee', 'Member']),
}

const passwordPersonalTrainer = {
  password: z.string({
    required_error: passwordRequired(),
    invalid_type_error: passwordInvalid()
  })
};

const personalTrainerResume = {
  id: z.string(),
  name: z.string(),
  deleted: z.boolean(),
  personal_trainer: z.object({
    occupation: z.enum(['Personal_Trainer', 'Physiotherapist']),
  }),
};

const personalTrainerFindUnique = {
  ...personalTrainerId,
  ...personalTrainerDate,
  ...personalTrainerCore
};

const personalTrainerFindMany = {
  ...personalTrainerResume,
};

const createPersonalTrainerSchema = z.object({
  ...personalTrainerCore,
  ...passwordPersonalTrainer,
  ...PersonalTrainerRole,
});

const createPersonalTrainerResponseSchema = z.object({
  ...personalTrainerId,
});

const PersonalTrainerIdSchema = z.object({
  ...personalTrainerId
});

const PersonalTrainerUniqueResponseSchema = z.object({
  ...personalTrainerFindUnique
});

const PersonalTrainersManyResponseSchema = z.object({
  ...personalTrainerFindMany
});

const loginSchema = z.object({
  email: z.string({
    required_error: emailRequired(),
    invalid_type_error: emailInvalid()
  }).email(),
  password: z.string()
});

const loginResponseSchema = z.object({
  accessToken: z.string(),
});

const updatePersonalTrainerSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  active: z.boolean().optional(),
});

export type CreatePersonalTrainerInput = z.infer<typeof createPersonalTrainerSchema>
export type DeletePersonalTrainer = z.infer<typeof PersonalTrainerIdSchema>;
export type LoginInput = z.infer<typeof loginSchema>
export type PersonalTrainerId = z.infer<typeof PersonalTrainerIdSchema>;
export type UpdatePersonalTrainer = z.infer<typeof updatePersonalTrainerSchema>;

export const {schemas: personalTrainerSchemas, $ref} = buildJsonSchemas({
  createPersonalTrainerSchema,
  createPersonalTrainerResponseSchema,
  loginSchema,
  loginResponseSchema,
  PersonalTrainerUniqueResponseSchema,
  PersonalTrainersManyResponseSchema,
  PersonalTrainerIdSchema,
  updatePersonalTrainerSchema
}, {$id: "personalTrainerSchemas"});