import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import userLogo from "../assets/user.jpg";
import { Link } from "react-router-dom";
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { setUser } from "@/Redux/authSlice";

function Profile() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const [input, setInput] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    occupation: user?.occupation,
    bio: user?.bio,
    facebook: user?.facebook,
    linkedin: user?.linkedin,
    github: user?.github,
    instagram: user?.instagram,
    file: user?.photoUrl,
  });

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstName", input.firstName);
    formData.append("lastName", input.lastName);
    formData.append("bio", input.bio);
    formData.append("occupation", input.occupation);
    formData.append("facebook", input.facebook);
    formData.append("linkedin", input.linkedin);
    formData.append("instagram", input.instagram);
    formData.append("github", input.github);
    if (input?.file) {
      formData.append("file", input?.file);
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `http://localhost:3200/api/v1/user/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        setOpen(false);
        toast.success(res.data.message);
        dispatch(setUser(res.data.user));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 md:ml-80 md:h-screen">
      <div className="max-w-6xl mx-auto mt-8 ">
        <Card className=" flex md:flex-row flex-col gap-10 p-6 md:p-10 dark:bg-gray-800 mx-4 md:mx-0">
          {/* image section */}
          <div className="flex flex-col items-center justify-center md:w-100">
            <Avatar className="w-40 h-40 border-2">
              <AvatarImage src={user?.photoUrl || userLogo} />
            </Avatar>
            <h1 className="text-center font-semibold text-xl text-gray-700 dark:text-gray-300 my-3">
              {user?.occupation || "Mern Stack Developer"}
            </h1>
            <div className="flex gap-4 items-center">
              <a href={user?.facebook} target="_blank" rel="noopener noreferrer">
                <FaFacebook className="w-6 h-6 text-gray-800 dark:text-gray-300" />
              </a>
              <a href={user?.linkedin} target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="w-6 h-6 dark:text-gray-300 text-gray-800" />
              </a>
              <a href={user?.github} target="_blank" rel="noopener noreferrer">
                <FaGithub className="w-6 h-6 dark:text-gray-300 text-gray-800" />
              </a>
              <a href={user?.instagram} target="_blank" rel="noopener noreferrer">
                <FaInstagram className="w-6 h-6 text-gray-800 dark:text-gray-300" />
              </a>
            </div>
          </div>
          {/* info section */}
          <div>
            <h1 className="font-bold text-center md:text-start text-4xl mb-7">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="">
              <span className="font-semibold">Email : </span>
              {user?.email}
            </p>
            <div className="flex flex-col gap-2 items-start justify-start my-5">
              <Label className="">About Me : </Label>
              <Textarea  
                rows={2} 
                value={user?.bio || "Write something about yourself here..."}
                readOnly
                className="h-22 w-120 leading-7 resize-none border dark:border-gray-600 p-3 pl-6  rounded-lg"
              />
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <Button onClick={() => setOpen(true)}>Edit Profile</Button>
              <DialogContent className="md:w-106.25 ">
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Edit Profile
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    Make changes to your profile here.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={submitHandler}>
                <div className="grid gap-4 py-4">
                  <div className="flex gap-2">
                    <div>
                      <Label htmlFor="name" className="text-right mb-1">
                        First Name:
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={input.firstName}
                        onChange={changeEventHandler}
                        placeholder="First Name"
                        type="text"
                        className="col-span-3 text-gray-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="name" className="text-right mb-1">
                        Last Name:
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={input.lastName}
                        onChange={changeEventHandler}
                        placeholder="Last Name"
                        className="col-span-3 text-gray-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div>
                      <Label className="mb-1">Facebook: </Label>
                      <Input
                        id="facebook"
                        name="facebook"
                        value={input.facebook}
                        onChange={changeEventHandler}
                        placeholder="Enter a URL"
                        className="col-span-3 text-gray-500"
                      />
                    </div>
                    <div>
                      <Label className="mb-1">Instagram:</Label>
                      <Input
                        id="instagram"
                        name="instagram"
                        value={input.instagram}
                        onChange={changeEventHandler}
                        placeholder="Enter a URL"
                        className="col-span-3 text-gray-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div>
                      <Label className="mb-1">Linkedin:</Label>
                      <Input
                        id="linkedin"
                        name="linkedin"
                        value={input.linkedin}
                        onChange={changeEventHandler}
                        placeholder="Enter a URL"
                        className="col-span-3 text-gray-500"
                      />
                    </div>
                    <div>
                      <Label className="mb-1">Github:</Label>
                      <Input
                        id="github"
                        name="github"
                        value={input.github}
                        onChange={changeEventHandler}
                        placeholder="Enter a URL"
                        className="col-span-3 text-gray-500"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="name" className="mb-1">
                      Occupation:
                    </Label>
                    <Input
                      id="occupation"
                      name="occupation"
                      value={input.occupation}
                      onChange={changeEventHandler}
                      placeholder="Your Occupation"
                      type="text"
                      className="col-span-3 text-gray-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name" className="mb-1">
                      Description:
                    </Label>
                    <Textarea
                      id="bio"
                      value={input.bio}
                      onChange={changeEventHandler}
                      name="bio"
                      placeholder="Enter a description"
                      className="col-span-3 text-gray-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name" className="mb-1">
                      Picture
                    </Label>
                    <Input
                      id="file"
                      type="file"
                      accept="image/*"
                      onChange={changeFileHandler}
                      className="w-69.25"
                    />
                  </div>
                </div>
                <DialogFooter>
                  {loading ? (
                    <Button disabled>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please
                      wait
                    </Button>
                  ) : (
                    <Button type="submit">Save Changes</Button>
                  )}
                </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </Card>
      </div>
      {/* <TotalProperty/> */}
    </div>
  );
}

export default Profile;
