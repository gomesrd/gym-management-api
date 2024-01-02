import {FastifyInstance} from "fastify";
import personalTrainerRoutes from "../modules/personalTrainer/personalTrainer.controller";
import {healthCheck} from "./health-check";
import memberRoutes from "../modules/member/member.controller";
import trainingRoutes from "../modules/training/training.controller";
import trainingRecordRoutes from "../modules/trainingRecord/trainingRecord.controller";
import trainingReportRoutes from "../modules/report/training/trainingReport.controller";
import fastifyCors from "@fastify/cors";
import {routesPath} from "../utils/enumsController";


export async function router(server: FastifyInstance) {
  server.register(memberRoutes, {prefix: routesPath.members});
  server.register(personalTrainerRoutes, {prefix: routesPath.personalTrainers});
  server.register(trainingReportRoutes, {prefix: routesPath.trainingsReport})
  server.register(trainingRecordRoutes, {prefix: routesPath.trainingsRecord});
  server.register(trainingRoutes, {prefix: routesPath.trainings});
  server.register(healthCheck);
  server.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });
}