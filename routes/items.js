const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const { validateItem, validateItemUpdate, validateId } = require('../middleware/validation'); 

/**
 * @swagger
 *  components:
 *    schemas:
 *      Item:
 *       type: object
 *       required:
 *         - name
 *         - category
 *      properties:
 *        id:
 *          type: string
 *          description: The auto-generated id of the item
 *        name:
 *          type: string
 *          description: The name of the item
 *        quantity:
 *          type: number
 *          description: The quantity of the item
 *        category:
 *          type: string
 *          description: The category of the item
 *        example:
 *          name: Gaming Keyboard
 *          quantity: 12
 *          category: Electronics
 */

 // GET ALL
/**
 * @swagger
 * /api/items:
 *  get:
 *    summary: Get all items
 *    tags: [Items]
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Item'
 *      500:                      
 *        description: Server error
 */
router.get('/', async (req, res, next) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        next(err);
    }
});

// CREATE NEW ITEM
/**
 * @swagger
 * /api/items:
 *  post:
 *    summary: Create a new item
 *    tags: [Items]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Item'
 *    responses:
 *      201:
 *        description: The item was successfully created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Item'
 *      400:
 *        description: Validation error (Missing fields or wrong type)
 *      500:
 *        description: Server error
 */

router.post('/', validateItem, async (req, res, next) => {
    try {
        const newItem = new Item(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        next(err);
    }
});

// GET SINGLE ITEM BY ID

/**
* @swagger
* /api/items/{id}:
*  get:
*    summary: Get a single item by ID
*    tags: [Items]
*    parameters:
*      - in: path
*        name: id
*        schema:
*          type: string
*        required: true
*        description: The item ID
*    responses:
*      200:
*        description: The item description by id
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/Item'
*      400:
*        description: Invalid ID format
*      404:
*        description: Item not found
*      500:
*        description: Server error
*/

router.get('/:id', validateId, async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            const error = new Error('Item not found');
            error.statusCode = 404;
            return next(error);
        }
        res.json(item);
    } catch (err) {
        next(err);
    }
});

// UPDATE ITEM

/**
 * @swagger
 * /api/items/{id}:
 *   put:
 *    summary: Update an item
 *    tags: [Items]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The item ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Item'
 *    responses:
 *      204:
 *        description: Item updated successfully
 *      400:
 *        description: Validation error or invalid ID
 *      404:
 *        description: Item not found
 *      500:
 *        description: Server error      
 */

router.put('/:id', [validateId, validateItemUpdate], async (req, res, next) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );

       if (!updatedItem) {
            const error = new Error('Item not found');
            error.statusCode = 404;
            return next(error);
        }
        res.status(204).send();
    } catch (err) {
        next(err);
    }
});

// DELETE ITEM

/**
 * @swagger
 * /api/items/{id}:
 *   delete:
 *     summary: Delete an item
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The item ID
 *     responses:
 *       200:
 *         description: The item was deleted
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Item not found
 *       500:
 *         description: Server error
 */

router.delete('/:id', validateId, async (req, res, next) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) {
            const error = new Error('Item not found');
            error.statusCode = 404;
            return next(error);
        }
        res.json({ message: 'Item deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;