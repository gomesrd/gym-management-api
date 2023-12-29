import {FastifyReply} from "fastify";

export const messageErrorDefault = {message: 'Something went wrong'};

export async function replyErrorDefault(reply: FastifyReply) {
  return reply.code(500).send(messageErrorDefault)
}