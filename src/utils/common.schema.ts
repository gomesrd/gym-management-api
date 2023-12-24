import {z} from "zod";

export const daysOfWeek = z.enum([
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]);

export const trainingModalities = z.enum(['pilates', 'functional']);

export const personalTrainerOccupation = z.enum(['physical_educator', 'physiotherapist']);

export const trainingStatus = z.enum(['realized', 'foul']);

export const trainingTypes = z.enum(['plan', 'singular', 'replacement']);

const filtersSchema = z.object({
  cpf: z.string().optional(),
  created_at_gte: z.string().optional(),
  created_at_lte: z.string().optional(),
  deleted: z.string().default('true').optional(),
  email: z.string().optional(),
  fixed_day: daysOfWeek.optional(),
  id: z.string().optional(),
  member_id: z.string().optional(),
  modality: trainingModalities.optional(),
  name: z.string().optional(),
  occupation: personalTrainerOccupation.optional(),
  personal_trainer_id: z.string().optional(),
  single_date: z.string().optional(),
  status: trainingStatus.optional(),
  start_time: z.string().optional(),
  training_id: z.string().optional(),
  type: trainingTypes.optional(),
});

export type Filters = z.infer<typeof filtersSchema>;
