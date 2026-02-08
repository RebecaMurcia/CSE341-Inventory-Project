const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name for the item'],
    trim: true, 
    unique: true 
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Quantity cannot be negative']
  },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Groceries', 'Clothing', 'Furniture', 'Other'],
    default: 'Other'
  },
  inStock: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware: Automatically set inStock based on quantity before saving
ItemSchema.pre('save', async function() {
  if (this.quantity !== undefined) {
      this.inStock = this.quantity > 0;
  }
});

module.exports = mongoose.model('Item', ItemSchema);