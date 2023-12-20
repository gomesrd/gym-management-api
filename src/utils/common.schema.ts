import {z} from "zod";

const filtersSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  cpf: z.string().optional(),
  email: z.string().optional(),
  occupation: z.enum(['Personal_Trainer', 'Physiotherapist']).optional(),
  member_id: z.string().optional(),
  personal_trainer_id: z.string().optional(),
  deleted: z.string().default('true').optional(),
  fixed_day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']).optional(),
  single_date: z.string().optional(),
  start_time: z.string().optional(),
  modality: z.enum(['Pilates', 'Functional']).optional(),
  type: z.enum(['Plan', 'Singular', 'Replacement']).optional(),
  training_id: z.string().optional(),
});


export type Filters = z.infer<typeof filtersSchema>;
