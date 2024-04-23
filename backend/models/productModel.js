import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      enum: ['morning', 'evening'],
      required: true,
    },
    hen: {
      type: String,
      required: true,
    },
    eggs: {
      type: Number,
      required: true,
    },
    feeds: {
      type: String,
      required: true,
    },
    manure: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
