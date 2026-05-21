import { Eye, EyeOff, Loader2 } from "lucide-react";
import authImg from "../assets/login.png";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import axios from "axios";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../Redux/authSlice";
import { loginSchema, validateField } from "../lib/validationSchemas";
import ValidationMessage from "../components/ValidationMessage";

function Login() {
  const { loading } = useSelector((store) => store.auth);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputFields, setInputFields] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setInputFields((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    const error = await validateField(name, value, loginSchema);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await loginSchema.validate(inputFields, { abortEarly: false });
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
        "http://localhost:3200/api/v1/user/login",
        inputFields,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      if (res.data.success) {
        navigate("/");
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || error.message || "Login failed",
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <div className="hidden md:flex md:w-1/2 h-full">
        <img src={authImg} alt="Signup" className="w-full h-full" />
      </div>
      <div className="flex justify-center items-center w-full md:w-1/2 px-4 md:px-0">
        <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl dark:bg-gray-800 dark:border-gray-600">
          <CardHeader>
            <CardTitle>
              <h1 className="text-center text-xl font-semibold">
                Login to your account
              </h1>
            </CardTitle>
            <p className=" mt-2  text-sm font-serif text-center dark:text-gray-300">
              Enter your details below to login your account
            </p>
          </CardHeader>
          <CardContent>
            <form className=" space-y-4" onSubmit={handleFormSubmit}>
              <div>
                <Label className="mb-1">Email:</Label>
                <Input
                  onChange={handleInputChange}
                  value={inputFields.email}
                  type="text"
                  placeholder="Enter an email"
                  name="email"
                  className="dark:border-gray-600 dark:bg-gray-900"
                />
                <ValidationMessage name="email" errors={errors} />
              </div>

              <div className="relative">
                <Label className="mb-1">Password:</Label>
                <Input
                  onChange={handleInputChange}
                  value={inputFields.password}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter a password"
                  name="password"
                  autoComplete="current-password"
                  className="pr-10 dark:border-gray-600 dark:bg-gray-900"
                />
                <ValidationMessage name="password" errors={errors} />

                <button
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                  className="absolute right-3 top-6 cursor-pointer text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <Button type="submit" className="w-full cursor-pointer">
                {loading ? (
                  <>
                    <Loader2 className="mr-4 h-4 animate-spin">
                      please wait...
                    </Loader2>
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              <p className="text-center text-gray-600 dark:text-gray-300">
                Don't have an account?{" "}
                <Link to={"/signup"}>
                  <span className="underline cursor-pointer text-blue-400 hover:text-blue-700">
                    Sign up
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

export default Login;
