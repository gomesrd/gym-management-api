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

const memberCore = {
    name: z.string(),
    birth_date: z.string(),
    email: z.string({
        required_error: emailRequired(),
        invalid_type_error: emailInvalid(),
    }).email(),
    phone: z.string(),
};

const memberResume = {
    name: z.string(),
    phone: z.string().optional(),
};

const memberFindUnique = {
    ...memberId,
    ...memberCore,
    ...memberDate,
};

const memberFindMany = {
    ...memberId,
    ...memberResume
};

const memberPassword = {
    password: z.string({
        required_error: passwordRequired(),
        invalid_type_error: passwordInvalid()
    })
};

const createMemberSchema = z.object({
    ...memberCore,
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
    ...memberFindMany
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

export const {schemas: memberSchemas, $ref} = buildJsonSchemas({
    createMemberSchema,
    createMemberResponseSchema,
    loginSchema,
    loginResponseSchema,
    MemberResponseSchema,
    MemberIdSchema,
    MembersResponseSchema,
    updateMemberSchema,
}, {$id: "memberSchemas"});