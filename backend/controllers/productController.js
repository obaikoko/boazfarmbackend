import Product from '../models/productModel.js';
import asyncHandler from '../middleware/asyncHandler.js';
// import cloudinary from '../config/cloudinary.js';

// @desc Gets all products
// @route GET /api/products
// @privacy Public
const getProducts = asyncHandler(async (req, res) => {
  const product = await Product.find({}).populate(
    'user',
    'firstName lastName email'
  );
  if (product) {
    res.status(200);
    res.json(product);
  }
});

// @desc Gets Single Product
// @route GET /api/products:id
// @privacy Public
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.status(200);
    res.json(product);
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { title, hen, eggs, feeds, manure } = req.body;
  const product = await Product.create({
    user: req.user,
    title,
    hen,
    eggs,
    feeds,
    manure,
  });
  if (product) {
    res.status(200);
    res.json(product);
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { title, hen, eggs, feeds, manure } = req.body;

  const product = await Product.findById(req.params.id);
  if (product) {
    product.title = title || product.title;
    product.hen = hen || product.hen;
    product.eggs = eggs || product.eggs;
    product.feeds = feeds || product.feeds;
    product.manure = manure || product.manure;

     const updatedProduct = await product.save();

     res.status(200)
     res.json(updatedProduct)
  } else {
    res.status(404);
    throw new Error('not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await cloudinary.uploader.destroy(product.image.publicId);
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: `${req.user.firstName} ${req.user.lastName}`,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.status(200);
  res.json(products);
});

export {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
};
