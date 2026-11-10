import { CATEGORIES } from '../constants/categories.js';

const objectId = { type: 'string', example: '6aee2158daca1f6553c72d50' };

const errorResponse = (description, message) => ({
  description,
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/Error' },
      example: { message },
    },
  },
});

const validationResponse = {
  description: 'Validation failed',
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/ValidationError' },
    },
  },
};

const unauthorizedResponse = errorResponse(
  'Missing, invalid or expired access token',
  'Access token expired',
);

const json = (schema) => ({ 'application/json': { schema } });

export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'E-Pharmacy API',
    version: '1.0.0',
    description:
      'Backend for the E-Pharmacy app: products, pharmacies, reviews, user auth and cart.',
  },
  servers: [{ url: '/' }],
  tags: [
    { name: 'User', description: 'Registration, login and session' },
    { name: 'Products', description: 'Medicines catalog' },
    { name: 'Stores', description: 'Pharmacies' },
    { name: 'Reviews', description: 'Customer reviews' },
    { name: 'Cart', description: 'Cart and checkout (private)' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'UUID',
        description: 'accessToken from /api/user/login or /api/user/refresh',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: { message: { type: 'string' } },
      },
      ValidationError: {
        type: 'object',
        properties: {
          statusCode: { type: 'integer', example: 400 },
          error: { type: 'string', example: 'Bad Request' },
          message: { type: 'string', example: 'Validation failed' },
          validation: {
            type: 'object',
            example: {
              body: {
                source: 'body',
                keys: ['phone'],
                message: 'Phone must be in format +380XXXXXXXXX',
              },
            },
          },
        },
      },
      Product: {
        type: 'object',
        properties: {
          _id: objectId,
          photo: {
            type: 'string',
            example: 'https://i.ibb.co/bLKP624/5-15-1000x1000-min.jpg',
          },
          name: { type: 'string', example: 'Aspirin' },
          suppliers: { type: 'string', example: 'Square' },
          stock: { type: 'integer', example: 12 },
          price: { type: 'number', example: 89.66 },
          category: { type: 'string', enum: CATEGORIES },
        },
      },
      ProductsList: {
        type: 'object',
        properties: {
          page: { type: 'integer', example: 1 },
          perPage: { type: 'integer', example: 12 },
          totalItems: { type: 'integer', example: 60 },
          totalPage: { type: 'integer', example: 5 },
          products: {
            type: 'array',
            items: { $ref: '#/components/schemas/Product' },
          },
        },
      },
      Store: {
        type: 'object',
        properties: {
          _id: objectId,
          name: { type: 'string', example: 'Pharmacy Hope' },
          address: { type: 'string', example: 'Shevchenka St, 100' },
          city: { type: 'string', example: 'Lviv' },
          phone: { type: 'string', example: '0322-45-67-89' },
          rating: { type: 'number', example: 4 },
        },
      },
      Review: {
        type: 'object',
        properties: {
          _id: objectId,
          name: { type: 'string', example: 'Maria Tkachuk' },
          testimonial: { type: 'string' },
        },
      },
      User: {
        type: 'object',
        properties: {
          _id: objectId,
          name: { type: 'string', example: 'Den' },
          email: { type: 'string', example: 'den@mail.com' },
          phone: { type: 'string', example: '+380707614324' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Tokens: {
        type: 'object',
        properties: {
          accessToken: { type: 'string', format: 'uuid' },
          refreshToken: { type: 'string', format: 'uuid' },
        },
      },
      Cart: {
        type: 'object',
        properties: {
          products: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                productId: { $ref: '#/components/schemas/Product' },
                quantity: { type: 'integer', example: 2 },
              },
            },
          },
          totalPrice: { type: 'number', example: 179.32 },
        },
      },
      Order: {
        type: 'object',
        properties: {
          _id: objectId,
          userId: objectId,
          name: { type: 'string', example: 'Den' },
          email: { type: 'string', example: 'den@mail.com' },
          phone: { type: 'string', example: '+380707614324' },
          address: { type: 'string', example: 'Khreshchatyk 1' },
          paymentMethod: { type: 'string', enum: ['Cash', 'Bank'] },
          products: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                productId: objectId,
                quantity: { type: 'integer', example: 2 },
                price: { type: 'number', example: 89.66 },
              },
            },
          },
          totalPrice: { type: 'number', example: 179.32 },
          status: { type: 'string', example: 'Pending' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  paths: {
    '/api/user/register': {
      post: {
        tags: ['User'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: json({
            type: 'object',
            required: ['name', 'email', 'phone', 'password'],
            properties: {
              name: { type: 'string', minLength: 2, maxLength: 32 },
              email: { type: 'string', format: 'email' },
              phone: {
                type: 'string',
                pattern: '^\\+380\\d{9}$',
                example: '+380707614324',
              },
              password: {
                type: 'string',
                minLength: 8,
                description:
                  'At least one letter, one number and one special character',
                example: 'Pass123!',
              },
            },
          }),
        },
        responses: {
          201: {
            description: 'User created',
            content: json({ $ref: '#/components/schemas/User' }),
          },
          400: validationResponse,
          409: errorResponse('Email already registered', 'Email in use'),
        },
      },
    },
    '/api/user/login': {
      post: {
        tags: ['User'],
        summary: 'Log in and get tokens',
        requestBody: {
          required: true,
          content: json({
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: { type: 'string', example: 'den@mail.com' },
              password: { type: 'string', example: 'Pass123!' },
            },
          }),
        },
        responses: {
          200: {
            description:
              'Logged in. Access token lives 15 minutes, refresh token 1 day',
            content: json({
              allOf: [
                { $ref: '#/components/schemas/Tokens' },
                {
                  type: 'object',
                  properties: { user: { $ref: '#/components/schemas/User' } },
                },
              ],
            }),
          },
          400: validationResponse,
          401: errorResponse('Wrong email or password', 'Invalid credentials'),
        },
      },
    },
    '/api/user/refresh': {
      post: {
        tags: ['User'],
        summary: 'Get a new token pair by refresh token',
        requestBody: {
          required: true,
          content: json({
            type: 'object',
            required: ['refreshToken'],
            properties: { refreshToken: { type: 'string', format: 'uuid' } },
          }),
        },
        responses: {
          200: {
            description: 'New tokens, the old session is removed',
            content: json({ $ref: '#/components/schemas/Tokens' }),
          },
          400: validationResponse,
          401: errorResponse(
            'Session not found or refresh token expired',
            'Refresh token expired',
          ),
        },
      },
    },
    '/api/user/logout': {
      get: {
        tags: ['User'],
        summary: 'Log out (removes the session)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Logged out',
            content: json({ $ref: '#/components/schemas/Error' }),
          },
          401: unauthorizedResponse,
        },
      },
    },
    '/api/user/user-info': {
      get: {
        tags: ['User'],
        summary: 'Current user name and email',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'User info',
            content: json({
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Den' },
                email: { type: 'string', example: 'den@mail.com' },
              },
            }),
          },
          401: unauthorizedResponse,
        },
      },
    },
    '/api/products': {
      get: {
        tags: ['Products'],
        summary: 'Medicines list with search, filter and pagination',
        parameters: [
          {
            name: 'name',
            in: 'query',
            description: 'Search by name, case-insensitive',
            schema: { type: 'string' },
          },
          {
            name: 'category',
            in: 'query',
            schema: { type: 'string', enum: CATEGORIES },
          },
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', minimum: 1, default: 1 },
          },
          {
            name: 'perPage',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 50, default: 12 },
          },
        ],
        responses: {
          200: {
            description: 'Products page',
            content: json({ $ref: '#/components/schemas/ProductsList' }),
          },
          400: validationResponse,
        },
      },
    },
    '/api/products/{productId}': {
      get: {
        tags: ['Products'],
        summary: 'Product details',
        parameters: [
          {
            name: 'productId',
            in: 'path',
            required: true,
            schema: objectId,
          },
        ],
        responses: {
          200: {
            description: 'Product',
            content: json({ $ref: '#/components/schemas/Product' }),
          },
          400: validationResponse,
          404: errorResponse('No product with this id', 'Product not found'),
        },
      },
    },
    '/api/stores': {
      get: {
        tags: ['Stores'],
        summary: 'All pharmacies',
        responses: {
          200: {
            description: 'Pharmacies',
            content: json({
              type: 'array',
              items: { $ref: '#/components/schemas/Store' },
            }),
          },
        },
      },
    },
    '/api/stores/nearest': {
      get: {
        tags: ['Stores'],
        summary: 'Nearest pharmacies',
        responses: {
          200: {
            description: 'Nearest pharmacies',
            content: json({
              type: 'array',
              items: { $ref: '#/components/schemas/Store' },
            }),
          },
        },
      },
    },
    '/api/customer-reviews': {
      get: {
        tags: ['Reviews'],
        summary: 'Customer reviews',
        responses: {
          200: {
            description: 'Reviews',
            content: json({
              type: 'array',
              items: { $ref: '#/components/schemas/Review' },
            }),
          },
        },
      },
    },
    '/api/cart': {
      get: {
        tags: ['Cart'],
        summary: 'Cart items and total price',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Cart (empty if nothing was added yet)',
            content: json({ $ref: '#/components/schemas/Cart' }),
          },
          401: unauthorizedResponse,
        },
      },
    },
    '/api/cart/update': {
      put: {
        tags: ['Cart'],
        summary: 'Set product quantity in cart (0 removes it)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: json({
            type: 'object',
            required: ['productId', 'quantity'],
            properties: {
              productId: objectId,
              quantity: { type: 'integer', minimum: 0, example: 2 },
            },
          }),
        },
        responses: {
          200: {
            description: 'Updated cart',
            content: json({ $ref: '#/components/schemas/Cart' }),
          },
          400: errorResponse(
            'Validation failed or not enough stock',
            'Only 12 items in stock',
          ),
          401: unauthorizedResponse,
          404: errorResponse('No product with this id', 'Product not found'),
        },
      },
    },
    '/api/cart/checkout': {
      post: {
        tags: ['Cart'],
        summary: 'Place an order from the cart',
        description:
          'Creates an order, decreases products stock and clears the cart.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: json({
            type: 'object',
            required: ['name', 'email', 'phone', 'address'],
            properties: {
              name: { type: 'string', example: 'Den' },
              email: { type: 'string', example: 'den@mail.com' },
              phone: { type: 'string', example: '+380707614324' },
              address: { type: 'string', example: 'Khreshchatyk 1' },
              paymentMethod: {
                type: 'string',
                enum: ['Cash', 'Bank'],
                default: 'Cash',
              },
            },
          }),
        },
        responses: {
          201: {
            description: 'Order created',
            content: json({ $ref: '#/components/schemas/Order' }),
          },
          400: errorResponse(
            'Validation failed, empty cart or not enough stock',
            'Cart is empty',
          ),
          401: unauthorizedResponse,
        },
      },
    },
  },
};
