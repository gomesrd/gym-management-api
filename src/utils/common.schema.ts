import {z} from "zod";

const filtersSchema = z.object({
  id: z.string().optional(),
  member_id: z.string().optional(),
  personal_trainer_id: z.string().optional(),
  deleted: z.string().default('true').optional(),
  fixed_day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']).optional(),
  single_date: z.string().optional(),
  start_time: z.string().optional(),
  modality: z.enum(['Pilates', 'Functional']),
  type: z.enum(['Plan', 'Singular', 'Replacement']),
});


export type Filters = z.infer<typeof filtersSchema>;
