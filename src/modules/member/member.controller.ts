import {FastifyInstance} from "fastify";
import {
  deleteMemberHandler, getUniqueMemberHandler, getManyMembersHandler, loginHandler,
  registerMemberHandler, updateMemberHandler, getUniqueMemberHandlerResume
} from "./member.service";
import {$ref, memberIdSchema, queryAllMembersSchema} from "./member.schema";

async function memberRoutes(server: FastifyInstance) {
  server.get('', {
    preHandler: [server.authenticate, server.authorizationLimited],
    schema: {
      tags: ['Member'],
      summary: 'Get all members',
      querystring: queryAllMembersSchema,
      response: {
        200: $ref('MembersResponseSchema')
      },

    },
  }, getManyMembersHandler);

  server.get('/:member_id', {
    preHandler: [server.authenticate, server.authorizationMember],
    schema: {
      tags: ['Member'],
      summary: 'Get all data a specific member',
      params: memberIdSchema,
      response: {
        200: $ref('MemberResponseSchema')
      }

    },
  }, getUniqueMemberHandler);

  server.get('/resume/:member_id', {
    preHandler: [server.authenticate, server.authorizationLimited],
    schema: {
      tags: ['Member'],
      summary: 'Get resume data a specific member',
      params: memberIdSchema,
      response: {
        200: $ref('MemberResumeResponseSchema')
      }

    },
  }, getUniqueMemberHandlerResume);

  server.post('/register', {
    schema: {
      tags: ['Member'],
      body: $ref('createMemberSchema'),
      summary: 'Create a new member',
      response: {
        201: $ref('createMemberResponseSchema'),
      },
    }
  }, registerMemberHandler);

  server.post('/login', {
    schema: {
      tags: ['Member'],
      body: $ref('loginSchema'),
      summary: 'Login in the application',
      response: {
        200: $ref('loginResponseSchema')
      }
    }
  }, loginHandler);

  server.put('/:member_id', {
      preHandler: [server.authenticate, server.authorizationMember],
      schema: {
        tags: ['Member'],
        summary: 'Update a specific member',
        params: memberIdSchema,
        body: $ref('updateMemberSchema'),
        response: {
          200: $ref('updateMemberSchema')
        }
      }
    }, updateMemberHandler
  );

  server.delete('/:member_id', {
      preHandler: [server.authenticate, server.authorizationMember],
      schema: {
        tags: ['Member'],
        summary: 'Delete a specific member',
        params: memberIdSchema,
        response: {
          200: {
            type: 'object',
            properties: {
              message: {type: 'string', example: ''}
            }
          }
        }
      }
    }, deleteMemberHandler
  );
}

export default memberRoutes;