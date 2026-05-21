import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ValidationMessage from "@/components/ValidationMessage";
import { blogSchema, validateField } from "@/lib/validationSchemas";
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
import { useRef, useEffect, useState } from "react";

const UpdateBlog = () => {
  const editor = useRef(null);
  const params = useParams();
  const id = params.blogId;
  const isCreateMode = !id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { blog } = useSelector((store) => store.blog);
  const selectBlog = id ? blog.find((item) => item._id === id) : null;

  const [loading, setLoading] = useState(false);
  const [blogData, setBlogData] = useState({
    title: "",
    subtitle: "",
    category: "",
    thumbnail: null,
  });
  const [errors, setErrors] = useState({});
  const [content, setContent] = useState("");
  const [previewThumbnail, setPreviewThumbnail] = useState("");

  useEffect(() => {
    if (selectBlog) {
      setBlogData({
        title: selectBlog.title || "",
        subtitle: selectBlog.subtitle || "",
        category: selectBlog.category || "",
        thumbnail: selectBlog.thumbnail || null,
      });
      setContent(selectBlog.description || "");
      setPreviewThumbnail(selectBlog.thumbnail || "");
    }

    if (isCreateMode) {
      setBlogData({ title: "", subtitle: "", category: "", thumbnail: null });
      setContent("");
      setPreviewThumbnail("");
    }
  }, [selectBlog, isCreateMode]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "title") {
      const error = await validateField(name, value, blogSchema);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
    }
  };

  const selectCategory = async (value) => {
    setBlogData((prev) => ({ ...prev, category: value }));

    const error = await validateField("category", value, blogSchema);
    setErrors((prevErrors) => ({
      ...prevErrors,
      category: error,
    }));
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBlogData((prev) => ({ ...prev, thumbnail: file }));
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
    formData.append("isPublished", "false");
    if (blogData.thumbnail instanceof File) {
      formData.append("file", blogData.thumbnail);
    }

    try {
      setLoading(true);
      const url = isCreateMode
        ? `http://localhost:3200/api/v1/blog/`
        : `http://localhost:3200/api/v1/blog/${id}`;
      const method = isCreateMode ? axios.post : axios.put;
      const res = await method(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        if (isCreateMode) {
          dispatch(
            setBlog([...(Array.isArray(blog) ? blog : []), res.data.blog]),
          );
        }
        navigate(`/dashboard/your-blog`);
      } else {
        toast.error(res.data.message || "Unable to save blog.");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to save blog.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBlog = async () => {
    try {
      await blogSchema.validate(
        {
          title: blogData.title,
          description: content,
          category: blogData.category,
        },
        { abortEarly: false },
      );
      setErrors({});
      await updateBlogHandler();
    } catch (validationError) {
      if (validationError.inner) {
        const formErrors = validationError.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setErrors(formErrors);
      }
    }
  };

  const deleteBlog = async () => {
    if (isCreateMode) return;

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
      } else {
        toast.error(res.data.message || "Unable to delete blog.");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="pb-10 px-4 pt-20 md:px-6 md:ml-80">
      <div className="max-w-6xl mx-auto mt-8">
        <Card className="w-full bg-white dark:bg-gray-800 p-5 space-y-6 sm:space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold">
              {isCreateMode ? "Create Blog" : "Edit Blog"}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {isCreateMode
                ? "Create and share your ideas with the world. Write your blog post and save it when you're ready to publish."
                : "Make changes to your blog here. Click publish when you're done."}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Title :</Label>
              <Input
                type="text"
                placeholder="Enter a title"
                name="title"
                value={blogData.title}
                onChange={handleChange}
                className="dark:border-gray-300 mt-1"
              />
              <ValidationMessage name="title" errors={errors} />
            </div>
            <div>
              <Label>Subtitle :</Label>
              <Input
                type="text"
                placeholder="Enter a subtitle"
                name="subtitle"
                value={blogData.subtitle}
                onChange={handleChange}
                className="dark:border-gray-300 mt-1"
              />
            </div>
          </div>
          <div>
            <Label>Description :</Label>
            <JoditEditor
              ref={editor}
              value={content}
              onChange={async (newContent) => {
                setContent(newContent);
                const error = await validateField("description", newContent, blogSchema);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  description: error,
                }));
              }}
              className="jodit_toolbar min-h-65 md:min-h-80 mt-1"
            />
            <ValidationMessage name="description" errors={errors} />
          </div>

          <div className="space-y-4">
            <div>
              <Label className="mb-1 ">Category :</Label>
              <Select
                value={blogData.category}
                onValueChange={selectCategory}
                className="dark:border-gray-300 w-full "
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem className="cursor-pointer" value="Life Style">
                      Life Style
                    </SelectItem>
                    <SelectItem
                      className="cursor-pointer"
                      value="Digital Marketing"
                    >
                      Digital Marketing
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="Blogging">
                      Blogging
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="Photography">
                      Photography
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="Traveling">
                      Traveling
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="Cooking">
                      Cooking
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <ValidationMessage name="category" errors={errors} />
            </div>
            <div>
              <Label>Thumbnail :</Label>
              <Input
                id="file"
                type="file"
                onChange={selectThumbnail}
                accept="image/*"
                className="w-full cursor-pointer dark:border-gray-300 mt-1"
              />
              {previewThumbnail && (
                <img
                  src={previewThumbnail}
                  className="w-full max-w-md my-2 rounded-xl object-cover"
                  alt="Blog Thumbnail"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            {!isCreateMode ? (
              <Button
                variant="outline"
                className="cursor-pointer w-full sm:w-auto"
                onClick={deleteBlog}
              >
                Delete Blog
              </Button>
            ) : (
              <Button
                variant="outline"
                className="cursor-pointer w-full sm:w-auto"
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
            )}
            <Button
              className="cursor-pointer w-full sm:w-auto"
              onClick={handleSaveBlog}
              disabled={loading}
            >
              {loading ? "Please Wait" : "Save Draft"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UpdateBlog;
