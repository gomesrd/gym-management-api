import {z} from 'zod';
import {buildJsonSchemas} from 'fastify-zod'
import {emailInvalid, emailRequired, passwordInvalid, passwordRequired} from "./personalTrainer.mesages";

const personalTrainerId = {
    id: z.string()
};

const personalTrainerDate = {
    created_at: z.date(),
    updated_at: z.date(),
};

const personalTrainerCore = {
    name: z.string(),
    cpf: z.string(),
    occupation: z.string(),
    email: z.string({
        required_error: 'Email is required',
        invalid_type_error: emailInvalid(),
    }).email(),
    phone: z.string(),
    role: z.string().optional(),
}

const passwordPersonalTrainer = {
    password: z.string({
        required_error: passwordRequired(),
        invalid_type_error: passwordInvalid()
    })
};

const personalTrainerResume = {
    name: z.string(),
    phone: z.string().optional(),
};

const personalTrainerFindUnique = {
    ...personalTrainerId,
    ...personalTrainerCore,
    ...personalTrainerDate,
};

const personalTrainerFindMany = {
    ...personalTrainerId,
    ...personalTrainerResume,
};

const createPersonalTrainerSchema = z.object({
    ...personalTrainerCore,
    ...passwordPersonalTrainer,
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
    occupation: z.string().optional(),
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