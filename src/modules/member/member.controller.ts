import {FastifyReply, FastifyRequest} from "fastify";
import {
  createMember,
  deleteMember,
  findUniqueMember,
  findMemberByEmail,
  findManyMembers,
  updateMember, findUniqueMemberResume
} from "./member.service";
import {CreateMemberInput, DeleteMember, Filters, LoginInput, MemberId, UpdateMember} from "./member.schema";
import {invalidLoginMessage} from "./member.mesages";
import {verifyPassword} from "../../utils/hash";
import {server} from "../../app";

export async function registerMemberHandler(request: FastifyRequest<{
  Body: CreateMemberInput
}>, reply: FastifyReply) {
  const body = request.body;
  try {
    const member = await createMember(body);
    return reply.code(201).send(member)
  } catch (e) {
    return reply.code(500).send(e)
  }
}


export async function loginHandler(request: FastifyRequest<{
  Body: LoginInput
}>, reply: FastifyReply) {
  const body = request.body;

  const member = await findMemberByEmail(body.email);

  if (!member) {
    return reply.code(401).send(invalidLoginMessage())
  }

  const correctPassword = verifyPassword(
    {
      candidatePassword: body.password,
      salt: member.salt,
      hash: member.password
    }
  )

  if (correctPassword) {
    const {id, name} = member;
    const dataMember = {id, name};
    const expiresIn = 60 * 120;
    return {accessToken: server.jwt.sign(dataMember, {expiresIn})};
  }

  return reply.code(401).send(invalidLoginMessage());
}

export async function getUniqueMemberHandler(request: FastifyRequest<{
  Params: MemberId;
}>) {
  const userId = request.user.id;

  return findUniqueMember({
    ...request.params,
  }, userId);
}

export async function getUniqueMemberHandlerResume(request: FastifyRequest<{
  Params: MemberId;
}>) {
  const userId = request.user.id;

  return findUniqueMemberResume({
    ...request.params,
  }, userId);
}

export async function getManyMembersHandler(request: FastifyRequest<{
  Querystring: Filters;
}>) {
  const filters = request.query;
  try {
    return findManyMembers({
      ...filters
    });
  } catch (e) {
    console.log(e)
  }
}

export async function updateMemberHandler(request: FastifyRequest<{
  Body: UpdateMember;
  Params: MemberId;
}>) {
  const userId = request.user.id;
  return updateMember(
    {
      ...request.body
    },
    {
      ...request.params,
    }, userId);
}

export async function deleteMemberHandler(request: FastifyRequest<{
  Params: DeleteMember;
}>, reply: FastifyReply) {
  const userId = request.user.id;
  await deleteMember({
    ...request.params,
  }, userId);
  return reply.code(200).send('');
}