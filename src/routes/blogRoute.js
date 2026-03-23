const express = require("express");
const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// All blog routes are protected - only authenticated users can access
router.use(protect);

router.post("/", upload.single("blogImage"), createBlog);
router.get("/", getAllBlogs);
router.get("/:id", getSingleBlog);
router.put("/:id", upload.single("blogImage"), updateBlog);
router.delete("/:id", deleteBlog);

module.exports = router;
