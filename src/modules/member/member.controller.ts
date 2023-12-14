import {FastifyReply, FastifyRequest} from "fastify";
import {
  createMember,
  deleteMember,
  findUniqueMember,
  findMemberByEmail,
  findManyMembers,
  updateMember
} from "./member.service";
import {CreateMemberInput, DeleteMember, LoginInput, MemberId, UpdateMember} from "./member.schema";
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
  return findUniqueMember({
    ...request.params,
    user_id: request.user.id,
    user_role: request.user.role
  });
}

export async function getManyMembersHandler(request: FastifyRequest) {

  try {
    return findManyMembers({
      user_id: request.user.id,
    });
  } catch (e) {
    console.log(e)
  }
}

export async function updateMemberHandler(request: FastifyRequest<{
  Body: UpdateMember;
  Params: MemberId;
}>) {
  return updateMember(
    {
      ...request.body
    },
    {
      ...request.params,
      user_id: request.user.id,
      user_role: request.user.role
    });
}

export async function deleteMemberHandler(request: FastifyRequest<{
  Params: DeleteMember;
}>, reply: FastifyReply) {
  await deleteMember({
    ...request.params,
    user_id: request.user.id,
    user_role: request.user.role
  });
  return reply.code(200).send('');
}