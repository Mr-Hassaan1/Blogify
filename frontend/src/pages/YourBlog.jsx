import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setBlog } from "@/Redux/blogSlice";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function YourBlog() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { blog } = useSelector((store) => store.blog);

  useEffect(() => {
    const getOwnBlog = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3200/api/v1/blog/get-own-blogs`,
          { withCredentials: true },
        );
        if (res.data.success) {
          dispatch(setBlog(res.data.blogs));
        }
      } catch (error) {
        console.log(error);
      }
    };

    getOwnBlog();
  }, [dispatch]);

  const dateHandler = (index) => {
    const date = new Date(blog[index].createdAt);
    const localDate = date.toLocaleDateString();
    return localDate;
  };

  const deleteBlog = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:3200/api/v1/blog/delete/${id}`,
        { withCredentials: true },
      );
      if (res.data.success) {
        const updatedBlogData = blog.filter((blogItem) => blogItem?._id !== id);
        dispatch(setBlog(updatedBlogData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong!");
    }
  };

  return (
    <div className="pb-10 pt-20 md:ml-80 h-screen">
      <div className="max-w-6xl mx-auto mt-8 ">
        <Card className="w-full p-5 space-y-2 dark:bg-gray-800">
          <Table>
            <TableCaption>A list of your recent blogs.</TableCaption>
            <TableHeader className="overflow-x-auto">
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-x-auto ">
              {blog?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="flex gap-4 items-center">
                    <img
                      src={item.thumbnail}
                      alt=""
                      className="w-20 rounded-md hidden md:block"
                    />
                    <h1
                      className="hover:underline cursor-pointer w-30 md:w-full truncate"
                      onClick={() => navigate(`/blogs/${item._id}`)}
                    >
                      {item.title}
                    </h1>
                  </TableCell>
                  <TableCell>
                    <h2 className="w-15 md:w-full truncate">{item.category}</h2>
                  </TableCell>
                  <TableCell>
                    <h2 className="w-12 md:w-full truncate">{dateHandler(index)}</h2>
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <BsThreeDotsVertical className="cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-45">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() =>
                            navigate(`/dashboard/create-blog/${item._id}`)
                          }
                        >
                          <Edit />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500 cursor-pointer"
                          onClick={() => deleteBlog(item._id)}
                        >
                          <Trash2 />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}

export default YourBlog;
