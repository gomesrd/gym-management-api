import {FastifyReply, FastifyRequest} from "fastify";
import {
  createPersonalTrainer,
  deletePersonalTrainer,
  findManyPersonalTrainers,
  findPersonalTrainerByEmail,
  findUniquePersonalTrainer,
  updatePersonalTrainer
} from "./personalTrainer.service";
import {
  CreatePersonalTrainerInput,
  DeletePersonalTrainer,
  LoginInput,
  PersonalTrainerId,
  PersonalTrainersManyResponse,
  UpdatePersonalTrainer
} from "./personalTrainer.schema";
import {invalidLoginMessage} from "./personalTrainer.mesages";
import {verifyPassword} from "../../utils/hash";
import {server} from "../../app";

export async function registerPersonalTrainerHandler(request: FastifyRequest<{
  Body: CreatePersonalTrainerInput
}>, reply: FastifyReply) {
  const body = request.body;
  //const userId = request.user.id;
  try {
    const personalTrainer = await createPersonalTrainer(body);
    return reply.code(201).send(personalTrainer)
  } catch (e: any) {
    if (e.code === 'P2002') {
      return reply.code(400).send({
        message: 'Personal trainer already exists'
      })
    }
    return reply.code(500).send('Something went wrong')
  }
}

export async function loginHandler(request: FastifyRequest<{
  Body: LoginInput
}>, reply: FastifyReply) {
  const body = request.body;
  const personalTrainer = await findPersonalTrainerByEmail(body.email);
  if (!personalTrainer) {
    return reply.code(401).send(invalidLoginMessage())
  }
  const correctPassword = verifyPassword(
    {
      candidatePassword: body.password,
      salt: personalTrainer.salt,
      hash: personalTrainer.password
    }
  )
  if (correctPassword) {
    const {id, name, role} = personalTrainer;
    const personalTrainerData = {id, name, role};
    // const expiresIn = 60 * 120;
    const accessToken = server.jwt.sign(personalTrainerData);

    return reply.code(200).send({accessToken});
  }
  return reply.code(401).send(invalidLoginMessage());
}

export async function getUniquePersonalTrainerHandler(request: FastifyRequest<{
  Params: PersonalTrainerId;
}>) {
  const userId = request.user.id;

  return findUniquePersonalTrainer({
    ...request.params
  }, userId)
}

export async function getManyPersonalTrainersHandler(): Promise<PersonalTrainersManyResponse | undefined> {
  try {
    return await findManyPersonalTrainers();
  } catch (e) {
    console.log(e)
    return undefined;
  }
}

export async function updatePersonalTrainerHandler(request: FastifyRequest<{
  Body: UpdatePersonalTrainer;
  Params: PersonalTrainerId;
}>) {
  const userId = request.user.id;
  return updatePersonalTrainer({
    ...request.body,
  }, {
    ...request.params,
  }, userId);
}


export async function deletePersonalTrainerHandler(request: FastifyRequest<{
  Params: DeletePersonalTrainer;
}>, reply: FastifyReply) {
  await deletePersonalTrainer({
    ...request.params
  });
  return reply.code(200).send('');
}