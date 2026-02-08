// server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect to Database
connectDB();

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

// Swagger Configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Inventory API',
            version: '1.0.0',
            description: 'API for managing warehouse inventory',
            contact: {
                name: 'Your Name'
            },
            servers: [{ url: 'http://localhost:3000' }]
        }
    },
    
    apis: ['./routes/*.js'] 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// Middleware to parse JSON
app.use(express.json());


// Import Routes
const itemsRouter = require('./routes/items');

// Use Routes
app.use('/api/items', itemsRouter); 

// ... app.listen code ...

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});