import { FastifyReply, FastifyRequest } from 'fastify'
import { createPlan, deletePlans, getListPlans, getManyPlans, getUniquePlan, updatePlans } from './plans.repository'
import { PlanRegisterInput } from './plans.schema'
import { Filters } from '../../../utils/common.schema'

export async function registerPlanHandler(
  request: FastifyRequest<{
    Body: PlanRegisterInput
  }>,
  reply: FastifyReply
) {
  const body = request.body

  try {
    await createPlan(body)

    return reply.code(201).send('')
  } catch (error: any) {
    console.log(error)

    return reply.code(500).send('Internal server error')
  }
}

export async function getUniquePlanHandler(
  request: FastifyRequest<{
    Params: { plan_id: string }
  }>,
  reply: FastifyReply
) {
  const planId = request.params.plan_id
  try {
    const getPlan = await getUniquePlan(planId)

    return reply.code(200).send(getPlan)
  } catch (error: any) {
    console.log(error)

    return reply.code(500).send('Internal server error')
  }
}

export async function getManyPlansHandler(
  request: FastifyRequest<{
    Querystring: Filters
  }>,
  reply: FastifyReply
) {
  try {
    const filters = request.query
    const getPlans = await getManyPlans(filters)

    return reply.code(200).send(getPlans)
  } catch (error: any) {
    console.log(error)

    return reply.code(500).send('Internal server error')
  }
}

export async function getListPlansHandler(request: FastifyRequest, reply: FastifyReply) {
  try {
    const getPlans = await getListPlans()

    return reply.code(200).send(getPlans)
  } catch (error: any) {
    console.log(error)

    return reply.code(500).send('Internal server error')
  }
}

export async function updatePlansHandler(
  request: FastifyRequest<{
    Body: PlanRegisterInput
    Params: { plan_id: string }
  }>,
  reply: FastifyReply
) {
  const planId = request.params.plan_id
  const dataUpdate = request.body

  try {
    const update = await updatePlans(planId, dataUpdate)

    return reply.code(200).send(update)
  } catch (e: any) {
    console.log(e)

    return reply.code(500).send('Internal server error')
  }
}

export async function deletePlansHandler(
  request: FastifyRequest<{
    Params: { plan_id: string }
  }>,
  reply: FastifyReply
) {
  const planId = request.params.plan_id

  try {
    await deletePlans(planId)

    return reply.code(200).send('')
  } catch (e: any) {
    console.log(e)

    return reply.code(500).send('Internal server error')
  }
}

// TODO: Incluir tratamento para criação de plano que já existe
