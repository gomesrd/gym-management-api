import { FastifyReply, FastifyRequest } from 'fastify'
import {
  createMember,
  deleteMember,
  findUniqueMember,
  findMemberByEmailCpf,
  findManyMembers,
  updateMember,
  findUniqueMemberResume,
  findMemberById
} from './member.repository'
import { CreateMemberInput, UpdateMember } from './member.schema'
import { verifyPassword } from '../../utils/hash'
import { server } from '../../app'
import {
  Filters,
  invalidLogin,
  LoginInput,
  memberExists,
  memberNotFound,
  noPermissionAction
} from '../../utils/common.schema'
import { verifyPermissionActionOnlyMember } from '../../utils/permissions.service'
import { MemberId } from '../../utils/types'
import { replyErrorDefault } from '../../utils/error'
import { parseFiltersPermission } from '../../utils/parseFilters'
import { findPersonalTrainerById } from '../personalTrainer/personalTrainer.repository'

export async function getManyMembersHandler(
  request: FastifyRequest<{
    Querystring: Filters
  }>,
  reply: FastifyReply
) {
  const filters = request.query
  const userId = request.user.id

  try {
    const findMembers = await findManyMembers(filters, userId)

    if (!findMembers) {
      return reply.code(204).send(memberNotFound)
    }

    return reply.code(200).send(findMembers)
  } catch (e) {
    console.log(e)

    return replyErrorDefault(reply)
  }
}

export async function getUniqueMemberHandler(
  request: FastifyRequest<{
    Params: MemberId
  }>,
  reply: FastifyReply
) {
  const userId = request.user.id
  const memberId = request.params.member_id
  const parseFilters = await parseFiltersPermission(userId, memberId)

  try {
    const findMember = await findUniqueMember(parseFilters)

    if (!findMember) {
      return reply.code(202).send(memberNotFound)
    }

    return reply.code(200).send(findMember)
  } catch (e) {
    console.log(e)

    return replyErrorDefault(reply)
  }
}

export async function getUniqueMemberHandlerResume(
  request: FastifyRequest<{
    Params: MemberId
  }>,
  reply: FastifyReply
) {
  const memberId = request.params.member_id

  try {
    const findMember = await findUniqueMemberResume(memberId)

    if (!findMember) {
      return reply.code(202).send(memberNotFound)
    }

    return reply.code(200).send(findMember)
  } catch (e) {
    console.log(e)

    return replyErrorDefault(reply)
  }
}

export async function registerMemberHandler(
  request: FastifyRequest<{
    Body: CreateMemberInput
  }>,
  reply: FastifyReply
) {
  const body = request.body
  const cpf = body.cpf

  const verifyMember = await findMemberByEmailCpf(undefined, cpf)
  if (verifyMember) return reply.code(400).send(memberExists)

  try {
    const member = await createMember(body)

    return reply.code(201).send(member)
  } catch (e: any) {
    console.log(e)

    return replyErrorDefault(reply)
  }
}

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginInput
  }>,
  reply: FastifyReply
) {
  const body = request.body
  const email = body.email
  const member = await findMemberByEmailCpf(email)

  if (!member) return reply.code(401).send(invalidLogin)

  try {
    const { id, name } = member
    const dataMember = { id, name }
    const expiresIn = 60 * 120
    const accessToken = { accessToken: server.jwt.sign(dataMember, { expiresIn }) }

    return reply.code(200).send(accessToken)
  } catch (e: any) {
    console.log(e)
    if (e.code === 401) return reply.code(401).send(invalidLogin)

    return replyErrorDefault(reply)
  }
}

export async function updateMemberHandler(
  request: FastifyRequest<{
    Body: UpdateMember
    Params: MemberId
  }>,
  reply: FastifyReply
) {
  const userId = request.user.id
  const dataUpdate = request.body
  const memberId = request.params.member_id
  const parseFilters = await parseFiltersPermission(userId, memberId)

  const member = await findUniqueMember(parseFilters)
  if (!member) return reply.code(202).send(memberNotFound)

  try {
    await verifyPermissionActionOnlyMember(userId, memberId)
    const update = updateMember(dataUpdate, memberId)

    return reply.code(200).send(update)
  } catch (e: any) {
    console.log(e)
    if (e.code === 403) return reply.code(403).send(noPermissionAction)

    return replyErrorDefault(reply)
  }
}

export async function deleteMemberHandler(
  request: FastifyRequest<{
    Params: MemberId
  }>,
  reply: FastifyReply
) {
  const userId = request.user.id
  const memberId = request.params.member_id
  const member = await findMemberByIdHandler(memberId)
  if (!member) return reply.code(202).send(memberNotFound)

  try {
    await verifyPermissionActionOnlyMember(userId, memberId)
    await deleteMember(memberId)

    return reply.code(204).send('')
  } catch (e: any) {
    console.log(e)
    if (e.code === 403) return reply.code(403).send(noPermissionAction)

    return replyErrorDefault(reply)
  }
}

export async function findMemberByIdHandler(memberId: string) {
  return await findMemberById(memberId)
}
