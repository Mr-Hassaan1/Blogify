import BlogCard from "@/components/BlogCard";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setBlog, resetBlog } from "@/Redux/blogSlice";

const Blog = () => {
  const dispatch = useDispatch();
  const { blog } = useSelector((store) => store.blog);

  useEffect(() => {
    dispatch(resetBlog());
    const getAllPublishedBlogs = async () => {
      try {
        const res = await axios.get(
          `https://blogify-backend-lemon.vercel.app/api/v1/blog/get-published-blogs`,
          { withCredentials: true },
        );
        if (res.data.success) {
          dispatch(setBlog(res.data.blogs));
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message || "Unable to fetch blogs.");
      }
    };
    getAllPublishedBlogs();
  }, [dispatch]);

  return (
    <div className="pt-16">
      <div className="max-w-6xl mx-auto text-center flex flex-col space-y-4 items-center">
        <h1 className="text-4xl font-bold text-center pt-10 ">Our Blogs</h1>
        <hr className=" w-24 text-center border-2 border-red-500 rounded-full" />
      </div>
      <div className="max-w-6xl mx-auto grid gap-10 grid-cols-1 md:grid-cols-3 py-10 px-4 md:px-0">
        {blog?.map((blog, index) => {
          return <BlogCard blog={blog} key={index} />;
        })}
      </div>
    </div>
  );
};

export default Blog;
