import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import JoditEditor from "jodit-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setBlog } from "@/Redux/blogSlice";
import { useRef, useState } from "react";

const UpdateBlog = () => {
  const editor = useRef(null);

  const [loading, setLoading] = useState(false);
  const [publish, setPublish] = useState(false);
  const params = useParams();
  const id = params.blogId;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { blog } = useSelector((store) => store.blog);
  const selectBlog = blog.find((blog) => blog._id === id);
  const [content, setContent] = useState(selectBlog.description);

  const [blogData, setBlogData] = useState({
    title: selectBlog?.title,
    subtitle: selectBlog?.subtitle,
    description: content,
    category: selectBlog?.category,
  });
  const [previewThumbnail, setPreviewThumbnail] = useState(
    selectBlog?.thumbnail,
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectCategory = (value) => {
    setBlogData({ ...blogData, category: value });
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBlogData({ ...blogData, thumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  const updateBlogHandler = async () => {
    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("subtitle", blogData.subtitle);
    formData.append("description", content);
    formData.append("category", blogData.category);
    formData.append("file", blogData.thumbnail);
    try {
      setLoading(true);
      const res = await axios.put(
        `http://localhost:3200/api/v1/blog/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        toast.success(res.data.message);

        console.log(blogData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublishUnpublish = async (action) => {
    console.log("action", action);

    try {
      const res = await axios.patch(`http://localhost:3200/api/v1/blog/${id}`, {
        params: {
          action,
        },
        withCredentials: true,
      });
      if (res.data.success) {
        setPublish(!publish);
        toast.success(res.data.message);
        navigate(`/dashboard/your-blog`);
      } else {
        toast.error("Failed to update");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBlog = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:3200/api/v1/blog/delete/${id}`,
        { withCredentials: true },
      );
      if (res.data.success) {
        const updatedBlogData = blog.filter((blogItem) => blogItem?._id !== id);
        dispatch(setBlog(updatedBlogData));
        toast.success(res.data.message);
        navigate("/dashboard/your-blog");
      }
      console.log(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error("something went error");
    }
  };

  return (
    <div className="pb-10 px-4 pt-20 md:px-6 md:ml-80">
      <div className="max-w-6xl mx-auto mt-8">
        <Card className="w-full bg-white dark:bg-gray-800 p-5 space-y-6 sm:space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold">Basic Blog Information</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Make changes to your blogs here. Click publish when you're done.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
            <Button
              className="w-full sm:w-auto"
              onClick={() =>
                togglePublishUnpublish(
                  selectBlog.isPublished ? "false" : "true",
                )
              }
            >
              {selectBlog?.isPublished ? "UnPublish" : "Publish"}
            </Button>
            <Button className="w-full sm:w-auto" variant="destructive" onClick={deleteBlog}>
              Remove Course
            </Button>
          </div>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                type="text"
                placeholder="Enter a title"
                name="title"
                value={blogData.title}
                onChange={handleChange}
                className="dark:border-gray-300"
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                type="text"
                placeholder="Enter a subtitle"
                name="subtitle"
                value={blogData.subtitle}
                onChange={handleChange}
                className="dark:border-gray-300"
              />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <JoditEditor
              ref={editor}
              value={blogData.description}
              onChange={(newContent) => setContent(newContent)}
              className="jodit_toolbar min-h-65 md:min-h-80"
            />
          </div>
          <div className="space-y-4">
            <div>
              <Label>Category</Label>
              <Select
                onValueChange={selectCategory}
                className="dark:border-gray-300 w-full"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="Web Development">
                      Web Development
                    </SelectItem>
                    <SelectItem value="Digital Marketing">
                      Digital Marketing
                    </SelectItem>
                    <SelectItem value="Blogging">Blogging</SelectItem>
                    <SelectItem value="Photography">Photography</SelectItem>
                    <SelectItem value="Traveling">Traveling</SelectItem>
                    <SelectItem value="Cooking">Cooking</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Thumbnail</Label>
              <Input
                id="file"
                type="file"
                onChange={selectThumbnail}
                accept="image/*"
                className="w-full dark:border-gray-300"
              />
              {previewThumbnail && (
                <img
                  src={previewThumbnail}
                  className="w-full max-w-md my-2 rounded-xl object-cover"
                  alt="Course Thumbnail"
                />
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button className="w-full sm:w-auto" onClick={updateBlogHandler}>
              {loading ? "Please Wait" : "Save"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UpdateBlog;
