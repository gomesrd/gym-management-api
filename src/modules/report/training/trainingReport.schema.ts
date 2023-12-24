import {object, z} from "zod";

const trainingReport = {
  trainingFoul: z.number(),
  trainingRealized: z.number(),
  trainingReschedule: z.number(),
}
const trainingReportSchema = object({
  data: z.object({
    ...trainingReport
  })
});