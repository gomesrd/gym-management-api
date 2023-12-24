import {z} from "zod";
import {buildJsonSchemas} from "fastify-zod";
import {daysOfWeek, trainingModalities, trainingTypes} from "../../utils/common.schema";

const trainingId = {
  id: z.string()
}

const trainingDate = {
  created_at: z.date(),
  updated_at: z.date(),
};

const trainingInput = {
  fixed_day: daysOfWeek.nullable(),
  single_date: z.date().nullable().optional(),
  start_time: z.string(),
  modality: trainingModalities.optional(),
  type: z.enum(['plan', 'singular', 'replacement']),
  personal_trainer_id: z.string(),
  member_id: z.string(),
  training_replacement_id: z.string().optional(),
};

const trainingInputReplacement = z.object({
  training_id: z.string(),
  member_id: z.string(),
  realized: z.boolean(),
})

const trainingResume = {
  ...trainingId,
  fixed_day: daysOfWeek.nullable(),
  single_date: z.date().nullable(),
  start_time: z.string(),
  modality: trainingModalities,
  type: trainingTypes,
  personal_trainer: z.object({
    user: z.object({
      name: z.string().optional(),
      id: z.string().optional(),
    }).optional(),
  }).optional(),
  member: z.object({
    user: z.object({
      name: z.string().optional(),
      id: z.string().optional(),
    }).optional(),
  }).optional(),
};

const trainingFindUniqueSchema = z.object({
  ...trainingResume,
  ...trainingDate
});

const trainingCount = {
  count: z.number()
};

const trainingFindManyScheme = z.object({
  ...trainingCount,
  data: z.array(
    z.object({
      ...trainingResume
    })
  ),
});


const createTraining = z.object({
  ...trainingInput,
});

const createTrainingSchema = z.array(createTraining);

const updateTrainingSchema = z.object({
  fixed_day: daysOfWeek.optional(),
  single_date: z.string().optional(),
  start_time: z.string().optional(),
  active: z.boolean().optional(),
  personal_trainer_id: z.string().optional(),
  modality: trainingModalities,
  type: trainingTypes,
});

const TrainingIdSchema = z.object({
  ...trainingId
});

export type CreateTrainingInput = z.infer<typeof createTrainingSchema>;
export type CreateTrainingReplacement = z.infer<typeof trainingInputReplacement>;
export type DeleteTraining = z.infer<typeof TrainingIdSchema>;
export type GetTraining = z.infer<typeof TrainingIdSchema>;
export type UpdateTraining = z.infer<typeof updateTrainingSchema>;
export type FindManyTraining = z.infer<typeof trainingFindManyScheme>;


export const {schemas: trainingSchemas, $ref} = buildJsonSchemas({
  createTrainingSchema,
  trainingFindManyScheme,
  trainingFindUniqueSchema,
  TrainingIdSchema,
  updateTrainingSchema,
}, {$id: "TrainingSchemas"});