import prisma from "../../../config/prisma";

export async function findPersonalTrainerByEmailCpf(email?: string | undefined, cpf?: string | undefined) {
  return prisma.users.findFirst({
    where: {
      OR: [
        {email: email},
        {cpf: cpf},
      ],
      deleted: false,
    },
  });
}
