import prisma from "../../utils/prisma";
import {
    CreatePersonalTrainerInput,
    DeletePersonalTrainer, PersonalTrainerId,
    UpdatePersonalTrainer
} from "./personalTrainer.schema";
import {hashPassword} from "../../utils/hash";
import {verifyUserRole} from "../auth/authorization";

export async function createPersonalTrainer(input: CreatePersonalTrainerInput) {
    const {password, ...rest} = input;
    const {hash, salt} = hashPassword(password);
    return prisma.personalTrainer.create({
        data: {...rest, salt, password: hash},
    });
}

export async function findPersonalTrainerByEmail(email: string) {
    return prisma.personalTrainer.findUnique({
        where: {email},
    });
}

export async function findUniquePersonalTrainer(data: PersonalTrainerId & {
    user_id: string,
    user_role: string
}) {
    const id = (data.user_role !== 'admin') ? data.user_id : data.id;

    return prisma.personalTrainer.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            name: true,
            cpf: true,
            occupation: true,
            email: true,
            phone: true,
            password: false,
            salt: false,
            role: false,
            created_at: true,
            updated_at: true,
        }
    });
}


export async function findManyPersonalTrainers() {
    return prisma.personalTrainer.findMany({
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

export async function deletePersonalTrainer(data: DeletePersonalTrainer) {

    return prisma.personalTrainer.delete({
        where: {
            id: data.id
        }
    });
}