import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

function BlogCard({ blog }) {
  const date = new Date(blog.createdAt);
  const formattedDate = date.toLocaleDateString();
  const navigate = useNavigate();
  return (
    <div className="bg-white dark:bg-gray-800 dark:border-gray-600 p-5 rounded-2xl shadow-lg border hover:scale-105 transition-all">
      <img
        src={blog.thumbnail}
        alt="Blog-thumbnail-img"
        className="rounded-lg"
      />
      <p className="text-sm mt-2 text-gray-500">
        Author - {blog.author.firstName} {blog.author.lastName} | {blog.category} |{" "}
        {formattedDate}
      </p>
      <h2 className="text-lg font-semibold ">{blog.title}</h2>
      <h2 className="text-gray-500 text-sm mt-l ">{blog.subtitle}</h2>
      <Button
        className="mt-4 px-4 rounded-lg text-sm cursor-pointer"
        onClick={() => navigate(`/blogs/${blog._id}`)}
      >
        Read More
      </Button>
    </div>
  );
}

export default BlogCard;
