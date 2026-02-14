const { body, param, validationResult } = require('express-validator');

// Helper function to check for errors
const checkErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validation Rules for Creating an Item
const validateItem = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isString().withMessage('Name must be a string') 
        .trim().escape(),
    body('quantity')
        .isNumeric().withMessage('Quantity must be a number')
        .isInt({ min: 0 }).withMessage('Quantity must be a positive integer'),
    body('category')
        .notEmpty().withMessage('Category is required')
        .isString().withMessage('Category must be a string')
        .trim().escape(),
checkErrors
];

// Validation Rules for Updating an Item
const validateItemUpdate = [
    body('name')
        .optional()
        .isString().withMessage('Name must be a string') 
        .notEmpty().withMessage('Name cannot be empty')
        .trim().escape(),
    body('quantity')
        .optional()
        .isNumeric().withMessage('Quantity must be a number')
        .isInt({ min: 0 }).withMessage('Quantity must be a positive integer'),
    body('category')
        .optional()
        .isString().withMessage('Category must be a string')
        .notEmpty().withMessage('Category cannot be empty')
        .trim().escape(),
checkErrors
];

const validateId = [
    param('id').isMongoId().withMessage('Invalid ID format'),
    checkErrors
];

module.exports = { validateItem, validateItemUpdate, validateId }; 