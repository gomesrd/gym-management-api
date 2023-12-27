import prisma from "../../../config/prisma";
import {CreateTrainingReplacement} from "../training.schema";

export async function createTrainingReplacement(input: CreateTrainingReplacement) {

  return prisma.trainingReplacement.create({
    data: input
  });
}