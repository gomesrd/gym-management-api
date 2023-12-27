import {FastifyReply, FastifyRequest} from "fastify";
import {
  createPersonalTrainer,
  deletePersonalTrainer,
  findManyPersonalTrainers,
  findPersonalTrainerByEmail,
  findUniquePersonalTrainer,
  updatePersonalTrainer
} from "./personalTrainer.repository";
import {
  CreatePersonalTrainerInput,
  PersonalTrainersManyResponse,
  UpdatePersonalTrainer
} from "./personalTrainer.schema";
import {invalidLoginMessage} from "./personalTrainer.mesages";
import {hashPassword, verifyPassword} from "../../utils/hash";
import {server} from "../../app";
import {parseFiltersPermission} from "../../utils/parseFilters";
import {queryUserRole} from "../../utils/permissions.service";
import {PersonalTrainerId} from "../../utils/types";
import {Filters, LoginInput} from "../../utils/common.schema";

export async function registerPersonalTrainerHandler(request: FastifyRequest<{
  Body: CreatePersonalTrainerInput
}>, reply: FastifyReply) {
  const body = request.body;
  const password = body.password;
  const {hash, salt} = hashPassword(password);


  try {
    const personalTrainer = await createPersonalTrainer(body, hash, salt);
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
  const personalTrainerId = request.params.personal_trainer_id
  const filters = await parseFiltersPermission(userId, personalTrainerId);


  return await findUniquePersonalTrainer(filters)
}

export async function getManyPersonalTrainersHandler(request: FastifyRequest<{
  Querystring: Filters;
}>): Promise<PersonalTrainersManyResponse | undefined> {
  const filters = request.query

  try {
    return await findManyPersonalTrainers(filters);
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
  const dataUpdate = request.body;
  const personalTrainerId = request.params.personal_trainer_id
  const userRole = await queryUserRole(userId);

  if (userRole !== 'admin' && userId !== personalTrainerId) {
    return Promise.reject('You can only update your own data');
  }

  return updatePersonalTrainer(dataUpdate, personalTrainerId);
}


export async function deletePersonalTrainerHandler(request: FastifyRequest<{
  Params: PersonalTrainerId;
}>, reply: FastifyReply) {
  const personalTrainerId = request.params.personal_trainer_id;

  await deletePersonalTrainer(personalTrainerId);
  return reply.code(200).send('');
}