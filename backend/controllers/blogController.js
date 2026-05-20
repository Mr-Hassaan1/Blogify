import { Blog } from "../models/blogModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

export const createBlog = async (req, res) => {
  try {
    const { title, subtitle, description, category } = req.body;
    const file = req.file;

    if (!title || !category) {
      return res.status(400).json({
        message: "Blog title and category must be required!",
      });
    }

    let thumbnail;
    if (file) {
      const fileUri = getDataUri(file);
      const uploadResult = await cloudinary.uploader.upload(fileUri);
      thumbnail = uploadResult.secure_url;
    }

    const blog = await Blog.create({
      title,
      subtitle,
      description,
      category,
      author: req.id,
      thumbnail,
    });

    return res.status(201).json({
      success: true,
      blog,
      message: "Blog Created Successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create blog!",
      error: error.message,
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const { title, subtitle, description, category, isPublished } = req.body;
    const file = req.file;

    let blog = await Blog.findById(blogId).populate("author");
    if (!blog) {
      return res.status(404).json({
        message: "Blog not found!",
      });
    }
    let thumbnail;
    if (file) {
      const fileUri = getDataUri(file);
      thumbnail = await cloudinary.uploader.upload(fileUri);
    }

    const updateData = {
      title,
      subtitle,
      description,
      category,
      author: req.id,
      thumbnail: thumbnail?.secure_url,
    };
    if (typeof isPublished !== "undefined") {
      updateData.isPublished = isPublished === "true" || isPublished === true;
    }

    blog = await Blog.findByIdAndUpdate(blogId, updateData, { new: true });

    res
      .status(200)
      .json({ success: true, message: "Blog updated successfully", blog });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating blog",
      error: error.message,
    });
  }
};

export const getOwnBlogs = async (req, res) => {
  try {
    const userId = req.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const blogs = await Blog.find({ author: userId }).populate({
      path: "author",
      select: "firstName lastName photoUrl",
    });
    if (!blogs) {
      return res
        .status(404)
        .json({ message: "No blogs found.", blogs: [], success: false });
    }

    return res.status(200).json({ blogs, success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching blogs", error: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId ?? req.params.id;
    const authorId = req.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    if (blog.author.toString() !== authorId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this blog",
      });
    }

    await Blog.findByIdAndDelete(blogId);

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting blog",
      error: error.message,
    });
  }
};

export const getPublishedBlog = async (_, res) => {
  try {
    const blogs = await Blog.find({
      isPublished: true,
    })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "author",
        select: "firstName lastName photoUrl",
      });

    if (!blogs) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get published blogs",
    });
  }
};

export const togglePublishBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const publishParam = req.query.publish;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        message: "Blog not found!",
      });
    }

    if (blog.author.toString() !== req.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update publish status",
      });
    }

    if (publishParam === "true") {
      blog.isPublished = true;
    } else if (publishParam === "false") {
      blog.isPublished = false;
    } else {
      blog.isPublished = !blog.isPublished;
    }

    await blog.save();

    const statusMessage = blog.isPublished ? "Published" : "Unpublished";
    return res.status(200).json({
      success: true,
      message: `Blog is ${statusMessage}`,
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to update status",
      error: error.message,
    });
  }
};

export const likeBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userIdWhoLiked = req.id;
    const blog = await Blog.findById(blogId).populate({ path: "likes" });
    if (!blog)
      return res
        .status(404)
        .json({ message: "Blog not found", success: false });
    await blog.updateOne({ $addToSet: { likes: userIdWhoLiked } });
    await blog.save();
    return res.status(200).json({ message: "Blog liked", blog, success: true });
  } catch (error) {
    console.log(error);
  }
};

export const dislikeBlog = async (req, res) => {
  try {
    const userIdWhoLiked = req.id;
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (!blog)
      return res
        .status(404)
        .json({ message: "post not found", success: false });

    await blog.updateOne({ $pull: { likes: userIdWhoLiked } });
    await blog.save();

    return res
      .status(200)
      .json({ message: "Blog disliked", blog, success: true });
  } catch (error) {
    console.log(error);
  }
};

export const getMyTotalBlogLikes = async (req, res) => {
  try {
    const userId = req.id;

    const myBlogs = await Blog.find({ author: userId }).select("likes");

    const totalLikes = myBlogs.reduce(
      (acc, blog) => acc + (blog.likes?.length || 0),
      0,
    );

    res.status(200).json({
      success: true,
      totalBlogs: myBlogs.length,
      totalLikes,
    });
  } catch (error) {
    console.error("Error getting total blog likes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch total blog likes",
    });
  }
};
