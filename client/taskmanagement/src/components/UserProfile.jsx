import { useState, useRef } from "react";
import { Button, TextInput, Tooltip } from "flowbite-react";
import axios from "axios";
import Cookies from "js-cookie";
import { Toast } from "flowbite-react";
import { HiCheck } from "react-icons/hi";

const UserProfile = () => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const [showToast, setShowToast] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profile: file });
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}user/updateprofile/${currentUser.id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      if (res.status === 200) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setCurrentUser(res.data.user);
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}user/deleteprofile/${currentUser.id}/`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        }
      );
      if (res.status === 200) {
        localStorage.removeItem("user");
        Cookies.remove("token");
        Navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full flex flex-col items-center pt-20">
      {showToast && (
        <Toast className="absolute top-0 mx-auto bg-white shadow-lg border border-gray-200 p-4 rounded-lg">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <HiCheck className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">
            Profile updated successfully.
          </div>
          <Toast.Toggle onDismiss={() => setShowToast(false)} />
        </Toast>
      )}
      <form onSubmit={handleUpdateProfile} className="w-full">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div className="w-full flex justify-center">
          <Tooltip content="Click to Upload Profile" animation="duration-500">
            <img
              src={`${import.meta.env.VITE_API_IMAGE_URL}${
                currentUser.profile
              }`}
              alt={currentUser.username}
              className="rounded-full w-32 h-32 object-cover border-2 border-[lightgray] cursor-pointer"
              onClick={() => filePickerRef.current.click()}
            />
          </Tooltip>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          <TextInput
            type="text"
            id="username"
            placeholder="username"
            defaultValue={currentUser.username}
            onChange={handleChange}
          />{" "}
          <TextInput
            type="text"
            id="email"
            placeholder="email"
            defaultValue={currentUser.email}
            onChange={handleChange}
          />
        </div>
        <Button
          type="submit"
          className="mt-2 w-full"
          gradientDuoTone="purpleToPink"
        >
          Update
        </Button>
      </form>
      <Button
        type="button"
        gradientDuoTone="pinkToOrange"
        className="mt-4 w-full"
        onClick={handleDelete}
      >
        Delete Account
      </Button>
    </div>
  );
};

export default UserProfile;
