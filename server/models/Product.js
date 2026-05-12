const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    category: {
      type: String,
      enum: ['kit', 'training', 'accessory', 'premium'],
      required: true,
    },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    onSale: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    images: [{ type: String }],
    sizes: [
      {
        size: { type: String },
        stock: { type: Number, default: 0 },
      },
    ],
    totalStock: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });

productSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', productSchema);
