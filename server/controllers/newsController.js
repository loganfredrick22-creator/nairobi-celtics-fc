const News = require('../models/News');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const getNews = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const filter = {};
    if (category) filter.category = category;

    const options = { page: parseInt(page), limit: parseInt(limit), sort: { publishedAt: -1 } };
    const news = await News.paginate(filter, options);
    sendSuccess(res, { articles: news.docs }, 'News articles retrieved', 200, {
      page: news.page, limit: news.limit, totalPages: news.totalPages, totalDocs: news.totalDocs,
    });
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const getNewsBySlug = async (req, res) => {
  try {
    const article = await News.findOne({ slug: req.params.slug });
    if (!article) return sendError(res, 'Article not found', 404);
    const related = await News.find({ category: article.category, _id: { $ne: article._id } })
      .limit(3).sort({ publishedAt: -1 });
    sendSuccess(res, { article, related }, 'Article retrieved');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const createNews = async (req, res) => {
  try {
    const article = await News.create(req.body);
    sendSuccess(res, { article }, 'Article created', 201);
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const updateNews = async (req, res) => {
  try {
    const article = await News.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true, runValidators: true });
    if (!article) return sendError(res, 'Article not found', 404);
    sendSuccess(res, { article }, 'Article updated');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

module.exports = { getNews, getNewsBySlug, createNews, updateNews };
