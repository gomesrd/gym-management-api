import prisma from "../../config/prisma";
import {CreateMemberInput, DeleteMember, MemberId, UpdateMember} from "./member.schema";
import {hashPassword} from "../../utils/hash";

export async function createMember(input: CreateMemberInput) {
    const {password, ...rest} = input;
    const {hash, salt} = hashPassword(password);

    return prisma.member.create({
        data: {...rest, salt, password: hash},
    });
}

export async function findMemberByEmail(email: string) {
    return prisma.member.findUnique({
        where: {email},
    });

}

export async function findManyMembers() {
    return prisma.member.findMany({
        select: {
            id: true,
            name: true,
            email: false,
            phone: true,
            birth_date: false,
            created_at: false,
            updated_at: false,
            salt: false,
            password: false,
        }
    });
}

export async function findUniqueMember(data: MemberId & {
    user_id: string, user_role: string
}) {
    const id = (data.user_role === 'admin' || 'personal_trainer') ? data.id : data.user_id;
    return prisma.member.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            name: true,
            birth_date: true,
            email: true,
            phone: true,
            created_at: true,
            updated_at: true,
            salt: false,
            password: false,
        }
    });
}

export async function updateMember(data: UpdateMember, params: MemberId & {
    user_id: string, user_role: string
}) {
    if (params.user_role !== 'admin' && params.user_id !== params.id) {
        return Promise.reject('You do not have permission to realize this action');
    }
    return prisma.member.update({
        where: {
            id: params.id
        },
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            birth_date: data.birth_date,
        }
    });
}

export async function deleteMember(params: DeleteMember & {
    user_id: string, user_role: string
}) {
    if (params.user_role !== 'admin' && params.user_id !== params.id) {
        return Promise.reject('You do not have permission to realize this action');
    }
    return prisma.member.delete({
        where: {
            id: params.id,
        }
    })
}