import {FastifyReply, FastifyRequest} from "fastify";
import {CreateTrainingReplacement} from "../training.schema";
import {createTrainingReplacement} from "./trainingReplacement.repository";

export async function registerTrainingReplacementHandler(request: FastifyRequest<{
  Body: CreateTrainingReplacement
}>, reply: FastifyReply) {
  const body = request.body;

  try {
    const trainingReplacement = await createTrainingReplacement(body);
    return reply.code(201).send(trainingReplacement)
  } catch (e: any) {
    console.log(e)
    return reply.code(500).send('Something went wrong')
  }
}
