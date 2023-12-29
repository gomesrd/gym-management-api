import {FastifyReply, FastifyRequest} from "fastify";
import {
  createMember,
  deleteMember,
  findUniqueMember,
  findMemberByEmail,
  findManyMembers,
  updateMember, findUniqueMemberResume
} from "./member.repository";
import {CreateMemberInput, UpdateMember} from "./member.schema";
import {invalidLoginMessage} from "./member.mesages";
import {verifyPassword} from "../../utils/hash";
import {server} from "../../app";
import {Filters, LoginInput} from "../../utils/common.schema";
import {verifyPermissionActionOnlyMember} from "../../utils/permissions.service";
import {MemberId} from "../../utils/types";
import {replyErrorDefault} from "../../utils/error";

export async function registerMemberHandler(request: FastifyRequest<{
  Body: CreateMemberInput
}>, reply: FastifyReply) {
  const body = request.body;
  try {
    const member = await createMember(body);
    return reply.code(201).send(member)
  } catch (e: any) {
    if (e.code === 'P2002') {
      return reply.code(400).send({
        message: 'Member already exists'
      })
    }
    console.log(e)
    return replyErrorDefault(reply)
  }
  // TODO - REFATORAR A VALIDAÇÃO SE O EMAIL JÁ EXISTE
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
  if (!correctPassword) {
    return reply.code(401).send(invalidLoginMessage());
  }

  try {
    const {id, name} = member;
    const dataMember = {id, name};
    const expiresIn = 60 * 120;
    const accessToken = {accessToken: server.jwt.sign(dataMember, {expiresIn})}
    return reply.code(200).send(accessToken);

  } catch (e) {
    console.log(e)
    return replyErrorDefault(reply)
  }

}

export async function getUniqueMemberHandler(request: FastifyRequest<{
  Params: MemberId;
}>, reply: FastifyReply) {
  const userId = request.user.id;
  const memberId = request.params.member_id

  try {
    const findMember = await findUniqueMember(memberId, userId);
    return reply.code(200).send(findMember)

  } catch (e) {
    console.log(e)
    return replyErrorDefault(reply)
  }
}

export async function getUniqueMemberHandlerResume(request: FastifyRequest<{
  Params: MemberId;
}>, reply: FastifyReply) {
  const memberId = request.params.member_id

  try {
    const findMember = await findUniqueMemberResume(memberId);
    return reply.code(200).send(findMember)
  } catch (e) {
    console.log(e)
    return replyErrorDefault(reply)
  }
}

export async function getManyMembersHandler(request: FastifyRequest<{
  Querystring: Filters;
}>, reply: FastifyReply) {
  const filters = request.query;
  const userId = request.user.id;

  try {
    const findMembers = await findManyMembers(filters, userId);
    return reply.code(200).send(findMembers)
  } catch (e) {
    console.log(e)
    return replyErrorDefault(reply)
  }
}

export async function updateMemberHandler(request: FastifyRequest<{
  Body: UpdateMember;
  Params: MemberId;
}>, reply: FastifyReply) {
  const userId = request.user.id;
  const dataUpdate = request.body;
  const memberId = request.params.member_id
  await verifyPermissionActionOnlyMember(userId, memberId);

  try {
    const update = updateMember(
      dataUpdate,
      memberId,
    );
    return reply.code(200).send(update)
  } catch (e) {
    console.log(e)
    return replyErrorDefault(reply)
  }
}

export async function deleteMemberHandler(request: FastifyRequest<{
  Params: MemberId;
}>, reply: FastifyReply) {
  const userId = request.user.id;
  const memberId = request.params.member_id;
  await verifyPermissionActionOnlyMember(userId, memberId);
  await deleteMember(memberId);

  try {
    return reply.code(204).send('');
  } catch (e) {
    console.log(e)
    return replyErrorDefault(reply)
  }
}