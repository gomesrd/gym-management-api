import {FastifyReply, FastifyRequest} from "fastify";
import {
  createMember,
  deleteMember,
  findUniqueMember,
  findMemberByEmail,
  findManyMembers,
  updateMember, findUniqueMemberResume
} from "./member.repository";
import {CreateMemberInput, DeleteMember, LoginInput, MemberId, UpdateMember} from "./member.schema";
import {invalidLoginMessage} from "./member.mesages";
import {verifyPassword} from "../../utils/hash";
import {server} from "../../app";
import {Filters} from "../../utils/common.schema";
import {verifyPermissionActionOnlyMember} from "../../utils/permissions.service";

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
  const memberId = request.params.id

  return findUniqueMember(memberId, userId);
}

export async function getUniqueMemberHandlerResume(request: FastifyRequest<{
  Params: MemberId;
}>) {
  const memberId = request.params.id

  return findUniqueMemberResume(memberId);
}

export async function getManyMembersHandler(request: FastifyRequest<{
  Querystring: Filters;
}>) {
  const filters = request.query;
  const userId = request.user.id;

  try {
    return findManyMembers(filters, userId);
  } catch (e) {
    console.log(e)
  }
}

export async function updateMemberHandler(request: FastifyRequest<{
  Body: UpdateMember;
  Params: MemberId;
}>) {
  const userId = request.user.id;
  const dataUpdate = request.body;
  const memberId = request.params.id
  await verifyPermissionActionOnlyMember(userId, memberId);

  return updateMember(
    dataUpdate,
    memberId,
  );
}

export async function deleteMemberHandler(request: FastifyRequest<{
  Params: DeleteMember;
}>, reply: FastifyReply) {
  const userId = request.user.id;
  const memberId = request.params.id;
  await verifyPermissionActionOnlyMember(userId, memberId);
  await deleteMember(memberId);
  return reply.code(200).send('');
}