const mongoose = require('mongoose');

const ageSchema = new mongoose.Schema(
  {
    name: { type: String, required: false, trim: true },
    age: { type: Number, required: true },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

module.exports = mongoose.model('Age', ageSchema);
