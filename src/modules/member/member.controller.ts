import {FastifyInstance} from "fastify";
import {
  deleteMemberHandler, getUniqueMemberHandler, getManyMembersHandler, loginHandler,
  registerMemberHandler, updateMemberHandler, getUniqueMemberHandlerResume
} from "./member.service";
import {$ref, memberIdSchema, queryAllMembersSchema} from "./member.schema";
import {
  responseDeleteSchema,
  responseIdSchema,
  responseInvalidLogin,
  responseMemberExists, responseMemberNotFound, responseNotAllowed
} from "../../utils/common.schema";
import {memberRoutesPath, memberSummary, tags} from "../../utils/enumsController";

async function memberRoutes(server: FastifyInstance) {
  server.get(memberRoutesPath.findAll, {
    preHandler: [server.authenticate, server.authorizationLimited],
    schema: {
      tags: [tags.member],
      summary: memberSummary.findAll,
      querystring: queryAllMembersSchema,
      response: {
        200: $ref('MembersAllResponseSchema'),
        202: responseMemberNotFound
      },

    },
  }, getManyMembersHandler);

  server.get(memberRoutesPath.findById, {
    preHandler: [server.authenticate, server.authorizationMember],
    schema: {
      tags: [tags.member],
      summary: memberSummary.findById,
      params: memberIdSchema,
      response: {
        200: $ref('MemberUniqueResponseSchema'),
        202: responseMemberNotFound,
      }

    },
  }, getUniqueMemberHandler);

  server.get(memberRoutesPath.resumeAll, {
    preHandler: [server.authenticate, server.authorizationLimited],
    schema: {
      tags: [tags.member],
      summary: memberSummary.resume,
      params: memberIdSchema,
      response: {
        200: $ref('MemberResumeResponseSchema'),
        202: responseMemberNotFound
      }

    },
  }, getUniqueMemberHandlerResume);

  server.post(memberRoutesPath.register, {
    schema: {
      tags: [tags.member],
      body: $ref('createMemberSchema'),
      summary: memberSummary.register,
      response: {
        201: responseIdSchema,
        400: responseMemberExists
      },
    }
  }, registerMemberHandler);

  server.post(memberRoutesPath.login, {
    schema: {
      tags: [tags.member],
      body: $ref('loginSchema'),
      summary: memberSummary.login,
      response: {
        200: $ref('loginResponseSchema'),
        401: responseInvalidLogin
      }
    }
  }, loginHandler);

  server.put(memberRoutesPath.update, {
      preHandler: [server.authenticate, server.authorizationMember],
      schema: {
        tags: [tags.member],
        summary: memberSummary.update,
        params: memberIdSchema,
        body: $ref('updateMemberSchema'),
        response: {
          200: $ref('updateMemberSchema'),
          202: responseMemberNotFound,
          403: responseNotAllowed
        }
      }
    }, updateMemberHandler
  );

  server.delete(memberRoutesPath.delete, {
      preHandler: [server.authenticate, server.authorizationMember],
      schema: {
        tags: [tags.member],
        summary: memberSummary.delete,
        params: memberIdSchema,
        response: {
          202: responseMemberNotFound,
          204: responseDeleteSchema,
          403: responseNotAllowed
        }
      }
    }, deleteMemberHandler
  );
}

export default memberRoutes;