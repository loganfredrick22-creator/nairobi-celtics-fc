const Product = require('../models/Product');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, sort, search, featured } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured) filter.featured = featured === 'true';
    if (search) filter.name = { $regex: search, $options: 'i' };

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'featured') sortOption = { featured: -1, createdAt: -1 };

    const options = { page: parseInt(page), limit: parseInt(limit), sort: sortOption };
    const products = await Product.paginate(filter, options);
    sendSuccess(res, { products: products.docs }, 'Products retrieved', 200, {
      page: products.page, limit: products.limit, totalPages: products.totalPages, totalDocs: products.totalDocs,
    });
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return sendError(res, 'Product not found', 404);
    const related = await Product.find({ category: product.category, _id: { $ne: product._id } }).limit(4);
    sendSuccess(res, { product, related }, 'Product retrieved');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    sendSuccess(res, { product }, 'Product created', 201);
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return sendError(res, 'Product not found', 404);
    sendSuccess(res, { product }, 'Product updated');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const updateStock = async (req, res) => {
  try {
    const { sizes } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return sendError(res, 'Product not found', 404);

    if (sizes) {
      sizes.forEach(({ size, stock }) => {
        const existing = product.sizes.find((s) => s.size === size);
        if (existing) existing.stock = stock;
        else product.sizes.push({ size, stock });
      });
      product.totalStock = product.sizes.reduce((sum, s) => sum + s.stock, 0);
    }
    await product.save();
    sendSuccess(res, { product }, 'Stock updated');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, updateStock };
