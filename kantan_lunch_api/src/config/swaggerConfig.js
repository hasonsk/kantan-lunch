import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Restaurant API',
      version: '1.0.0',
      description: 'API documentation for the Restaurant application',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}/api`,
      },
    ],
    components: {
      schemas: {
        Restaurant: {
          type: 'object',
          required: ['name', 'address'],
          properties: {
            _id: {
              type: 'string',
              description: 'The auto-generated id of the restaurant',
            },
            name: {
              type: 'string',
              description: 'Restaurant name',
            },
            address: {
              type: 'string',
              description: 'Restaurant address',
            },
            rating: {
              type: 'number',
              description: 'Restaurant rating',
              minimum: 0,
              maximum: 5,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the restaurant was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the restaurant was last updated',
            },
          },
          example: {
            _id: "60d5f9f9f9f9f9f9f9f9f9f9",
            name: "The Gourmet Kitchen",
            address: "123 Culinary Street, Flavor Town",
            rating: 4.5,
            createdAt: "2023-08-01T12:34:56.789Z",
            updatedAt: "2023-08-10T08:21:45.123Z"
          },
        },
        RestaurantInput: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Restaurant name',
            },
            address: {
              type: 'string',
              description: 'Restaurant address',
            },
            rating: {
              type: 'number',
              description: 'Restaurant rating',
              minimum: 0,
              maximum: 5,
            },
          },
          example: {
            name: "The Gourmet Kitchen",
            address: "123 Culinary Street, Flavor Town",
            rating: 4.5
          },
        },
      },
    },
  },
  // Only include route files since models are defined here
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;