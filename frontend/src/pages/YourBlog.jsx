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
import { CloudOff, Edit, Globe, Trash2 } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function YourBlog() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { blog } = useSelector((store) => store.blog);
  const [deleteId, setDeleteId] = useState(null);
  const [publishData, setPublishData] = useState(null);

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

  const togglePublish = async (id, publish) => {
    try {
      const res = await axios.patch(
        `http://localhost:3200/api/v1/blog/${id}?publish=${publish}`,
        null,
        { withCredentials: true },
      );
      if (res.data.success) {
        const updatedBlogData = blog.map((blogItem) =>
          blogItem._id === id
            ? { ...blogItem, isPublished: publish }
            : blogItem,
        );
        dispatch(setBlog(updatedBlogData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to update publish status.",
      );
    }
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
                <TableHead>Status</TableHead>
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
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${item.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                    >
                      {item.isPublished ? "Published" : "Draft"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <h2 className="w-12 md:w-full truncate">
                      {dateHandler(index)}
                    </h2>
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
                          className="cursor-pointer flex items-center gap-2"
                          onClick={() => {
                            const nextState = !item.isPublished;

                            if (item.isPublished && nextState === false) {
                              setPublishData({
                                id: item._id,
                                value: nextState,
                              });
                            } else {
                              togglePublish(item._id, nextState);
                            }
                          }}
                        >
                          {item.isPublished ? (
                            <>
                              <CloudOff size={16} />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <Globe size={16} />
                              Publish
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500 cursor-pointer"
                          onClick={() => setDeleteId(item._id)}
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

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undo. This will permanently delete this
              blog.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600"
              onClick={() => {
                deleteBlog(deleteId);
                setDeleteId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!publishData}
        onOpenChange={() => setPublishData(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unpublish Blog?</AlertDialogTitle>
            <AlertDialogDescription>
              This blog will become a draft and will not be visible to users.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                togglePublish(publishData.id, publishData.value);
                setPublishData(null);
              }}
            >
              Unpublish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default YourBlog;
