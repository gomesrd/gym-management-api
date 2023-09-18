import {FastifyInstance} from "fastify";
import personalTrainerRoutes from "../modules/personalTrainer/personalTrainer.route";
import {healthCheck} from "./health-check";
import {responseSchema} from "../responseSchema";
import {loginServer} from "../modules/auth/login";
import {documentation} from "../config/documentation";
import memberRoutes from "../modules/member/member.route";
import trainingRoutes from "../modules/training/training.route";
import trainingRecordRoutes from "../modules/trainingRecord/trainingRecord.route";
import {authorizationServer} from "../modules/auth/authorization";

export async function router(server: FastifyInstance) {
    await documentation(server);
    await loginServer(server);
    await authorizationServer(server);
    await responseSchema(server);
    server.register(personalTrainerRoutes, {prefix: '/personal-trainers'});
    server.register(memberRoutes, {prefix: '/members'});
    server.register(trainingRoutes, {prefix: '/trainings'});
    server.register(trainingRecordRoutes, {prefix: '/trainings-record'});
    server.register(healthCheck);
}