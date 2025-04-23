import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Trello Clone API',
      version: '1.0.0',
      description: 'API documentation for Trello Clone',
    },
    servers: [
      {
        url: 'http://localhost:5251/api',
      },
    ],
  },
  apis: ['./routes/*.js'], // Tự động đọc swagger từ các route
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
