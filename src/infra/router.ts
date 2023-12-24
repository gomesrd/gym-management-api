import {FastifyInstance} from "fastify";
import personalTrainerRoutes from "../modules/personalTrainer/personalTrainer.controller";
import {healthCheck} from "./health-check";
import memberRoutes from "../modules/member/member.controller";
import trainingRoutes from "../modules/training/training.controller";
import trainingRecordRoutes from "../modules/trainingRecord/trainingRecord.controller";
import trainingReportRoutes from "../modules/report/training/trainingReport.controller";

export async function router(server: FastifyInstance) {
    server.register(memberRoutes, {prefix: '/members'});
    server.register(personalTrainerRoutes, {prefix: '/personal-trainers'});
    server.register(trainingReportRoutes, {prefix: '/reports/trainings'})
    server.register(trainingRecordRoutes, {prefix: '/trainings-record'});
    server.register(trainingRoutes, {prefix: '/trainings'});
    server.register(healthCheck);
}