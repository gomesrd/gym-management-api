import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'
import {
  dateCreatedUpdated,
  loginResponseSchema,
  loginSchema,
  pageableQueryString,
  responseManyDefault,
  userPassword,
  usersAddress
} from '../../utils/common.schema'

const memberId = {
  id: z.string()
}

const memberCore = {
  name: z.string(),
  cpf: z.string(),
  birth_date: z.string(),
  email: z.string().email(),
  phone: z.string(),
  deleted: z.boolean().optional().default(false)
}

const memberResume = {
  ...memberId,
  name: z.string(),
  deleted: z.boolean(),
  member: z.object({
    id: z.string(),
    user_id: z.string(),
    MemberPlan: z
        .array(
            z.object({
              id: z.string(),
              member_id: z.string(),
            })
        )
        .optional()
  })
}

const updateMemberSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  birth_date: z.string().optional()
})

const findUniqueResume = {
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  birth_date: z.string(),
  deleted: z.boolean()
}
export const queryAllMembersSchema = {
  type: 'object',
  properties: {
    cpf: { type: 'string', description: 'CPF' },
    email: { type: 'string', description: 'Email' },
    deleted: { type: 'string', description: 'true or false' },
    name: { type: 'string', description: 'Name' },
    ...pageableQueryString
  },
  required: ['page', 'pageSize']
}

export const memberIdSchema = {
  type: 'object',
  properties: {
    member_id: { type: 'string', description: 'Member Id' }
  }
}

const memberFindUniqueResume = {
  ...memberId,
  ...findUniqueResume,
  ...dateCreatedUpdated
}

const memberFindMany = {
  data: z.array(
    z.object({
      ...memberResume
    })
  )
}

const memberFindUnique = {
  ...memberId,
  ...memberCore,
  ...usersAddress,
  ...dateCreatedUpdated
}

const createMemberSchema = z.object({
  ...memberCore,
  ...usersAddress,
  ...userPassword
})

const MemberUniqueResponseSchema = z.object({
  ...memberFindUnique
})

const MembersAllResponseSchema = z.object({
  ...responseManyDefault,
  ...memberFindMany
})

const MemberResumeResponseSchema = z.object({
  ...memberFindUniqueResume
})

export type CreateMemberInput = z.infer<typeof createMemberSchema>
export type UpdateMember = z.infer<typeof updateMemberSchema>

export const { schemas: memberSchemas, $ref } = buildJsonSchemas(
  {
    createMemberSchema,
    MemberUniqueResponseSchema,
    MembersAllResponseSchema,
    updateMemberSchema,
    MemberResumeResponseSchema,
    loginSchema,
    loginResponseSchema
  },
  { $id: 'memberSchemas' }
)
