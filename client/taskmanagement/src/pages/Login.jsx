import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import Cookies from "js-cookie";
import { Button, Label, TextInput } from "flowbite-react";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}login/`,
        formData
      );
      const data = res.data;

      if (res.status === 200) {
        const { token, user } = res.data;
        localStorage.setItem("user", JSON.stringify(user));
        Cookies.set("token", token);
        console.log("User login successful!");
        if (user.admin) {
          navigate("/admindashboard?tab=profile");
        } else {
          navigate("/userdashboard?tab=tasks");
        }
      } else {
        console.error("Login failed:", data.error);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("Invalid username or password");
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col sm:justify-center items-center pt-6 sm:pt-0 dark:text-gray-200 dark:bg-[rgb(16,23,42)]">
      <div className="w-full sm:max-w-md p-5 mx-auto">
        <h2 className="mb-12 text-center text-5xl font-extrabold">Welcome.</h2>
        <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="username" value="Your username" />
            </div>
            <TextInput
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="username"
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="Your password" />
            </div>
            <TextInput
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="**********"
              required
            />
          </div>
          <Button type="submit" color="blue">
            Submit
          </Button>
          {error && (
            <Alert color="failure" icon={HiInformationCircle} className="mt-2">
              <span className="font-medium">Info alert! </span>
              {error}
            </Alert>
          )}
          <div className="mt-4 text-center">
            <Link to="/register" className="underline">
              Sign up for an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
