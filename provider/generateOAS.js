const swaggerJSDoc = require('swagger-jsdoc');
const fs = require('fs');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Provider API',
            version: '1.0.0',
        },
    },
    apis: ['./provider.js'], // Parses JSDoc comments in provider.js
};

const swaggerSpec = swaggerJSDoc(options);
fs.writeFileSync('./provider-oas.json', JSON.stringify(swaggerSpec, null, 2));
console.log('OpenAPI Spec generated as provider-oas.json');
