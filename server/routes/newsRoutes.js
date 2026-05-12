const express = require('express');
const router = express.Router();
const { getNews, getNewsBySlug, createNews, updateNews } = require('../controllers/newsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getNews);
router.get('/:slug', getNewsBySlug);
router.post('/', protect, admin, createNews);
router.put('/:slug', protect, admin, updateNews);

module.exports = router;
