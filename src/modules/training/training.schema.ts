import {z} from "zod";
import {buildJsonSchemas} from "fastify-zod";
import {
  count,
  dateCreatedUpdated,
  daysOfWeek,
  trainingModalities,
  trainingTypes
} from "../../utils/common.schema";

const trainingId = {
  id: z.string()
}

const trainingCore = {
  fixed_day: daysOfWeek.nullable(),
  single_date: z.date().nullable(),
  start_time: z.string(),
  modality: trainingModalities.optional(),
  type: trainingTypes,
}

const trainingInput = {
  ...trainingCore,
  personal_trainer_id: z.string(),
  member_id: z.string(),
  training_replacement_id: z.string().optional(),
};

const trainingReplacement = z.object({
  training_id: z.string(),
  member_id: z.string(),
  realized: z.boolean(),
})

const usersResume = {
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
}

const trainingResume = {
  ...trainingId,
  ...trainingCore,
  ...usersResume
};

const trainingFindUniqueSchema = z.object({
  ...trainingResume,
  ...dateCreatedUpdated
});

const trainingFindManyScheme = z.object({
  ...count,
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

const createTrainingReplacementSchema = {...trainingReplacement}

const updateTrainingSchema = z.object({
  fixed_day: daysOfWeek.optional().nullable(),
  single_date: z.string().nullable(),
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
export type CreateTrainingReplacement = z.infer<typeof trainingReplacement>;
export type DeleteTraining = z.infer<typeof TrainingIdSchema>;
export type GetTraining = z.infer<typeof TrainingIdSchema>;
export type UpdateTraining = z.infer<typeof updateTrainingSchema>;
export type FindManyTraining = z.infer<typeof trainingFindManyScheme>;

export const {schemas: trainingSchemas, $ref} = buildJsonSchemas({
  createTrainingSchema,
  trainingReplacement,
  trainingFindManyScheme,
  trainingFindUniqueSchema,
  TrainingIdSchema,
  updateTrainingSchema,
}, {$id: "TrainingSchemas"});