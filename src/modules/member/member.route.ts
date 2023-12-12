import {FastifyInstance} from "fastify";
import {
  deleteMemberHandler, getUniqueMemberHandler, getManyMembersHandler, loginHandler,
  registerMemberHandler, updateMemberHandler, disableMemberHandler
} from "./member.controller";
import {$ref} from "./member.schema";

async function memberRoutes(server: FastifyInstance) {
  server.get('', {
    preHandler: [server.authenticate, server.authorizationExclusive],
    schema: {
      tags: ['Member'],
      summary: 'Get all members',
      response: {
        200: {
          type: 'array',
          items: $ref('MembersResponseSchema')
        },
      },

    },
  }, getManyMembersHandler);

  server.get('/:id', {
    preHandler: [server.authenticate],
    schema: {
      tags: ['Member'],
      summary: 'Get a specific member',
      params: {
        id: {type: 'string'},
      },
      response: {
        200: $ref('MemberResponseSchema')
      }

    },
  }, getUniqueMemberHandler);

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

  server.put('/:id', {
      preHandler: [server.authenticate, server.authorizationMember],
      schema: {
        tags: ['Member'],
        summary: 'Update a specific member',
        params: {
          id: {type: 'string'},
        },
        body: $ref('updateMemberSchema'),
        response: {
          200: $ref('MemberResponseSchema')
        }
      }
    }, updateMemberHandler
  );

  server.put('/disable/:id', {
      preHandler: [server.authenticate, server.authorizationExclusive],
      schema: {
        tags: ['Training'],
        summary: 'Disable a specific Member',
        params: {
          id: {type: 'string'},
        },
        body: $ref('updateMemberSchema'),
        response: {
          200: {
            type: 'object',
            properties: {
              message: {type: 'string', example: ''}
            }
          }
        },
      }
    }, disableMemberHandler
  );

  server.delete('/:id', {
      preHandler: [server.authenticate, server.authorizationMember],
      schema: {
        tags: ['Member'],
        summary: 'Delete a specific member',
        params: {
          id: {type: 'string'},
        },
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