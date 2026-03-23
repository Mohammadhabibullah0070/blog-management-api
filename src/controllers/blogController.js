const Blog = require("../models/Blog");

// POST /api/blogs
const createBlog = async (req, res) => {
  const { title, content, authorName, tags } = req.body;
  const blogImage = req.file ? req.file.filename : null;
  try {
    if (!title || !content || !authorName) {
      return res
        .status(400)
        .json({ message: "Title, content, and authorName are required" });
    }
    const blog = await Blog.create({
      title,
      content,
      authorName,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      blogImage,
      author: req.user._id,
    });
    res.status(201).json({ message: "Blog created", blog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "name email");
    res.json({ blogs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/blogs/:id
const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "name email",
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ blog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/blogs/:id
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this blog" });
    }

    const { title, content, authorName, tags } = req.body;
    const blogImage = req.file ? req.file.filename : blog.blogImage;

    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        authorName,
        tags: tags ? tags.split(",").map((t) => t.trim()) : blog.tags,
        blogImage,
      },
      { new: true },
    );
    res.json({ message: "Blog updated", blog: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/blogs/:id
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this blog" });
    }
    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
};
