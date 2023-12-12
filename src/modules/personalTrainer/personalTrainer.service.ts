import prisma from "../../config/prisma";
import {
    CreatePersonalTrainerInput, DeletePersonalTrainer, PersonalTrainerId, UpdatePersonalTrainer
} from "./personalTrainer.schema";
import {hashPassword} from "../../utils/hash";

export async function createPersonalTrainer(input: CreatePersonalTrainerInput) {
    const {password, ...rest} = input;
    const {hash, salt} = hashPassword(password);
    return prisma.personalTrainer.create({
        data: {...rest, salt, password: hash},
    });
}

export async function findPersonalTrainerByEmail(email: string) {
    return prisma.personalTrainer.findUnique({
        where: {
            email,
            active: true
        },
    });
}

export async function findUniquePersonalTrainer(data: PersonalTrainerId & {
    user_id: string,
    user_role: string
}) {
    const id = (data.user_role !== 'admin') ? data.user_id : data.id;
    const active = (data.user_role !== 'admin') ? true : undefined;

    return prisma.personalTrainer.findUnique({
        where: {
            id: id,
            active: active
        },
        select: {
            id: true,
            name: true,
            cpf: true,
            birth_date: true,
            occupation: true,
            email: true,
            phone: true,
            address: true,
            address_number: true,
            address_complement: true,
            address_neighborhood: true,
            city: true,
            state: true,
            zip_code: true,
            password: false,
            salt: false,
            role: false,
            created_at: true,
            updated_at: true,
        }
    });
}

export async function findManyPersonalTrainers(data: any & {
    user_role: string,
}) {
    const active = (data.user_role !== 'admin') ? true : undefined;

    return prisma.personalTrainer.findMany({
        where: {
            active: active
        },
        select: {
            id: true,
            name: true,
            cpf: false,
            occupation: false,
            email: false,
            phone: true,
            password: false,
            salt: false,
            role: false,
            created_at: false,
            updated_at: false,
        }
    });
}

export async function updatePersonalTrainer(data: UpdatePersonalTrainer, params: PersonalTrainerId & {
    user_id: string,
    user_role: string
}) {
    if (params.user_role !== 'admin' && params.user_id !== params.id) {
        return Promise.reject('You can only update your own data');
    }
    return prisma.personalTrainer.update({
        where: {
            id: params.id
        },
        data: {
            name: data.name,
            email: data.email,
            occupation: data.occupation,
            phone: data.phone,
        }
    });
}

export async function disablePersonalTrainer(params: PersonalTrainerId) {
    try {
        return await prisma.personalTrainer.update({
            where: {
                id: params.id,
            },
            data: {
                active: false,
            }
        });
    } catch (error) {
        throw error;
    }
}

export async function deletePersonalTrainer(data: DeletePersonalTrainer) {
    return prisma.personalTrainer.delete({
        where: {
            id: data.id
        }
    });
}