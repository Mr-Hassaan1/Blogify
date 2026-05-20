import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const BlogCardList = ({ blog }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-700 dark:border-gray-600 flex flex-col md:flex-row gap-6 p-6 rounded-3xl mt-6 shadow-lg border border-gray-200 transition-all duration-300 hover:-translate-y-1">
      <div className="md:w-72 shrink-0 overflow-hidden rounded-3xl">
        <img
          src={blog.thumbnail}
          alt={blog.title}
          className="w-full h-56 md:h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold">{blog.title}</h2>
          <p className="text-gray-500 dark:text-gray-300 mt-3 line-clamp-3">
            {blog.subtitle}
          </p>
        </div>

        <div className="mt-6">
          <Button
            onClick={() => navigate(`/blogs/${blog._id}`)}
            className="px-5 py-3 rounded-2xl text-sm cursor-pointer"
          >
            Read More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogCardList;
