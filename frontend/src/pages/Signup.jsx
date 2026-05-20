import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import authImg from "../assets/signup.jpg";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../Redux/authSlice";
import { signupSchema } from "../lib/validationSchemas";
import ValidationMessage from "../components/ValidationMessage";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const { loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await signupSchema.validate(userData, { abortEarly: false });
      setErrors({});
    } catch (validationError) {
      if (validationError.inner) {
        const formErrors = validationError.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setErrors(formErrors);
      }
      return;
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        "http://localhost:3200/api/v1/user/register",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Signup failed");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || error.message || "Signup failed",
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <div className="hidden md:flex md:w-1/2 h-full">
        <img
          src={authImg}
          alt="Signup"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex justify-center items-center w-full md:w-1/2 px-4 md:px-0">
        <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl dark:bg-gray-800 dark:border-gray-600">
          <CardHeader>
            <CardTitle>
              <h1 className="text-center text-xl font-semibold">
                Create an account
              </h1>
            </CardTitle>
            <p className=" mt-2  text-sm font-serif text-center dark:text-gray-300">
              Enter your details below to create your account
            </p>
          </CardHeader>

          <CardContent>
            <form className=" space-y-4" onSubmit={handleFormSubmit}>
              <div className="flex gap-3">
                <div>
                  <Label className="mb-1">First Name:</Label>
                  <Input
                    onChange={handleInputChange}
                    value={userData.firstName}
                    type="text"
                    placeholder="First Name"
                    name="firstName"
                    className="dark:border-gray-600 dark:bg-gray-900"
                  />
                  <ValidationMessage name="firstName" errors={errors} />
                </div>

                <div>
                  <Label className="mb-1">Last Name:</Label>
                  <Input
                    onChange={handleInputChange}
                    value={userData.lastName}
                    type="text"
                    placeholder="Last Name"
                    name="lastName"
                    className="dark:border-gray-600 dark:bg-gray-900"
                  />
                  <ValidationMessage name="lastName" errors={errors} />
                </div>
              </div>

              <div>
                <Label className="mb-1">Email:</Label>
                <Input
                  onChange={handleInputChange}
                  value={userData.email}
                  type="text"
                  placeholder="john.doe@example.com"
                  name="email"
                  className="dark:border-gray-600 dark:bg-gray-900"
                />
                <ValidationMessage name="email" errors={errors} />
              </div>

              <div className="relative">
                <Label className="mb-1">Password:</Label>
                <Input
                  onChange={handleInputChange}
                  value={userData.password}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a Password"
                  name="password"
                  autoComplete="new-password"
                  className="pr-10 dark:border-gray-600 dark:bg-gray-900"
                />
                <ValidationMessage name="password" errors={errors} />

                <button
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                  className="absolute right-3 top-6 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <Button type="submit" className="w-full cursor-pointer ">
                {loading ? (
                  <>
                    <Loader2 className="mr-4 h-4 animate-spin" />
                    please wait...
                  </>
                ) : (
                  "Signup"
                )}
              </Button>

              <p className="text-center text-gray-600 dark:text-gray-300">
                Already have an account?{" "}
                <Link to={"/login"}>
                  <span className="underline cursor-pointer text-blue-400 hover:text-blue-700">
                    Sign in
                  </span>
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Signup;
