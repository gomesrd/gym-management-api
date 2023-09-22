import {FastifyInstance} from "fastify";
import personalTrainerRoutes from "../modules/personalTrainer/personalTrainer.route";
import {healthCheck} from "./health-check";
import memberRoutes from "../modules/member/member.route";
import trainingRoutes from "../modules/training/training.route";
import trainingRecordRoutes from "../modules/trainingRecord/trainingRecord.route";

export async function router(server: FastifyInstance) {
    server.register(personalTrainerRoutes, {prefix: '/personal-trainers'});
    server.register(memberRoutes, {prefix: '/members'});
    server.register(trainingRoutes, {prefix: '/trainings'});
    server.register(trainingRecordRoutes, {prefix: '/trainings-record'});
    server.register(healthCheck);
}