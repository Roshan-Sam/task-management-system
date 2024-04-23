import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextInput,
  Button,
  Label,
  Modal,
  Checkbox,
  Alert,
  Toast,
} from "flowbite-react";
import { HiInformationCircle, HiCheck } from "react-icons/hi";
import Cookies from "js-cookie";

const AdminAddTask = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    title: "",
    due_date: "",
    assigned_to: [],
    created_by: currentUser.id,
  });
  const [normalUsers, setNormalUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (userId) => {
    if (formData.assigned_to.includes(userId)) {
      setFormData({
        ...formData,
        assigned_to: formData.assigned_to.filter((id) => id !== userId),
      });
    } else {
      setFormData({
        ...formData,
        assigned_to: [...formData.assigned_to, userId],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.assigned_to.length === 0) {
      setAlertMessage(
        "Please select at least one user for assigning the task."
      );
      setTimeout(() => {
        setAlertMessage(null);
      }, 2000);
      return;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}admin/addtask/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      if (res.status === 200) {
        setSuccess(res.data.message);
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          setSuccess("");
        }, 2000);
        setFormData({
          ...formData,
          title: "",
          due_date: "",
          assigned_to: [],
          created_by: currentUser.id,
        });
        setAlertMessage(null);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  useEffect(() => {
    const fetchNormalUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}getusers/`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        setNormalUsers(response.data);
      } catch (error) {
        console.error("Error fetching normal users:", error);
      }
    };
    fetchNormalUsers();
  }, []);

  return (
    <div className="max-w-lg mx-auto p-3 w-full flex flex-col items-center pt-20">
      {showToast && (
        <Toast className=" absolute top-1 mx-auto bg-white shadow-lg border border-gray-200 p-4 rounded-lg">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <HiCheck className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">{success}</div>
          <Toast.Toggle onDismiss={() => setShowToast(false)} />
        </Toast>
      )}
      <h1 className="text-2xl font-semibold">Create a task</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <Label htmlFor="title">Title</Label>
        <TextInput
          type="text"
          placeholder="Enter task title"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <Label htmlFor="due_date">Due Date</Label>
        <TextInput
          type="date"
          id="due_date"
          name="due_date"
          value={formData.due_date}
          onChange={handleChange}
          required
        />
        <Label htmlFor="assigned_to">Assign To</Label>
        <Button
          onClick={() => setOpenModal(true)}
          outline
          gradientDuoTone="cyanToBlue"
          size="sm"
        >
          Select Users
        </Button>
        <Button type="submit" variant="primary">
          Add Task
        </Button>
        {alertMessage && (
          <Alert color="failure" icon={HiInformationCircle}>
            <span className="font-medium">Info alert! </span>
            {alertMessage}
          </Alert>
        )}
      </form>
      <Modal show={openModal} onClose={() => setOpenModal(false)} size="sm">
        <Modal.Header>Select Users</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-2 justify-center">
            {normalUsers.map((user) => (
              <div key={user.id} className="flex gap-2 items-center">
                <Checkbox
                  id={user.id}
                  checked={formData.assigned_to.includes(user.id)}
                  onChange={() => handleCheckboxChange(user.id)}
                />
                <label htmlFor={user.id}>{user.username}</label>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>Done</Button>
          <Button onClick={() => setOpenModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminAddTask;
