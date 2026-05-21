import { Avatar, AvatarImage } from "@/components/ui/avatar";
import userLogo from "../assets/user.jpg";
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Mail, FileText } from "lucide-react";
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
import TotalProperty from "@/components/TotalProperty";

function Profile() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const [input, setInput] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    occupation: user?.occupation || "",
    bio: user?.bio || "",
    facebook: user?.facebook || "",
    linkedin: user?.linkedin || "",
    github: user?.github || "",
    instagram: user?.instagram || "",
    file: null,
  });

  const socialLinks = [
    { url: user?.facebook, Icon: FaFacebook, label: "Facebook" },
    { url: user?.linkedin, Icon: FaLinkedin, label: "LinkedIn" },
    { url: user?.github, Icon: FaGithub, label: "GitHub" },
    { url: user?.instagram, Icon: FaInstagram, label: "Instagram" },
  ];

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const changeFileHandler = (e) => {
    setInput((prev) => ({ ...prev, file: e.target.files?.[0] || null }));
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
    if (input.file) {
      formData.append("file", input.file);
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
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update profile.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 md:ml-80 min-h-screen bg-gray-50/50 dark:bg-gray-950 pb-12 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 lg:px-8 mt-6 space-y-8">
        <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-blue-500/10 to-purple-500/0 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 relative z-10">
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-300" />
              <Avatar className="w-45 h-45 md:w-50 md:h-50 border-4 border-white dark:border-gray-900 shadow-xl relative">
                <AvatarImage
                  src={user?.photoUrl || userLogo}
                  alt="Profile"
                  className="object-cover"
                />
              </Avatar>
            </div>

            <div className="flex-1 text-center md:text-left space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white wrap-break-word max-w-full">
                    {user?.firstName} {user?.lastName}
                  </h1>
                </div>

                <p className="text-md font-medium text-blue-600 dark:text-blue-400 flex items-center justify-center md:justify-start gap-1.5">
                  {user?.occupation || "Add your occupation"}
                </p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-2.5 pt-1">
                {socialLinks.map(({ url, Icon, label }) =>
                  url ? (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={label}
                      className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200 border border-gray-100 dark:border-gray-700/50 shadow-sm"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ) : null,
                )}
              </div>
            </div>

            <div className="w-full md:w-auto pt-2">
              <Dialog open={open} onOpenChange={setOpen}>
                <Button
                  onClick={() => setOpen(true)}
                  className="w-full md:w-auto px-5 py-5 rounded-xl font-medium shadow-sm bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition-all cursor-pointer"
                >
                  Edit Profile
                </Button>

                {/* Form Dialog Box UI layout */}
                <DialogContent className="sm:max-w-112.5">
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold">
                      Edit Profile
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-500">
                      Make changes to your profile here.
                    </DialogDescription>
                  </DialogHeader>

                  <form
                    id="edit-profile-form"
                    onSubmit={submitHandler}
                    className="flex flex-col gap-4 py-3"
                  >
                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="space-y-1 flex-1">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={input.firstName}
                          onChange={changeEventHandler}
                          placeholder="First Name"
                          type="text"
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-1 flex-1">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={input.lastName}
                          onChange={changeEventHandler}
                          placeholder="Last Name"
                          className="rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input
                        id="occupation"
                        name="occupation"
                        value={input.occupation}
                        onChange={changeEventHandler}
                        placeholder="Enter your occupation"
                        className="rounded-lg"
                      />
                    </div>

                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="space-y-1 flex-1">
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input
                          id="facebook"
                          name="facebook"
                          value={input.facebook}
                          onChange={changeEventHandler}
                          placeholder="URL"
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-1 flex-1">
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input
                          id="instagram"
                          name="instagram"
                          value={input.instagram}
                          onChange={changeEventHandler}
                          placeholder="URL"
                          className="rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="space-y-1 flex-1">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          name="linkedin"
                          value={input.linkedin}
                          onChange={changeEventHandler}
                          placeholder="URL"
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-1 flex-1">
                        <Label htmlFor="github">GitHub</Label>
                        <Input
                          id="github"
                          name="github"
                          value={input.github}
                          onChange={changeEventHandler}
                          placeholder="URL"
                          className="rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="bio">Description</Label>
                      <Textarea
                        id="bio"
                        value={input.bio}
                        onChange={changeEventHandler}
                        name="bio"
                        placeholder="Enter a description"
                        className="min-h-20 rounded-lg"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="file">Profile Picture</Label>
                      <Input
                        id="file"
                        type="file"
                        accept="image/*"
                        onChange={changeFileHandler}
                        className="cursor-pointer rounded-lg file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                  </form>

                  <DialogFooter className="pt-2">
                    {loading ? (
                      <Button disabled className="w-full rounded-xl">
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please
                        wait
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        form="edit-profile-form"
                        className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer"
                      >
                        Save Changes
                      </Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800/80 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Email Address
                </h3>
                <p className="mt-1 font-medium text-gray-900 dark:text-gray-100 break-all">
                  {user?.email || "No email available"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-2 bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800/80">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  About Me
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300 whitespace-pre-line">
                  {user?.bio ||
                    "No summary provided yet. Click edit profile to add your background context details."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-2 shadow-sm border border-gray-100 dark:border-gray-800">
          <TotalProperty />
        </div>
      </div>
    </div>
  );
}

export default Profile;
