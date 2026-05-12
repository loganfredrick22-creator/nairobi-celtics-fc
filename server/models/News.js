const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const slugify = require('slugify');

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' },
    category: {
      type: String,
      enum: ['Match Reports', 'Transfer News', 'Club News', 'Academy', 'Community'],
      required: true,
    },
    author: { type: String, default: 'Nairobi Celtics FC' },
    thumbnail: { type: String, default: '/images/news-1.jpg' },
    publishedAt: { type: Date, default: Date.now },
    featured: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

newsSchema.index({ slug: 1 });
newsSchema.index({ category: 1 });
newsSchema.index({ publishedAt: -1 });

newsSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

newsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('News', newsSchema);
