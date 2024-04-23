import { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { useNavigate, Link } from "react-router-dom";
import { Alert } from "flowbite-react";
import axios from "axios";
import { HiInformationCircle } from "react-icons/hi";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
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
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}register/`,
        formData
      );
      if (response.status === 200) {
        console.log(response.data.message);
        navigate("/login");
      } else {
        console.error("Registration failed:", data.error);
      }
    } catch (error) {
      console.error("Registration failed:", error.message);
      if (
        error.response &&
        error.response.data &&
        error.response.data.username
      ) {
        setError(error.response.data.username[0]);
      } else {
        setError("Username, Email or Password has already been taken.");
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
              <Label htmlFor="email" value="Your email" />
            </div>
            <TextInput
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email"
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
            <Link to="/login" className="underline">
              Sign in your account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
