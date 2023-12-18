import {z} from 'zod';
import {buildJsonSchemas} from 'fastify-zod'
import {emailInvalid, emailRequired, passwordInvalid, passwordRequired} from "./member.mesages";

const memberId = {
  id: z.string()
}

const memberDate = {
  created_at: z.date(),
  updated_at: z.date(),
};

const memberAddress = {
  address: z.object({
    address: z.string(),
    address_number: z.string(),
    address_complement: z.string().optional(),
    address_neighborhood: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string().optional(),
    zip_code: z.string(),
  }),
};

const memberCore = {
  name: z.string(),
  cpf: z.string(),
  birth_date: z.string(),
  email: z.string(
    {
      required_error: emailRequired(),
      invalid_type_error: emailInvalid()
    }
  ),
  phone: z.string(),
  deleted: z.boolean(),
};

const memberResume = {
  id: z.string(),
  name: z.string(),
  phone: z.string().optional(),
  deleted: z.boolean(),
};

const memberCount = {
  count: z.number()
};

const memberFindUniqueResume = {
  id: z.string(),
  name: z.string(),
  birth_date: z.string(),
  email: z.string(),
  phone: z.string(),
  deleted: z.boolean(),
  ...memberDate
};

const memberFindUnique = {
  ...memberId,
  ...memberCore,
  ...memberAddress,
  ...memberDate,
};

const memberFindMany = {
  data: z.array(z.object({
    ...memberResume
  }))
};

const memberPassword = {
  password: z.string({
    required_error: passwordRequired(),
    invalid_type_error: passwordInvalid()
  })
};

const createMemberSchema = z.object({
  ...memberCore,
  ...memberAddress,
  ...memberPassword,
});

const createMemberResponseSchema = z.object({
  ...memberId
});

const MemberIdSchema = z.object({
  ...memberId
});

const MemberResponseSchema = z.object({
  ...memberFindUnique
});

const MembersResponseSchema = z.object({
  ...memberCount,
  ...memberFindMany
});

const MemberResumeResponseSchema = z.object({
  ...memberFindUniqueResume
});

const filtersSchema = z.object({
  deleted: z.string().default('true')
});


const loginSchema = z.object({
  email: z.string({
    required_error: emailRequired(),
    invalid_type_error: emailInvalid()
  }).email(),
  password: z.string()
});

const loginResponseSchema = z.object({
  accessToken: z.string(),
});

const updateMemberSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  birth_date: z.string().optional(),
});

export type CreateMemberInput = z.infer<typeof createMemberSchema>
export type DeleteMember = z.infer<typeof MemberIdSchema>;
export type LoginInput = z.infer<typeof loginSchema>
export type MemberId = z.infer<typeof MemberIdSchema>;
export type UpdateMember = z.infer<typeof updateMemberSchema>;
export type Filters = z.infer<typeof filtersSchema>;

export const {schemas: memberSchemas, $ref} = buildJsonSchemas({
  createMemberSchema,
  createMemberResponseSchema,
  loginSchema,
  loginResponseSchema,
  MemberResponseSchema,
  MemberIdSchema,
  MembersResponseSchema,
  updateMemberSchema,
  filtersSchema,
  MemberResumeResponseSchema
}, {$id: "memberSchemas"});