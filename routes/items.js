const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

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
 *   get:
 *     summary: Get all items
 *     description: Retrieve a list of all items from the database
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE NEW ITEM
/**
 * @swagger
 * /api/items:
 *  post:
 *    summary: Create a new item
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *            properties:
 *              name:
 *                type: string
 *              quantity:
 *                type: integer
 *              category:
 *                type: string
 *    responses:
 *      201:
 *        description: Created
 */

router.post('/', async (req, res) => {
    const newItem = new Item({
        name: req.body.name,
        quantity: req.body.quantity,
        category: req.body.category
    });

    try {
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
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
*      404:
*        description: Item not found
*/

router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (err) {
        if (err.kind === 'ObjectId') {
             return res.status(404).json({ message: 'Item not found' });
        }
        res.status(500).json({ message: err.message });
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
 *      200:
 *        description: The item was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Item'
 *      404:
 *        description: Item not found      
 */

router.put('/:id', async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(updatedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
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
 *       404:
 *         description: Item not found
 */

router.delete('/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json({ message: 'Item deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;