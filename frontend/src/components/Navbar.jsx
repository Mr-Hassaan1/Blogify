import { useState } from "react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import Logo from "../assets/logo.png";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "@/Redux/authSlice";
import userLogo from "../assets/user.jpg";
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi";
import { ChartColumnBig, LogOut, Search, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaMoon, FaRegEdit, FaSun } from "react-icons/fa";
import { toggleTheme } from "@/Redux/themeSlice";
import { LiaCommentSolid } from "react-icons/lia";
import ResponsiveMenu from "./ResponsiveMenu";

function Navbar() {
  const { user } = useSelector((store) => store.auth);
  const { theme } = useSelector((store) => store.theme);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openNav, setOpenNav] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const handelSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };

  const toggleNav = () => {
    setOpenNav(!openNav);
  };

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:3200/api/v1/user/logout", {
        withCredentials: true,
      });

      if (res.data.success) {
        navigate("/login");
        dispatch(setUser(null));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  return (
    <div className="py-2 fixed w-full dark:bg-gray-800 dark:border-b-gray-600 border-b-gray-300 border-2 bg-gray-200 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-0">
        <div className="flex gap-7 items-center">
          <Link>
            <img
              src={Logo}
              alt="logo"
              className="w-27 h-7 md:w-33 md:h-10 dark:invert"
            />
          </Link>

          <div className="relative hidden md:block">
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-700 dark:border-gray-900 bg-gray-300 w-50 hidden md:block"
            />
            <Button onClick={handelSearch} className="absolute top-0 right-0">
              <Search />
            </Button>
          </div>
        </div>

        {/* nav section */}
        <nav className="flex gap-7 md:gap-8 items-center">
          <ul className=" hidden md:flex gap-8 items-center text-xl font-semibold">
            <Link to={"/"}>
              <li>Home</li>
            </Link>
            <Link to={"/blogs"}>
              <li>Blogs</li>
            </Link>
            <Link to={"/about"}>
              <li>About</li>
            </Link>
          </ul>
          <div className="flex">
            <Button
              className="h-10 w-10"
              onClick={() => dispatch(toggleTheme())}
            >
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </Button>
            {user ? (
              <div className="ml-7 flex gap-8 items-center">
                <DropdownMenu className="">
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarImage src={user.photoUrl || userLogo} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className=" dark:bg-gray-800"
                  >
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => navigate("/dashboard/profile")}
                      >
                        <User />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/dashboard/your-blog")}
                      >
                        <ChartColumnBig />
                        <span>Your Blog</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/dashboard/comments")}
                      >
                        <LiaCommentSolid />
                        <span>Comments</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/dashboard/create-blog")}
                      >
                        <FaRegEdit />
                        <span>Create Blog</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logoutHandler}>
                      <LogOut />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button className="hidden md:block" onClick={logoutHandler}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="ml-7 md:flex gap-2">
                <Link to={"/login"}>
                  <Button>Login</Button>
                </Link>
                <Link to={"/signup"} className=" md-block">
                  <Button>Signup</Button>
                </Link>
              </div>
            )}
          </div>

          {openNav ? (
            <HiMenuAlt3 onClick={toggleNav} className="w-7 h-7 md:hidden" />
          ) : (
            <HiMenuAlt1 onClick={toggleNav} className="w-7 h-7 md:hidden" />
          )}
        </nav>
        <ResponsiveMenu
          openNav={openNav}
          setOpenNav={setOpenNav}
          logoutHandler={logoutHandler}
        />
      </div>
    </div>
  );
}

export default Navbar;
