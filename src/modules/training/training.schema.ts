import {z} from "zod";
import {buildJsonSchemas} from "fastify-zod";

const trainingId = {
    id: z.string()
}

const trainingDate = {
    created_at: z.date(),
    updated_at: z.date(),
};

const trainingInput = {
    fixed_day: z.string().optional(),
    single_date: z.string().optional(),
    start_time: z.string(),
    modality_training: z.string(),
    type_training: z.string(),
    personal_trainer_id: z.string(),
    member_id: z.string(),
};

const trainingResume = {
    ...trainingId,
    fixed_day: z.string(),
    single_date: z.string().optional(),
    start_time: z.string(),
    modality_training: z.string(),
    type_training: z.string(),
    personal_trainer: z.object({
        name: z.string(),
        id: z.string().optional(),
    }),
    member: z.object({
        name: z.string(),
        id: z.string().optional(),
    }),
};

const trainingFindUniqueSchema = z.object({
    ...trainingResume,
    ...trainingDate
});

const trainingFindManyScheme = z.object({
    ...trainingResume,
});


const trainingsQueryStringSchema = z.object({
    id: z.string().optional(),
    member_id: z.string().optional(),
    personal_trainer_id: z.string().optional(),
    active: z.boolean().optional(),
    fixed_day: z.string().optional(),
    single_date: z.string().optional(),
    start_time: z.string().optional(),
    modality_training: z.string().optional(),
    type_training: z.string().optional(),
});

const createTraining = z.object({
    ...trainingInput,
});

const createTrainingSchema = z.array(createTraining);

const updateTrainingSchema = z.object({
    fixed_day: z.string().optional(),
    single_date: z.string().optional(),
    start_time: z.string().optional(),
    active: z.boolean().optional(),
    personal_trainer_id: z.string().optional(),
    modality_training: z.string().optional(),
    type_training: z.string().optional(),
});

const TrainingIdSchema = z.object({
    ...trainingId
});

export type CreateTrainingInput = z.infer<typeof createTrainingSchema>;
export type DeleteTraining = z.infer<typeof TrainingIdSchema>;
export type GetTraining = z.infer<typeof TrainingIdSchema>;
export type UpdateTraining = z.infer<typeof updateTrainingSchema>;
export type TrainingsQueryString = z.infer<typeof trainingsQueryStringSchema>;


export const {schemas: trainingSchemas, $ref} = buildJsonSchemas({
    createTrainingSchema,
    trainingFindManyScheme,
    trainingFindUniqueSchema,
    TrainingIdSchema,
    updateTrainingSchema,
    trainingsQueryStringSchema,
}, {$id: "TrainingSchemas"});