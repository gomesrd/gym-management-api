import {z} from "zod";

const filtersSchema = z.object({
  cpf: z.string().optional(),
  created_at_gte: z.string().optional(),
  created_at_lte: z.string().optional(),
  deleted: z.string().default('true').optional(),
  email: z.string().optional(),
  fixed_day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']).optional(),
  id: z.string().optional(),
  member_id: z.string().optional(),
  modality: z.enum(['Pilates', 'Functional']).optional(),
  name: z.string().optional(),
  occupation: z.enum(['Personal_Trainer', 'Physiotherapist']).optional(),
  personal_trainer_id: z.string().optional(),
  single_date: z.string().optional(),
  status: z.enum(['Reschedule', 'Realized', 'Foul']).optional(),
  start_time: z.string().optional(),
  training_id: z.string().optional(),
  type: z.enum(['Plan', 'Singular', 'Replacement']).optional(),
});


export type Filters = z.infer<typeof filtersSchema>;
