import {z} from "zod";
import {buildJsonSchemas} from "fastify-zod";

const trainingRecordId = {
    id: z.string()
}

const trainingRecordDateCreated = {
    updated_at: z.date(),
};

const trainingRecordInput = {
    type_training: z.string(),
    status_training: z.string(),
    training_id: z.string(),
    personal_trainer_id: z.string(),
    member_id: z.string(),
};

const trainingRecordResume = {
    ...trainingRecordId,
    type_training: z.string(),
    status_training: z.string(),
    training_id: z.string(),
    personal_trainer: z.object({
        name: z.string(),
        id: z.string().optional(),
    }),
    member: z.object({
        name: z.string(),
        id: z.string().optional(),
    }),
    created_at: z.date(),
};

const trainingRecordFindUniqueSchema = z.object({
    ...trainingRecordResume,
    ...trainingRecordDateCreated
});

const trainingRecordFindManyScheme = z.object({
    ...trainingRecordResume,
});


const trainingRecordsQueryStringSchema = z.object({
    id: z.string().optional(),
    training_id: z.string().optional(),
    personal_trainer_id: z.string().optional(),
    member_id: z.string().optional(),
});

const createTrainingRecord = z.object({
    ...trainingRecordInput,
});

const createTrainingRecordSchema = z.array(createTrainingRecord);

const updateTrainingRecordSchema = z.object({
    status_training: z.string().optional(),
});

const TrainingRecordIdSchema = z.object({
    ...trainingRecordId
});

export type CreateTrainingRecordInput = z.infer<typeof createTrainingRecordSchema>;
export type DeleteTrainingRecord = z.infer<typeof TrainingRecordIdSchema>;
export type GetTrainingRecord = z.infer<typeof TrainingRecordIdSchema>;
export type UpdateTrainingRecord = z.infer<typeof updateTrainingRecordSchema>;
export type TrainingRecordsQueryString = z.infer<typeof trainingRecordsQueryStringSchema>;


export const {schemas: trainingRecordSchemas, $ref} = buildJsonSchemas({
    createTrainingRecordSchema,
    trainingRecordFindManyScheme,
    trainingRecordFindUniqueSchema,
    TrainingRecordIdSchema,
    updateTrainingRecordSchema,
    trainingRecordsQueryStringSchema,
}, {$id: "TrainingRecordSchemas"});