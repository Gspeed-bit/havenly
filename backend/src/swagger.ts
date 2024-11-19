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
  apis: [
    './src/components/user/routes/**/*.ts', // Recursively search all .ts files
    './src/components/user/controllers/**/*.ts', // Recursively search all .ts files in controllers
    './src/components/property/controllers/**/*.ts',
    './src/components/property/routes/**/*.ts', // Recursively search all .ts files
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
