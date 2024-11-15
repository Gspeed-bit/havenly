import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Havenly API',
      version: '1.0.0',
      description: 'API documentation for the Havenly platform',
    },
  },
  apis: ['./backend/routes/*.ts', './backend/controllers/*.ts'], // Adjust paths to your route/controller files
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
