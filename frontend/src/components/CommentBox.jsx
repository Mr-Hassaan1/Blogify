import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setBlog } from "@/Redux/blogSlice";
import { setComment } from "@/Redux/commentSlice";
import { Edit, LucideSend, Trash2 } from "lucide-react";
import { BsThreeDots } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CommentBox = ({ selectedBlog }) => {
  const { user } = useSelector((store) => store.auth);
  const { comment } = useSelector((store) => store.comment);
  const [content, setContent] = useState("");
  const { blog } = useSelector((store) => store.blog);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setContent(inputText);
    } else setContent("");
  };

  useEffect(() => {
    const getAllCommentsOfBlog = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3200/api/v1/comment/${selectedBlog._id}/comment/all`,
        );
        const data = res.data.comments;
        dispatch(setComment(data));
      } catch (error) {
        console.log(error);
      }
    };
    if (selectedBlog?._id) getAllCommentsOfBlog();
  }, [selectedBlog?._id, dispatch]);

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3200/api/v1/comment/${selectedBlog._id}/create`,
        { content },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        let updatedCommentData;
        console.log(comment);

        if (comment.length >= 1) {
          updatedCommentData = [...comment, res.data.comment];
        } else {
          updatedCommentData = [res.data.comment];
        }
        dispatch(setComment(updatedCommentData));

        const updatedBlogData = blog.map((p) =>
          p._id === selectedBlog._id
            ? { ...p, comments: updatedCommentData }
            : p,
        );
        dispatch(setBlog(updatedBlogData));
        toast.success(res.data.message);
        setContent("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Comment not added");
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const res = await axios.delete(
        `http://localhost:3200/api/v1/comment/${commentId}/delete`,
        {
          withCredentials: true,
        },
      );
      if (res.data.success) {
        const updatedCommentData = comment.filter(
          (item) => item._id !== commentId,
        );
        console.log(updatedCommentData);

        dispatch(setComment(updatedCommentData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error Comment not deleted!");
    }
  };

  const editCommentHandler = async (commentId) => {
    try {
      const res = await axios.put(
        `http://localhost:3200/api/v1/comment/${commentId}/edit`,
        { content: editedContent },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (res.data.success) {
        const updatedCommentData = comment.map((item) =>
          item._id === commentId ? { ...item, content: editedContent } : item,
        );
        dispatch(setComment(updatedCommentData));
        toast.success(res.data.message);
        setEditingCommentId(null);
        setEditedContent("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to edit comment");
    }
  };

  const likeCommentHandler = async (commentId) => {
    try {
      const res = await axios.get(
        `http://localhost:3200/api/v1/comment/${commentId}/like`,
        {
          withCredentials: true,
        },
      );

      if (res.data.success) {
        const updatedComment = res.data.updatedComment;

        const updatedCommentList = comment.map((item) =>
          item._id === commentId ? updatedComment : item,
        );

        dispatch(setComment(updatedCommentList));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Error liking comment", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <div className="flex gap-4 mb-4 items-center">
        <Avatar>
          <AvatarImage src={user.photoUrl} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h3 className="font-semibold">
          {user.firstName} {user.lastName}
        </h3>
      </div>
      <div className="flex gap-3">
        <Textarea
          placeholder="Leave a comment"
          className="bg-gray-100 dark:bg-gray-800"
          onChange={changeEventHandler}
          value={content}
        />
        <Button className="h-16 cursor-pointer" onClick={commentHandler}>
          <LucideSend />
        </Button>
      </div>
      {comment.length > 0 ? (
        <div className="mt-7 bg-gray-100 dark:bg-gray-800 p-5 rounded-md">
          {comment.map((item, index) => {
            return (
              <div key={index} className="mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 items-start">
                    <Avatar>
                      <AvatarImage src={item?.userId?.photoUrl} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="mb-2 space-y-1 md:w-100">
                      <h1 className="font-semibold">
                        {item?.userId?.firstName} {item?.userId?.lastName}
                        <span className="text-sm ml-2 font-light">
                          {new Date(item.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {" - "}
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </h1>
                      {editingCommentId === item?._id ? (
                        <>
                          <Textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="mb-2 bg-gray-200 dark:bg-gray-700"
                          />
                          <div className="flex py-1 gap-2">
                            <Button
                              size="sm"
                              onClick={() => editCommentHandler(item._id)}
                              className="cursor-pointer"
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingCommentId(null)}
                              className="cursor-pointer"
                            >
                              Cancel
                            </Button>
                          </div>
                        </>
                      ) : (
                        <p className="">{item?.content}</p>
                      )}
                      <div className="flex gap-5 items-center">
                        <div className="flex gap-2 items-center">
                          <div
                            className="flex gap-1 items-center cursor-pointer"
                            onClick={() => likeCommentHandler(item._id)}
                          >
                            {item.likes.includes(user._id) ? (
                              <FaHeart fill="red" />
                            ) : (
                              <FaRegHeart />
                            )}
                            <span>{item.numberOfLikes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {user._id === item?.userId?._id ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <BsThreeDots className="cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-45">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => {
                            setEditingCommentId(item._id);
                            setEditedContent(item.content);
                          }}
                        >
                          <Edit />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500 cursor-pointer"
                          onClick={() => deleteComment(item._id)}
                        >
                          <Trash2 />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default CommentBox;
