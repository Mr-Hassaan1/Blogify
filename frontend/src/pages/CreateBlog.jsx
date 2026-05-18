import { Button } from "@/components/ui/button";
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
import { setBlog } from "@/Redux/blogSlice";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreateBlog = () => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const { blog } = useSelector((store) => store.blog);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getSelectedCategory = (value) => {
    setCategory(value);
  };
  const createBlogHandler = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:3200/api/v1/blog/`,
        { title, category },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        dispatch(setBlog([...(Array.isArray(blog) ? blog : []), res.data.blog]));
        navigate(`/dashboard/create-blog/${res.data.blog._id}`);
        toast.success(res.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to create blog.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="pt-20 md:ml-80 md:h-screen">
      <div className="max-w-6xl mx-auto mt-8 ">
        <Card className="md:p-10 p-4 dark:bg-gray-800">
          <h1 className="text-2xl font-bold">Lets create blog</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex eius
            necessitatibus fugit vel distinctio architecto, ut ratione rem nobis
            eaque?
          </p>
          <div className="mt-8 ">
            <div className="mb-10">
              <Label className="mb-3">Title :</Label>
              <Input
                type="text"
                placeholder="Your Blog Name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white dark:bg-gray-700"
              />
            </div>
            <div className="mb-10">
              <Label className="mb-3" >Category:</Label>
              <Select onValueChange={getSelectedCategory}>
                <SelectTrigger className="w-45 bg-white dark:bg-gray-700">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="mt-17">
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
                    <SelectItem value="Cooking">Cooking</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                className=""
                disabled={loading}
                onClick={createBlogHandler}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateBlog;
