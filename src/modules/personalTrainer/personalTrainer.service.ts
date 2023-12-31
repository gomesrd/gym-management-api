import {FastifyReply, FastifyRequest} from "fastify";
import {
  createPersonalTrainer,
  deletePersonalTrainer,
  findManyPersonalTrainers,
  findPersonalTrainerByEmailCpf,
  findPersonalTrainerById,
  findUniquePersonalTrainer,
  updatePersonalTrainer
} from "./personalTrainer.repository";
import {
  CreatePersonalTrainerInput,
  PersonalTrainersManyResponse,
  UpdatePersonalTrainer
} from "./personalTrainer.schema";
import {hashPassword, verifyPassword} from "../../utils/hash";
import {server} from "../../app";
import {parseFiltersPermission} from "../../utils/parseFilters";
import {queryUserRole} from "../../utils/permissions.service";
import {PersonalTrainerId} from "../../utils/types";
import {
  Filters,
  invalidLogin,
  LoginInput,
  personalTrainerExists,
  personalTrainerNotFound
} from "../../utils/common.schema";
import {replyErrorDefault} from "../../utils/error";

export async function registerPersonalTrainerHandler(request: FastifyRequest<{
  Body: CreatePersonalTrainerInput
}>, reply: FastifyReply) {
  const body = request.body;
  const password = body.password;
  const {hash, salt} = hashPassword(password);
  const cpf = body.cpf;

  const personalTrainer = await findPersonalTrainerByEmailCpf(undefined, cpf);
  console.log(personalTrainer)
  if (personalTrainer) return reply.code(401).send(personalTrainerExists)

  try {
    const personalTrainer = await createPersonalTrainer(body, hash, salt);
    return reply.code(201).send(personalTrainer)
  } catch (e: any) {
    console.log(e)
    return replyErrorDefault(reply)
  }
}

export async function loginHandler(request: FastifyRequest<{
  Body: LoginInput
}>, reply: FastifyReply) {
  const body = request.body;
  const email = body.email;
  const personalTrainer = await findPersonalTrainerByEmailCpf(email);
  if (!personalTrainer) return reply.code(401).send(invalidLogin)


  const correctPassword = verifyPassword(
    {
      candidatePassword: body.password,
      salt: personalTrainer.salt,
      hash: personalTrainer.password
    }
  )

  if (!correctPassword) {
    return reply.code(401).send(invalidLogin);
  }

  try {
    const {id, name, role} = personalTrainer;
    const personalTrainerData = {id, name, role};
    // const expiresIn = 60 * 120;
    const accessToken = server.jwt.sign(personalTrainerData);
    return reply.code(200).send({accessToken});

  } catch (e) {
    console.log(e)
    return replyErrorDefault(reply)
  }
}

export async function getUniquePersonalTrainerHandler(request: FastifyRequest<{
  Params: PersonalTrainerId;
}>, reply: FastifyReply) {
  const userId = request.user.id;
  const personalTrainerId = request.params.personal_trainer_id
  const filters = await parseFiltersPermission(userId, personalTrainerId);

  try {
    const findPersonalTrainer = await findUniquePersonalTrainer(filters)

    if (!findPersonalTrainer) {
      return reply.code(202).send(personalTrainerNotFound);
    }
    return reply.code(200).send(findPersonalTrainer)
  } catch (e) {
    console.log(e)
    return replyErrorDefault(reply)
  }
}

export async function getManyPersonalTrainersHandler(request: FastifyRequest<{
  Querystring: Filters;
}>, reply: FastifyReply): Promise<PersonalTrainersManyResponse | undefined> {
  const filters = request.query

  try {
    const findPersonalTrainers = await findManyPersonalTrainers(filters);

    if (!findPersonalTrainers) {
      return reply.code(204).send(personalTrainerNotFound);
    }
    return reply.code(200).send(findPersonalTrainers)

  } catch (e) {
    console.log(e)
    return replyErrorDefault(reply)
  }
}

export async function updatePersonalTrainerHandler(request: FastifyRequest<{
  Body: UpdatePersonalTrainer;
  Params: PersonalTrainerId;
}>, reply: FastifyReply) {
  const userId = request.user.id;
  const dataUpdate = request.body;
  const personalTrainerId = request.params.personal_trainer_id
  const userRole = await queryUserRole(userId);

  if (userRole !== 'admin' && userId !== personalTrainerId) return reply.code(403).send('You can only update your own data');
  const personalTrainer = await findPersonalTrainerByIdHandler(personalTrainerId);
  if (!personalTrainer) return reply.code(202).send(personalTrainerNotFound);

  try {
    const update = updatePersonalTrainer(dataUpdate, personalTrainerId);
    return reply.code(200).send(update)

  } catch (e) {
    console.log(e)
    return replyErrorDefault(reply)
  }
}


export async function deletePersonalTrainerHandler(request: FastifyRequest<{
  Params: PersonalTrainerId;
}>, reply: FastifyReply) {
  const personalTrainerId = request.params.personal_trainer_id;
  const personalTrainer = await findPersonalTrainerByIdHandler(personalTrainerId);
  if (!personalTrainer) return reply.code(202).send(personalTrainerNotFound);

  try {
    await deletePersonalTrainer(personalTrainerId);
    return reply.code(204).send('');
  } catch (e) {
    console.log(e)
    return replyErrorDefault(reply)
  }
}

export async function findPersonalTrainerByIdHandler(personalTrainerId: string) {
  return await findPersonalTrainerById(personalTrainerId);
}